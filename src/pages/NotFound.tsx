
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NeonLogo from '@/components/NeonLogo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center p-6">
      <NeonLogo size="md" className="mb-8" />
      
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-neon-red mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-6">Strona nie znaleziona</h2>
        <p className="text-white/70 mb-8">
          Upps! Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
        </p>
        <Button asChild className="bg-neon-blue hover:bg-neon-blue/80">
          <Link to="/">Wróć do strony głównej</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
