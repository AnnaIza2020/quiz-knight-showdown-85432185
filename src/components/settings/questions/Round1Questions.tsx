import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/context/GameContext';
import { Category, Question, GameRound } from '@/types/game-types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Round1Questions = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [newOptionText, setNewOptionText] = useState('');
  const { categories, addCategory, removeCategory, setCategories, addQuestion } = useGameContext();
  
  useEffect(() => {
    // Filter categories for ROUND_ONE when component mounts
    const roundOneCategories = categories.filter(cat => cat.round === GameRound.ROUND_ONE);
    setCategories(roundOneCategories);
  }, []);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast.error('Podaj nazwę kategorii');
      return;
    }
    
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName,
      round: GameRound.ROUND_ONE, // Set the round explicitly
      questions: []
    };
    
    addCategory(newCategory);
    setNewCategoryName('');
    toast({
      title: 'Kategoria dodana!',
      description: `Kategoria "${newCategory.name}" została dodana.`,
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    removeCategory(categoryId);
    toast({
      title: 'Kategoria usunięta!',
      description: 'Kategoria została usunięta.',
    });
  };

  const handleAddOption = () => {
    if (newOptionText.trim() === '') return;
    setNewOptions([...newOptions, newOptionText]);
    setNewOptionText('');
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...newOptions];
    updatedOptions.splice(index, 1);
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = () => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    if (newQuestionText.trim() === '') {
      toast.error('Podaj treść pytania');
      return;
    }
    if (newAnswerText.trim() === '') {
      toast.error('Podaj poprawną odpowiedź');
      return;
    }
    
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: newQuestionText,
      correctAnswer: newAnswerText,
      categoryId: selectedCategory,
      category: categories.find(cat => cat.id === selectedCategory)?.name, // Added for backward compatibility
      difficulty: parseInt(difficulty),
      options: newOptions,
      question: newQuestionText, // For backward compatibility
      answer: newAnswerText, // For backward compatibility
    };
    
    addQuestion(selectedCategory, newQuestion);
    setNewQuestionText('');
    setNewAnswerText('');
    setNewOptions([]);
    toast({
      title: 'Pytanie dodane!',
      description: 'Pytanie zostało dodane do kategorii.',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dodawanie kategorii */}
      <Card>
        <CardHeader>
          <CardTitle>Dodaj kategorię</CardTitle>
          <CardDescription>Dodaj nową kategorię do rundy 1</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="category">Nazwa kategorii</Label>
            <Input
              id="category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nazwa kategorii"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddCategory} className="w-full">
            <PlusCircle size={16} className="mr-2" />
            Dodaj kategorię
          </Button>
        </CardFooter>
      </Card>

      {/* Lista kategorii */}
      <Card>
        <CardHeader>
          <CardTitle>Lista kategorii</CardTitle>
          <CardDescription>Lista kategorii dla rundy 1</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.length > 0 ? (
            <ul className="list-none pl-0">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>{category.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Brak kategorii. Dodaj kategorię powyżej.</p>
          )}
        </CardContent>
      </Card>

      {/* Dodawanie pytania */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Dodaj pytanie</CardTitle>
          <CardDescription>Dodaj nowe pytanie do wybranej kategorii</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wybór kategorii */}
            <div className="grid gap-2">
              <Label htmlFor="select">Wybierz kategorię</Label>
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Poziom trudności */}
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Poziom trudności</Label>
              <Select onValueChange={(value) => setDifficulty(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz poziom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Łatwy</SelectItem>
                  <SelectItem value="2">Średni</SelectItem>
                  <SelectItem value="3">Trudny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Treść pytania */}
          <div className="grid gap-2">
            <Label htmlFor="question">Treść pytania</Label>
            <Textarea
              id="question"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Treść pytania"
            />
          </div>

          {/* Poprawna odpowiedź */}
          <div className="grid gap-2">
            <Label htmlFor="answer">Poprawna odpowiedź</Label>
            <Input
              id="answer"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder="Poprawna odpowiedź"
            />
          </div>

          {/* Opcje odpowiedzi */}
          <div className="grid gap-2">
            <Label>Opcje odpowiedzi</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Dodaj opcję"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
              />
              <Button type="button" size="sm" onClick={handleAddOption}>
                Dodaj
              </Button>
            </div>
            {newOptions.length > 0 && (
              <ul className="list-none pl-0">
                {newOptions.map((option, index) => (
                  <li key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                    <span>{option}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddQuestion} className="w-full">
            <PlusCircle size={16} className="mr-2" />
            Dodaj pytanie
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Round1Questions;
