
import React from 'react';
import { Link } from 'react-router-dom';
import NeonLogo from '@/components/NeonLogo';
import { useGameContext } from '@/context/GameContext';

const Index = () => {
  return (
    <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center p-6">
      <div className="animate-fade-in">
        <NeonLogo size="lg" className="mb-8" />
        
        <div className="text-center mb-12">
          <p className="text-xl text-white mb-2">
            Neonowa aplikacja quizowa dla Twojego streama
          </p>
          <p className="text-neon-blue">
            Trzy unikalne rundy. Pełne wsparcie streamingu.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <Link 
            to="/overlay" 
            className="neon-card hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-neon-pink mb-2">Nakładka OBS</h2>
            <p className="text-white/80">
              Widok dla widzów i uczestników. Idealny do streamowania lub wyświetlania na osobnym ekranie.
            </p>
          </Link>
          
          <Link 
            to="/host" 
            className="neon-card hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-neon-blue mb-2">Panel Hosta</h2>
            <p className="text-white/80">
              Steruj całą grą, przyznawaj punkty, kontroluj przebieg wszystkich rund.
            </p>
          </Link>
          
          <Link 
            to="/settings" 
            className="neon-card hover:border-neon-purple hover:shadow-[0_0_20px_rgba(155,0,255,0.8)] transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-neon-purple mb-2">Ustawienia</h2>
            <p className="text-white/80">
              Zarządzaj uczestnikami, dodawaj pytania i kategorie, dostosuj wygląd.
            </p>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-neon-green">DISCORD GAME SHOW</p>
          <p className="text-white/60 text-sm mt-2">
            Aplikacja zoptymalizowana pod rozdzielczość 1920x1080
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
