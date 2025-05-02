
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import NeonLogo from '@/components/NeonLogo';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { loadGameData } = useGameContext();
  
  useEffect(() => {
    // Load game data on homepage visit
    loadGameData();
  }, [loadGameData]);
  
  return (
    <div className="min-h-screen bg-neon-background flex flex-col items-center p-6">
      <motion.div 
        className="mt-12 mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <NeonLogo size="lg" />
      </motion.div>
      
      <motion.div
        className="max-w-2xl text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-white text-xl mb-4">
          Interaktywny teleturniej z pytaniami i wyzwaniami
        </h2>
        <p className="text-white/70">
          Trzy rundy ekscytującej zabawy, specjalne karty, koło fortuny i wiele więcej!
          Idealna rozrywka na Twój stream lub wydarzenie.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <MainCard 
          title="Panel Prowadzącego" 
          description="Zarządzaj pytaniami, uczestnikami i kontroluj przebieg gry"
          to="/unified-host" 
          delay={0.4}
        />
        
        <MainCard 
          title="Nakładka OBS" 
          description="Wyświetla interfejs teleturnieju dla widzów - kamery, pytania, animacje"
          to="/overlay" 
          delay={0.6}
        />
        
        <MainCard 
          title="Ustawienia" 
          description="Dostosuj wygląd, dodaj pytania, zarządzaj kategoriami i grafikami"
          to="/settings" 
          delay={0.8}
        />
        
        <MainCard 
          title="Instrukcja" 
          description="Jak prowadzić teleturniej i korzystać z wszystkich funkcji"
          to="/rules" 
          delay={1.0}
        />
      </div>
    </div>
  );
};

const MainCard = ({ title, description, to, delay = 0 }: { 
  title: string, 
  description: string, 
  to: string,
  delay?: number 
}) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link 
      to={to} 
      className="block h-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 transition-all hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
    >
      <h3 className="text-2xl font-bold text-neon-blue mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </Link>
  </motion.div>
);

export default HomePage;
