
import React from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { GameRound, Player } from '@/context/GameContext';
import PlayerCard from '@/components/PlayerCard';
import QuestionBoard from '@/components/QuestionBoard';
import NeonLogo from '@/components/NeonLogo';
import CountdownTimer from '@/components/CountdownTimer';
import FortuneWheel from '@/components/FortuneWheel';

const Host = () => {
  const { 
    round, 
    players, 
    activePlayerId,
    setActivePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    startTimer,
    stopTimer,
    timerRunning,
    currentQuestion,
    resetGame
  } = useGameContext();
  
  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated);
  
  const handleSelectPlayer = (player: Player) => {
    if (player.isEliminated) return;
    
    // Toggle active player
    if (activePlayerId === player.id) {
      setActivePlayer(null);
    } else {
      setActivePlayer(player.id);
    }
  };
  
  const handleAwardPoints = () => {
    if (!activePlayerId || !currentQuestion) return;
    
    awardPoints(activePlayerId, currentQuestion.difficulty);
    
    // Play success sound
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.5;
    successSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleDeductHealth = () => {
    if (!activePlayerId) return;
    
    // In round 1, deduct 20 health points
    if (round === GameRound.ROUND_ONE) {
      deductHealth(activePlayerId, 20);
    }
    
    // In round 2, deduct 1 life
    if (round === GameRound.ROUND_TWO) {
      deductLife(activePlayerId);
      
      // Check if player has no lives left
      const player = players.find(p => p.id === activePlayerId);
      if (player && player.lives <= 1) {
        eliminatePlayer(activePlayerId);
      }
    }
    
    // Play fail sound
    const failSound = new Audio('/sounds/fail.mp3');
    failSound.volume = 0.5;
    failSound.play().catch(e => console.log('Error playing sound:', e));
  };
  
  // Calculate if we can advance to the next round
  const canAdvanceToRoundTwo = round === GameRound.ROUND_ONE && players.length >= 6;
  const canAdvanceToRoundThree = round === GameRound.ROUND_TWO && activePlayers.length >= 3;
  const canFinishGame = round === GameRound.ROUND_THREE && activePlayers.length > 0;
  
  return (
    <div className="min-h-screen bg-neon-background p-4">
      <div className="flex justify-between items-center mb-6">
        <NeonLogo />
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-neon-blue">
            Strona główna
          </Link>
          <Link to="/overlay" className="text-white hover:text-neon-blue">
            Nakładka OBS
          </Link>
          <Link to="/settings" className="text-white hover:text-neon-blue">
            Ustawienia
          </Link>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {round === GameRound.SETUP && <span className="text-white">Panel Hosta - Przygotowanie</span>}
            {round === GameRound.ROUND_ONE && <span className="text-neon-pink">Panel Hosta - Runda 1</span>}
            {round === GameRound.ROUND_TWO && <span className="text-neon-blue">Panel Hosta - Runda 2</span>}
            {round === GameRound.ROUND_THREE && <span className="text-neon-purple">Panel Hosta - Runda 3</span>}
            {round === GameRound.FINISHED && <span className="text-neon-yellow">Panel Hosta - Koniec gry</span>}
          </h1>
          
          <div className="flex gap-2">
            {canAdvanceToRoundTwo && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-pink to-neon-purple"
                onClick={advanceToRoundTwo}
              >
                Przejdź do Rundy 2
              </button>
            )}
            
            {canAdvanceToRoundThree && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-blue to-neon-purple"
                onClick={advanceToRoundThree}
              >
                Przejdź do Rundy 3
              </button>
            )}
            
            {canFinishGame && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-yellow to-neon-purple"
                onClick={() => {
                  // Sort players by points to determine the winner
                  const sortedPlayers = [...activePlayers].sort((a, b) => b.points - a.points);
                  if (sortedPlayers.length > 0) {
                    const winnerIds = [sortedPlayers[0].id];
                    finishGame(winnerIds);
                  }
                }}
              >
                Zakończ grę
              </button>
            )}
            
            {round === GameRound.FINISHED && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-green to-neon-blue"
                onClick={resetGame}
              >
                Nowa gra
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        {/* Left column - Players */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">
            Gracze {activePlayerId ? '- Wybrano gracza' : '- Wybierz gracza'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {activePlayers.map(player => (
              <div
                key={player.id} 
                onClick={() => handleSelectPlayer(player)}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  activePlayerId === player.id ? 'scale-105' : ''
                }`}
              >
                <PlayerCard 
                  player={{...player, isActive: activePlayerId === player.id}} 
                  size="sm"
                />
              </div>
            ))}
          </div>
          
          {eliminatedPlayers.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-2 text-neon-red">Wyeliminowani gracze</h3>
              <div className="grid grid-cols-2 gap-4 opacity-60">
                {eliminatedPlayers.map(player => (
                  <div key={player.id}>
                    <PlayerCard player={player} size="sm" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Right column - Game controls */}
        <div>
          {/* Timer controls */}
          <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
            <div className="neon-card">
              <h2 className="text-xl font-bold mb-4 text-white">Pytania i kategorie</h2>
              <QuestionBoard />
            </div>
            
            <div className="neon-card">
              <h2 className="text-xl font-bold mb-4 text-white">Narzędzia</h2>
              
              {/* Timer display */}
              <div className="mb-4 flex flex-col items-center">
                <CountdownTimer size="md" />
                
                <div className="flex gap-2 mt-2">
                  {[5, 10, 15, 30].map(seconds => (
                    <button
                      key={seconds}
                      className="py-1 px-2 bg-black border border-neon-green text-neon-green rounded hover:bg-neon-green/20"
                      onClick={() => startTimer(seconds)}
                      disabled={timerRunning}
                    >
                      {seconds}s
                    </button>
                  ))}
                  
                  {timerRunning && (
                    <button
                      className="py-1 px-2 bg-black border border-neon-red text-neon-red rounded hover:bg-neon-red/20"
                      onClick={stopTimer}
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
              
              {/* Round specific tools */}
              {round === GameRound.ROUND_THREE && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2 text-neon-purple">Koło Fortuny</h3>
                  <FortuneWheel className="w-full max-w-xs mx-auto" />
                </div>
              )}
            </div>
          </div>
          
          {/* Player actions */}
          <div className="neon-card">
            <h2 className="text-xl font-bold mb-4 text-white">Akcje dla gracza</h2>
            
            {activePlayerId ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="py-2 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold
                            hover:bg-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAwardPoints}
                  disabled={!currentQuestion}
                >
                  {currentQuestion ? (
                    <>Przyznaj {currentQuestion.difficulty} punktów</>
                  ) : (
                    <>Wybierz pytanie, aby przyznać punkty</>
                  )}
                </button>
                
                <button
                  className="py-2 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md font-bold
                            hover:bg-neon-red/20"
                  onClick={handleDeductHealth}
                >
                  {round === GameRound.ROUND_ONE ? (
                    <>Odejmij 20 HP</>
                  ) : round === GameRound.ROUND_TWO ? (
                    <>Odejmij życie</>
                  ) : (
                    <>Błędna odpowiedź</>
                  )}
                </button>
                
                <button
                  className="py-2 px-4 bg-black border-2 border-neon-yellow text-neon-yellow rounded-md font-bold
                            hover:bg-neon-yellow/20"
                  onClick={() => {
                    if (!activePlayerId) return;
                    
                    // Add 5 bonus points
                    awardPoints(activePlayerId, 5);
                    
                    // Play sound
                    const bonusSound = new Audio('/sounds/bonus.mp3');
                    bonusSound.volume = 0.5;
                    bonusSound.play().catch(e => console.log('Error playing sound:', e));
                  }}
                >
                  Dodaj 5 punktów bonusowych
                </button>
                
                <button
                  className="py-2 px-4 bg-black border-2 border-red-800 text-red-500 rounded-md font-bold
                            hover:bg-red-900/30"
                  onClick={() => {
                    if (activePlayerId) {
                      eliminatePlayer(activePlayerId);
                      
                      // Play sound
                      const eliminateSound = new Audio('/sounds/eliminate.mp3');
                      eliminateSound.volume = 0.7;
                      eliminateSound.play().catch(e => console.log('Error playing sound:', e));
                    }
                  }}
                >
                  Wyeliminuj gracza
                </button>
              </div>
            ) : (
              <div className="text-center text-white/60">
                Wybierz gracza, aby wykonać akcje
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Host;
