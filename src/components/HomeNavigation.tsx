
import React from 'react';
import { Link } from 'react-router-dom';
import NeonLogo from './NeonLogo';

const HomeNavigation: React.FC = () => {
  return (
    <div className="min-h-screen bg-neon-background p-8 flex flex-col items-center justify-center">
      <NeonLogo size="lg" className="mb-12" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Discord Game Show</h1>
        <p className="text-xl text-white/70">Interaktywny teleturniej z trzema rundami</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Link to="/overlay" className="neon-card p-6 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-bold text-neon-blue mb-3">Nakładka OBS</h2>
          <p className="text-white/70">Pełnoekranowy widok na streamowanie</p>
          <div className="mt-4 text-neon-blue/70 flex justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </Link>
        
        <Link to="/host" className="neon-card p-6 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-bold text-neon-pink mb-3">Panel Hosta</h2>
          <p className="text-white/70">Zarządzanie grą, pytaniami i graczami</p>
          <div className="mt-4 text-neon-pink/70 flex justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </Link>
        
        <Link to="/settings" className="neon-card p-6 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-bold text-neon-green mb-3">Ustawienia</h2>
          <p className="text-white/70">Konfiguracja gry, pytań i wyglądu</p>
          <div className="mt-4 text-neon-green/70 flex justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </Link>
      </div>
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Uruchamianie gry</h3>
        <ol className="text-white/70 list-decimal list-inside text-left max-w-md">
          <li className="mb-2">Dodaj graczy i pytania w panelu ustawień</li>
          <li className="mb-2">Otwórz nakładkę OBS w osobnym oknie i dodaj jako źródło Browser w OBS</li>
          <li className="mb-2">Prowadź grę za pomocą Panelu Hosta</li>
        </ol>
      </div>
    </div>
  );
};

export default HomeNavigation;
