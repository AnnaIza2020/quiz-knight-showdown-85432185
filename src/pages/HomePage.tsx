
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '@/components/common/NeonButton';
import { Settings, Monitor, Users, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0C13] text-white font-montserrat">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo and title section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="/game-logo.png" 
              alt="Discord Game Show Logo" 
              className="w-32 h-32 mx-auto mb-4"
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-[#00FFA3] via-[#00E0FF] to-[#FF3E9D] bg-clip-text text-transparent animate-pulse">
            Discord Game Show
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Interaktywny teleturniej z trzema rundami, specjalnymi kartami i animacjami dla streamerów na Twitchu i Discordzie. 
            Pytania z polskiego internetu, Twitcha i gier w Polsce.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <NeonButton 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/host')}
            className="min-w-[200px]"
          >
            Panel Hosta
          </NeonButton>
          <NeonButton 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/player')}
            className="min-w-[200px]"
          >
            Widok Gracza
          </NeonButton>
        </div>

        {/* Bottom navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-[#00FFA3]/50"
          >
            <Settings className="w-8 h-8 mb-2 text-[#00FFA3]" />
            <span className="text-sm font-medium">Ustawienia</span>
          </button>
          
          <button
            onClick={() => navigate('/overlay')}
            className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-[#00E0FF]/50"
          >
            <Monitor className="w-8 h-8 mb-2 text-[#00E0FF]" />
            <span className="text-sm font-medium">Overlay</span>
          </button>
          
          <button
            onClick={() => navigate('/players')}
            className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-[#8B5CF6]/50"
          >
            <Users className="w-8 h-8 mb-2 text-[#8B5CF6]" />
            <span className="text-sm font-medium">Gracze</span>
          </button>
          
          <button
            onClick={() => navigate('/rules')}
            className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-[#FF3E9D]/50"
          >
            <BookOpen className="w-8 h-8 mb-2 text-[#FF3E9D]" />
            <span className="text-sm font-medium">Zasady</span>
          </button>
        </div>
      </div>

      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFA3]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF3E9D]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E0FF]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default HomePage;
