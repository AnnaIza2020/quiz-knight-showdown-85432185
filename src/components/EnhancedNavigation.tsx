
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Layout, Users, Shield, Home } from 'lucide-react';

const EnhancedNavigation = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <NavigationButton 
        to="/unified-host" 
        icon={<Home />}
        label="Panel Hosta"
        delay={0.1}
        primaryClass="bg-gradient-to-r from-green-500 to-blue-500"
      />
      
      <NavigationButton 
        to="/overlay" 
        icon={<Layout />}
        label="Nakładka OBS"
        delay={0.2}
        primaryClass="bg-gradient-to-r from-blue-500 to-indigo-500"
      />
      
      <NavigationButton 
        to="/settings" 
        icon={<Settings />}
        label="Ustawienia"
        delay={0.3}
        primaryClass="bg-gradient-to-r from-indigo-500 to-purple-500"
      />
      
      <NavigationButton 
        to="/player/1" 
        icon={<Users />}
        label="Widok Gracza"
        delay={0.4}
        primaryClass="bg-gradient-to-r from-purple-500 to-pink-500"
      />
    </div>
  );
};

const NavigationButton = ({ to, icon, label, delay, primaryClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      to={to} 
      className={`flex flex-col items-center p-4 rounded-lg ${primaryClass} text-white transition-all`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-lg font-medium">{label}</span>
    </Link>
  </motion.div>
);

export default EnhancedNavigation;
