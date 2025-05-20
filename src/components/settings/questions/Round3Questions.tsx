import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { Category } from '@/types/game-types';
import { createQuestionWithDefaults } from '@/utils/createQuestionWithDefaults';

const questionSchema = z.object({
  questionText: z.string().min(1, { message: 'Pytanie jest wymagane' }),
  answerText: z.string().min(1, { message: 'Odpowiedź jest wymagana' }),
  category: z.string().min(1, { message: 'Kategoria jest wymagana' }),
  difficulty: z.string().min(1, { message: 'Poziom trudności jest wymagany' }),
});

export { createQuestionWithDefaults };

const Round3Questions = () => {
  const { categories, addCategory, addQuestion, removeQuestion, removeCategory } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Form configuration
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      answerText: '',
      category: '',
      difficulty: '1',
    },
  });
  
  const { handleSubmit, control, reset, setValue } = form;
  
  // Local state for new question options
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  
  // Add category
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast.error('Podaj nazwę kategorii');
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName,
      round: 3,
      questions: []
    };
    
    addCategory(newCategory);
    setNewCategoryName('');
    toast.success(`Dodano kategorię: ${newCategory.name}`);
  };
  
  // Fix question creation
  const handleAddQuestion = () => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    
    if (!newQuestionText.trim() || !newAnswerText.trim()) {
      toast.error('Wypełnij pytanie i odpowiedź');
      return;
    }
    
    const newQuestion = createQuestionWithDefaults({
      text: newQuestionText,
      correctAnswer: newAnswerText,
      categoryId: selectedCategory,
      category: categories.find(cat => cat.id === selectedCategory)?.name, // Added for backward compatibility
      difficulty: parseInt(difficulty),
      question: newQuestionText, // For backward compatibility
      answer: newAnswerText, // For backward compatibility
    });
    
    addQuestion(selectedCategory, newQuestion);
    
    setNewQuestionText('');
    setNewAnswerText('');
    setDifficulty('1');
    setSelectedCategory('');
    
    toast.success('Pytanie dodane pomyślnie!');
  };
  
  // Remove question
  const handleRemoveQuestion = (categoryId: string, questionId: string) => {
    removeQuestion(categoryId, questionId);
    toast.success('Pytanie usunięte pomyślnie!');
  };
  
  // Remove category
  const handleRemoveCategory = (categoryId: string) => {
    removeCategory(categoryId);
    toast.success('Kategoria usunięta pomyślnie!');
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Category Section */}
      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Dodaj Kategorię</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryName" className="text-sm text-white/70">Nazwa kategorii</Label>
          <Input
            id="categoryName"
            className="bg-black/50 border-white/20 text-white"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Wpisz nazwę kategorii"
          />
          <Button onClick={handleAddCategory} className="bg-neon-blue text-black hover:bg-neon-blue/80">
            Dodaj kategorię
          </Button>
        </div>
      </div>
      
      {/* Add Question Section */}
      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Dodaj Pytanie</h3>
        <form onSubmit={handleSubmit(handleAddQuestion)} className="flex flex-col gap-4">
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wybierz kategorię</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="questionText" className="text-sm text-white/70">Treść pytania</Label>
            <Input
              id="questionText"
              className="bg-black/50 border-white/20 text-white"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Wpisz treść pytania"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="answerText" className="text-sm text-white/70">Poprawna odpowiedź</Label>
            <Input
              id="answerText"
              className="bg-black/50 border-white/20 text-white"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder="Wpisz poprawną odpowiedź"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="difficulty" className="text-sm text-white/70">Poziom trudności</Label>
            <Select onValueChange={setDifficulty} defaultValue={difficulty}>
              <SelectTrigger className="bg-black/50 border-white/20 text-white">
                <SelectValue placeholder="Wybierz poziom trudności" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Łatwy</SelectItem>
                <SelectItem value="2">Średni</SelectItem>
                <SelectItem value="3">Trudny</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/80">
            Dodaj pytanie
          </Button>
        </form>
      </div>
      
      {/* Categories and Questions List */}
      <div className="col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">Lista Kategorii i Pytań</h3>
        {categories.length === 0 ? (
          <p className="text-white/50">Brak kategorii. Dodaj kategorię powyżej.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-semibold text-white">{category.name}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-500/10"
                    onClick={() => handleRemoveCategory(category.id)}
                  >
                    Usuń kategorię
                  </Button>
                </div>
                
                {category.questions.length === 0 ? (
                  <p className="text-white/50">Brak pytań w tej kategorii.</p>
                ) : (
                  <ul className="space-y-2">
                    {category.questions.map((question) => (
                      <li key={question.id} className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                        <span className="text-white">{question.text}</span>
                        <div className="flex gap-2">
                          <span className="text-sm text-white/60">{question.correctAnswer}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-500/10"
                            onClick={() => handleRemoveQuestion(category.id, question.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Round3Questions;
