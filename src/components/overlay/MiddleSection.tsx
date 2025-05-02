
import React from 'react';
import { GameRound } from '@/types/game-types';
import NeonLogo from '@/components/NeonLogo';
import QuestionBoard from '@/components/QuestionBoard';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';

interface MiddleSectionProps {
  round: GameRound;
  hostCameraUrl: string;
}

const MiddleSection = ({ round, hostCameraUrl }: MiddleSectionProps) => {
  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 h-64">
      {/* Host camera */}
      <div className="relative overflow-hidden rounded-lg border-2 border-neon-purple/50 
                      shadow-[0_0_15px_rgba(155,0,255,0.5)]">
        {hostCameraUrl ? (
          <iframe 
            src={hostCameraUrl}
            title="Host"
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neon-background">
            <NeonLogo size="sm" />
            <span className="text-white/50 mt-2">Kamera Hosta</span>
          </div>
        )}
      </div>
      
      {/* Question board or round display */}
      <div className="relative">
        <QuestionBoard />
      </div>
      
      {/* Timer or Fortune Wheel based on round */}
      <div className="relative overflow-hidden rounded-lg border-2 border-neon-blue/50 
                      shadow-[0_0_15px_rgba(0,255,255,0.5)] bg-black/40 backdrop-blur-sm
                      flex items-center justify-center">
        {round === GameRound.ROUND_THREE ? (
          <FortuneWheel />
        ) : (
          <CountdownTimer size="lg" />
        )}
      </div>
    </div>
  );
};

export default MiddleSection;
