
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Question, GameRound } from '@/types/game-types';
import { v4 as uuidv4 } from 'uuid';

interface QuestionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  categories: Category[];
  editingQuestion: Question | null;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  open,
  onClose,
  onSave,
  categories,
  editingQuestion
}) => {
  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    correctAnswer: '',
    categoryId: '',
    difficulty: 1,
    options: [],
    imageUrl: '', // Changed from image_url to imageUrl
  });

  const [roundFilter, setRoundFilter] = useState<GameRound | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when editing a question
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        ...editingQuestion,
        // Ensure we have the required fields
        id: editingQuestion.id,
        text: editingQuestion.text || '',
        correctAnswer: editingQuestion.correctAnswer || editingQuestion.answer || '',
        categoryId: editingQuestion.categoryId || '',
        difficulty: editingQuestion.difficulty || 1,
        options: editingQuestion.options || [],
        imageUrl: editingQuestion.imageUrl || editingQuestion.image_url || '', // Handle both field names
      });
      
      // Set the round filter based on the category's round
      if (editingQuestion.categoryId) {
        const category = categories.find(c => c.id === editingQuestion.categoryId);
        if (category && category.round) {
          setRoundFilter(category.round as GameRound);
        }
      }
    } else {
      // Reset form for new question
      resetForm();
    }
  }, [editingQuestion, categories]);

  const resetForm = () => {
    setFormData({
      text: '',
      correctAnswer: '',
      categoryId: '',
      difficulty: 1,
      options: [],
      imageUrl: '', // Changed from image_url to imageUrl
    });
    setRoundFilter(null);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert string to number for difficulty
    const processedValue = name === 'difficulty' ? parseInt(value, 10) : value;
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // When category changes, update options based on the round
    if (name === 'categoryId') {
      const selectedCategory = categories.find(c => c.id === value);
      if (selectedCategory && selectedCategory.round) {
        setRoundFilter(selectedCategory.round as GameRound);
      }
    }
  };

  const handleRoundChange = (value: string) => {
    const round = value as GameRound;
    setRoundFilter(round);
    // Clear category selection when round changes
    setFormData(prev => ({ ...prev, categoryId: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.text) {
      newErrors.text = 'Treść pytania jest wymagana';
    }
    
    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Odpowiedź jest wymagana';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Wybierz kategorię';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const questionToSave: Question = {
        id: formData.id || uuidv4(),
        text: formData.text || '',
        correctAnswer: formData.correctAnswer || '',
        categoryId: formData.categoryId || '',
        difficulty: formData.difficulty || 1,
        options: formData.options || [],
        imageUrl: formData.imageUrl || undefined,
        // For backward compatibility
        image_url: formData.imageUrl || undefined,
        category: categories.find(c => c.id === formData.categoryId)?.name || '',
      };
      
      onSave(questionToSave);
      resetForm();
      onClose();
    }
  };

  // Filter categories by selected round
  const filteredCategories = roundFilter !== null 
    ? categories.filter(category => category.round === roundFilter)
    : categories;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0c0e1a] border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? 'Edytuj pytanie' : 'Dodaj nowe pytanie'}</DialogTitle>
          <DialogDescription>
            {editingQuestion 
              ? 'Zmodyfikuj istniejące pytanie w bazie pytań.' 
              : 'Utwórz nowe pytanie i przypisz je do odpowiedniej kategorii.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Round selection (for filtering categories) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="round" className="text-right">
              Runda
            </Label>
            <div className="col-span-3">
              <Select
                value={roundFilter?.toString() || ''}
                onValueChange={handleRoundChange}
              >
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue placeholder="Wybierz rundę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GameRound.ROUND_ONE}>Runda 1</SelectItem>
                  <SelectItem value={GameRound.ROUND_TWO}>Runda 2</SelectItem>
                  <SelectItem value={GameRound.ROUND_THREE}>Runda 3</SelectItem>
                </SelectContent>
              </Select>
              {errors.round && <p className="text-red-400 text-sm mt-1">{errors.round}</p>}
            </div>
          </div>
          
          {/* Category selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryId" className="text-right">
              Kategoria
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.categoryId || ''}
                onValueChange={(value) => handleSelectChange('categoryId', value)}
                disabled={roundFilter === null}
              >
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue placeholder={roundFilter === null ? "Najpierw wybierz rundę" : "Wybierz kategorię"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
            </div>
          </div>
          
          {/* Question text */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Treść pytania
            </Label>
            <div className="col-span-3">
              <Textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Wpisz treść pytania..."
                className="bg-black/30 border-gray-700 text-white min-h-[100px]"
              />
              {errors.text && <p className="text-red-400 text-sm mt-1">{errors.text}</p>}
            </div>
          </div>
          
          {/* Correct answer */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="correctAnswer" className="text-right">
              Poprawna odpowiedź
            </Label>
            <div className="col-span-3">
              <Input
                id="correctAnswer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                placeholder="Wpisz poprawną odpowiedź..."
                className="bg-black/30 border-gray-700 text-white"
              />
              {errors.correctAnswer && <p className="text-red-400 text-sm mt-1">{errors.correctAnswer}</p>}
            </div>
          </div>
          
          {/* Difficulty */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Poziom trudności
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.difficulty?.toString() || '1'}
                onValueChange={(value) => handleSelectChange('difficulty', value)}
              >
                <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Poziom 1 (Łatwy)</SelectItem>
                  <SelectItem value="2">Poziom 2 (Średni)</SelectItem>
                  <SelectItem value="3">Poziom 3 (Trudny)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Image URL (optional) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              URL obrazu (opcjonalnie)
            </Label>
            <div className="col-span-3">
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://przyklad.pl/obraz.png"
                className="bg-black/30 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handleSubmit} className="bg-neon-green hover:bg-neon-green/80 text-black">
            {editingQuestion ? 'Zapisz zmiany' : 'Dodaj pytanie'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
