/**
 * Motion foundations: every duration, easing, distance and spring the site
 * animates with.
 *
 * The values are the ones already in use, lifted out of the components so
 * there is one place to change how the site moves. A component that needs a
 * number the set does not have should add it here with a name, not inline it.
 */

export const motionTokens = {
  /** Seconds. `fast` also backs the CSS crossfade, see --motion-fast. */
  duration: {
    fast: 0.18,
    normal: 0.28,
    slow: 0.42
  },

  easing: {
    /** Decelerating, for things arriving. */
    smooth: [0.22, 1, 0.36, 1],
    /** Symmetric, for things moving between two known states. */
    standard: [0.4, 0, 0.2, 1]
  },

  scale: {
    press: 0.96,
    pop: 1.03,
    subtle: 0.98
  },

  /** Pixels of travel. Short, because a biodata is a document, not a slideshow. */
  distance: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40
  }
} as const;

/*
 * No stagger token, deliberately. The lists that would stagger — the template
 * grid's first paint, the home page's steps and proof points — are on
 * prerendered pages that ship no JavaScript at all, and staggering them would
 * mean shipping an animation library to delay content a visitor came to read.
 * Add one here, between 0.05s and 0.10s, when something genuinely needs it.
 */

export const springs = {
  /** Settles in about 200ms. For positions that must keep up with a click. */
  snappy: { type: 'spring', stiffness: 420, damping: 38 },
  /** Softer arrival, for content rather than controls. */
  gentle: { type: 'spring', stiffness: 260, damping: 30 }
} as const;

/** The site-wide default, applied once by MotionProvider. */
export const defaultTransition = {
  duration: motionTokens.duration.normal,
  ease: motionTokens.easing.smooth
} as const;
