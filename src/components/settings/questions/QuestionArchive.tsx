
import React, { useState, useEffect } from 'react';
import { Category, Question } from '@/types/game-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, RotateCw, Archive } from 'lucide-react';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

interface QuestionArchiveProps {
  categories: Category[];
  onRestoreQuestion: (questionId: string) => void;
}

const QuestionArchive: React.FC<QuestionArchiveProps> = ({ categories, onRestoreQuestion }) => {
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load used questions from database using RPC call
  const loadUsedQuestions = async () => {
    setIsLoading(true);
    try {
      // Use RPC call to get used questions since the table might not be in types yet
      const { data, error } = await supabase.rpc('load_game_data', { 
        key: 'used_questions' 
      });
        
      if (error) {
        console.error("Error loading used questions:", error);
        toast.error("Nie udało się załadować używanych pytań");
        return;
      }
      
      if (data && Array.isArray(data)) {
        setUsedQuestionIds(data);
      } else if (data && typeof data === 'object') {
        // Handle case where data is stored as object with question IDs
        const questionIds = Object.keys(data);
        setUsedQuestionIds(questionIds);
      }
    } catch (error) {
      console.error("Error loading used questions:", error);
      toast.error("Nie udało się załadować używanych pytań");
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadUsedQuestions();
  }, []);
  
  // Get all questions from all categories
  const allQuestions = categories.flatMap(category => 
    category.questions.map(question => ({
      ...question,
      categoryName: category.name
    }))
  );
  
  // Filter used questions
  const usedQuestions = allQuestions.filter(question => 
    usedQuestionIds.includes(question.id)
  );
  
  // Apply filters
  const filteredQuestions = usedQuestions.filter(question => {
    const matchesSearch = 
      question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.correctAnswer?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || question.categoryName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle restoring a question
  const handleRestoreQuestion = async (questionId: string) => {
    try {
      // Get current used questions
      const { data: currentData } = await supabase.rpc('load_game_data', { 
        key: 'used_questions' 
      });
      
      let updatedUsedQuestions: string[] = [];
      if (Array.isArray(currentData)) {
        updatedUsedQuestions = currentData.filter((id: string) => id !== questionId);
      } else if (currentData && typeof currentData === 'object') {
        const questionIds = Object.keys(currentData);
        updatedUsedQuestions = questionIds.filter(id => id !== questionId);
      }
      
      // Save updated list
      const { error } = await supabase.rpc('save_game_data', {
        key: 'used_questions',
        value: updatedUsedQuestions
      });
        
      if (error) {
        toast.error('Nie udało się przywrócić pytania');
        return;
      }
      
      // Remove from used questions list
      setUsedQuestionIds(prev => prev.filter(id => id !== questionId));
      onRestoreQuestion(questionId);
      toast.success('Pytanie przywrócone do puli');
    } catch (error) {
      console.error("Error restoring question:", error);
      toast.error('Wystąpił błąd podczas przywracania pytania');
    }
  };
  
  return (
    <div className="p-4 bg-black/50 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Archive className="mr-2 h-5 w-5" /> 
          Magazyn pytań ({usedQuestions.length})
        </h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadUsedQuestions}
          disabled={isLoading}
          className="text-white border-white/20"
        >
          <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Odśwież
        </Button>
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Szukaj pytań..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-black/30 border-white/20 text-white"
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="all" className="text-xs py-1">
              Wszystkie
            </TabsTrigger>
            <TabsTrigger value="Runda 1" className="text-xs py-1">
              Runda 1
            </TabsTrigger>
            <TabsTrigger value="Runda 2" className="text-xs py-1">
              Runda 2
            </TabsTrigger>
            <TabsTrigger value="Runda 3" className="text-xs py-1">
              Runda 3
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredQuestions.length > 0 ? (
        <div className="space-y-2 overflow-y-auto max-h-96">
          {filteredQuestions.map((question) => (
            <div 
              key={question.id}
              className="p-3 bg-black/30 rounded border border-white/10 hover:border-white/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-neon-blue text-sm">{question.categoryName}</span>
                <QuestionDifficultyBadge difficulty={question.difficulty} />
              </div>
              <div className="text-white font-medium mb-1">
                {question.text || question.question}
              </div>
              <div className="text-white/70 text-sm mb-2">
                Odp: {question.correctAnswer || question.answer}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRestoreQuestion(question.id)}
                  className="text-neon-green border-neon-green hover:bg-neon-green/20"
                >
                  <RotateCw className="h-3 w-3 mr-1" /> Przywróć do puli
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-white/50">
          {usedQuestions.length > 0 
            ? 'Brak pytań pasujących do filtrów' 
            : 'Brak wykorzystanych pytań w magazynie'}
        </div>
      )}
    </div>
  );
};

export default QuestionArchive;
