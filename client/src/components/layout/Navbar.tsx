import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swords, Trophy, Flame, Play, Menu, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { MobileDrawer } from './MobileDrawer';
import { useAuthStore } from '../../store/authStore';
import { sound } from '../../lib/sound';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(sound.isEnabled());

  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide on scroll down, show on scroll up (Section 14.3)
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleSound = () => {
    const newState = sound.toggle();
    setIsAudioActive(newState);
    if (newState) {
      sound.playClick();
    }
  };

  const navLinks = [
    { label: 'Play', path: '/play', icon: <Play className="w-4 h-4" /> },
    { label: 'Tournaments', path: '/tournaments', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Flame className="w-4 h-4" /> },
    { label: 'How to Play', path: '/how-to-play', icon: <Swords className="w-4 h-4" /> }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${scrolled ? 'pt-3 px-4 sm:px-8' : 'pt-0 px-0'}`}
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-300 ${
            scrolled
              ? 'glass-panel rounded-full px-6 py-2.5 border border-primary/30 shadow-glass backdrop-blur-2xl'
              : 'px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-800/60 bg-background/80 backdrop-blur-md'
          } flex items-center justify-between`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-background-deep rounded-[10px] flex items-center justify-center">
                <Swords className="w-5 h-5 text-accent-cyan group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <span className="font-display font-black text-xl tracking-wider text-white">
              TRIAD<span className="text-accent-cyan">ARENA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-accent-cyan bg-accent-cyan/15 font-bold border border-accent-cyan/40 shadow-glow-cyan'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Audio toggle + Profile / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioActive ? 'Mute Procedural Audio' : 'Enable Procedural Audio'}
              aria-label="Toggle procedural game audio"
              className={`p-2 rounded-full border transition-all ${
                isAudioActive
                  ? 'border-accent-cyan/50 text-accent-cyan bg-accent-cyan/10 shadow-glow-cyan'
                  : 'border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card border border-primary/40 hover:border-accent-cyan/60 transition-all hover:scale-105"
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
              onClick={toggleSound}
              aria-label="Toggle audio"
              className="p-2 text-gray-400 hover:text-white"
            >
              {isAudioActive ? <Volume2 className="w-5 h-5 text-accent-cyan" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-lg text-gray-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so content does not collide with fixed navbar */}
      <div className="h-16" />

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
