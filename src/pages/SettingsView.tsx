
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/context/GameStateContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettings from '@/components/settings/ThemeSettings';
import Round1Questions from '@/components/settings/questions/Round1Questions';
import Round2Questions from '@/components/settings/questions/Round2Questions';
import Round3Questions from '@/components/settings/questions/Round3Questions';

const SettingsView: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Panel Ustawień
          </h1>
          
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="theme">Wygląd</TabsTrigger>
              <TabsTrigger value="round1">Runda 1</TabsTrigger>
              <TabsTrigger value="round2">Runda 2</TabsTrigger>
              <TabsTrigger value="round3">Runda 3</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme">
              <ThemeSettings />
            </TabsContent>
            
            <TabsContent value="round1">
              <Round1Questions />
            </TabsContent>
            
            <TabsContent value="round2">
              <Round2Questions />
            </TabsContent>
            
            <TabsContent value="round3">
              <Round3Questions />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsView;
