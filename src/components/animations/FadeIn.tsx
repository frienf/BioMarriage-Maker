'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';

interface FadeInProps extends HTMLMotionProps<'div'> {
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Animation duration (in seconds) */
  duration?: number;
  /** Starting Y offset (in pixels) */
  y?: number;
  /** Whether to animate only once on mount */
  once?: boolean;
  /** Viewport threshold for whileInView */
  viewportAmount?: number | 'some' | 'all';
}

/**
 * Fade-in animation component with configurable options.
 * Respects prefers-reduced-motion automatically via MotionConfig.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = motionTokens.duration.normal,
  y = motionTokens.distance.md,
  once = true,
  viewportAmount = 0.3,
  className,
  style,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: motionTokens.easing.smooth, delay }}
      whileInView={once ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: viewportAmount }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered fade-in for lists of children.
 * Each child fades in with a small delay after the previous one.
 */
interface StaggeredFadeInProps extends Omit<FadeInProps, 'delay'> {
  staggerDelay?: number;
  delay?: number;
  children: React.ReactNode;
}

export function StaggeredFadeIn({
  children,
  staggerDelay = 0.08,
  delay = 0,
  duration = motionTokens.duration.normal,
  y = motionTokens.distance.md,
  once = true,
  viewportAmount = 0.3,
  className,
  style,
  ...props
}: StaggeredFadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      viewport={{ once, amount: viewportAmount }}
      className={className}
      style={style}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ variants?: Record<string, unknown> }>, {
              variants: {
                hidden: { opacity: 0, y },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration, ease: motionTokens.easing.smooth },
                },
              },
            })
          : child
      )}
    </motion.div>
  );
}

/**
 * Slide-in from left or right based on direction.
 * Useful for side panels, drawers, or directional reveals.
 */
interface SlideInProps extends FadeInProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  duration = motionTokens.duration.normal,
  distance = 40,
  className,
  style,
  ...props
}: SlideInProps & { distance?: number }) {
  const initial = {
    left: { opacity: 0, x: -distance },
    right: { opacity: 0, x: distance },
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
  }[direction];

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, ease: motionTokens.easing.smooth, delay }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}