
import React from 'react';
import { Link } from 'react-router-dom';

const EnhancedNavigation = () => {
  return (
    <nav className="flex flex-col md:flex-row gap-4 mt-8">
      <Link
        to="/host"
        className="neon-button bg-gradient-to-r from-neon-pink to-neon-blue"
      >
        Panel Hosta (Wersja Klasyczna)
      </Link>
      
      <Link
        to="/hostpanel"
        className="neon-button bg-gradient-to-r from-neon-green to-neon-yellow"
      >
        Panel Hosta (Nowy Układ)
      </Link>
      
      <Link
        to="/overlay"
        className="neon-button bg-gradient-to-r from-neon-purple to-neon-blue"
      >
        Nakładka OBS
      </Link>
      
      <Link
        to="/settings"
        className="neon-button bg-gradient-to-r from-neon-blue to-neon-green"
      >
        Ustawienia
      </Link>
    </nav>
  );
};

export default EnhancedNavigation;
