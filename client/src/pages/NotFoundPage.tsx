import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gray-800 max-w-md w-full shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-display font-black text-white tracking-widest mb-2">404</h1>
        <h2 className="text-lg font-display font-bold text-gray-200 uppercase tracking-wide mb-3">
          Arena Sector Not Found
        </h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          The requested coordinate does not exist or has been shifted into another dimension.
        </p>
        <Link to="/">
          <Button variant="primary" size="md" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Arena
          </Button>
        </Link>
      </div>
    </div>
  );
};
