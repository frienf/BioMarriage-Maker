'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ToranFieldProps {
  className?: string;
  style?: React.CSSProperties;
  enabled?: boolean;
  leafCount?: number;
  flowerCount?: number;
  speed?: number;
  interactive?: boolean;
}

const LEAF_COLORS = [
  '#2f6b3f', // --leaf
  '#3f7f4e', // --toran-leaf
  '#2c5e39', // --toran-stem
  '#5e9c6b', // --leaf-on-dark
];

const FLOWER_COLORS = [
  '#f0a030', // --marigold
  '#b86e10', // --marigold-deep
  '#a47a35', // --gold
  '#c9a24a', // --gold-on-dark
];

function randomColor(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function ToranField({
  leafCount = 24,
  flowerCount = 16,
  speed = 1,
  interactive = true,
}: ToranFieldProps) {
  const leafRefs = useRef<THREE.InstancedMesh[]>([]);
  const flowerRefs = useRef<THREE.InstancedMesh[]>([]);
  const dummy = useRef(new THREE.Object3D()).current;
  const mouse = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentRotation = useRef(new THREE.Euler(0, 0, 0));

  const leafData = useMemo(() => {
    const positions = new Float32Array(leafCount * 3);
    const rotations = new Float32Array(leafCount * 3);
    const scales = new Float32Array(leafCount * 3);
    const velocities = new Float32Array(leafCount * 3);
    const colors = new Float32Array(leafCount * 3);
    const swayOffsets = new Float32Array(leafCount);

    for (let i = 0; i < leafCount; i++) {
      const radius = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 2;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      const scale = 0.3 + Math.random() * 0.4;
      scales[i * 3] = scale;
      scales[i * 3 + 1] = scale * 0.6;
      scales[i * 3 + 2] = scale * 0.05;

      velocities[i * 3] = (Math.random() - 0.5) * 0.0003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0003;

      const color = new THREE.Color(randomColor(LEAF_COLORS));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      swayOffsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, rotations, scales, velocities, colors, swayOffsets };
  }, [leafCount]);

  const flowerData = useMemo(() => {
    const positions = new Float32Array(flowerCount * 3);
    const rotations = new Float32Array(flowerCount * 3);
    const scales = new Float32Array(flowerCount);
    const velocities = new Float32Array(flowerCount * 3);
    const colors = new Float32Array(flowerCount * 3);
    const pulseOffsets = new Float32Array(flowerCount);

    for (let i = 0; i < flowerCount; i++) {
      const radius = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 1;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      scales[i] = 0.15 + Math.random() * 0.1;

      velocities[i * 3] = (Math.random() - 0.5) * 0.0002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0002;

      const color = new THREE.Color(randomColor(FLOWER_COLORS));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      pulseOffsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, rotations, scales, velocities, colors, pulseOffsets };
  }, [flowerCount]);

  const leafGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      0, 0, 0,
      0.5, 0.5, 0,
      1, 0, 0,
      0.5, -0.5, 0,
    ]);
    const indices = [0, 1, 2, 0, 2, 3];
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const flowerGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const petalCount = 5;
    const positions: number[] = [0, 0, 0];
    const indices: number[] = [];

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const nextAngle = ((i + 1) % petalCount) * Math.PI * 2;
      positions.push(
        Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0,
        Math.cos(nextAngle) * 0.5, Math.sin(nextAngle) * 0.5, 0,
        0, 0, 0.05
      );
      indices.push(0, i * 3 + 1, i * 3 + 2);
      indices.push(0, i * 3 + 3, i * 3 + 2);
      indices.push(0, i * 3 + 1, i * 3 + 3);
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const leafMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      side: THREE.DoubleSide,
      flatShading: true,
    }),
  []);

  const flowerMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      flatShading: true,
    }),
  []);

  useEffect(() => {
    if (leafRefs.current[0] || flowerRefs.current[0]) return;

    const leafMesh = new THREE.InstancedMesh(leafGeometry, leafMaterial, leafCount);
    leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    leafMesh.instanceColor = new THREE.InstancedBufferAttribute(leafData.colors, 3);
    leafRefs.current[0] = leafMesh;

    const flowerMesh = new THREE.InstancedMesh(flowerGeometry, flowerMaterial, flowerCount);
    flowerMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    flowerMesh.instanceColor = new THREE.InstancedBufferAttribute(flowerData.colors, 3);
    flowerRefs.current[0] = flowerMesh;

    for (let i = 0; i < leafCount; i++) {
      dummy.position.set(
        leafData.positions[i * 3],
        leafData.positions[i * 3 + 1],
        leafData.positions[i * 3 + 2]
      );
      dummy.rotation.set(
        leafData.rotations[i * 3],
        leafData.rotations[i * 3 + 1],
        leafData.rotations[i * 3 + 2]
      );
      dummy.scale.set(
        leafData.scales[i * 3],
        leafData.scales[i * 3 + 1],
        leafData.scales[i * 3 + 2]
      );
      dummy.updateMatrix();
      leafMesh.setMatrixAt(i, dummy.matrix);
    }
    leafMesh.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < flowerCount; i++) {
      dummy.position.set(
        flowerData.positions[i * 3],
        flowerData.positions[i * 3 + 1],
        flowerData.positions[i * 3 + 2]
      );
      dummy.rotation.set(
        flowerData.rotations[i * 3],
        flowerData.rotations[i * 3 + 1],
        flowerData.rotations[i * 3 + 2]
      );
      const s = flowerData.scales[i];
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      flowerMesh.setMatrixAt(i, dummy.matrix);
    }
    flowerMesh.instanceMatrix.needsUpdate = true;

    return () => {
      leafGeometry.dispose();
      flowerGeometry.dispose();
      leafMaterial.dispose();
      flowerMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafGeometry, flowerGeometry, leafMaterial, flowerMaterial, leafCount, flowerCount, leafData, flowerData]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const leafMesh = leafRefs.current[0];
    const flowerMesh = flowerRefs.current[0];
    if (!leafMesh || !flowerMesh) return;

    if (interactive) {
      targetRotation.current.y += (mouse.current.x - targetRotation.current.y) * 0.005;
      targetRotation.current.x += (-mouse.current.y - targetRotation.current.x) * 0.005;
    } else {
      targetRotation.current.y += delta * 0.02 * speed;
      targetRotation.current.x = Math.sin(t * 0.15) * 0.08;
    }

    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.02;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.02;

    for (let i = 0; i < leafCount; i++) {
      dummy.position.set(
        leafData.positions[i * 3],
        leafData.positions[i * 3 + 1],
        leafData.positions[i * 3 + 2]
      );

      leafData.positions[i * 3] += leafData.velocities[i * 3] * delta * 60 * speed;
      leafData.positions[i * 3 + 1] += leafData.velocities[i * 3 + 1] * delta * 60 * speed;
      leafData.positions[i * 3 + 2] += leafData.velocities[i * 3 + 2] * delta * 60 * speed;

      const sway = Math.sin(t * 0.5 + leafData.swayOffsets[i]) * 0.15;
      dummy.rotation.set(
        leafData.rotations[i * 3] + sway,
        leafData.rotations[i * 3 + 1] + t * 0.05 * speed,
        leafData.rotations[i * 3 + 2]
      );

      const s = leafData.scales[i * 3];
      dummy.scale.set(s, leafData.scales[i * 3 + 1], leafData.scales[i * 3 + 2]);

      dummy.updateMatrix();
      leafMesh.setMatrixAt(i, dummy.matrix);
    }
    leafMesh.instanceMatrix.needsUpdate = true;

    leafMesh.rotation.x = currentRotation.current.x * 0.3;
    leafMesh.rotation.y = currentRotation.current.y * 0.3;

    for (let i = 0; i < flowerCount; i++) {
      dummy.position.set(
        flowerData.positions[i * 3],
        flowerData.positions[i * 3 + 1],
        flowerData.positions[i * 3 + 2]
      );

      flowerData.positions[i * 3] += flowerData.velocities[i * 3] * delta * 60 * speed;
      flowerData.positions[i * 3 + 1] += flowerData.velocities[i * 3 + 1] * delta * 60 * speed;
      flowerData.positions[i * 3 + 2] += flowerData.velocities[i * 3 + 2] * delta * 60 * speed;

      const pulse = 1 + Math.sin(t * 2 + flowerData.pulseOffsets[i]) * 0.08;
      const s = flowerData.scales[i] * pulse;
      dummy.rotation.set(
        flowerData.rotations[i * 3],
        flowerData.rotations[i * 3 + 1] + t * 0.08 * speed,
        flowerData.rotations[i * 3 + 2]
      );
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      flowerMesh.setMatrixAt(i, dummy.matrix);
    }
    flowerMesh.instanceMatrix.needsUpdate = true;

    flowerMesh.rotation.x = currentRotation.current.x * 0.5;
    flowerMesh.rotation.y = currentRotation.current.y * 0.5;
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouse.current.set(0, 0);
  };

  const leafMesh = leafRefs.current[0];
  const flowerMesh = flowerRefs.current[0];

  return (
    <group onPointerMove={handleMouseMove} onPointerLeave={handleMouseLeave}>
      {leafMesh && <primitive object={leafMesh} />}
      {flowerMesh && <primitive object={flowerMesh} />}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} color="#fff8e7" />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8fb3ae" />
      <pointLight position={[0, 3, 5]} intensity={0.8} color="#f0a030" distance={20} decay={2} />
    </group>
  );
}

export function ToranFieldCanvas({
  className,
  style,
  enabled = true,
  ...props
}: ToranFieldProps) {
  if (!enabled) return null;

  return (
    <Canvas
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'auto',
        ...style,
      }}
      camera={{ position: [0, 0, 28], fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      frameloop="demand"
      shadows={false}
    >
      <color attach="background" args={['transparent']} />
      <ToranField {...props} />
    </Canvas>
  );
}