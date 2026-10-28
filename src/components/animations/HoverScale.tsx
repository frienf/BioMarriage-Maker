'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { motionTokens } from '@/lib/motion-tokens';

interface HoverScaleProps extends HTMLMotionProps<'div'> {
  /** Scale factor on hover */
  scale?: number;
  /** Scale factor on tap/press */
  tapScale?: number;
  /** Transition duration for hover */
  hoverDuration?: number;
  /** Transition duration for tap */
  tapDuration?: number;
}

/**
 * Scale on hover and tap with spring physics.
 * Great for cards, buttons, and interactive elements.
 */
export function HoverScale({
  children,
  scale = motionTokens.scale.pop,
  tapScale = motionTokens.scale.press,
  hoverDuration = motionTokens.duration.fast,
  tapDuration = motionTokens.duration.fast,
  className,
  style,
  ...props
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: hoverDuration, ease: motionTokens.easing.smooth } }}
      whileTap={{ scale: tapScale, transition: { duration: tapDuration } }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  /** Y offset on hover (negative = up) */
  y?: number;
  /** Box shadow on hover */
  boxShadow?: string;
}

/**
 * Lift effect on hover - moves up and adds shadow.
 * Perfect for cards and elevated surfaces.
 */
export function HoverLift({
  children,
  y = -motionTokens.distance.lg,
  boxShadow = 'var(--shadow-card)',
  className,
  style,
  ...props
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        y,
        boxShadow,
        transition: { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pulse animation - subtle scale pulse for attention.
 * Use sparingly for important CTAs or notifications.
 */
export function Pulse({
  children,
  scale = 1.05,
  interval = 2,
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & { scale?: number; interval?: number }) {
  return (
    <motion.div
      animate={{ scale: [1, scale, 1] }}
      transition={{ duration: interval, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shake animation for error states.
 * Triggers on mount or when key changes.
 */
export function Shake({
  children,
  trigger,
  className,
  style,
  ...props
}: HTMLMotionProps<'div'> & { trigger?: number | string }) {
  const shakeIntensity = 8;
  return (
    <motion.div
      animate={{ x: [0, -shakeIntensity, shakeIntensity, -shakeIntensity, shakeIntensity, 0] }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}