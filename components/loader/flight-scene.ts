import * as THREE from 'three';
import { buildBrutalistAircraft, AircraftComponents } from './aircraft';
import { buildAirportEnvironment, EnvironmentComponents } from './environment';

export interface FlightSceneController {
  mount: (container: HTMLDivElement) => void;
  updateProgress: (progress: number) => void;
  destroy: () => void;
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function createFlightScene(): FlightSceneController {
  let container: HTMLDivElement | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;

  let aircraft: AircraftComponents | null = null;
  let environment: EnvironmentComponents | null = null;

  let animationFrameId: number = 0;
  let targetProgress: number = 0;
  let currentProgress: number = 0;
  let startTime = 0;
  let lastTime = 0;

  function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.008);

    // Camera Setup (Hero Cinematic Viewpoint)
    camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3.2, 12.5);
    camera.lookAt(0, 1.2, 0);

    // Lighting (High-Contrast Brutalist Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainKeyLight.position.set(10, 20, 15);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x84cc16, 2.0);
    rimLight.position.set(-15, 10, -20);
    scene.add(rimLight);

    // Build 3D Objects
    aircraft = buildBrutalistAircraft();
    scene.add(aircraft.rootGroup);

    environment = buildAirportEnvironment();
    scene.add(environment.runwayGroup);
    scene.add(environment.cloudsGroup);
    scene.add(environment.mountainsGroup);
    scene.add(environment.starField);
    scene.add(environment.signboardGroup);
    scene.add(environment.luggageGroup);
  }

  function renderLoop() {
    if (!renderer || !scene || !camera || !aircraft || !environment) return;

    const now = performance.now() / 1000;
    const delta = Math.min(now - lastTime, 0.1);
    lastTime = now;
    const elapsedTime = now - startTime;

    // Smooth progress interpolation
    currentProgress += (targetProgress - currentProgress) * 0.08;
    const p = currentProgress / 100;

    // 1. ENGINE TURBOFAN SPIN
    const fanSpeed = p < 0.3 ? 2 : p < 0.7 ? 15 : 35;
    aircraft.engineLeftFan.rotation.z += fanSpeed * delta;
    aircraft.engineRightFan.rotation.z += fanSpeed * delta;

    // 2. PASSENGER INERTIA MOVEMENT
    aircraft.passengerGroups.forEach((group, index) => {
      const initialY = group.userData.initialY || 0.45;
      group.position.y = initialY + Math.sin(elapsedTime * 3 + index) * 0.02;
      group.rotation.z = Math.sin(elapsedTime * 2.5 + index) * 0.03;
    });

    // 3. FLIGHT TAKE OFF SEQUENCE & CAMERA DYNAMICS
    if (p < 0.35) {
      // Phase 1 & 2: Stationing & Engine Spooling
      aircraft.rootGroup.position.set(0, Math.sin(elapsedTime * 4) * 0.015, 0);
      aircraft.rootGroup.rotation.set(0, 0, 0);
      camera.position.set(0, 3.2, 12.5);
      camera.lookAt(0, 1.2, 0);
    } else if (p >= 0.35 && p < 0.75) {
      // Phase 3 & 4: Taxiing & High-Speed Acceleration down Runway
      const accelProgress = (p - 0.35) / 0.4;
      const speedZ = accelProgress * accelProgress * 45;

      aircraft.rootGroup.position.z -= speedZ * delta;
      environment.runwayGroup.position.z += speedZ * delta * 0.8;

      // Runway vibration / high-speed camera shake
      const shakeX = (Math.random() - 0.5) * 0.04 * accelProgress;
      const shakeY = (Math.random() - 0.5) * 0.04 * accelProgress;
      camera.position.set(shakeX, 3.2 + shakeY, 12.5);
      camera.lookAt(0, 1.2, -aircraft.rootGroup.position.z);
    } else if (p >= 0.75 && p < 0.90) {
      // Phase 5: ROTATION (Nose Lifts around Rear Landing Gear)
      const rotateProgress = (p - 0.75) / 0.15;
      const pitchAngle = rotateProgress * 0.28;

      aircraft.rootGroup.rotation.x = -pitchAngle;
      aircraft.rootGroup.position.y = rotateProgress * 1.8;
      aircraft.noseGear.position.y = -0.6 + rotateProgress * 0.4; // Nose wheel unloads first

      camera.position.set(0, 3.5 + rotateProgress * 1.5, 14);
      camera.lookAt(0, 2 + rotateProgress * 2, -10);
    } else {
      // Phase 6: LIFTOFF & CLIMB INTO SKY
      const climbProgress = (p - 0.90) / 0.10;

      aircraft.rootGroup.position.y = 1.8 + climbProgress * 22;
      aircraft.rootGroup.position.z -= climbProgress * 25;
      aircraft.rootGroup.rotation.x = -0.28 - climbProgress * 0.1;

      // Retract landing gear
      aircraft.noseGear.position.y = 0.5;
      aircraft.mainGearLeft.position.y = 0.5;
      aircraft.mainGearRight.position.y = 0.5;

      // Move clouds & environment downward for high altitude feel
      environment.cloudsGroup.position.y = -climbProgress * 30;
      environment.mountainsGroup.position.y = -climbProgress * 20;

      camera.position.set(0, 5 + climbProgress * 6, 16 + climbProgress * 10);
      camera.lookAt(0, aircraft.rootGroup.position.y, aircraft.rootGroup.position.z);
    }

    // 4. EXHAUST PARTICLES ANIMATION
    if (aircraft.exhaustParticles) {
      const positions = aircraft.exhaustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += (0.2 + p * 0.5);
        if (positions[i * 3 + 2] > 12) {
          positions[i * 3 + 2] = 0;
        }
      }
      aircraft.exhaustParticles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(renderLoop);
  }

  function handleResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  return {
    mount: (targetContainer: HTMLDivElement) => {
      container = targetContainer;
      initScene();

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      container.appendChild(renderer.domElement);
      window.addEventListener('resize', handleResize);
      startTime = performance.now() / 1000;
      lastTime = startTime;
      renderLoop();
    },
    updateProgress: (progress: number) => {
      targetProgress = Math.max(0, Math.min(100, progress));
    },
    destroy: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
        renderer.dispose();
      }
    },
  };
}
