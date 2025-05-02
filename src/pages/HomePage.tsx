import React from 'react';
import { Link } from 'react-router-dom';
import NeonLogo from '@/components/NeonLogo';
import { motion } from 'framer-motion';
import { Settings, Layout, Users, Shield } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

const HomePage = () => {
  const { loadGameData } = useGameContext();
  
  // Fix the infinite update loop by adding loadGameData to dependency array
  React.useEffect(() => {
    // Load game data on homepage visit
    loadGameData();
  }, [loadGameData]);
  
  return (
    <div className="min-h-screen bg-[#0A0A15] flex flex-col items-center justify-center p-6">
      <motion.div 
        className="mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <img 
          src="/lovable-uploads/0272188b-bb47-43fe-aff3-66734661c616.png" 
          alt="Discord Game Show Logo" 
          className="w-64 h-auto mb-4"
        />
      </motion.div>
      
      <motion.h1
        className="text-6xl font-bold mb-4 text-transparent bg-clip-text"
        style={{
          backgroundImage: 'linear-gradient(90deg, #3BF73B 0%, #00C2FF 50%, #FF42B7 100%)'
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Discord Game Show
      </motion.h1>
      
      <motion.div
        className="max-w-2xl text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-white text-lg">
          Interaktywny teleturniej z trzema rundami, specjalnymi kartami i
          animacjami dla streamów na Twitchu i Discordzie. Pytania z polskiego
          internetu, Twitcha i gier w Polsce.
        </p>
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12 w-full max-w-xl">
        <MainButton 
          to="/unified-host" 
          label="Panel Hosta"
          gradient="from-lime-500 to-pink-500"
          delay={0.5}
        />
        
        <MainButton 
          to="/overlay" 
          label="Widok Gracza"
          gradient="from-blue-900 to-blue-800"
          delay={0.6}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <NavButton 
          to="/settings" 
          label="Ustawienia"
          icon={<Settings className="w-6 h-6 opacity-80" />}
          delay={0.7}
        />
        
        <NavButton 
          to="/overlay" 
          label="Overlay"
          icon={<Layout className="w-6 h-6 opacity-80" />}
          delay={0.8}
        />
        
        <NavButton 
          to="/player/1" 
          label="Gracze"
          icon={<Users className="w-6 h-6 opacity-80" />}
          delay={0.9}
        />
        
        <NavButton 
          to="/rules" 
          label="Zasady"
          icon={<Shield className="w-6 h-6 opacity-80" />}
          delay={1.0}
        />
      </div>
    </div>
  );
};

type MainButtonProps = {
  to: string;
  label: string;
  gradient: string;
  delay: number;
}

const MainButton = ({ to, label, gradient, delay }: MainButtonProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.4 }}
    className="w-[220px]"
  >
    <Link to={to} className="block w-full">
      <div 
        className={`py-3 px-6 rounded text-white font-bold text-center text-lg bg-gradient-to-r ${gradient} 
                   hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300`}
      >
        {label}
      </div>
    </Link>
  </motion.div>
);

type NavButtonProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const NavButton = ({ to, label, icon, delay }: NavButtonProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.4 }}
  >
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center p-4 bg-[#0C0C1D] border border-[#1A1A2F] rounded-lg
                hover:bg-[#14142A] hover:border-[#2A2A40] transition-all duration-200 h-28"
    >
      <div className="text-green-500 mb-2">
        {icon}
      </div>
      <span className="text-white text-lg">{label}</span>
    </Link>
  </motion.div>
);

export default HomePage;
