
import React, { useState, useEffect } from 'react';
import { GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';
import NeonLogo from '@/components/NeonLogo';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect';

interface MiddleSectionProps {
  round: GameRound;
  hostCameraUrl: string;
}

const MiddleSection: React.FC<MiddleSectionProps> = ({ round, hostCameraUrl }) => {
  const { timerRunning, currentQuestion, primaryColor, secondaryColor } = useGameContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [currentRoundDisplay, setCurrentRoundDisplay] = useState(round);
  
  // Show round transition animation when round changes
  useEffect(() => {
    if (round !== GameRound.SETUP) {
      setShowRoundTransition(true);
      setCurrentRoundDisplay(round);
      
      // Hide transition after animation
      const timeout = setTimeout(() => {
        setShowRoundTransition(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [round]);
  
  // Show confetti on game start
  useEffect(() => {
    if (round === GameRound.ROUND_ONE) {
      setShowIntro(true);
      
      // Hide intro after animation
      const timeout = setTimeout(() => {
        setShowIntro(false);
        setShowConfetti(true);
      }, 3000);
      
      // Hide confetti after some time
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(confettiTimeout);
      };
    }
  }, [round]);
  
  // Generate round name for transitions
  const getRoundName = () => {
    switch (currentRoundDisplay) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Finał Gry";
    }
  };
  
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 min-h-[300px]">
      {/* Round transition overlay */}
      <AnimatePresence>
        {showRoundTransition && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-4" style={{ color: primaryColor || '#ff00ff' }}>
                {getRoundName()}
              </h1>
              <p className="text-white text-xl">Rozpoczynamy!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Intro animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold mb-4" style={{ color: primaryColor || '#ff00ff' }}>
                Quiz Knight Showdown
              </h1>
              <p className="text-white text-2xl">Rozpoczynamy grę!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confetti effect */}
      <ConfettiEffect 
        show={showConfetti} 
        primaryColor={primaryColor || '#ff00ff'} 
        secondaryColor={secondaryColor || '#00ffff'} 
      />
      
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
          
          {/* Current active question */}
          <AnimatePresence mode="wait">
            {currentQuestion ? (
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
            ) : round === GameRound.ROUND_THREE && !currentQuestion ? (
              // Show wheel in round 3 when no question is selected
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
            ) : (
              // Default content when no question is shown
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MiddleSection;
