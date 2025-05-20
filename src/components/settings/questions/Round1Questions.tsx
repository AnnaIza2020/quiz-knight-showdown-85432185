import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Category, Question, GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { createQuestionWithDefaults } from '@/utils/createQuestionWithDefaults';

// Export the function to make it available for other components
export { createQuestionWithDefaults };

const Round1Questions = () => {
  const { categories, addCategory, removeCategory, setCategories, addQuestion, removeQuestion } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
  
  useEffect(() => {
    // Filter categories for this round
    const roundCategories = categories.filter(cat => cat.round === GameRound.ROUND_ONE);
    
    if (roundCategories.length === 0) {
      // Create default category if none exists
      const defaultCategory: Category = {
        id: uuidv4(),
        name: 'Wiedza ogólna',
        round: GameRound.ROUND_ONE,
        questions: []
      };
      addCategory(defaultCategory);
      setSelectedCategory(defaultCategory.id);
    } else {
      setSelectedCategory(roundCategories[0].id);
    }
  }, []);
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast.error('Podaj nazwę kategorii');
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName,
      round: GameRound.ROUND_ONE,
      questions: []
    };
    
    addCategory(newCategory);
    setNewCategoryName('');
    setSelectedCategory(newCategory.id);
    
    toast.success(`Kategoria "${newCategory.name}" została dodana`);
  };
  
  const handleRemoveCategory = (categoryId: string) => {
    if (!categoryId) return;
    removeCategory(categoryId);
    setSelectedCategory(null);
    toast.success('Kategoria została usunięta');
  };
  
  const handleAddQuestion = () => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    
    if (!newQuestionText.trim()) {
      toast.error('Wypełnij treść pytania');
      return;
    }
    
    if (!newAnswerText.trim()) {
      toast.error('Wypełnij odpowiedź');
      return;
    }
    
    const newQuestion = createQuestionWithDefaults({
      text: newQuestionText,
      correctAnswer: newAnswerText,
      categoryId: selectedCategory,
      category: categories.find(c => c.id === selectedCategory)?.name, 
      difficulty: difficultyLevel
    });
    
    addQuestion(selectedCategory, newQuestion);
    
    setNewQuestionText('');
    setNewAnswerText('');
    
    toast.success('Pytanie zostało dodane');
  };
  
  const handleRemoveQuestion = (questionId: string) => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    
    removeQuestion(selectedCategory, questionId);
    toast.success('Pytanie zostało usunięte');
  };
  
  const categoryQuestions = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)?.questions || []
    : [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Management */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Kategorie</h3>
        
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nazwa nowej kategorii"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-black/40 border-gray-700 text-white"
            />
            <Button onClick={handleAddCategory}>Dodaj</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {categories
            .filter(cat => cat.round === GameRound.ROUND_ONE)
            .map(category => (
              <div
                key={category.id}
                className={`p-3 rounded-md bg-black/30 border ${
                  selectedCategory === category.id ? 'border-neon-blue' : 'border-gray-700'
                } text-white cursor-pointer`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex justify-between items-center">
                  {category.name}
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCategory(category.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Question Management */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Pytania</h3>
        
        {selectedCategory ? (
          <>
            <div className="mb-4">
              <Label>Treść pytania</Label>
              <Textarea
                placeholder="Wpisz treść pytania"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="bg-black/40 border-gray-700 text-white resize-none"
              />
            </div>
            
            <div className="mb-4">
              <Label>Poprawna odpowiedź</Label>
              <Input
                type="text"
                placeholder="Wpisz poprawną odpowiedź"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                className="bg-black/40 border-gray-700 text-white"
              />
            </div>
            
            <div className="mb-4">
              <Label>Poziom trudności</Label>
              <Select
                value={String(difficultyLevel)}
                onValueChange={(value) => setDifficultyLevel(Number(value))}
              >
                <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Łatwe</SelectItem>
                  <SelectItem value="2">2 - Średnie</SelectItem>
                  <SelectItem value="3">3 - Trudne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddQuestion} className="w-full">Dodaj pytanie</Button>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2 text-white">Lista pytań</h4>
              
              {categoryQuestions.length === 0 ? (
                <p className="text-white/60">Brak pytań w tej kategorii.</p>
              ) : (
                <div className="space-y-2">
                  {categoryQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 rounded-md bg-black/20 border border-gray-700 text-white"
                    >
                      <p className="font-semibold">{question.text}</p>
                      <p className="text-sm text-green-400 mt-1">Odp: {question.correctAnswer}</p>
                      <p className="text-xs text-gray-400 mt-1">Trudność: {question.difficulty}</p>
                      <div className="mt-2 flex justify-end">
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRemoveQuestion(question.id)}
                        >
                          <Trash2 size={14} className="mr-1" /> Usuń
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-white/60">Wybierz kategorię, aby wyświetlić pytania.</p>
        )}
      </div>
    </div>
  );
};

export default Round1Questions;
