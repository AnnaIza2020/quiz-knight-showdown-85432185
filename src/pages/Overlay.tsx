
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/context/GameContext';
import PlayerCard from '@/components/PlayerCard';
import NeonLogo from '@/components/NeonLogo';
import CountdownTimer from '@/components/CountdownTimer';
import QuestionBoard from '@/components/QuestionBoard';
import FortuneWheel from '@/components/FortuneWheel';

const Overlay = () => {
  const { 
    round,
    players,
    hostCameraUrl,
    currentQuestion,
    activePlayerId,
    winnerIds,
    primaryColor,
    secondaryColor
  } = useGameContext();

  const [showConfetti, setShowConfetti] = useState(false);
  
  // Show confetti when winners are announced
  useEffect(() => {
    if (round === GameRound.FINISHED && winnerIds.length > 0) {
      setShowConfetti(true);
      
      // Play victory sound
      const victorySound = new Audio('/sounds/victory.mp3');
      victorySound.volume = 0.7;
      victorySound.play().catch(e => console.log('Error playing sound:', e));
    }
  }, [round, winnerIds]);
  
  // Filter players based on current round
  const activePlayers = players.filter(p => !p.isEliminated);
  
  // For round 1: display all 10 players
  // For round 2: display 6 players
  // For round 3: display 3 players
  const maxPlayers = 
    round === GameRound.ROUND_ONE ? 10 : 
    round === GameRound.ROUND_TWO ? 6 : 
    round === GameRound.ROUND_THREE ? 3 : 10;
  
  // Divide players into top and bottom rows
  const topPlayers = [...activePlayers].slice(0, Math.ceil(maxPlayers / 2));
  const bottomPlayers = [...activePlayers].slice(Math.ceil(maxPlayers / 2), maxPlayers);
  
  return (
    <div className="w-full h-screen bg-neon-background overflow-hidden relative">
      {/* Overlay grid layout */}
      <div className="w-full h-full grid grid-rows-[1fr_auto_1fr] p-4 gap-4">
        {/* Top row with first 5 players */}
        <div className="grid grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => {
            const player = topPlayers[i];
            return player ? (
              <PlayerCard key={player.id} player={player} />
            ) : (
              <div key={`empty-top-${i}`} className="player-card player-card-inactive bg-black/20">
                <div className="flex items-center justify-center h-full text-white/30">
                  Slot {i + 1}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Middle row with host camera and question board */}
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
        
        {/* Bottom row with remaining 5 players */}
        <div className="grid grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => {
            const player = bottomPlayers[i];
            return player ? (
              <PlayerCard key={player.id} player={player} />
            ) : (
              <div key={`empty-bottom-${i}`} className="player-card player-card-inactive bg-black/20">
                <div className="flex items-center justify-center h-full text-white/30">
                  Slot {i + 6}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Round indicator */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-b-lg"
        style={{
          backgroundColor: 'black',
          borderWidth: '0 2px 2px 2px',
          borderStyle: 'solid',
          borderColor: round === GameRound.ROUND_ONE ? primaryColor :
                       round === GameRound.ROUND_TWO ? secondaryColor :
                       round === GameRound.ROUND_THREE ? '#9b00ff' : 'white',
          boxShadow: `0 0 10px ${
            round === GameRound.ROUND_ONE ? primaryColor :
            round === GameRound.ROUND_TWO ? secondaryColor :
            round === GameRound.ROUND_THREE ? '#9b00ff' : 'white'
          }`
        }}
      >
        <div className="font-bold text-lg">
          {round === GameRound.SETUP && <span>Przygotowanie</span>}
          {round === GameRound.ROUND_ONE && <span className="text-neon-pink">Runda 1: Zróżnicowana wiedza z Internetu</span>}
          {round === GameRound.ROUND_TWO && <span className="text-neon-blue">Runda 2: 5 sekund</span>}
          {round === GameRound.ROUND_THREE && <span className="text-neon-purple">Runda 3: Koło Fortuny</span>}
          {round === GameRound.FINISHED && <span className="text-neon-yellow">Koniec gry!</span>}
        </div>
      </div>
      
      {/* Winner display */}
      {round === GameRound.FINISHED && winnerIds.length > 0 && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-8 neon-text">ZWYCIĘZCA</h1>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
            {winnerIds.map(id => {
              const winner = players.find(p => p.id === id);
              if (!winner) return null;
              
              return (
                <div key={winner.id} className="animate-bounce-in">
                  <PlayerCard 
                    player={winner} 
                    size="lg" 
                    className="border-neon-yellow shadow-[0_0_30px_rgba(255,255,0,0.7)]"
                  />
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-bold text-neon-yellow">{winner.name}</div>
                    <div className="text-xl text-white">{winner.points} punktów</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array(100).fill(0).map((_, i) => {
            const size = Math.random() * 12 + 5;
            const colors = [primaryColor, secondaryColor, '#9b00ff', '#ffff00', '#00ff66'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = `${Math.random() * 100}%`;
            const animationDuration = `${Math.random() * 3 + 2}s`;
            const animationDelay = `${Math.random() * 3}s`;
            
            return (
              <div 
                key={i}
                className="absolute top-0"
                style={{
                  left,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: '2px',
                  animation: 'confetti-drop',
                  animationDuration,
                  animationDelay,
                  animationFillMode: 'both'
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Overlay;
