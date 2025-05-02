
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeonLogo from '@/components/NeonLogo';
import EnhancedNavigation from '@/components/EnhancedNavigation';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/0272188b-bb47-43fe-aff3-66734661c616.png" 
              alt="Discord Game Show Logo" 
              className="h-32 mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 to-pink-500">
            Discord Game Show
          </h1>
          <p className="mt-2 text-white/80">
            Panel zarządzania turniejem dla prowadzącego i uczestników
          </p>
        </div>

        <div className="neon-card mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Witaj w panelu prowadzącego!</h2>
          <p className="text-white/80 mb-4">
            Wybierz jedną z poniższych opcji, aby kontynuować:
          </p>
          
          <EnhancedNavigation />
        </div>
        
        <div className="neon-card">
          <h2 className="text-xl font-bold mb-2 text-neon-blue">Krótka instrukcja:</h2>
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

export default HomePage;
