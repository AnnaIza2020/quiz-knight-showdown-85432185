
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { Heart } from 'lucide-react';

const PlayerView = () => {
  // Get playerId from URL parameters
  const { playerId } = useParams<{ playerId: string }>();
  
  const { 
    players, 
    round,
    primaryColor,
    secondaryColor
  } = useGameContext();

  // Get player information if playerId is provided
  const player = playerId 
    ? players.find(p => p.id === playerId) 
    : players.length > 0 ? players[0] : null;

  if (!player) {
    return (
      <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white mb-6">Nieprawidłowy identyfikator gracza</h1>
        <p className="text-gray-300">Skontaktuj się z hostem gry, aby uzyskać prawidłowy link.</p>
      </div>
    );
  }

  // Calculate player color based on id or use primary color as default
  const playerColor = `#${player.id.slice(0, 6)}` || primaryColor;
  
  // Round name based on current round
  const roundName = 
    round === 'round_one' ? 'Runda 1: Zróżnicowana wiedza z polskiego internetu' :
    round === 'round_two' ? 'Runda 2: Wyzwania i wiedza' :
    round === 'round_three' ? 'Runda 3: Koło Chaosu' :
    round === 'finished' ? 'Gra zakończona' : 'Przygotowanie do gry';

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Top info bar - 200px height */}
      <div className="h-[200px] w-full bg-black/70 backdrop-blur-md border-b border-white/10 p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          {/* Player name with assigned color */}
          <div className="flex items-center">
            <div 
              className="px-5 py-3 rounded-lg text-2xl font-bold"
              style={{ backgroundColor: playerColor }}
            >
              Nick: {player.name}
            </div>
          </div>
          
          {/* Round information */}
          <div className="text-white text-xl">
            {roundName}
          </div>
          
          {/* Points */}
          <div className="text-white text-xl">
            Punkty: {player.points}
          </div>
          
          {/* Lives */}
          <div className="flex items-center gap-1 text-white text-xl">
            Życia: 
            {player.lives > 0 ? (
              <div className="flex">
                {Array(player.lives).fill(0).map((_, i) => (
                  <Heart key={i} className="h-6 w-6 text-neon-red fill-neon-red" />
                ))}
              </div>
            ) : (
              <span className="text-neon-red">0</span>
            )}
          </div>
          
          {/* Special cards - placeholder for now */}
          <div className="text-white text-xl">
            Karty: <span className="text-neon-blue">Druga szansa</span>
          </div>
        </div>
      </div>
      
      {/* Main content area - 880px height */}
      <div className="flex-grow h-[880px] bg-neon-background overflow-hidden relative">
        {/* Content depends on current game state */}
        {round === 'setup' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold text-white mb-8">
              Witaj, <span style={{ color: playerColor }}>{player.name}</span>!
            </h2>
            <p className="text-2xl text-white/80">
              Oczekiwanie na rozpoczęcie gry przez hosta...
            </p>
          </div>
        )}
        
        {round === 'finished' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-5xl font-bold text-white mb-8">
              Gra zakończona
            </h2>
            <p className="text-2xl text-white/80 mb-6">
              Twój końcowy wynik: <span className="text-neon-yellow font-bold">{player.points} punktów</span>
            </p>
            <p className="text-xl text-white/60">
              Dziękujemy za udział w grze!
            </p>
          </div>
        )}
        
        {round !== 'setup' && round !== 'finished' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Player camera or avatar if available */}
            {player.cameraUrl && (
              <div className="absolute bottom-8 right-8 w-[240px] h-[180px] border-2 border-white/20 rounded-xl overflow-hidden">
                <iframe 
                  src={player.cameraUrl}
                  title={`Kamera ${player.name}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {/* Round content placeholder */}
            <div className="text-4xl font-bold text-white">
              {roundName}
            </div>
            <div className="mt-8 text-2xl text-white/70">
              Oczekiwanie na pytanie...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerView;
