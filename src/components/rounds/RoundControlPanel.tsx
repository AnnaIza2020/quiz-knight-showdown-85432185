
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Check, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Trophy,
  X
} from 'lucide-react';
import { GameRound, Player, Question } from '@/types/game-types';
import { RoundSettings } from '@/types/round-settings';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import QuestionBoard from '../QuestionBoard';
import FortuneWheel from '../FortuneWheel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useWheelSync } from '@/hooks/useWheelSync';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface RoundControlPanelProps {
  round: GameRound;
  activePlayers: Player[];
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  timerSeconds: number;
  usedQuestionIds: string[];
  roundSettings: RoundSettings;
}

const RoundControlPanel: React.FC<RoundControlPanelProps> = ({
  round,
  activePlayers,
  currentQuestion,
  activePlayerId,
  timerRunning,
  timerSeconds,
  usedQuestionIds,
  roundSettings
}) => {
  const { 
    setActivePlayer,
    startTimer,
    stopTimer,
    awardPoints,
    deductHealth,
    deductLife,
    playSound,
    selectQuestion,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    categories,
    markQuestionAsUsed
  } = useGameContext();
  
  const [luckyLoserDialogOpen, setLuckyLoserDialogOpen] = useState(false);
  const [resetRoundDialogOpen, setResetRoundDialogOpen] = useState(false);
  const [skipQuestionDialogOpen, setSkipQuestionDialogOpen] = useState(false);
  
  // Track round progress
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const maxQuestionsForRound = round === GameRound.ROUND_ONE 
    ? roundSettings[GameRound.ROUND_ONE].maxQuestions
    : round === GameRound.ROUND_TWO 
      ? roundSettings[GameRound.ROUND_TWO].maxQuestions 
      : roundSettings[GameRound.ROUND_THREE].maxSpins;
  
  // Lucky loser handling
  const [luckyLoser, setLuckyLoser] = useState<Player | null>(null);
  
  // Wheel of Fortune in Round 3
  const { 
    isSpinning,
    selectedCategory,
    triggerSpin,
    resetWheel
  } = useWheelSync({
    onCategorySelected: (category) => {
      toast.success(`Kategoria: ${category}`, {
        description: 'Kliknij "Pokaż pytanie" aby wylosować pytanie z tej kategorii'
      });
      playSound('success');
    }
  });
  
  // Find the best-performing eliminated player for Lucky Loser
  const findLuckyLoser = () => {
    // Get all eliminated players
    const eliminatedPlayers = activePlayers.filter(player => player.isEliminated);
    
    if (eliminatedPlayers.length === 0) {
      toast.info('Brak wyeliminowanych graczy');
      return null;
    }
    
    // Sort by points (highest first)
    const sortedPlayers = [...eliminatedPlayers].sort((a, b) => b.points - a.points);
    return sortedPlayers[0] || null;
  };
  
  // Handle correct answer
  const handleCorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error('Wybierz aktywnego gracza');
      return;
    }
    
    const player = activePlayers.find(p => p.id === activePlayerId);
    if (!player) return;
    
    // Get points based on round and question difficulty
    let pointsToAward = 0;
    
    if (round === GameRound.ROUND_ONE) {
      pointsToAward = roundSettings[GameRound.ROUND_ONE].pointsForCorrectAnswer;
      if (currentQuestion?.difficulty) {
        pointsToAward = currentQuestion.difficulty;
      }
    } else if (round === GameRound.ROUND_TWO) {
      pointsToAward = roundSettings[GameRound.ROUND_TWO].pointsForCorrectAnswer;
    } else if (round === GameRound.ROUND_THREE) {
      pointsToAward = roundSettings[GameRound.ROUND_THREE].pointsForCorrectAnswer;
    }
    
    // Award points
    awardPoints(activePlayerId, pointsToAward);
    
    // Play sound and show toast
    playSound('success');
    toast.success(`Poprawna odpowiedź! +${pointsToAward} punktów`, {
      description: `${player.name} ma teraz ${player.points + pointsToAward} punktów`
    });
    
    // Mark question as used
    if (currentQuestion) {
      markQuestionAsUsed(currentQuestion.id);
    }
    
    // Increment question counter
    setCurrentQuestionNumber(prev => Math.min(prev + 1, maxQuestionsForRound));
    
    // Stop timer if running
    if (timerRunning) {
      stopTimer();
    }
  };
  
  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error('Wybierz aktywnego gracza');
      return;
    }
    
    const player = activePlayers.find(p => p.id === activePlayerId);
    if (!player) return;
    
    // Determine health deduction based on round
    let healthDeduction = 0;
    
    if (round === GameRound.ROUND_ONE) {
      healthDeduction = roundSettings[GameRound.ROUND_ONE].healthDeductionPercentage;
    } else if (round === GameRound.ROUND_TWO) {
      healthDeduction = 20; // 20% in Round 2
    } else if (round === GameRound.ROUND_THREE) {
      healthDeduction = 25; // 25% in Round 3
    }
    
    // Deduct health
    deductHealth(activePlayerId, healthDeduction);
    
    // Play sound and show toast
    playSound('failure');
    toast.error(`Błędna odpowiedź! -${healthDeduction}% życia`, {
      description: `${player.name} ma teraz ${Math.max(0, player.health - healthDeduction)}% życia`
    });
    
    // Mark question as used
    if (currentQuestion) {
      markQuestionAsUsed(currentQuestion.id);
    }
    
    // Increment question counter
    setCurrentQuestionNumber(prev => Math.min(prev + 1, maxQuestionsForRound));
    
    // Stop timer if running
    if (timerRunning) {
      stopTimer();
    }
    
    // Check if player should be eliminated
    if (player.health <= healthDeduction) {
      toast.info(`${player.name} został wyeliminowany!`);
      playSound('eliminate');
    }
  };
  
  // Handle lucky loser dialog
  const handleOpenLuckyLoserDialog = () => {
    const luckyLoser = findLuckyLoser();
    setLuckyLoser(luckyLoser);
    setLuckyLoserDialogOpen(true);
  };
  
  // Handle lucky loser confirmation
  const handleConfirmLuckyLoser = () => {
    if (!luckyLoser) return;
    
    // Reset player's life and remove elimination
    const updatedPlayer = {
      ...luckyLoser,
      health: 100, // Full health
      lives: 3, // Reset lives
      isEliminated: false // No longer eliminated
    };
    
    // Update player (this should internally call setPlayers)
    useGameContext().updatePlayer(updatedPlayer);
    
    // Show toast and play sound
    toast.success(`${luckyLoser.name} wraca do gry jako Lucky Loser!`);
    playSound('bonus');
    
    // Close dialog
    setLuckyLoserDialogOpen(false);
  };
  
  // Handle round reset
  const handleResetRound = () => {
    // Reset round-specific state
    setCurrentQuestionNumber(1);
    resetWheel();
    selectQuestion(null);
    stopTimer();
    
    // Close dialog
    setResetRoundDialogOpen(false);
    
    toast.success('Runda została zresetowana');
  };
  
  // Handle skip question
  const handleSkipQuestion = () => {
    // Mark current question as skipped
    if (currentQuestion) {
      markQuestionAsUsed(currentQuestion.id);
    }
    
    // Clear current question
    selectQuestion(null);
    
    // Stop timer if running
    if (timerRunning) {
      stopTimer();
    }
    
    // Show notification
    toast.info('Pytanie pominięto');
    
    // Close dialog
    setSkipQuestionDialogOpen(false);
  };
  
  // Spin the Wheel of Fortune
  const handleSpinWheel = () => {
    triggerSpin();
    playSound('wheel-spin');
    toast.info('Koło fortuny kręci się...');
  };
  
  // Get a random question from the selected category
  const handleGetCategoryQuestion = () => {
    if (!selectedCategory) {
      toast.error('Najpierw wylosuj kategorię za pomocą Koła Fortuny');
      return;
    }
    
    // Find the category
    const category = categories.find(c => c.name === selectedCategory);
    if (!category) {
      toast.error('Nie znaleziono kategorii');
      return;
    }
    
    // Get available questions (not used yet)
    const availableQuestions = category.questions.filter(q => !usedQuestionIds.includes(q.id));
    
    if (availableQuestions.length === 0) {
      toast.error('Brak dostępnych pytań w tej kategorii');
      return;
    }
    
    // Get a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    
    // Select the question
    selectQuestion(question);
    
    // Play sound and show notification
    playSound('card-reveal');
    toast.success('Wylosowano pytanie z kategorii: ' + selectedCategory);
  };
  
  // Render controls based on current round
  const renderRoundControls = () => {
    if (round === GameRound.SETUP) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Przygotowanie do gry</h3>
          <p className="text-white/70 mb-6">
            Kliknij przycisk "Start Rundy 1" w górnym pasku, aby rozpocząć teleturniej.
          </p>
          <Button 
            onClick={() => advanceToRoundTwo()}
            className="bg-neon-blue hover:bg-neon-blue/80"
          >
            <Play className="h-4 w-4 mr-2" />
            Rozpocznij Rundę 1
          </Button>
        </div>
      );
    }
    
    if (round === GameRound.ROUND_ONE) {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Runda 1: Eliminacje</h3>
            <Badge className="bg-neon-blue">
              Pytanie {currentQuestionNumber}/{maxQuestionsForRound}
            </Badge>
          </div>
          
          <Progress 
            value={(currentQuestionNumber / maxQuestionsForRound) * 100} 
            className="h-2 mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <QuestionBoard question={currentQuestion} />
            
            <div>
              <Card className="bg-black/30 border border-white/10 mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Timer i Ocena</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button 
                      onClick={() => startTimer(30)}
                      className="bg-neon-blue hover:bg-neon-blue/80 text-white"
                      disabled={timerRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start (30s)
                    </Button>
                    
                    <Button 
                      onClick={stopTimer}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={!timerRunning}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleCorrectAnswer}
                            className="bg-green-600 hover:bg-green-700 text-white h-16"
                            disabled={!currentQuestion}
                          >
                            <Check className="h-6 w-6 mr-2" />
                            Poprawna odpowiedź
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Gracz otrzyma {currentQuestion?.difficulty || roundSettings[GameRound.ROUND_ONE].pointsForCorrectAnswer} punktów
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleIncorrectAnswer}
                            className="bg-red-600 hover:bg-red-700 text-white h-16"
                            disabled={!currentQuestion}
                          >
                            <X className="h-6 w-6 mr-2" />
                            Błędna odpowiedź
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Gracz straci {roundSettings[GameRound.ROUND_ONE].healthDeductionPercentage}% życia
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
                  onClick={() => setSkipQuestionDialogOpen(true)}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Pomiń pytanie
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  onClick={handleOpenLuckyLoserDialog}
                  disabled={roundSettings[GameRound.ROUND_ONE].luckyLoserEnabled === false}
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  Lucky Loser
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
              onClick={() => setResetRoundDialogOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset rundy
            </Button>
            
            <Button 
              onClick={() => advanceToRoundTwo()}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
            >
              <Play className="h-4 w-4 mr-1" />
              Przejdź do Rundy 2
            </Button>
          </div>
        </div>
      );
    }
    
    if (round === GameRound.ROUND_TWO) {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Runda 2: Szybka Odpowiedź</h3>
            <Badge className="bg-neon-yellow text-black">
              Pytanie {currentQuestionNumber}/{maxQuestionsForRound}
            </Badge>
          </div>
          
          <Progress 
            value={(currentQuestionNumber / maxQuestionsForRound) * 100} 
            className="h-2 mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <QuestionBoard question={currentQuestion} />
            
            <div>
              <Card className="bg-black/30 border border-white/10 mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Timer 5 Sekund</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button 
                      onClick={() => startTimer(5)}
                      className="bg-neon-yellow hover:bg-neon-yellow/80 text-black"
                      disabled={timerRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start (5s)
                    </Button>
                    
                    <Button 
                      onClick={stopTimer}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={!timerRunning}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleCorrectAnswer}
                            className="bg-green-600 hover:bg-green-700 text-white h-16"
                            disabled={!currentQuestion}
                          >
                            <Check className="h-6 w-6 mr-2" />
                            Poprawna odpowiedź
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Gracz otrzyma {roundSettings[GameRound.ROUND_TWO].pointsForCorrectAnswer} punktów
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleIncorrectAnswer}
                            className="bg-red-600 hover:bg-red-700 text-white h-16"
                            disabled={!currentQuestion}
                          >
                            <X className="h-6 w-6 mr-2" />
                            Błędna odpowiedź
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Gracz straci 20% życia
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
                  onClick={() => setSkipQuestionDialogOpen(true)}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Pomiń pytanie
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                  onClick={() => setResetRoundDialogOpen(true)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset rundy
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => advanceToRoundThree()}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
            >
              <Play className="h-4 w-4 mr-1" />
              Przejdź do Rundy 3
            </Button>
          </div>
        </div>
      );
    }
    
    if (round === GameRound.ROUND_THREE) {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Runda 3: Koło Fortuny</h3>
            <Badge className="bg-neon-purple">
              Obrót {currentQuestionNumber}/{maxQuestionsForRound}
            </Badge>
          </div>
          
          <Progress 
            value={(currentQuestionNumber / maxQuestionsForRound) * 100} 
            className="h-2 mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="bg-black/30 border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Koło Fortuny</CardTitle>
              </CardHeader>
              <CardContent>
                <FortuneWheel 
                  categories={categories.map(c => c.name)}
                  isSpinning={isSpinning}
                />
                
                <div className="mt-4 flex justify-center">
                  {selectedCategory ? (
                    <Badge className="text-md py-2 px-4 bg-neon-purple">
                      {selectedCategory}
                    </Badge>
                  ) : (
                    <Badge className="text-md py-2 px-4 bg-gray-700">
                      Zakręć kołem aby wylosować kategorię
                    </Badge>
                  )}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleSpinWheel}
                    className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                    disabled={isSpinning}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Zakręć kołem
                  </Button>
                  
                  <Button 
                    onClick={handleGetCategoryQuestion}
                    className="bg-neon-green hover:bg-neon-green/80 text-black"
                    disabled={!selectedCategory}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Pokaż pytanie
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div>
              <QuestionBoard question={currentQuestion} />
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleCorrectAnswer}
                        className="bg-green-600 hover:bg-green-700 text-white h-12"
                        disabled={!currentQuestion}
                      >
                        <Check className="h-5 w-5 mr-2" />
                        Poprawna odpowiedź
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Gracz otrzyma {roundSettings[GameRound.ROUND_THREE].pointsForCorrectAnswer} punktów
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleIncorrectAnswer}
                        className="bg-red-600 hover:bg-red-700 text-white h-12"
                        disabled={!currentQuestion}
                      >
                        <X className="h-5 w-5 mr-2" />
                        Błędna odpowiedź
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Gracz straci 25% życia
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  onClick={() => startTimer(30)}
                  className="bg-neon-blue hover:bg-neon-blue/80 text-white"
                  disabled={timerRunning || !currentQuestion}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Timer (30s)
                </Button>
                
                <Button 
                  onClick={stopTimer}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!timerRunning}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              className="border-orange-400 text-orange-400 hover:bg-orange-400/10"
              onClick={() => setSkipQuestionDialogOpen(true)}
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Pomiń pytanie
            </Button>
            
            <Button 
              onClick={() => finishGame([])} // Empty array will trigger automatic winner detection
              className="bg-neon-green hover:bg-neon-green/80 text-black"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Zakończ grę
            </Button>
          </div>
        </div>
      );
    }
    
    if (round === GameRound.FINISHED) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Teleturniej zakończony!</h3>
          <p className="text-white/70 mb-6">
            Zwycięzcy zostali ogłoszeni. Możesz zresetować grę lub wrócić do menu głównego.
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      {renderRoundControls()}
      
      {/* Lucky Loser Dialog */}
      <Dialog open={luckyLoserDialogOpen} onOpenChange={setLuckyLoserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lucky Loser</DialogTitle>
            <DialogDescription>
              {luckyLoser ? (
                <span>
                  Gracz <span className="font-bold">{luckyLoser.name}</span> ma najwyższy wynik ({luckyLoser.points} pkt) wśród wyeliminowanych graczy. Czy chcesz przywrócić tego gracza do gry jako "Lucky Loser"?
                </span>
              ) : (
                <span>Nie znaleziono wyeliminowanych graczy.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLuckyLoserDialogOpen(false)}
            >
              Anuluj
            </Button>
            
            <Button 
              onClick={handleConfirmLuckyLoser}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
              disabled={!luckyLoser}
            >
              Przywróć jako Lucky Loser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Round Dialog */}
      <Dialog open={resetRoundDialogOpen} onOpenChange={setResetRoundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset rundy</DialogTitle>
            <DialogDescription>
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto my-2" />
              Czy na pewno chcesz zresetować bieżącą rundę? Ta akcja wyczyści aktualny postęp rundy.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setResetRoundDialogOpen(false)}
            >
              Anuluj
            </Button>
            
            <Button 
              onClick={handleResetRound}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset rundy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Skip Question Dialog */}
      <Dialog open={skipQuestionDialogOpen} onOpenChange={setSkipQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pomiń pytanie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz pominąć bieżące pytanie? 
              To pytanie zostanie oznaczone jako użyte i nie będzie dostępne w bieżącej sesji.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSkipQuestionDialogOpen(false)}
            >
              Anuluj
            </Button>
            
            <Button 
              onClick={handleSkipQuestion}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Pomiń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoundControlPanel;
