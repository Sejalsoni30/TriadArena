/**
 * Triad Arena Motion Design System Tokens
 * Defined once, reused everywhere across components and pages.
 * Conforms to Section 14.7 of the Master Build Specification.
 */

export const MOTION_DURATIONS = {
  fast: 0.15,      // 150ms: micro-interactions, button hover, click ripple
  base: 0.3,       // 300ms: modals, tabs, dropdowns, card state shifts
  slow: 0.6,       // 600ms: section reveals, drawer slide, match result reveals
  hero: 1.2        // 1200ms: initial hero text masked reveal, preloader intro
} as const;

export const MOTION_EASINGS = {
  // Expo out for swift, impactful entrances
  easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Smooth cubic for reversible transitions
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  // Snappy physics spring for interactive controls and cards
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 24,
    mass: 0.8
  },
  // Bouncy spring for celebrations and trophies
  bouncySpring: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 15
  }
} as const;

export const MOTION_OFFSETS = {
  revealDistance: 32, // 32px vertical distance for entrance reveals
  staggerDelay: 0.08   // 80ms stagger between list items or text lines
} as const;

/**
 * Checks if user prefers reduced motion (OS-level accessibility setting)
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Framer Motion Variants
 */
export const fadeInUpVariant = {
  hidden: {
    opacity: 0,
    y: MOTION_OFFSETS.revealDistance,
    filter: 'blur(8px)'
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: MOTION_DURATIONS.slow,
      delay: custom * MOTION_OFFSETS.staggerDelay,
      ease: MOTION_EASINGS.easeOutExpo
    }
  })
};

export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_OFFSETS.staggerDelay,
      delayChildren: 0.1
    }
  }
};

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.base,
      ease: MOTION_EASINGS.easeOutExpo
    }
  }
};
