
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Player, Question } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Timer, Users, Trophy, Heart } from 'lucide-react';
import { toast } from 'sonner';

const GameManager: React.FC = () => {
  const {
    round,
    setRound,
    players,
    currentQuestion,
    activePlayerId,
    timerRunning,
    timerSeconds,
    startTimer,
    stopTimer,
    awardPoints,
    deductHealth,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    roundSettings,
    playSound
  } = useGameContext();

  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Auto advance rounds based on game logic
  useEffect(() => {
    if (round === GameRound.ROUND_ONE) {
      checkRoundOneCompletion();
    } else if (round === GameRound.ROUND_TWO) {
      checkRoundTwoCompletion();
    } else if (round === GameRound.ROUND_THREE) {
      checkRoundThreeCompletion();
    }
  }, [players, currentQuestion, round]);

  const checkRoundOneCompletion = () => {
    const alivePlayers = players.filter(p => !p.isEliminated && p.health > 0);
    if (alivePlayers.length <= roundSettings.round1.eliminateCount + 1) {
      handleRoundOneEnd();
    }
  };

  const checkRoundTwoCompletion = () => {
    const alivePlayers = players.filter(p => !p.isEliminated && p.lives > 0);
    if (alivePlayers.length <= 3) {
      handleRoundTwoEnd();
    }
  };

  const checkRoundThreeCompletion = () => {
    const alivePlayers = players.filter(p => !p.isEliminated && p.lives > 0);
    if (alivePlayers.length <= 1) {
      handleGameEnd();
    }
  };

  const handleRoundOneEnd = () => {
    playSound('round-start');
    toast.success('Runda 1 zakończona! Przechodząc do Rundy 2');
    
    // Eliminate players and select lucky loser
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    const survivingCount = players.length - roundSettings.round1.eliminateCount;
    
    sortedPlayers.forEach((player, index) => {
      if (index >= survivingCount) {
        eliminatePlayer(player.id);
      }
    });

    setTimeout(() => {
      advanceToRoundTwo();
    }, 2000);
  };

  const handleRoundTwoEnd = () => {
    playSound('round-start');
    toast.success('Runda 2 zakończona! Przechodząc do Rundy 3 - Koło Fortuny');
    
    setTimeout(() => {
      advanceToRoundThree();
    }, 2000);
  };

  const handleGameEnd = () => {
    const alivePlayers = players.filter(p => !p.isEliminated && p.lives > 0);
    const winnerIds = alivePlayers.map(p => p.id);
    
    playSound('victory');
    toast.success('Gra zakończona!');
    
    setTimeout(() => {
      finishGame(winnerIds);
    }, 2000);
  };

  const handleCorrectAnswer = (playerId: string) => {
    const pointsAwarded = getCurrentRoundPoints();
    awardPoints(playerId, pointsAwarded);
    playSound('success');
    toast.success(`Gracz otrzymał ${pointsAwarded} punktów!`);
  };

  const handleIncorrectAnswer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    if (round === GameRound.ROUND_ONE) {
      const healthLoss = roundSettings.round1.healthDeductionPercentage;
      deductHealth(playerId, healthLoss);
      
      if (player.health - healthLoss <= 0) {
        eliminatePlayer(playerId);
        playSound('eliminate');
        toast.error('Gracz został wyeliminowany!');
      }
    } else {
      const player = players.find(p => p.id === playerId);
      if (player && player.lives > 1) {
        // Deduct life logic would go here
        playSound('fail');
        toast.warning('Gracz stracił życie!');
      } else {
        eliminatePlayer(playerId);
        playSound('eliminate');
        toast.error('Gracz został wyeliminowany!');
      }
    }
  };

  const getCurrentRoundPoints = (): number => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return roundSettings.round1.pointsForCorrectAnswer;
      case GameRound.ROUND_TWO:
        return roundSettings.round2.pointsForCorrectAnswer;
      case GameRound.ROUND_THREE:
        return roundSettings.round3.pointsForCorrectAnswer;
      default:
        return 10;
    }
  };

  const getAlivePlayers = () => {
    return players.filter(p => !p.isEliminated);
  };

  const getRoundName = (round: GameRound): string => {
    switch (round) {
      case GameRound.SETUP:
        return 'Przygotowanie';
      case GameRound.ROUND_ONE:
        return 'Runda 1: Wiedza z Internetu';
      case GameRound.ROUND_TWO:
        return 'Runda 2: 5 Sekund';
      case GameRound.ROUND_THREE:
        return 'Runda 3: Koło Fortuny';
      case GameRound.FINISHED:
        return 'Gra Zakończona';
      default:
        return 'Nieznana Runda';
    }
  };

  if (round === GameRound.FINISHED) {
    const winners = players.filter(p => !p.isEliminated);
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="bg-black/40 backdrop-blur-md border-neon-green w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-neon-green" />
            </div>
            <CardTitle className="text-4xl font-bold text-neon-green mb-2">
              🎉 ZWYCIĘZCA! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {winners.map((winner, index) => (
              <div key={winner.id} className="bg-black/20 rounded-lg p-4">
                <h3 className="text-2xl font-bold text-white">
                  #{index + 1} {winner.name}
                </h3>
                <p className="text-neon-blue text-lg">
                  {winner.points} punktów
                </p>
              </div>
            ))}
            <Button 
              onClick={() => setRound(GameRound.SETUP)}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
            >
              Nowa Gra
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="bg-black/40 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {getRoundName(round)}
                </CardTitle>
                <p className="text-white/60">
                  Discord Game Show - Panel Hosta
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {timerRunning && (
                  <div className="flex items-center space-x-2 bg-black/30 rounded-lg px-4 py-2">
                    <Timer className="w-5 h-5 text-neon-blue" />
                    <span className="text-neon-blue font-mono text-xl">
                      {timerSeconds}s
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-neon-green" />
                  <span className="text-white">
                    {getAlivePlayers().length} graczy
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getAlivePlayers().map((player) => (
            <Card 
              key={player.id} 
              className={`bg-black/40 backdrop-blur-md border-white/20 ${
                activePlayerId === player.id ? 'ring-2 ring-neon-blue' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">
                    {player.name}
                  </CardTitle>
                  {player.isEliminated && (
                    <Badge variant="destructive">Wyeliminowany</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Punkty:</span>
                  <span className="text-neon-green font-bold">{player.points}</span>
                </div>
                
                {round === GameRound.ROUND_ONE && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Zdrowie:</span>
                      <span className="text-white">{player.health}%</span>
                    </div>
                    <Progress value={player.health} className="h-2" />
                  </div>
                )}
                
                {(round === GameRound.ROUND_TWO || round === GameRound.ROUND_THREE) && (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-white">
                      {player.lives} {player.lives === 1 ? 'życie' : 'życia'}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleCorrectAnswer(player.id)}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    ✓ Poprawna
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleIncorrectAnswer(player.id)}
                    className="bg-red-600 hover:bg-red-700 flex-1"
                  >
                    ✗ Błędna
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <Card className="bg-black/40 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Aktualne Pytanie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg text-white">{currentQuestion.text}</p>
                
                {currentQuestion.options && currentQuestion.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        className="bg-black/20 rounded-lg p-3 text-white"
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-white/60">
                  <span>Kategoria: {currentQuestion.category}</span>
                  <span>Poziom: {currentQuestion.difficulty}</span>
                  <span>Punkty: {currentQuestion.points}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Controls */}
        <Card className="bg-black/40 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Kontrola Gry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                onClick={() => startTimer(30)}
                disabled={timerRunning}
                className="bg-neon-blue hover:bg-neon-blue/80"
              >
                Start Timer (30s)
              </Button>
              
              <Button
                onClick={stopTimer}
                disabled={!timerRunning}
                variant="destructive"
              >
                Stop Timer
              </Button>
              
              {round === GameRound.SETUP && (
                <Button
                  onClick={() => setRound(GameRound.ROUND_ONE)}
                  className="bg-neon-green hover:bg-neon-green/80 text-black"
                >
                  Rozpocznij Grę
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default GameManager;
