import * as THREE from 'three';

export interface EnvironmentComponents {
  runwayGroup: THREE.Group;
  cloudsGroup: THREE.Group;
  mountainsGroup: THREE.Group;
  starField: THREE.Points;
  signboardGroup: THREE.Group;
  luggageGroup: THREE.Group;
}

export function buildAirportEnvironment(): EnvironmentComponents {
  const runwayGroup = new THREE.Group();
  const cloudsGroup = new THREE.Group();
  const mountainsGroup = new THREE.Group();
  const signboardGroup = new THREE.Group();
  const luggageGroup = new THREE.Group();

  // Materials
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x070709,
    roughness: 0.95,
  });

  const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const darkStructureMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.8 });
  const limeGlowMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });

  // 1. RUNWAY ASPHALT & MARKINGS
  const runwayWidth = 45;
  const runwayLength = 350;
  const runwayGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength);
  const runwayMesh = new THREE.Mesh(runwayGeo, asphaltMat);
  runwayMesh.rotation.x = -Math.PI / 2;
  runwayMesh.position.set(0, -0.6, -100);
  runwayGroup.add(runwayMesh);

  // Dashed Centerline Stripes
  const stripeGeo = new THREE.PlaneGeometry(0.5, 4.5);
  for (let z = -250; z <= 50; z += 9) {
    const stripe = new THREE.Mesh(stripeGeo, whiteLineMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, -0.58, z);
    runwayGroup.add(stripe);
  }

  // Threshold Side Lines
  const sideLineGeo = new THREE.PlaneGeometry(0.4, runwayLength);
  const leftLine = new THREE.Mesh(sideLineGeo, whiteLineMat);
  leftLine.rotation.x = -Math.PI / 2;
  leftLine.position.set(-16, -0.58, -100);
  runwayGroup.add(leftLine);

  const rightLine = new THREE.Mesh(sideLineGeo, whiteLineMat);
  rightLine.rotation.x = -Math.PI / 2;
  rightLine.position.set(16, -0.58, -100);
  runwayGroup.add(rightLine);

  // Runway Lights (Edge Markers)
  const lightGeo = new THREE.SphereGeometry(0.12, 8, 8);
  for (let z = -220; z <= 40; z += 12) {
    const leftLight = new THREE.Mesh(lightGeo, limeGlowMat);
    leftLight.position.set(-16.5, -0.45, z);
    runwayGroup.add(leftLight);

    const rightLight = new THREE.Mesh(lightGeo, limeGlowMat);
    rightLight.position.set(16.5, -0.45, z);
    runwayGroup.add(rightLight);
  }

  // 2. CONTROL TOWER & BRUTALIST SIGNBOARD (Left Side)
  const towerBodyGeo = new THREE.CylinderGeometry(2.5, 3.5, 26, 12);
  const tower = new THREE.Mesh(towerBodyGeo, darkStructureMat);
  tower.position.set(-28, 12, -45);
  signboardGroup.add(tower);

  // Tower Observation Deck
  const deckGeo = new THREE.CylinderGeometry(4.2, 3.2, 5, 12);
  const deckMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.set(-28, 24, -45);
  signboardGroup.add(deck);

  // Directional Signboard (Matching Artwork)
  const signBoardGeo = new THREE.BoxGeometry(7, 10, 0.4);
  const signBoard = new THREE.Mesh(signBoardGeo, darkStructureMat);
  signBoard.position.set(-22, 5, -25);
  signboardGroup.add(signBoard);

  // 3. BRUTALIST LUGGAGE CASE (Right Side)
  const luggageBodyGeo = new THREE.BoxGeometry(6.5, 8.5, 3.5);
  const luggageMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
  const luggage = new THREE.Mesh(luggageBodyGeo, luggageMat);
  luggage.position.set(22, 3.6, -20);
  luggageGroup.add(luggage);

  // Luggage Handle
  const handleGeo = new THREE.TorusGeometry(1.6, 0.2, 8, 16, Math.PI);
  const handle = new THREE.Mesh(handleGeo, whiteLineMat);
  handle.position.set(22, 8.4, -20);
  handle.rotation.x = Math.PI / 2;
  luggageGroup.add(handle);

  // Luggage Stickers (White Rectangles)
  const stickerGeo = new THREE.PlaneGeometry(3.8, 0.9);
  for (let i = 0; i < 4; i++) {
    const sticker = new THREE.Mesh(stickerGeo, whiteLineMat);
    sticker.position.set(22, 6.2 - i * 1.6, -18.2);
    luggageGroup.add(sticker);
  }

  // 4. MOUNTAINS & CITY SKYLINE (Background Depth)
  for (let i = 0; i < 14; i++) {
    const radius = 12 + Math.random() * 8;
    const height = 18 + Math.random() * 22;
    const mountainGeo = new THREE.ConeGeometry(radius, height, 5);
    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x0d0d12, roughness: 1.0 });
    const mountain = new THREE.Mesh(mountainGeo, mountainMat);
    const xPos = (i - 7) * 22;
    mountain.position.set(xPos, height / 2 - 2, -180);
    mountainsGroup.add(mountain);
  }

  // City Buildings
  for (let i = 0; i < 20; i++) {
    const bWidth = 4 + Math.random() * 6;
    const bHeight = 15 + Math.random() * 35;
    const buildingGeo = new THREE.BoxGeometry(bWidth, bHeight, bWidth);
    const building = new THREE.Mesh(buildingGeo, darkStructureMat);
    const xPos = (i - 10) * 14;
    building.position.set(xPos, bHeight / 2 - 2, -140);
    mountainsGroup.add(building);
  }

  // 5. VOLUMETRIC CLOUDS DECK
  for (let i = 0; i < 25; i++) {
    const cloudGeo = new THREE.DodecahedronGeometry(8 + Math.random() * 12, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set((Math.random() - 0.5) * 180, 25 + Math.random() * 40, -Math.random() * 200 - 20);
    cloudsGroup.add(cloud);
  }

  // 6. NIGHT SKY STARS
  const starCount = 350;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 300;
    starPositions[i * 3 + 1] = Math.random() * 150 + 20;
    starPositions[i * 3 + 2] = -Math.random() * 250 - 50;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6,
    transparent: true,
    opacity: 0.8,
  });
  const starField = new THREE.Points(starGeo, starMat);

  return {
    runwayGroup,
    cloudsGroup,
    mountainsGroup,
    starField,
    signboardGroup,
    luggageGroup,
  };
}
