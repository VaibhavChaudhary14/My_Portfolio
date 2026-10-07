import * as THREE from 'three';
import { createPassengerArtifact, PASSENGER_DATA } from './passenger';

export interface AircraftComponents {
  rootGroup: THREE.Group;
  fuselageMesh: THREE.Mesh;
  noseGear: THREE.Group;
  mainGearLeft: THREE.Group;
  mainGearRight: THREE.Group;
  engineLeftFan: THREE.Group;
  engineRightFan: THREE.Group;
  passengerGroups: THREE.Group[];
  exhaustParticles: THREE.Points;
}

export function buildBrutalistAircraft(): AircraftComponents {
  const rootGroup = new THREE.Group();

  // Primary Materials (Brutalist High Contrast Palette)
  const blackFuselageMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.4,
    metalness: 0.2,
  });

  const whiteHighlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
  });

  const transparentWindowMat = new THREE.MeshPhysicalMaterial({
    color: 0x18181b,
    transmission: 0.85,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
  });

  // 1. FUSELAGE MAIN BODY
  const fuselageShape = new THREE.CapsuleGeometry(1.65, 7.5, 16, 32);
  const fuselageMesh = new THREE.Mesh(fuselageShape, blackFuselageMat);
  fuselageMesh.rotation.x = Math.PI / 2;
  fuselageMesh.position.set(0, 1.4, 0);
  rootGroup.add(fuselageMesh);

  // White Technical Border Outline Stripes
  const stripeGeo = new THREE.TorusGeometry(1.66, 0.035, 8, 32);
  for (let z = -2.5; z <= 2.5; z += 1.25) {
    const stripe = new THREE.Mesh(stripeGeo, whiteHighlightMat);
    stripe.position.set(0, 1.4, z);
    rootGroup.add(stripe);
  }

  // Nose Cone (Front)
  const noseConeGeo = new THREE.ConeGeometry(1.65, 2.5, 24);
  const noseCone = new THREE.Mesh(noseConeGeo, blackFuselageMat);
  noseCone.rotation.x = -Math.PI / 2;
  noseCone.position.set(0, 1.4, -4.8);
  rootGroup.add(noseCone);

  // Nose Tip White Accent
  const noseTipGeo = new THREE.SphereGeometry(0.25, 12, 12);
  const noseTip = new THREE.Mesh(noseTipGeo, whiteHighlightMat);
  noseTip.position.set(0, 1.4, -6.05);
  rootGroup.add(noseTip);

  // 2. COCKPIT & PILOT SILHOUETTE
  const cockpitFrameGeo = new THREE.BoxGeometry(1.8, 1.1, 1.8);
  const cockpitFrame = new THREE.Mesh(cockpitFrameGeo, transparentWindowMat);
  cockpitFrame.position.set(0, 2.1, -3.2);
  rootGroup.add(cockpitFrame);

  // Pilot Silhouette (Vaibhav)
  const pilotHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  pilotHead.position.set(0, 2.3, -3.2);
  rootGroup.add(pilotHead);

  // 3. PASSENGER CABIN WINDOW CUTOUTS & PASSENGERS
  const passengerGroups: THREE.Group[] = [];

  PASSENGER_DATA.forEach((data) => {
    const passengerArtifact = createPassengerArtifact(data);
    passengerArtifact.position.set(data.position[0], data.position[1] + 1.2, data.position[2]);
    rootGroup.add(passengerArtifact);
    passengerGroups.push(passengerArtifact);

    // Illuminated Window Frame Cutout
    const windowFrameGeo = new THREE.BoxGeometry(0.7, 0.75, 0.7);
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.1,
      metalness: 0.8,
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(data.position[0], data.position[1] + 1.2, data.position[2]);
    rootGroup.add(windowFrame);
  });

  // 4. WINGS (Left & Right Swept Wings with Winglets)
  const wingShape = new THREE.BoxGeometry(7.2, 0.16, 2.2);
  
  // Left Wing
  const leftWing = new THREE.Mesh(wingShape, blackFuselageMat);
  leftWing.position.set(-4.5, 1.2, -0.2);
  leftWing.rotation.z = -0.06;
  leftWing.rotation.y = 0.12;
  rootGroup.add(leftWing);

  // Left Wing Tip White Edge
  const leftWinglet = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.8), whiteHighlightMat);
  leftWinglet.position.set(-8.0, 1.5, -0.2);
  rootGroup.add(leftWinglet);

  // Right Wing
  const rightWing = new THREE.Mesh(wingShape, blackFuselageMat);
  rightWing.position.set(4.5, 1.2, -0.2);
  rightWing.rotation.z = 0.06;
  rightWing.rotation.y = -0.12;
  rootGroup.add(rightWing);

  // Right Wing Tip White Edge
  const rightWinglet = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 0.8), whiteHighlightMat);
  rightWinglet.position.set(8.0, 1.5, -0.2);
  rootGroup.add(rightWinglet);

  // 5. TURBOFAN ENGINES
  const engineHousingGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.4, 24);
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });

  // Left Engine
  const engineLeft = new THREE.Mesh(engineHousingGeo, engineMat);
  engineLeft.rotation.x = Math.PI / 2;
  engineLeft.position.set(-3.2, 0.5, -0.5);
  rootGroup.add(engineLeft);

  const engineLeftFan = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.02), whiteHighlightMat);
    blade.rotation.z = (i / 8) * Math.PI * 2;
    engineLeftFan.add(blade);
  }
  engineLeftFan.position.set(-3.2, 0.5, -1.7);
  rootGroup.add(engineLeftFan);

  // Right Engine
  const engineRight = new THREE.Mesh(engineHousingGeo, engineMat);
  engineRight.rotation.x = Math.PI / 2;
  engineRight.position.set(3.2, 0.5, -0.5);
  rootGroup.add(engineRight);

  const engineRightFan = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.02), whiteHighlightMat);
    blade.rotation.z = (i / 8) * Math.PI * 2;
    engineRightFan.add(blade);
  }
  engineRightFan.position.set(3.2, 0.5, -1.7);
  rootGroup.add(engineRightFan);

  // 6. LANDING GEAR ASSEMBLY (Nose + Main Gear)
  function createGearGroup(x: number, y: number, z: number): THREE.Group {
    const gearGroup = new THREE.Group();
    gearGroup.position.set(x, y, z);

    // Strut Shock
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12),
      whiteHighlightMat
    );
    strut.position.y = 0.55;
    gearGroup.add(strut);

    // Dual Rubber Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.18, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });

    const wheelLeft = new THREE.Mesh(wheelGeo, wheelMat);
    wheelLeft.rotation.z = Math.PI / 2;
    wheelLeft.position.set(-0.15, 0.35, 0);
    gearGroup.add(wheelLeft);

    const wheelRight = new THREE.Mesh(wheelGeo, wheelMat);
    wheelRight.rotation.z = Math.PI / 2;
    wheelRight.position.set(0.15, 0.35, 0);
    gearGroup.add(wheelRight);

    return gearGroup;
  }

  const noseGear = createGearGroup(0, -0.6, -4.2);
  const mainGearLeft = createGearGroup(-1.8, -0.6, 0.8);
  const mainGearRight = createGearGroup(1.8, -0.6, 0.8);

  rootGroup.add(noseGear);
  rootGroup.add(mainGearLeft);
  rootGroup.add(mainGearRight);

  // 7. EXHAUST PARTICLES SYSTEM
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 6;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
    particlePositions[i * 3 + 2] = Math.random() * 8 + 1;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x84cc16,
    size: 0.18,
    transparent: true,
    opacity: 0.6,
  });

  const exhaustParticles = new THREE.Points(particleGeo, particleMat);
  exhaustParticles.position.set(0, 0.5, 1.2);
  rootGroup.add(exhaustParticles);

  return {
    rootGroup,
    fuselageMesh,
    noseGear,
    mainGearLeft,
    mainGearRight,
    engineLeftFan,
    engineRightFan,
    passengerGroups,
    exhaustParticles,
  };
}
