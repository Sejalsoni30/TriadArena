import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { UserProfile } from '@triad-arena/shared';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; path: string; icon: React.ReactNode }[];
  user: UserProfile | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  links,
  user,
  isAuthenticated,
  onLogout
}) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background-deep/80 backdrop-blur-md"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-4/5 max-w-sm h-full glass-panel bg-background-deep p-6 border-l border-gray-800 flex flex-col justify-between shadow-2xl z-10"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Swords className="w-6 h-6 text-accent-cyan" />
                  <span className="font-display font-black text-lg text-white">TRIAD ARENA</span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User profile snippet (if logged in) */}
              {isAuthenticated && user && (
                <div className="py-5 border-b border-gray-800 flex items-center gap-3">
                  <Avatar name={user.username} size="md" src={user.avatar} />
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">{user.username}</h4>
                    <p className="font-mono text-xs text-accent-cyan">
                      Level {user.level} • {user.rating} Elo
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <nav className="flex flex-col gap-1.5 py-6">
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider ${
                      location.pathname === '/dashboard'
                        ? 'bg-primary text-white shadow-glow-primary'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5 text-accent-cyan" />
                    Dashboard
                  </Link>
                )}

                {links.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider ${
                        isActive
                          ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40 font-bold'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-5 h-5">{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer actions */}
            <div className="pt-6 border-t border-gray-800 flex flex-col gap-3">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-start gap-2 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link to="/login" onClick={onClose}>
                    <Button variant="outline" size="md" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={onClose}>
                    <Button variant="accent" size="md" className="w-full">
                      Play Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
