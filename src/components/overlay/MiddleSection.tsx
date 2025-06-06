
import React from 'react';
import { motion } from 'framer-motion';
import { GameRound } from '@/types/game-types';
import { Question } from '@/types/interfaces';
import { Card, CardContent } from '@/components/ui/card';
import FortuneWheel from '@/components/FortuneWheel';

interface MiddleSectionProps {
  round: GameRound;
  hostCameraUrl?: string;
  currentQuestion: Question | null;
  timerRunning: boolean;
  timerSeconds: number;
  categories: string[];
  onCategorySelected: (category: string) => void;
}

const MiddleSection: React.FC<MiddleSectionProps> = ({
  round,
  hostCameraUrl,
  currentQuestion,
  timerRunning,
  timerSeconds,
  categories,
  onCategorySelected
}) => {
  return (
    <div className="h-full flex space-x-4">
      {/* Host Camera */}
      <div className="w-1/3">
        <Card className="h-full bg-black/60 border border-neon-blue/50">
          <CardContent className="p-4 h-full flex flex-col items-center justify-center">
            {hostCameraUrl ? (
              <img 
                src={hostCameraUrl} 
                alt="Host" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎤</div>
                  <div className="text-white font-bold text-xl">PROWADZĄCY</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Middle Content Area */}
      <div className="w-2/3 flex flex-col space-y-4">
        {/* Question or Wheel */}
        {round === GameRound.ROUND_THREE && !currentQuestion ? (
          <Card className="flex-grow bg-black/60 border border-neon-purple/50">
            <CardContent className="p-6 h-full flex items-center justify-center">
              <FortuneWheel
                categories={categories}
                onResult={onCategorySelected}
                isSpinning={false}
              />
            </CardContent>
          </Card>
        ) : currentQuestion ? (
          <Card className="flex-grow bg-black/60 border border-neon-green/50">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-white text-2xl font-bold mb-4">
                  {currentQuestion.text}
                </div>
                {currentQuestion.options && (
                  <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="bg-neon-blue/20 border border-neon-blue/50 rounded-lg p-4"
                      >
                        <span className="text-neon-blue font-bold mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-white">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-grow bg-black/60 border border-white/20">
            <CardContent className="p-6 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-4">🎮</div>
                <div className="text-xl">Oczekiwanie na pytanie...</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timer */}
        {timerRunning && (
          <Card className="bg-black/60 border border-neon-gold/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-neon-gold text-3xl font-bold mb-2">
                  {timerSeconds}s
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-neon-gold to-neon-orange h-3 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timerSeconds / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MiddleSection;
