
import React, { useState } from 'react';
import { Clock, FastForward, Play, Square, Timer, HelpCircle } from 'lucide-react';
import { GameRound, Question } from '@/types/game-types';
import CountdownTimer from '../CountdownTimer';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

interface TopBarProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
  stopTimer: () => void;
  handleAdvanceToRound: (round: GameRound) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  round,
  handleStartTimer,
  stopTimer,
  handleAdvanceToRound
}) => {
  const { categories, selectQuestion, playSound, markQuestionAsUsed } = useGameContext();
  const [randomQuestionDialogOpen, setRandomQuestionDialogOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get all used questions from localStorage
  const getUsedQuestionIds = (): string[] => {
    const usedQuestionsJson = localStorage.getItem('gameShowUsedQuestions');
    return usedQuestionsJson ? JSON.parse(usedQuestionsJson) : [];
  };
  
  // Add a question to used questions
  const addUsedQuestion = async (questionId: string) => {
    const usedQuestions = getUsedQuestionIds();
    if (!usedQuestions.includes(questionId)) {
      const newUsedQuestions = [...usedQuestions, questionId];
      localStorage.setItem('gameShowUsedQuestions', JSON.stringify(newUsedQuestions));
      
      try {
        await saveUsedQuestion(questionId);
      } catch (error) {
        console.error("Error saving used question:", error);
      }
    }
  };
  
  // New function to save used questions to Supabase
  const saveUsedQuestion = async (questionId: string) => {
    // Get existing used questions
    const { data: existingData, error: getError } = await supabase
      .from('game_settings')
      .select('value')
      .eq('id', 'used_questions')
      .single();
    
    if (getError && getError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      throw getError;
    }
    
    // Prepare the list of used questions
    let usedQuestions: string[] = [];
    if (existingData?.value && Array.isArray(existingData.value)) {
      usedQuestions = existingData.value as string[];
    }
    
    // Add the new question ID if not already present
    if (!usedQuestions.includes(questionId)) {
      usedQuestions.push(questionId);
    }
    
    // Save the updated list
    if (existingData) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('game_settings')
        .update({ value: usedQuestions })
        .eq('id', 'used_questions');
      
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('game_settings')
        .insert({ id: 'used_questions', value: usedQuestions });
      
      if (insertError) throw insertError;
    }
  };
  
  // Handle random question selection
  const handleRandomQuestion = () => {
    // Get all questions from all categories
    const allQuestions = categories.flatMap(category => 
      category.questions.map(question => ({
        ...question,
        categoryName: category.name
      }))
    );
    
    // Get used question ids
    const usedQuestionIds = getUsedQuestionIds();
    
    // Apply filters if selected
    let filteredQuestions = [...allQuestions];
    
    if (selectedCategory) {
      filteredQuestions = filteredQuestions.filter(q => q.categoryName === selectedCategory);
    }
    
    if (selectedDifficulty !== null) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Filter out used questions
    const availableQuestions = filteredQuestions.filter(q => !usedQuestionIds.includes(q.id));
    
    if (availableQuestions.length === 0) {
      toast.error('Brak dostępnych pytań spełniających kryteria');
      return;
    }
    
    // Get random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const randomQuestion = availableQuestions[randomIndex];
    
    // Select question
    selectQuestion(randomQuestion);
    
    // Mark as used
    markQuestionAsUsed(randomQuestion.id);
    addUsedQuestion(randomQuestion.id);
    
    // Close dialog
    setRandomQuestionDialogOpen(false);
    
    // Play sound effect
    playSound('card-reveal');
    
    // Show toast
    toast.success('Wylosowano nowe pytanie', {
      description: `${randomQuestion.categoryName} - ${randomQuestion.difficulty} pkt`
    });
  };
  
  // Generate round name based on current round
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza z Polskiego Internetu";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Gra Zakończona";
      default:
        return "Nieznana runda";
    }
  };
  
  // Determine which timer buttons to show based on the current round
  const getTimerButtons = () => {
    if (round === GameRound.ROUND_ONE) {
      return (
        <>
          <button
            onClick={() => handleStartTimer(30)}
            className="bg-black border border-neon-blue text-neon-blue hover:bg-neon-blue/10 py-2 px-3 rounded-md flex items-center"
          >
            <Timer className="h-4 w-4 mr-1" />
            30s
          </button>
          <button
            onClick={() => handleStartTimer(60)}
            className="bg-black border border-neon-blue text-neon-blue hover:bg-neon-blue/10 py-2 px-3 rounded-md flex items-center"
          >
            <Timer className="h-4 w-4 mr-1" />
            60s
          </button>
        </>
      );
    }
    
    if (round === GameRound.ROUND_TWO) {
      return (
        <button
          onClick={() => handleStartTimer(5)}
          className="bg-black border border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 py-2 px-3 rounded-md flex items-center"
        >
          <Play className="h-4 w-4 mr-1" />
          5s
        </button>
      );
    }
    
    if (round === GameRound.ROUND_THREE) {
      return (
        <button
          onClick={() => handleStartTimer(30)}
          className="bg-black border border-neon-purple text-neon-purple hover:bg-neon-purple/10 py-2 px-3 rounded-md flex items-center"
        >
          <Timer className="h-4 w-4 mr-1" />
          30s
        </button>
      );
    }
    
    return null;
  };
  
  // Get the next round button if applicable
  const getNextRoundButton = () => {
    if (round === GameRound.ROUND_ONE) {
      return (
        <button
          onClick={() => handleAdvanceToRound(GameRound.ROUND_TWO)}
          className="bg-black border border-neon-green text-neon-green hover:bg-neon-green/10 py-2 px-3 rounded-md flex items-center"
        >
          <FastForward className="h-4 w-4 mr-1" />
          Przejdź do Rundy 2
        </button>
      );
    }
    
    if (round === GameRound.ROUND_TWO) {
      return (
        <button
          onClick={() => handleAdvanceToRound(GameRound.ROUND_THREE)}
          className="bg-black border border-neon-green text-neon-green hover:bg-neon-green/10 py-2 px-3 rounded-md flex items-center"
        >
          <FastForward className="h-4 w-4 mr-1" />
          Przejdź do Rundy 3
        </button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10 mb-4 flex flex-wrap justify-between items-center gap-y-3">
      {/* Left section - Round info */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white mr-2">
          {getRoundName()}
        </h1>
      </div>
      
      {/* Middle section - Timer */}
      <div className="flex gap-2">
        <CountdownTimer size="md" />
        
        {round !== GameRound.SETUP && round !== GameRound.FINISHED && (
          <button
            onClick={() => setRandomQuestionDialogOpen(true)}
            className="bg-black border border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 py-2 px-3 rounded-md flex items-center ml-2"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Losuj Pytanie
          </button>
        )}
      </div>
      
      {/* Right section - Actions */}
      <div className="flex gap-2">
        {getTimerButtons()}
        
        <button
          onClick={stopTimer}
          className="bg-black border border-neon-red text-neon-red hover:bg-neon-red/10 py-2 px-3 rounded-md flex items-center"
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </button>
        
        {getNextRoundButton()}
      </div>
      
      {/* Random Question Dialog */}
      <Dialog open={randomQuestionDialogOpen} onOpenChange={setRandomQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Losuj pytanie</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="mb-2 font-medium">Kategoria</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                className={`p-2 rounded text-center ${selectedCategory === null ? 'bg-neon-blue/20 border border-neon-blue' : 'bg-black/50 border border-white/20'}`}
                onClick={() => setSelectedCategory(null)}
              >
                Wszystkie
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`p-2 rounded text-center ${selectedCategory === category.name ? 'bg-neon-blue/20 border border-neon-blue' : 'bg-black/50 border border-white/20'}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <h3 className="mb-2 font-medium">Poziom trudności</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                className={`p-2 rounded text-center ${selectedDifficulty === null ? 'bg-neon-blue/20 border border-neon-blue' : 'bg-black/50 border border-white/20'}`}
                onClick={() => setSelectedDifficulty(null)}
              >
                Wszystkie
              </button>
              
              {[5, 10, 15, 20].map(difficulty => (
                <button
                  key={difficulty}
                  className={`p-2 rounded text-center ${selectedDifficulty === difficulty ? 'bg-neon-blue/20 border border-neon-blue' : 'bg-black/50 border border-white/20'}`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty} pkt
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleRandomQuestion}
                className="px-4 py-2 bg-neon-yellow hover:bg-neon-yellow/80 text-black font-medium rounded"
              >
                Losuj Pytanie
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopBar;
