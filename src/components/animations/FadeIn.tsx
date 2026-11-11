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
 * Keep server-rendered content visible even before JavaScript runs.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = motionTokens.duration.normal,
  y: _y = motionTokens.distance.md,
  once = true,
  viewportAmount = 0.3,
  className,
  style,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={false}
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
 * Group content without hiding it in the server-rendered page.
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
      initial={false}
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
 * Keep grouped content visible during server rendering.
 */
interface SlideInProps extends FadeInProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideIn({
  children,
  direction: _direction = 'left',
  delay = 0,
  duration = motionTokens.duration.normal,
  distance: _distance = 40,
  className,
  style,
  ...props
}: SlideInProps & { distance?: number }) {
  return (
    <motion.div
      initial={false}
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
