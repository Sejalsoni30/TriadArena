import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, ShieldCheck, HeartHandshake, Mail, Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-background-deep border-t border-gray-800/80 py-12 px-4 sm:px-6 lg:px-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-accent-cyan" />
            <span className="font-display font-black text-lg text-white">
              TRIAD<span className="text-accent-cyan">ARENA</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            The next-generation competitive skill & prediction battle arena. Think fast. Play smart. Win big.
          </p>
          <div className="text-[11px] text-gray-400 font-mono">
            Pure virtual points and XP economy. No real money or gambling.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">
            Game Modes
          </h4>
          <ul className="flex flex-col gap-2">
            <li><Link to="/solo" className="hover:text-accent-cyan transition-colors">Solo vs AI (Markov Chain)</Link></li>
            <li><Link to="/lobby" className="hover:text-accent-cyan transition-colors">Ranked 1v1 Quick Match</Link></li>
            <li><Link to="/room" className="hover:text-accent-cyan transition-colors">Private Custom Rooms</Link></li>
            <li><Link to="/tournaments" className="hover:text-accent-cyan transition-colors">Championship Tournaments</Link></li>
          </ul>
        </div>

        {/* Community & Rankings */}
        <div>
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">
            Competition
          </h4>
          <ul className="flex flex-col gap-2">
            <li><Link to="/leaderboard" className="hover:text-accent-cyan transition-colors">Global Leaderboard</Link></li>
            <li><Link to="/how-to-play" className="hover:text-accent-cyan transition-colors">How to Play & Strategy</Link></li>
            <li><Link to="/achievements" className="hover:text-accent-cyan transition-colors">Achievements & Badges</Link></li>
            <li><span className="text-gray-400">Season 1: Cyber Genesis</span></li>
          </ul>
        </div>

        {/* Legal & Fair Play */}
        <div>
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs mb-3">
            Fair Play & Legal
          </h4>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" /> Authoritative Commit-Reveal</li>
            <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
        <p>© 2026 Triad Arena. All rights reserved. Server-authoritative competitive platform.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1"><HeartHandshake className="w-4 h-4 text-accent-cyan" /> 100% Free-to-Play</span>
          <span>•</span>
          <span>Latency &lt; 35ms</span>
        </div>
      </div>
    </footer>
  );
};
