'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows, PerformanceMonitor, useTexture, Html } from '@react-three/drei';
import { PaperSheet } from './paper-sheet';
import { TEMPLATES } from '@/templates/catalog';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * A biodata shown as a printed sheet.
 *
 * The product sells a piece of paper, and a flat preview never quite says so.
 * This is the one thing 3D does for this project that 2D cannot: light moving
 * across a page as it turns.
 */

const SHOWN = ['kumkum', 'ganesh-mangal', 'mayur', 'marathi-paramparik', 'akash']
  .map((slug) => TEMPLATES.find((t) => t.slug === slug)!)
  .filter(Boolean);

/** Preload all thumbnail textures so template switches are instant. */
function PreloadThumbnails() {
  SHOWN.forEach((t) => useTexture.preload(`/brand/thumbs/${t.slug}.png`));
  return null;
}

/** Placeholder shown while a thumbnail texture loads. */
function LoadingPlaceholder() {
  return (
    <group>
      <mesh>
        <planeGeometry args={[2.1, 2.97]} />
        <meshBasicMaterial wireframe color="#666" />
      </mesh>
      <Html center position={[0, -1.8, 0]}>
        <p className="muted" style={{ fontSize: 14 }}>Loading template…</p>
      </Html>
    </group>
  );
}

export function Showcase() {
  const [index, setIndex] = useState(0);
  const [dpr, setDpr] = useState(1.5);
  const [still, setStill] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [_scrollProgress, setScrollProgress] = useState(0);
  const [_showCursor, setShowCursor] = useState(false);
  const [_cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  /** Captured from the canvas so the pointer handler, which lives outside it,
   *  can wake the render loop. */
  const invalidate = useRef<(() => void) | null>(null);
  const current = SHOWN[index];
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.Camera>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const prevIndexRef = useRef(index);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const matches = mq.matches;
      setStill(matches);
      setPrefersReducedMotion(matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const step = (by: number) => setIndex((i) => {
    const next = (i + by + SHOWN.length) % SHOWN.length;
    prevIndexRef.current = i;
    return next;
  });

  // Keyboard navigation for template switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      // Space/Enter to scroll to next section
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const sections = scrollContainerRef.current?.querySelectorAll('.showcase-section');
        if (sections && sections[index + 1]) {
          (sections[index + 1] as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  // Pointer position normalised to -1..1, written to a ref so the render loop
  // can read it without re-rendering React 60 times a second.
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tilt.current = {
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1
    };
    // Track cursor position for custom cursor
    setCursorPos({ x: e.clientX, y: e.clientY });
    setShowCursor(true);
    invalidate.current?.();
  }, []);

  const _onPointerLeave = useCallback(() => {
    tilt.current = { x: 0, y: 0 };
    setShowCursor(false);
    invalidate.current?.();
  }, []);

  // Track scroll progress for progress indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger animations - only on desktop and when not reduced motion
  useGSAP(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Camera orbit on scroll
      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: 3,
          y: 2,
          z: 8,
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: () => cameraRef.current?.lookAt(0, 0, 0)
          }
        });
      }

      // Sheet tilt on scroll
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          x: -0.3,
          y: 0.5,
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        });
      }

      // Auto-advance template on scroll sections
      const sections = gsap.utils.toArray('.showcase-section') as HTMLElement[];
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          onEnter: () => setIndex(i),
          onEnterBack: () => setIndex(i)
        });
      });

      // Scroll progress indicator
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setScrollProgress(self.progress)
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, { scope: scrollContainerRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={scrollContainerRef} className="showcase-scroll-container" style={{ minHeight: '300vh' }}>
      {/* Fixed canvas area - stays in viewport while scrolling */}
      <div
        ref={containerRef}
        tabIndex={0}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--canvas)',
          zIndex: 10
        }}
      >
        <div
          onPointerMove={still ? undefined : onPointerMove}
          onPointerLeave={_onPointerLeave}
          style={{ flex: 1, minHeight: 0, cursor: still ? 'default' : 'grab' }}
        >
          <Canvas
            shadows
            dpr={dpr}
            camera={{ position: [0, 0, 5.2], fov: 38 }}
            gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            <PerformanceMonitor onDecline={() => setDpr(1)} />
            <ambientLight intensity={0.78} />
            <directionalLight
              position={[-3.2, 4.4, 4]}
              intensity={1.35}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0005}
            />
            <directionalLight position={[4, 1.5, 2]} intensity={0.3} />

            <PreloadThumbnails />

            <Suspense fallback={<LoadingPlaceholder />}>
              <PaperSheet
                key={current.slug}
                src={`/brand/thumbs/${current.slug}.png`}
                tilt={tilt}
                still={still}
                groupRef={groupRef}
              />
            </Suspense>

            <ContactShadows position={[0, -1.62, 0]} opacity={0.38} scale={7} blur={2.6} far={3} resolution={512} />
          </Canvas>
        </div>

        <nav
          aria-label="Templates"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px var(--gutter) 28px',
            background: 'var(--paper)',
            borderTop: '1px solid var(--line)'
          }}
        >
          <button type="button" className="btn btn-outline" onClick={() => step(-1)} aria-label="Previous template">
            Previous
          </button>
          <p aria-live="polite" aria-atomic="true" style={{ minWidth: '14rem', textAlign: 'center', fontWeight: 600 }}>
            {current.title}
            <span className="muted small" style={{ fontWeight: 400 }}>
              {' '}
              · {index + 1} of {SHOWN.length}
            </span>
          </p>
          <button type="button" className="btn btn-primary" onClick={() => step(1)} aria-label="Next template">
            Next
          </button>
        </nav>
      </div>

      {/* Scrollable content sections - each triggers template change */}
      <div style={{ paddingTop: '100vh', paddingBottom: '100vh' }}>
        {SHOWN.map((tpl, i) => (
          <section
            key={tpl.slug}
            className="showcase-section"
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 var(--gutter)',
              background: i % 2 === 0 ? 'var(--paper)' : 'var(--canvas)'
            }}
          >
            <div style={{ maxWidth: '600px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 600, marginBottom: 16 }}>
                {tpl.title}
              </h2>
              <p className="lede" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                {tpl.blurb}
              </p>
              <p className="muted small" style={{ marginTop: 24 }}>
                Scroll to continue →
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
