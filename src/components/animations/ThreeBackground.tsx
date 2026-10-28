'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  /** Canvas className */
  className?: string;
  /** Canvas style */
  style?: React.CSSProperties;
  /** Whether to enable the background */
  enabled?: boolean;
  /** Particle count */
  particleCount?: number;
  /** Particle color */
  particleColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Whether to respond to mouse movement */
  _interactive?: boolean;
}

/**
 * Subtle particle background using Three.js.
 * Renders on demand, respects prefers-reduced-motion.
 * Optimized for performance with instanced meshes.
 */
export function ThreeBackground({
  className,
  style,
  enabled = true,
  particleCount = 150,
  particleColor = '#a47a35',
  backgroundColor = 'transparent',
  speed = 1,
  _interactive = true,
}: ThreeBackgroundProps) {
  if (!enabled) return null;

  return (
    <Canvas
      className={className}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', ...style }}
      camera={{ position: [0, 0, 50], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      frameloop="demand"
      shadows={false}
    >
      <ParticleField count={particleCount} color={particleColor} speed={speed} _interactive={_interactive} />
      <color attach="background" args={[backgroundColor]} />
    </Canvas>
  );
}

function ParticleField({
  count,
  color,
  speed,
  _interactive,
}: { count: number; color: string; speed: number; _interactive: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D()).current;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
      // Random velocities for gentle drift
      velocities[i * 3] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return { positions: arr, velocities };
  }, [count]);

  // Create geometry and material once
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.08, 1), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, depthWrite: false }),
    [color]
  );

  // Initialize instanced mesh
  useEffect(() => {
    if (meshRef.current) return;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions.positions[i * 3],
        positions.positions[i * 3 + 1],
        positions.positions[i * 3 + 2]
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    meshRef.current = mesh;
    return () => {
      geometry.dispose();
      material.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, material, count]);

  // Animation loop
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Gentle rotation of the particle field (applied to the mesh, not the scene)
    mesh.rotation.y += delta * 0.02 * speed;

    // Update individual particle positions
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions.positions[i * 3],
        positions.positions[i * 3 + 1],
        positions.positions[i * 3 + 2]
      );

      // Apply velocity
      positions.positions[i * 3] += positions.velocities[i * 3] * delta * 60 * speed;
      positions.positions[i * 3 + 1] += positions.velocities[i * 3 + 1] * delta * 60 * speed;
      positions.positions[i * 3 + 2] += positions.velocities[i * 3 + 2] * delta * 60 * speed;

      // Wrap around sphere
      const radius = Math.sqrt(
        positions.positions[i * 3] ** 2 +
        positions.positions[i * 3 + 1] ** 2 +
        positions.positions[i * 3 + 2] ** 2
      );
      if (radius > 35) {
        // Reset to center with new random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 5 + Math.random() * 5;
        positions.positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions.positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions.positions[i * 3 + 2] = r * Math.cos(phi);
      }

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const mesh = meshRef.current;
  if (!mesh) return null;
  return <primitive object={mesh} />;
}