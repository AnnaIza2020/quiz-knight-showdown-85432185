
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { Heart, Shield, Sparkles, Zap } from 'lucide-react';

const PlayerView = () => {
  // Get playerId from URL parameters
  const { playerId } = useParams<{ playerId: string }>();
  
  const { 
    players, 
    round,
    primaryColor,
    secondaryColor,
    saveGameData,
    loadGameData
  } = useGameContext();

  useEffect(() => {
    // Load game data when component mounts to ensure we have the latest player info
    loadGameData();
  }, [loadGameData]);

  // Get player information if playerId is provided
  const player = playerId 
    ? players.find(p => p.id === playerId) 
    : players.length > 0 ? players[0] : null;

  if (!player) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white mb-6">Nieprawidłowy identyfikator gracza</h1>
        <p className="text-gray-300">Skontaktuj się z hostem gry, aby uzyskać prawidłowy link.</p>
      </div>
    );
  }

  // Calculate player color based on id or use primary color as default
  const playerColor = player.avatar || primaryColor;
  
  // Round name based on current round
  const roundName = 
    round === 'round_one' ? 'Runda 1: Zróżnicowana wiedza z polskiego internetu' :
    round === 'round_two' ? 'Runda 2: Wyzwania i wiedza' :
    round === 'round_three' ? 'Runda 3: Koło Chaosu' :
    round === 'finished' ? 'Gra zakończona' : 'Przygotowanie do gry';

  // Placeholder for special cards that would come from player data
  const specialCards = [
    { id: 'second_chance', name: 'Druga szansa', icon: <Shield className="h-5 w-5" /> },
    { id: 'power_up', name: 'Wzmocnienie', icon: <Zap className="h-5 w-5" /> }
  ];

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Top info bar - 200px height */}
      <div className="h-[200px] w-full bg-black/70 backdrop-blur-md border-b border-white/10 p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between flex-wrap gap-y-4">
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
          <div className="text-white text-xl flex items-center gap-2">
            <span>Punkty:</span>
            <span className="bg-neon-yellow/20 text-neon-yellow px-3 py-1 rounded-md">
              {player.points}
            </span>
          </div>
          
          {/* Lives */}
          <div className="flex items-center gap-2 text-white text-xl">
            <span>Życia:</span>
            {player.lives > 0 ? (
              <div className="flex">
                {Array(player.lives).fill(0).map((_, i) => (
                  <Heart key={i} className="h-6 w-6 text-neon-red fill-neon-red" />
                ))}
                {Array(3 - player.lives).fill(0).map((_, i) => (
                  <Heart key={`empty-${i}`} className="h-6 w-6 text-gray-600" />
                ))}
              </div>
            ) : (
              <span className="text-neon-red font-bold">0</span>
            )}
          </div>
          
          {/* Special cards */}
          <div className="flex items-center gap-2 text-white text-xl">
            <span>Karty:</span>
            <div className="flex gap-2">
              {specialCards.map(card => (
                <div 
                  key={card.id}
                  className="flex items-center gap-1 bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-md"
                  title={card.name}
                >
                  {card.icon}
                  <span className="text-sm hidden sm:inline">{card.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area - 880px height */}
      <div className="flex-grow h-[880px] bg-neon-background overflow-hidden relative">
        {/* Content depends on current game state */}
        {round === 'setup' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="h-12 w-12 text-neon-yellow animate-pulse mr-4" />
              <h2 className="text-5xl font-bold text-white">
                Witaj, <span style={{ color: playerColor }}>{player.name}</span>!
              </h2>
            </div>
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
        
        {round === 'round_one' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Runda 1: Zróżnicowana wiedza z polskiego internetu
            </h3>
            
            {player.isActive ? (
              <div className="animate-pulse text-neon-green text-2xl font-bold mb-4">
                Twoja kolej!
              </div>
            ) : (
              <div className="text-white/70 text-xl mb-4">
                Oczekiwanie na swoją kolej...
              </div>
            )}
            
            {/* Player camera if available */}
            {player.cameraUrl && (
              <div className="absolute bottom-8 right-8 w-[320px] h-[240px] border-4" style={{ borderColor: playerColor }}>
                <iframe 
                  src={player.cameraUrl}
                  title={`Kamera ${player.name}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
        
        {round === 'round_two' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Runda 2: Wyzwania i wiedza
            </h3>
            
            {player.isActive ? (
              <div className="flex flex-col items-center">
                <div className="animate-pulse text-neon-yellow text-4xl font-bold mb-6">
                  Przygotuj się!
                </div>
                <div className="text-2xl text-white">
                  Za chwilę dostaniesz pytanie
                </div>
              </div>
            ) : (
              <div className="text-white/70 text-xl">
                Oczekiwanie na swoją kolej...
              </div>
            )}
            
            {/* Player camera if available */}
            {player.cameraUrl && (
              <div className="absolute bottom-8 right-8 w-[320px] h-[240px] border-4" style={{ borderColor: playerColor }}>
                <iframe 
                  src={player.cameraUrl}
                  title={`Kamera ${player.name}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
        
        {round === 'round_three' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Runda 3: Koło Chaosu
            </h3>
            
            {player.isActive ? (
              <div className="animate-pulse text-neon-purple text-3xl font-bold mb-4">
                Twoja kolej! Koło Chaosu wylosuje dla Ciebie pytanie
              </div>
            ) : (
              <div className="text-white/70 text-xl">
                Oczekiwanie na swoją kolej...
              </div>
            )}
            
            {/* Player camera if available */}
            {player.cameraUrl && (
              <div className="absolute bottom-8 right-8 w-[320px] h-[240px] border-4" style={{ borderColor: playerColor }}>
                <iframe 
                  src={player.cameraUrl}
                  title={`Kamera ${player.name}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerView;
