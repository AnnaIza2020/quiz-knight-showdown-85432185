
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Layout, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #1A1F2C 0%, #0A0A0F 100%)'
      }}
    >
      <div className="max-w-4xl w-full">        
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/game-logo.png" 
              alt="Discord Game Show Logo" 
              className="h-32 mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mt-4">
            <span className="text-[#39FF14]">Discord</span>{' '}
            <span className="text-[#FF00FF]">Game Show</span>
          </h1>
          <p className="mt-2 text-white/80">
            Panel zarządzania turniejem dla prowadzącego i uczestników
          </p>
        </div>

        <div className="bg-black/30 p-6 rounded-lg border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Witaj w panelu prowadzącego!</h2>
          <p className="text-white/80 mb-4">
            Wybierz jedną z poniższych opcji, aby kontynuować:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </div>
        
        <div className="bg-black/30 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-bold mb-2 text-[#39FF14]">Krótka instrukcja:</h2>
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>Panel Hosta - zarządzanie grą, graczami i pytaniami</li>
            <li>Nakładka OBS - widok dla widzów, można podłączyć jako źródło w OBS</li>
            <li>Ustawienia - konfiguracja gry, graczy, pytań i wyglądu</li>
          </ul>
        </div>
      </div>
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

export default HomePage;
