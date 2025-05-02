
import React from 'react';
import { GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';
import NeonLogo from '@/components/NeonLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface MiddleSectionProps {
  round: GameRound;
  hostCameraUrl: string;
}

const MiddleSection: React.FC<MiddleSectionProps> = ({ round, hostCameraUrl }) => {
  const { timerRunning, currentQuestion, primaryColor } = useGameContext();
  
  // Render the appropriate content based on the current game state
  const renderContent = () => {
    if (currentQuestion) {
      return (
        <motion.div 
          key="question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex flex-col items-center justify-center p-4"
        >
          <div className="text-neon-blue text-center mb-2">
            {currentQuestion.category} - {currentQuestion.difficulty} pkt
          </div>
          
          {currentQuestion.imageUrl && (
            <div className="mb-4 max-w-xs mx-auto">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question" 
                className="max-h-48 object-contain" 
              />
            </div>
          )}
          
          <div className="text-white text-xl md:text-2xl text-center font-bold">
            {currentQuestion.question}
          </div>
          
          {/* Only show options in round 1 */}
          {round === GameRound.ROUND_ONE && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-2 w-full mt-4 max-w-lg mx-auto">
              {currentQuestion.options.map((option, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-black/50 border border-white/20 rounded-md p-2 text-center text-white"
                >
                  {option}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    } else if (round === GameRound.ROUND_THREE) {
      return (
        <motion.div 
          key="wheel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex flex-col items-center justify-center"
        >
          <FortuneWheel className="max-w-xs" disabled />
        </motion.div>
      );
    }
    
    // Default content
    return (
      <motion.div 
        key="default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-grow flex flex-col items-center justify-center"
      >
        <NeonLogo size="lg" />
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 min-h-[300px]">
      {/* Host Camera */}
      <div className="relative">
        <div className="absolute inset-0 rounded-lg border-2 border-white/20 bg-black/60 overflow-hidden">
          {hostCameraUrl ? (
            <iframe 
              src={hostCameraUrl}
              title="Host Camera"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <NeonLogo />
              <div className="text-white/50 mt-4">Host Camera</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Middle Content - Questions or Wheel */}
      <div className="relative">
        <div className="absolute inset-0 rounded-lg border-2 border-white/20 bg-black/60 backdrop-blur-sm p-4 overflow-hidden flex flex-col">
          {/* Timer (shown on all rounds when active) */}
          {timerRunning && (
            <div className="absolute top-4 right-4 z-10">
              <CountdownTimer size="md" />
            </div>
          )}
          
          {/* Dynamic content based on game state */}
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MiddleSection;
