'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { motionTokens, springs } from '@/lib/motion-tokens';

/**
 * The gallery grid.
 *
 * Filtering is still URL state, so the server renders the right set and the
 * chips work with JavaScript off. This only adds what a page reload cannot do:
 * when a filter changes, the surviving cards travel to their new positions
 * instead of the grid snapping.
 *
 * `layout="position"` on purpose: the cards never change size, and animating
 * size would scale-correct the A4 preview inside them, which distorts it.
 */
export function TemplateGrid({ items }: { items: Array<{ slug: string; node: ReactNode }> }) {
  return (
    <ul className="grid-cards">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((item) => (
          <motion.li
            key={item.slug}
            layout="position"
            initial={{ opacity: 0, scale: motionTokens.scale.subtle }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: motionTokens.scale.subtle }}
            transition={{ layout: springs.snappy, duration: motionTokens.duration.fast }}
            style={{ display: 'flex' }}
          >
            {item.node}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
