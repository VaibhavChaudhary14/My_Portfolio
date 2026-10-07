import * as THREE from 'three';

export interface PassengerConfig {
  id: string;
  label: string;
  position: [number, number, number];
  color: number;
}

export const PASSENGER_DATA: PassengerConfig[] = [
  { id: 'gate', label: 'GATE EXAM', position: [-1.4, 0.45, -1.2], color: 0xfef08a },
  { id: 'aiml', label: 'AI / ML', position: [-0.48, 0.45, -1.2], color: 0x84cc16 },
  { id: 'content', label: 'CONTENT', position: [0.48, 0.45, -1.2], color: 0xfbcfe8 },
  { id: 'build', label: 'BUILDING', position: [1.4, 0.45, -1.2], color: 0xbae6fd },
  { id: 'learn', label: 'LEARNING', position: [-0.95, 0.45, 0.2], color: 0xa855f7 },
  { id: 'create', label: 'CREATIVE', position: [0.95, 0.45, 0.2], color: 0xf97316 },
];

export function createPassengerArtifact(config: PassengerConfig): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...config.position);

  // Base Seat / Platform inside fuselage window cutout
  const seatGeo = new THREE.BoxGeometry(0.55, 0.1, 0.55);
  const seatMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
  });
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.y = -0.15;
  group.add(seat);

  // Character Figure Silhouette (Cutout / Graphic novel style)
  const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.4,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 0.22, 0);
  group.add(head);

  const bodyGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.32, 10);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.5,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0, 0);
  group.add(body);

  // Artifact specific props based on passenger ID
  const propGroup = new THREE.Group();
  propGroup.position.set(0, 0.1, 0.2);

  if (config.id === 'gate') {
    // Stack of GATE books & study sheet
    for (let i = 0; i < 3; i++) {
      const bookGeo = new THREE.BoxGeometry(0.28, 0.05, 0.22);
      const bookMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xfef08a : 0xffffff,
        roughness: 0.3,
      });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set((i - 1) * 0.04, i * 0.05 - 0.05, 0);
      book.rotation.y = (i - 1) * 0.2;
      propGroup.add(book);
    }
  } else if (config.id === 'aiml') {
    // Glowing Neural Network Nodes / Microchip
    const chipGeo = new THREE.BoxGeometry(0.22, 0.04, 0.22);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    propGroup.add(chip);

    const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 4) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 0.12, 0.08 + Math.sin(i) * 0.03, Math.sin(angle) * 0.12);
      propGroup.add(node);
    }
  } else if (config.id === 'content') {
    // Camera Lens & Typewriter
    const camGeo = new THREE.BoxGeometry(0.24, 0.16, 0.14);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    const cameraBody = new THREE.Mesh(camGeo, camMat);

    const lensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.1, 12);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.1;
    cameraBody.add(lens);
    propGroup.add(cameraBody);
  } else if (config.id === 'build') {
    // Laptop / Code Terminal screen
    const laptopBaseGeo = new THREE.BoxGeometry(0.28, 0.02, 0.2);
    const laptopMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8 });
    const base = new THREE.Mesh(laptopBaseGeo, laptopMat);

    const screenGeo = new THREE.BoxGeometry(0.28, 0.18, 0.02);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.09, -0.09);
    screen.rotation.x = -0.2;
    base.add(screen);
    propGroup.add(base);
  } else if (config.id === 'learn') {
    // Study Globe & Notebook
    const globeGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const globeMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, wireframe: true });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(0, 0.06, 0);
    propGroup.add(globe);
  } else {
    // Creative Palette / Sculptural geometric forms
    const icoGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const icoMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.2 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(0, 0.08, 0);
    propGroup.add(ico);
  }

  group.add(propGroup);

  // Store metadata tag for animation reference
  group.userData = { id: config.id, label: config.label, initialY: config.position[1] };

  return group;
}
