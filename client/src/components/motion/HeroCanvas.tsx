import React, { useEffect, useRef } from 'react';
import { isReducedMotionPreferred } from '../../lib/motion.config';

/**
 * Procedural 3D Geometric Canvas Scene.
 * Renders floating faceted Rock, holographic folded Paper, and laser Scissors
 * using the official Triad Arena Design Tokens:
 * - Rock: Electric Blue (#3B82F6) with specular rim light
 * - Paper: Neon Cyan (#22D3EE) with holographic transparency
 * - Scissors: Neon Accent Pink (#F472B6) with laser energy cores
 */
export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const reducedMotion = isReducedMotionPreferred();

    // Mouse parallax target
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 50;
      mouseY = (e.clientY / innerHeight - 0.5) * 50;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize & DPI
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.parentElement?.clientWidth ? canvas.parentElement.clientWidth * dpr : window.innerWidth * dpr;
      canvas.height = 420 * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Pause loop when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Floating Stardust Particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * (canvas.width / 2),
      y: Math.random() * 420,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4
    }));

    let angle = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = 420;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse parallax lerp
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (!reducedMotion) {
        angle += 0.015;
      }

      // Draw Star Particles
      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha * 0.7})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#22D3EE';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const centerX = w / 2 + currentX * 0.6;
      const centerY = h / 2 + currentY * 0.6;

      // 1. LEFT: Floating Rock (Electric Blue #3B82F6)
      ctx.save();
      const rockX = centerX - Math.min(w * 0.3, 180);
      const rockY = centerY + Math.sin(angle) * 12;
      ctx.translate(rockX, rockY);
      ctx.rotate(angle * 0.6);

      // Core glow
      const rockGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 55);
      rockGlow.addColorStop(0, 'rgba(59, 130, 246, 0.45)');
      rockGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = rockGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fill();

      // Faceted polygon faces
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.45)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const x = Math.cos(rad) * 35;
        const y = Math.sin(rad) * 35;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Internal facet lines
      ctx.beginPath();
      ctx.moveTo(-35, 0); ctx.lineTo(35, 0);
      ctx.moveTo(0, -35); ctx.lineTo(0, 35);
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // 2. CENTER: Floating Paper (Neon Cyan #22D3EE)
      ctx.save();
      const paperX = centerX;
      const paperY = centerY + Math.cos(angle * 1.2) * 14;
      ctx.translate(paperX, paperY);
      ctx.rotate(-angle * 0.4);

      // Glow aura
      const paperGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 65);
      paperGlow.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
      paperGlow.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = paperGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 65, 0, Math.PI * 2);
      ctx.fill();

      // Rotated rectangular prism
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#22D3EE';
      ctx.shadowBlur = 20;
      ctx.strokeRect(-28, -36, 56, 72);

      // Inner hologram grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-20, -28, 40, 56);

      ctx.restore();

      // 3. RIGHT: Floating Scissors (Neon Accent Pink #F472B6)
      ctx.save();
      const scissorX = centerX + Math.min(w * 0.3, 180);
      const scissorY = centerY + Math.sin(angle * 0.9) * 12;
      ctx.translate(scissorX, scissorY);
      ctx.rotate(angle * 0.5);

      // Pink glow aura
      const sciGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 60);
      sciGlow.addColorStop(0, 'rgba(244, 114, 182, 0.4)');
      sciGlow.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = sciGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();

      // Laser crossing blades
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#F472B6';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.moveTo(-32, -32); ctx.lineTo(32, 32);
      ctx.moveTo(32, -32); ctx.lineTo(-32, 32);
      ctx.stroke();

      // Energy node rings
      ctx.beginPath();
      ctx.arc(-24, -24, 7, 0, Math.PI * 2);
      ctx.arc(24, -24, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#8B5CF6';
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] flex items-center justify-center overflow-hidden my-4 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-label="3D geometric holographic Rock, Paper, Scissors entities"
      />
    </div>
  );
};
