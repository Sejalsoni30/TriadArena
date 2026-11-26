import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swords, Trophy, Award, LayoutDashboard, Menu, Flame, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { MobileDrawer } from './MobileDrawer';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { label: 'Play', path: '/play', icon: <Play className="w-4 h-4" /> },
    { label: 'Tournaments', path: '/tournaments', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Flame className="w-4 h-4" /> },
    { label: 'How to Play', path: '/how-to-play', icon: <Swords className="w-4 h-4" /> }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent-cyan p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-background-deep rounded-[7px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-accent-cyan group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="font-display font-black text-xl tracking-wider text-white">
              TRIAD<span className="text-accent-cyan">ARENA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-accent-cyan bg-accent-cyan/10 font-bold border border-accent-cyan/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User / Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-card border border-primary/30 hover:border-accent-cyan/50 transition-colors"
                >
                  <Avatar name={user.username} size="sm" src={user.avatar} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-display font-bold text-white">{user.username}</span>
                    <span className="text-[10px] font-mono text-accent-cyan">
                      Lvl {user.level} • {user.rating} Elo
                    </span>
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" size="sm">
                    Play Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
    </>
  );
};
