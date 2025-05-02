
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Layout } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-md w-full px-4 flex flex-col items-center">        
        <div className="mb-8 mt-24">
          <img 
            src="/lovable-uploads/61b1b24f-4a7b-43f7-836c-2dae94d40d5e.png" 
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
          Interaktywny teleturniej z trzema rundami, specjalnymi kartami i animacjami dla streamów na Twitchu i Discordzie.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8 w-full">
          <Link 
            to="/unified-host" 
            className="col-span-1 flex flex-col items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-[#8BC34A] to-[#4CAF50] text-white font-medium hover:brightness-110 transition-all"
          >
            Panel hosta
          </Link>
          
          <Link 
            to="/overlay" 
            className="col-span-1 flex flex-col items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-[#3F51B5] to-[#2196F3] text-white font-medium hover:brightness-110 transition-all"
          >
            Overlay
          </Link>
          
          <Link 
            to="/settings" 
            className="col-span-1 flex flex-col items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r from-[#9C27B0] to-[#673AB7] text-white font-medium hover:brightness-110 transition-all"
          >
            Ustawienia
          </Link>
        </div>
        
        <div className="w-full bg-black/40 rounded-lg p-4 border border-white/10">
          <h2 className="text-white/80 text-lg mb-2 font-medium text-center">Discord Game Show Arena</h2>
          <p className="text-white/60 text-sm text-center mb-2">
            Aplikacja stworzona do prowadzenia dynamicznych teleturniejów online.
          </p>
          <div className="flex justify-center mt-4 text-xs text-white/40">
            Wersja 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
