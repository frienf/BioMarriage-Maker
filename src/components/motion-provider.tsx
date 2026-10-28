'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { defaultTransition } from '@/lib/motion-tokens';

/**
 * One place that sets how the whole site moves.
 *
 * `reducedMotion="user"` makes every transform and layout animation obey the
 * operating system's reduce-motion setting without each component remembering
 * to ask. Opacity still crossfades, which is what that setting is for.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={defaultTransition}>
      {children}
    </MotionConfig>
  );
}
