'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens } from '@/lib/motion-tokens';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  target?: React.RefObject<HTMLElement>;
  trigger?: React.RefObject<HTMLElement>;
  animation?: gsap.TweenVars;
  scrollTrigger?: ScrollTrigger.Vars;
  once?: boolean;
  stagger?: number;
  childSelector?: string;
}

export function ScrollReveal({
  target,
  trigger,
  animation = { y: 50, opacity: 0 },
  scrollTrigger = {},
  once = true,
  stagger = 0,
  childSelector,
}: ScrollRevealProps) {
  const targetRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Stable references to avoid useEffect dependency issues
  const animationRef = useRef(animation);
  const scrollTriggerRef = useRef(scrollTrigger);
  animationRef.current = animation;
  scrollTriggerRef.current = scrollTrigger;

  useEffect(() => {
    const targetEl = target?.current ?? targetRef.current;
    const triggerEl = trigger?.current ?? targetEl;

    if (!targetEl || !triggerEl) return;

    ctxRef.current = gsap.context(() => {
      const elements = childSelector
        ? Array.from(targetEl.querySelectorAll<HTMLElement>(childSelector))
        : [targetEl];

      gsap.fromTo(
        elements,
        { ...animationRef.current, opacity: 0 },
        {
          ...animationRef.current,
          opacity: 1,
          duration: motionTokens.duration.normal,
          ease: motionTokens.easing.smooth as unknown as gsap.EaseString,
          stagger,
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: once ? 'play none none none' : 'play none none reverse',
            ...scrollTriggerRef.current,
          },
        }
      );
    });

    return () => ctxRef.current?.revert();
  }, [target, trigger, once, stagger, childSelector]);

  if (target) return null;
  return <div ref={targetRef as React.RefObject<HTMLDivElement>} />;
}

interface ScrollProgressProps {
  onProgress?: (progress: number) => void;
  trigger?: React.RefObject<HTMLElement>;
  scrollTrigger?: ScrollTrigger.Vars;
}

export function ScrollProgress({
  onProgress,
  trigger,
  scrollTrigger = {},
}: ScrollProgressProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const scrollTriggerRef = useRef(scrollTrigger);
  scrollTriggerRef.current = scrollTrigger;

  useEffect(() => {
    const triggerEl = trigger?.current ?? triggerRef.current;
    if (!triggerEl) return;

    ctxRef.current = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => onProgress?.(self.progress),
        ...scrollTriggerRef.current,
      });
    });

    return () => ctxRef.current?.revert();
  }, [trigger, onProgress]);

  if (trigger) return null;
  return <div ref={triggerRef as React.RefObject<HTMLDivElement>} />;
}

interface ParallaxProps {
  speed?: number;
  target?: React.RefObject<HTMLElement>;
  trigger?: React.RefObject<HTMLElement>;
}

export function Parallax({
  children,
  speed = 0.5,
  target,
  trigger,
}: ParallaxProps & { children: React.ReactNode }) {
  const targetRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const targetEl = target?.current ?? targetRef.current;
    const triggerEl = trigger?.current ?? targetEl;

    if (!targetEl || !triggerEl) return;

    ctxRef.current = gsap.context(() => {
      gsap.to(targetEl, {
        yPercent: (1 - speed) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctxRef.current?.revert();
  }, [target, trigger, speed]);

  return <div ref={targetRef as React.RefObject<HTMLDivElement>}>{children}</div>;
}

export { gsap, ScrollTrigger };