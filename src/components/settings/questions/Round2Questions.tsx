import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Category, Question, GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Trash2 } from 'lucide-react';

const Round2Questions = () => {
  const { categories, addCategory, removeCategory, setCategories } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  
  // Load categories for this round
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = () => {
    // Filter categories for the current round
    const roundCategories = categories.filter(cat => cat.round === GameRound.ROUND_TWO);
    
    // If there are no categories, create a default one
    if (roundCategories.length === 0) {
      const defaultCategory: Category = {
        id: uuidv4(),
        name: 'Pytania 5 sekund',
        round: GameRound.ROUND_TWO,
        questions: []
      };
      addCategory(defaultCategory);
      setSelectedCategory(defaultCategory.id);
    } else {
      setSelectedCategory(roundCategories[0].id);
    }
  };
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast.error('Podaj nazwę kategorii');
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName,
      round: GameRound.ROUND_TWO, // Set the round explicitly
      questions: []
    };
    
    addCategory(newCategory);
    setNewCategoryName('');
    setSelectedCategory(newCategory.id);
    
    toast.success(`Kategoria "${newCategory.name}" została dodana`);
  };
  
  const handleRemoveCategory = (categoryId: string) => {
    removeCategory(categoryId);
    setSelectedCategory(null);
    toast.success('Kategoria została usunięta');
  };
  
  const handleAddQuestion = () => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    if (!newQuestionText.trim() || !newAnswerText.trim()) {
      toast.error('Wypełnij treść pytania i odpowiedź');
      return;
    }
    
    const newQuestion: Question = {
      id: uuidv4(),
      text: newQuestionText,
      correctAnswer: newAnswerText,
      categoryId: selectedCategory,
      category: categories.find(cat => cat.id === selectedCategory)?.name, // Added for backward compatibility
      difficulty: 1,
      question: newQuestionText, // For backward compatibility
      answer: newAnswerText, // For backward compatibility
    };
    
    // Find the category and add the question
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory) {
        return { ...cat, questions: [...cat.questions, newQuestion] };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    setNewQuestionText('');
    setNewAnswerText('');
    
    toast.success('Pytanie zostało dodane');
  };
  
  const handleRemoveQuestion = (questionId: string) => {
    if (!selectedCategory) {
      toast.error('Wybierz kategorię');
      return;
    }
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory) {
        const updatedQuestions = cat.questions.filter(q => q.id !== questionId);
        return { ...cat, questions: updatedQuestions };
      }
      return cat;
    });
    
    setCategories(updatedCategories);
    toast.success('Pytanie zostało usunięte');
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    
    if (result.type === 'CATEGORY') {
      const items = Array.from(categories);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      // Update the state
      setCategories(items);
    } else if (result.type === 'QUESTION') {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (!category) return;
      
      const questions = Array.from(category.questions);
      const [reorderedItem] = questions.splice(result.source.index, 1);
      questions.splice(result.destination.index, 0, reorderedItem);
      
      // Update the state
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedCategory) {
          return { ...cat, questions: questions };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
    }
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
          
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {categories
                  .filter(cat => cat.round === GameRound.ROUND_TWO)
                  .map((category, index) => (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-3 rounded-md bg-black/30 border border-gray-700 text-white cursor-move ${selectedCategory === category.id ? 'border-neon-blue' : ''}`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="flex justify-between items-center">
                            {category.name}
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-500/10"
                              onClick={() => handleRemoveCategory(category.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
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
              
              <Button onClick={handleAddQuestion} className="w-full">Dodaj pytanie</Button>
              
              <Accordion type="multiple" className="mt-6">
                <Droppable droppableId="questions" type="QUESTION">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                      {categories
                        .find(cat => cat.id === selectedCategory)?.questions
                        .map((question, index) => (
                          <Draggable key={question.id} draggableId={question.id} index={index}>
                            {(provided) => (
                              <AccordionItem 
                                value={question.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border-b border-gray-700 last:border-none"
                              >
                                <AccordionTrigger className="text-left text-white">
                                  {question.text}
                                </AccordionTrigger>
                                <AccordionContent className="text-white/80">
                                  <p className="mb-2">Odpowiedź: {question.correctAnswer}</p>
                                  <Button 
                                    variant="link"
                                    size="sm"
                                    className="text-red-500 hover:text-red-500/80"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                  >
                                    Usuń pytanie
                                  </Button>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </Accordion>
            </>
          ) : (
            <p className="text-white/60">Wybierz kategorię, aby wyświetlić pytania.</p>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Round2Questions;
