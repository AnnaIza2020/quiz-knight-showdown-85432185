
import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/context/GameStateContext';

const GameOverlay: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full flex flex-col">
        {/* Top player area */}
        <div className="h-[360px] bg-black/30 border-b border-white/20">
          <div className="text-white text-center p-4">
            Górny obszar graczy
          </div>
        </div>

        {/* Middle area with host and question */}
        <div className="h-[360px] bg-black/40 border-b border-white/20 flex">
          <div className="w-[384px] bg-black/50 border-r border-white/20">
            <div className="text-white text-center p-4">
              Kamera hosta
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-white text-center">
              {gameState.currentQuestion ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{gameState.currentQuestion.text}</h2>
                  {gameState.currentQuestion.options && gameState.currentQuestion.options.length > 0 && (
                    <div className="space-y-2">
                      {gameState.currentQuestion.options.map((option, index) => (
                        <div key={index} className="p-2 bg-white/10 rounded">
                          {String.fromCharCode(65 + index)}: {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>Oczekiwanie na pytanie...</div>
              )}
            </div>
          </div>
          <div className="w-[300px] bg-black/50 border-l border-white/20">
            <div className="text-white text-center p-4">
              Kategorie pytań
            </div>
          </div>
        </div>

        {/* Bottom player area */}
        <div className="h-[360px] bg-black/30">
          <div className="text-white text-center p-4">
            Dolny obszar graczy
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameOverlay;
