import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords } from 'lucide-react';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Skip if already seen in current session
    const hasSeenIntro = sessionStorage.getItem('triad_intro_seen');
    if (hasSeenIntro) {
      setLoading(false);
      return;
    }

    // Quick cinematic count-up under 1.6s
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sessionStorage.setItem('triad_intro_seen', 'true');
            setLoading(false);
          }, 250);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] bg-background-deep flex flex-col items-center justify-center select-none"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
          <div className="absolute w-60 h-60 rounded-full bg-accent-cyan/15 blur-[80px]" />

          {/* Logo Reveal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6 relative z-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent-cyan p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-background-deep rounded-[14px] flex items-center justify-center">
                <Swords className="w-8 h-8 text-accent-cyan" />
              </div>
            </div>
            <span className="font-display font-black text-3xl tracking-widest text-white">
              TRIAD<span className="text-accent-cyan">ARENA</span>
            </span>
          </motion.div>

          {/* Holographic Progress Bar */}
          <div className="w-64 relative z-10">
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent-cyan to-accent-magenta shadow-glow-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-2">
              <span className="uppercase tracking-widest text-accent-cyan">INITIALIZING ARENA</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
