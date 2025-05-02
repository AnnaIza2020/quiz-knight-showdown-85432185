
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Layout, Home, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-md w-full px-4 flex flex-col items-center">        
        <div className="mb-8 mt-24">
          <img 
            src="/lovable-uploads/5d43e62b-61b1-4821-beff-4abb5eb500f5.png" 
            alt="Discord Game Show Logo" 
            className="h-32 mx-auto"
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-[#39FF14]">Discord</span>{' '}
          <span className="text-[#00FFFF]">Game</span>{' '}
          <span className="text-[#FF00FF]">Show</span>
        </h1>
        
        <p className="text-white/80 text-center mb-10 max-w-xs">
          Interaktywny teleturniej z trzema rundami, specjalnymi kartami i animacjami dla streamów na Twitchu i Discordzie. Pytania z polskiego internetu, Twitcha i gier w Polsce.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link 
            to="/unified-host" 
            className="flex items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-[#8BC34A] to-[#FF4081] text-white font-medium"
          >
            Panel Hosta
          </Link>
          
          <Link 
            to="/player/new" 
            className="flex items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-[#3F51B5] to-[#9C27B0] text-white font-medium"
          >
            Widok Gracza
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4 w-full">
          <NavButton to="/settings" icon={<Settings className="h-5 w-5" />} label="Ustawienia" color="text-[#39FF14]" />
          <NavButton to="/overlay" icon={<Layout className="h-5 w-5" />} label="Overlay" color="text-[#00FFFF]" />
          <NavButton to="/player/new" icon={<Users className="h-5 w-5" />} label="Gracze" color="text-[#FF00FF]" />
          <NavButton to="/settings?tab=rules" icon={<Home className="h-5 w-5" />} label="Zasady" color="text-white" />
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ to, icon, label, color }) => (
  <Link 
    to={to} 
    className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
  >
    <div className={`mb-1 ${color}`}>{icon}</div>
    <span className="text-xs text-white/80">{label}</span>
  </Link>
);

export default HomePage;
