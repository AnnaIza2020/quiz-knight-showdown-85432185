
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Layout, Users, Home } from 'lucide-react';

const EnhancedNavigation = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <NavigationButton 
        to="/unified-host" 
        icon={<Home />}
        label="Panel Hosta"
        primaryClass="bg-[#10B981] hover:bg-[#10B981]/90"
      />
      
      <NavigationButton 
        to="/overlay" 
        icon={<Layout />}
        label="Nakładka OBS"
        primaryClass="bg-[#3B82F6] hover:bg-[#3B82F6]/90"
      />
      
      <NavigationButton 
        to="/settings" 
        icon={<Settings />}
        label="Ustawienia"
        primaryClass="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
      />
      
      <NavigationButton 
        to="/player/1" 
        icon={<Users />}
        label="Widok Gracza"
        primaryClass="bg-[#333333] hover:bg-[#444444] border border-white/20"
      />
    </div>
  );
};

const NavigationButton = ({ to, icon, label, primaryClass }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center p-4 rounded-lg ${primaryClass} text-white transition-all`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <span className="text-lg font-medium">{label}</span>
  </Link>
);

export default EnhancedNavigation;
