
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Play, Square, RotateCcw, ChevronDown, SkipForward, Pause, X } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { GameRound, Player } from '@/types/game-types';
import PlayerCard from '@/components/PlayerCard';
import { cn } from '@/lib/utils';

const HostPanel = () => {
  const navigate = useNavigate();
  const {
    round,
    players,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    timerRunning,
    startTimer,
    stopTimer,
    playSound,
    resetGame,
  } = useGameContext();
  
  const [showRoundMenu, setShowRoundMenu] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Gra została uruchomiona",
    "Przygotowanie do rundy 1"
  ]);

  // Helper function to add an event to the notifications
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 4)]);
  };

  // Round management
  const handleAdvanceToRound = (targetRound: GameRound) => {
    if (targetRound === GameRound.ROUND_TWO) {
      advanceToRoundTwo();
      addEvent("Rozpoczęto rundę 2: 5 sekund");
      playSound('round-start');
    } else if (targetRound === GameRound.ROUND_THREE) {
      advanceToRoundThree();
      addEvent("Rozpoczęto rundę 3: Koło Fortuny");
      playSound('round-start');
    }
    setShowRoundMenu(false);
  };

  // Timer management
  const handleStartTimer = (seconds: number) => {
    startTimer(seconds);
    addEvent(`Timer ${seconds}s uruchomiony`);
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      addEvent("Gra wznowiona");
    } else {
      setIsPaused(true);
      addEvent("Gra wstrzymana");
    }
  };

  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
    // Logic for skipping question would go here
  };

  const handleFinishGame = () => {
    // For demonstration, just select the player with highest points as winner
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    if (sortedPlayers.length > 0) {
      finishGame([sortedPlayers[0].id]);
      addEvent(`Gra zakończona! Zwycięzca: ${sortedPlayers[0].name}`);
      playSound('victory');
    }
  };

  // Get active players that aren't eliminated
  const activePlayers = players.filter(player => !player.isEliminated);

  // Split players into two rows
  const topRowPlayers = activePlayers.slice(0, 5);
  const bottomRowPlayers = activePlayers.slice(5, 10);

  const getRoundName = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return "RUNDA 1: WIEDZA Z POLSKIEGO INTERNETU";
      case GameRound.ROUND_TWO:
        return "RUNDA 2: 5 SEKUND";
      case GameRound.ROUND_THREE:
        return "RUNDA 3: KOŁO FORTUNY";
      case GameRound.FINISHED:
        return "GRA ZAKOŃCZONA";
      default:
        return "PRZYGOTOWANIE GRY";
    }
  };

  // Render round-specific controls
  const renderRoundControls = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return (
          <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
            <h3 className="text-neon-blue text-xl mb-3">Wybór kategorii i trudności</h3>
            <div className="grid grid-cols-4 gap-3">
              {['Sport', 'Historia', 'Geografia', 'Kultura'].map(category => (
                <div key={category} className="flex flex-col gap-2">
                  <div className="text-center text-neon-pink font-bold mb-1">{category}</div>
                  {[5, 10, 15, 20].map(points => (
                    <button
                      key={`${category}-${points}`}
                      className="py-2 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20"
                    >
                      {points}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
        
      case GameRound.ROUND_TWO:
        return (
          <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
            <h3 className="text-neon-blue text-xl mb-3">Runda 5 Sekund</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="py-3 px-6 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold hover:bg-neon-green/20"
                onClick={() => handleStartTimer(5)}
              >
                Rozpocznij 5s
              </button>
              <button
                className="py-3 px-6 bg-black border-2 border-neon-red text-neon-red rounded-md font-bold hover:bg-neon-red/20"
              >
                Niepoprawna odpowiedź
              </button>
            </div>
          </div>
        );
        
      case GameRound.ROUND_THREE:
        return (
          <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
            <h3 className="text-neon-purple text-xl mb-3">Koło Fortuny</h3>
            <div className="flex justify-center">
              <button
                className="py-3 px-8 bg-black border-2 border-neon-purple text-neon-purple rounded-md font-bold hover:bg-neon-purple/20 text-xl"
              >
                Kręć kołem
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg">
            <h3 className="text-white text-xl">Przygotowanie do gry</h3>
            <p className="text-white/70">Wybierz graczy i rozpocznij rundę 1</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      {/* Upper Bar */}
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10 mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-3 md:mb-0">
            <h1 className="text-3xl font-bold text-center md:text-left">
              <span className={cn(
                'neon-text',
                round === GameRound.ROUND_ONE ? 'text-neon-pink' :
                round === GameRound.ROUND_TWO ? 'text-neon-blue' :
                round === GameRound.ROUND_THREE ? 'text-neon-purple' : 'text-white'
              )}>
                {getRoundName()}
              </span>
            </h1>
          </div>
          
          <div className="grid grid-cols-3 md:flex md:items-center gap-3">
            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-2 bg-black/50 p-2 rounded-md border border-neon-green/30">
              <Timer className="text-neon-green" />
              <span className="text-neon-green font-mono text-xl">30s</span>
            </div>
            
            <button
              className="flex items-center justify-center p-2 bg-black border border-neon-green text-neon-green rounded-md hover:bg-neon-green/20"
              onClick={() => handleStartTimer(30)}
            >
              <Play size={18} className="mr-1" /> Start
            </button>
            
            <button
              className="flex items-center justify-center p-2 bg-black border border-neon-red text-neon-red rounded-md hover:bg-neon-red/20"
              onClick={() => stopTimer()}
            >
              <Square size={18} className="mr-1" /> Stop
            </button>
            
            <button
              className="flex items-center justify-center p-2 bg-black border border-white/30 text-white/70 rounded-md hover:bg-white/10"
              onClick={() => startTimer(30)} // Restart timer
            >
              <RotateCcw size={18} className="mr-1" /> Reset
            </button>
            
            {/* Round Change Button */}
            <div className="relative col-span-3 md:col-span-1">
              <button 
                className="w-full flex items-center justify-center p-2 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20"
                onClick={() => setShowRoundMenu(!showRoundMenu)}
              >
                Zmień rundę <ChevronDown size={18} className="ml-1" />
              </button>
              
              {showRoundMenu && (
                <div className="absolute w-full mt-1 bg-black border border-neon-blue/30 rounded-md shadow-lg z-10">
                  <button 
                    className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-pink"
                    onClick={() => handleAdvanceToRound(GameRound.ROUND_ONE)}
                  >
                    Runda 1: Wiedza z Internetu
                  </button>
                  <button 
                    className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-blue"
                    onClick={() => handleAdvanceToRound(GameRound.ROUND_TWO)}
                  >
                    Runda 2: 5 Sekund
                  </button>
                  <button 
                    className="w-full p-2 text-left hover:bg-neon-blue/20 text-neon-purple"
                    onClick={() => handleAdvanceToRound(GameRound.ROUND_THREE)}
                  >
                    Runda 3: Koło Fortuny
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Layout with Players Grid and Right Column */}
      <div className="flex flex-grow gap-4">
        {/* Players Grid */}
        <div className="flex-grow bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-white">Siatka Graczy</h2>
          
          {/* Top row of players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            {topRowPlayers.map(player => (
              <PlayerCardWithControls key={player.id} player={player} />
            ))}
            
            {/* Fill with empty slots if less than 5 players */}
            {Array.from({ length: Math.max(0, 5 - topRowPlayers.length) }).map((_, i) => (
              <div key={`empty-top-${i}`} className="h-36 rounded-lg border border-white/10 bg-black/30 flex items-center justify-center text-white/30">
                Slot {topRowPlayers.length + i + 1}
              </div>
            ))}
          </div>
          
          {/* Bottom row of players */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {bottomRowPlayers.map(player => (
              <PlayerCardWithControls key={player.id} player={player} />
            ))}
            
            {/* Fill with empty slots if less than 5 players */}
            {Array.from({ length: Math.max(0, 5 - bottomRowPlayers.length) }).map((_, i) => (
              <div key={`empty-bottom-${i}`} className="h-36 rounded-lg border border-white/10 bg-black/30 flex items-center justify-center text-white/30">
                Slot {5 + bottomRowPlayers.length + i + 1}
              </div>
            ))}
          </div>
          
          {/* Round-specific controls */}
          {renderRoundControls()}
        </div>
        
        {/* Right Control Column */}
        <div className="hidden lg:block w-64 space-y-4">
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">Akcje</h3>
            
            <div className="space-y-3">
              <button 
                className="w-full py-3 px-4 bg-black border border-neon-purple text-neon-purple rounded-md hover:bg-neon-purple/20 flex items-center justify-center"
                onClick={resetGame}
              >
                <RotateCcw size={18} className="mr-2" /> Reset Rundy
              </button>
              
              <button 
                className="w-full py-3 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20 flex items-center justify-center"
                onClick={handleTogglePause}
              >
                {isPaused ? (
                  <><Play size={18} className="mr-2" /> Wznów Grę</>
                ) : (
                  <><Pause size={18} className="mr-2" /> Przerwa</>
                )}
              </button>
              
              <button 
                className="w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center"
                onClick={handleSkipQuestion}
              >
                <SkipForward size={18} className="mr-2" /> Pomiń Pytanie
              </button>
              
              <button 
                className="w-full py-4 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md hover:bg-neon-red/20 flex items-center justify-center font-bold mt-6"
                onClick={handleFinishGame}
              >
                <X size={18} className="mr-2" /> Zakończ Grę
              </button>
            </div>
          </div>
          
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold mb-2 text-white">Nawigacja</h3>
            <div className="space-y-2">
              <button 
                className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
                onClick={() => navigate('/')}
              >
                Strona Główna
              </button>
              <button 
                className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
                onClick={() => navigate('/overlay')}
              >
                Przejdź do Overlay
              </button>
              <button 
                className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
                onClick={() => navigate('/settings')}
              >
                Ustawienia
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Events Bar */}
      <div className="mt-4 bg-black/70 backdrop-blur-md p-2 rounded-lg border border-white/10 overflow-hidden">
        <div className="flex items-center">
          <span className="text-neon-green font-bold mr-2">Ostatnie wydarzenia:</span>
          <div className="overflow-x-auto whitespace-nowrap">
            {lastEvents.map((event, index) => (
              <span 
                key={index} 
                className={cn(
                  "inline-block mx-2 px-3 py-1 rounded-full text-sm",
                  index === 0 ? "bg-neon-blue/30 text-white" : "bg-black/50 text-white/70"
                )}
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for player cards with controls
const PlayerCardWithControls = ({ player }: { player: Player }) => {
  return (
    <div className="relative">
      <PlayerCard player={player} />
      <div className="absolute bottom-0 right-0 left-0 flex justify-center gap-1 p-1 bg-black/70">
        <button className="px-2 py-1 text-xs bg-neon-yellow/20 text-neon-yellow rounded">
          Karta
        </button>
        <button className="px-2 py-1 text-xs bg-neon-red/20 text-neon-red rounded">
          -HP
        </button>
      </div>
    </div>
  );
};

export default HostPanel;
