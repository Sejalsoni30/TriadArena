import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Desktop Custom Magnetic Glow Cursor.
 * Disabled on touch / mobile devices automatically.
 * Conforms to Section 14.3 of Master Build Specification.
 */
export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth spring physics for follower aura
  const cursorX = useSpring(-100, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 28 });
  const auraX = useSpring(-100, { stiffness: 180, damping: 20 });
  const auraY = useSpring(-100, { stiffness: 180, damping: 20 });

  useEffect(() => {
    // Detect touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      auraX.set(e.clientX);
      auraY.set(e.clientY);

      // Detect if hovering over clickable / interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-cursor')
      ) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, auraX, auraY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Magnetic Fluid Aura */}
      <motion.div
        style={{
          x: auraX,
          y: auraY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHoveringInteractive ? 1.8 : 1,
          borderColor: isHoveringInteractive ? 'rgba(0, 240, 255, 0.8)' : 'rgba(59, 130, 246, 0.4)',
          backgroundColor: isHoveringInteractive ? 'rgba(0, 240, 255, 0.1)' : 'rgba(37, 99, 235, 0.05)'
        }}
        transition={{ duration: 0.2 }}
        className="fixed w-9 h-9 rounded-full border border-primary/40 backdrop-blur-[1px] shadow-glow-cyan"
      />

      {/* Center Precision Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHoveringInteractive ? 0.5 : 1
        }}
        className="fixed w-2 h-2 rounded-full bg-accent-cyan shadow-glow-cyan"
      />
    </div>
  );
};
