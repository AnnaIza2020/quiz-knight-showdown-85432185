
import React from 'react';
import { GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';
import NeonLogo from '@/components/NeonLogo';

interface MiddleSectionProps {
  round: GameRound;
  hostCameraUrl: string;
}

const MiddleSection: React.FC<MiddleSectionProps> = ({ round, hostCameraUrl }) => {
  const { timerRunning, currentQuestion } = useGameContext();
  
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
          
          {/* Current active question */}
          {currentQuestion ? (
            <div className="flex-grow flex flex-col items-center justify-center p-4">
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
                    <div 
                      key={index}
                      className="bg-black/50 border border-white/20 rounded-md p-2 text-center text-white"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : round === GameRound.ROUND_THREE && !currentQuestion ? (
            // Show wheel in round 3 when no question is selected
            <div className="flex-grow flex flex-col items-center justify-center">
              <FortuneWheel className="max-w-xs" disabled />
            </div>
          ) : (
            // Default content when no question is shown
            <div className="flex-grow flex flex-col items-center justify-center">
              <NeonLogo size="lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiddleSection;
