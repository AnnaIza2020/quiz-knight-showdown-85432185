
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { usePlayerConnection } from '@/hooks/usePlayerConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Clock, Trophy, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const PlayerInterface: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { players, currentQuestion, timerRunning, timerSeconds } = useGameContext();
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  // Find the current player
  const currentPlayer = players.find(p => p.id === playerId);
  
  // Connection status
  const { 
    isConnected, 
    connectionStatus,
    gameEvent 
  } = usePlayerConnection({ 
    playerId,
    playerNickname: currentPlayer?.name 
  });

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast.error('Wprowadź odpowiedź!');
      return;
    }

    setHasAnswered(true);
    toast.success('Odpowiedź wysłana!');
    console.log('Answer submitted:', answer);
    
    // TODO: Send answer to game context
  };

  // Reset answer when new question appears
  useEffect(() => {
    setHasAnswered(false);
    setAnswer('');
  }, [currentQuestion]);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-neon-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/60 border border-red-500/50">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Gracz nie znaleziony</h2>
            <p className="text-gray-300">Nieprawidłowy identyfikator gracza.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-background p-4">
      {/* Header with player info and connection status */}
      <Card className="mb-4 bg-black/60 border border-neon-blue/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-purple rounded-full flex items-center justify-center">
                {currentPlayer.avatar ? (
                  <img 
                    src={currentPlayer.avatar} 
                    alt={currentPlayer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {currentPlayer.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{currentPlayer.name}</h1>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm text-gray-400">
                    {connectionStatus === 'connected' ? 'Połączony' : 'Rozłączony'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Player stats */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-neon-purple">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{currentPlayer.points}</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <Heart className="w-5 h-5" />
                <span className="font-bold">{currentPlayer.health}%</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-4">
        {/* Current question */}
        {currentQuestion ? (
          <Card className="bg-black/60 border border-neon-green/50">
            <CardHeader>
              <CardTitle className="text-neon-green">Pytanie</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-xl text-white font-medium">
                  {currentQuestion.text}
                </p>
                
                {/* Multiple choice options */}
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => setAnswer(option)}
                        disabled={hasAnswered}
                        variant={answer === option ? "default" : "outline"}
                        className={`justify-start p-4 h-auto ${
                          answer === option 
                            ? 'bg-neon-blue text-black' 
                            : 'border-neon-blue/50 text-white hover:bg-neon-blue/10'
                        }`}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  /* Text input for open questions */
                  <div className="space-y-2">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Wpisz swoją odpowiedź..."
                      disabled={hasAnswered}
                      className="bg-black/60 border-neon-blue/50 text-white"
                    />
                  </div>
                )}

                {/* Submit button */}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={hasAnswered || !answer.trim()}
                  className="w-full bg-neon-green hover:bg-neon-green/80 text-black font-bold"
                >
                  {hasAnswered ? 'Odpowiedź wysłana' : 'Wyślij odpowiedź'}
                </Button>

                {/* Timer */}
                {timerRunning && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-neon-gold">
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-bold">{timerSeconds}s</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <motion.div 
                        className="bg-neon-gold h-2 rounded-full"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timerSeconds / 30) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/60 border border-white/20">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-xl text-white font-medium">
                Oczekiwanie na pytanie...
              </h3>
              <p className="text-gray-400 mt-2">
                Prowadzący przygotowuje następne pytanie
              </p>
            </CardContent>
          </Card>
        )}

        {/* Special cards */}
        {currentPlayer.specialCards && currentPlayer.specialCards.length > 0 && (
          <Card className="bg-black/60 border border-neon-purple/50">
            <CardHeader>
              <CardTitle className="text-neon-purple">Karty specjalne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {currentPlayer.specialCards.map((cardId, index) => (
                  <Badge key={index} variant="outline" className="border-neon-purple text-neon-purple">
                    Karta {index + 1}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game events */}
        {gameEvent && (
          <Card className="bg-black/60 border border-neon-gold/50">
            <CardContent className="p-4">
              <p className="text-neon-gold font-medium">{gameEvent}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerInterface;
