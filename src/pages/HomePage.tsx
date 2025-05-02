import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Eye, Users, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0F0B1E] flex flex-col items-center justify-center p-6 text-white">
      {/* Title with gradient text */}
      <h1 className="text-6xl font-bold mb-6 text-center">
        <span className="text-[#4DF73B]">Discord </span>
        <span className="text-[#4BDFED]">Game </span>
        <span className="text-[#F25D94]">Show</span>
      </h1>
      
      {/* Description */}
      <p className="text-center text-gray-300 max-w-2xl mb-12">
        Interaktywny teleturniej z trzema rundami, specjalnymi kartami i 
        animacjami dla streamów na Twitchu i Discordzie. Pytania z polskiego 
        internetu, Twitcha i gier w Polsce.
      </p>
      
      {/* Main buttons */}
      <div className="flex gap-6 mb-16">
        <Link 
          to="/unified-host" 
          className="text-white hover:text-neon-blue"
        >
          Panel Prowadzącego
        </Link>
        <Link 
          to="/overlay" 
          className="px-10 py-3 text-lg font-medium rounded border-2 border-[#4BDFED]/60 hover:bg-[#4BDFED]/10 transition-colors"
        >
          Widok Gracza
        </Link>
      </div>
      
      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        <NavCard to="/settings" icon={<Settings className="w-6 h-6 text-[#4DF73B]" />} label="Ustawienia" />
        <NavCard to="/overlay" icon={<Eye className="w-6 h-6 text-[#4BDFED]" />} label="Overlay" />
        <NavCard to="/hostpanel" icon={<Users className="w-6 h-6 text-[#F25D94]" />} label="Gracze" />
        <NavCard to="/rules" icon={<Shield className="w-6 h-6 text-[#4BDFED]" />} label="Zasady" />
      </div>
    </div>
  );
};

interface NavCardProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavCard = ({ to, icon, label }: NavCardProps) => {
  return (
    <Link 
      to={to} 
      className="border border-white/10 rounded-md p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors"
    >
      {icon}
      <span className="text-lg">{label}</span>
    </Link>
  );
};

export default HomePage;
