import { useEffect } from 'react';
import Lenis from 'lenis';
import { isReducedMotionPreferred } from '../lib/motion.config';

/**
 * Inertial Smooth Scrolling hook using Lenis.
 * Automatically disabled if user has prefers-reduced-motion active.
 * Conforms to Section 14.1 of Master Build Specification.
 */
export function useLenis() {
  useEffect(() => {
    if (isReducedMotionPreferred()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
