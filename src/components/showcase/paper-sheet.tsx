'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

/**
 * One A4 sheet, as paper rather than as a card.
 *
 * The plane is subdivided and its vertices bowed, so the sheet catches light
 * across a curve the way a printed page does. A flat quad with a drop shadow
 * reads as a UI element; this is trying to read as something you could pick up.
 */

const A4 = { w: 2.1, h: 2.97 }; // 1 : 1.414
const SEGMENTS = 24;

function useCurvedPlane(curl: number) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(A4.w, A4.h, SEGMENTS, SEGMENTS);
    const pos = geo.attributes.position;
    const halfW = A4.w / 2;
    const halfH = A4.h / 2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // A gentle cylindrical bow, deepest at the free edge and eased off
      // towards the top, as a sheet resting against something behind it.
      const across = (x / halfW) ** 2;
      const down = (y + halfH) / A4.h;
      pos.setZ(i, -curl * across * (0.35 + 0.65 * (1 - down)));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [curl]);
}

export function PaperSheet({
  src,
  tilt,
  curl = 0.12,
  still,
  groupRef
}: {
  src: string;
  /** Pointer position, -1..1 on each axis, read every frame. */
  tilt: React.RefObject<{ x: number; y: number }>;
  curl?: number;
  still?: boolean;
  /** Optional parent ref for external control (e.g., GSAP ScrollTrigger). */
  groupRef?: React.RefObject<THREE.Group | null>;
}) {
  const internalGroup = useRef<THREE.Group>(null);
  const geometry = useCurvedPlane(curl);
  const invalidate = useThree((state) => state.invalidate);

  const texture = useLoader(THREE.TextureLoader, src);

  // The geometry is built by hand rather than by JSX, so R3F does not own it
  // and will not dispose it. Switching template unmounts this component, and
  // without the cleanup every switch would leak a 24x24 subdivided plane.
  // Also dispose the texture to prevent memory leaks on template switches.
  useEffect(() => () => {
    geometry.dispose();
    texture.dispose();
  }, [geometry, texture]);

  // Crisp small type on a sheet seen at an angle needs anisotropy; without it
  // the Devanagari conjuncts turn to mush as soon as the page tilts.
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  // Spring physics for smooth, natural tilt animation
  const [_springs, api] = useSpring(() => ({
    rotationX: 0,
    rotationY: 0,
    config: { tension: 170, friction: 26 }
  }), []);

  // Sync parent ref with internal group (for GSAP control)
  useEffect(() => {
    if (groupRef) {
      groupRef.current = internalGroup.current;
    }
  }, [groupRef]);

  // Pointer-driven tilt (when not in reduced-motion mode)
  useFrame((_state, _delta) => {
    if (still) return;
    const t = tilt.current ?? { x: 0, y: 0 };
    const targetY = t.x * 0.35;
    const targetX = -t.y * 0.22;
    api.start({ rotationY: targetY, rotationX: targetX });
  });

  // Reduced-motion fallback: gentle auto-rotate to best viewing angle
  useFrame(() => {
    if (!still) return;
    const g = internalGroup.current;
    if (!g) return;
    // Gentle auto-rotate to slightly angled "hero" pose
    const targetY = 0;
    const targetX = -0.15;
    if (Math.abs(g.rotation.y - targetY) > 0.01 || Math.abs(g.rotation.x - targetX) > 0.01) {
      g.rotation.y += (targetY - g.rotation.y) * 0.02;
      g.rotation.x += (targetX - g.rotation.x) * 0.02;
      invalidate();
    }
  });

  return (
    <animated.group ref={internalGroup}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial map={texture} roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </animated.group>
  );
}
