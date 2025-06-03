
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/context/GameStateContext';

const PlayersView: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-white/20 p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Panel Gracza
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Status */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Status Gracza</h2>
              <div className="space-y-2 text-white">
                <p>Punkty: <span className="text-green-400">0</span></p>
                <p>Życie: <span className="text-red-400">100%</span></p>
                <p>Karty: <span className="text-blue-400">0</span></p>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Aktualne Pytanie</h2>
              {gameState.currentQuestion ? (
                <div className="text-white">
                  <p className="mb-2">{gameState.currentQuestion.text}</p>
                  <div className="text-sm text-gray-300">
                    Kategoria: {gameState.currentQuestion.category}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Oczekiwanie na pytanie...</p>
              )}
            </div>

            {/* Game Status */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/10 md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Status Gry</h2>
              <div className="text-white space-y-2">
                <p>Runda: <span className="capitalize">{gameState.currentRound}</span></p>
                <p>Faza: <span className="capitalize">{gameState.currentPhase}</span></p>
                {gameState.timerRunning && (
                  <p>Czas: <span className="text-yellow-400">{gameState.timerSeconds}s</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayersView;
