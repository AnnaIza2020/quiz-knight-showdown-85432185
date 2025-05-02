
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Plus, Star, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';
import { useForm } from 'react-hook-form';
import { GameRound, Question } from '@/types/game-types';
import { v4 as uuidv4 } from 'uuid';

type FormValues = {
  category: string;
  difficulty: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

const Round1Questions = () => {
  const { categories, addCategory, removeCategory } = useGameContext();
  const [newCategory, setNewCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('wszystkie');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  
  // Filtrowanie kategorii tylko dla Rundy 1
  const round1Categories = categories.filter(cat => !cat.name.startsWith('R2_') && !cat.name.startsWith('R3_'));
  
  const form = useForm<FormValues>({
    defaultValues: {
      category: '',
      difficulty: 5,
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }
  });
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Nazwa kategorii nie może być pusta');
      return;
    }
    
    const categoryExists = categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase());
    if (categoryExists) {
      toast.error('Kategoria o takiej nazwie już istnieje');
      return;
    }
    
    addCategory({
      id: uuidv4(),
      name: newCategory.toUpperCase(),
      questions: []
    });
    
    setNewCategory('');
    toast.success(`Dodano kategorię: ${newCategory.toUpperCase()}`);
  };
  
  const handleSubmit = (values: FormValues) => {
    // Tutaj można dodać walidację i zapisywanie pytania
    console.log('Submitted question:', values);
    toast.success('Pytanie zostało dodane');
    setShowAddForm(false);
    form.reset();
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  // Testowe pytania dla prezentacji
  const mockQuestions: Question[] = [
    {
      id: "q1",
      category: "MEMY",
      difficulty: 5,
      question: "Z jakiego kraju pochodzi mem \"Stonoga\"?",
      answer: "Polska",
      options: ["Polska", "Czechy", "Niemcy", "USA"],
    },
    {
      id: "q2",
      category: "TWITCH",
      difficulty: 10,
      question: "Kto jest najbardziej popularnym polskim streamerem na Twitchu?",
      answer: "xQc",
      options: ["Xayoo", "xQc", "Pago", "Rybson"],
    },
  ];
  
  return (
    <div>
      {/* Zarządzanie kategoriami */}
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3">Zarządzanie kategoriami - Runda 1</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {round1Categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Badge className={`bg-purple-600 text-white flex items-center gap-1 pl-2 pr-1 py-1`}>
                {category.name}
                <button 
                  className="hover:bg-black/20 rounded-full p-0.5"
                  onClick={() => removeCategory(category.id)}
                >
                  <Trash2 size={14} />
                </button>
              </Badge>
            </div>
          ))}
          
          {round1Categories.length === 0 && (
            <p className="text-gray-400 text-sm">Brak kategorii. Dodaj pierwszą kategorię poniżej.</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Nazwa nowej kategorii"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-black/50 border border-gray-700 text-white"
          />
          <Button onClick={handleAddCategory} size="icon" className="bg-neon-pink hover:bg-neon-pink/80">
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      {/* Dodawanie nowego pytania */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Pytania - Runda 1</h3>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={`${showAddForm ? 'bg-gray-600' : 'bg-neon-pink'} gap-2`}
          >
            <Plus size={16} /> {showAddForm ? 'Anuluj' : 'Dodaj pytanie'}
          </Button>
        </div>
        
        {showAddForm && (
          <div className="bg-black/30 border border-gray-700 rounded-md p-4 mb-6">
            <h4 className="text-base font-medium mb-4">Nowe pytanie - Runda 1</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategoria</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full bg-black/50 border border-gray-700 text-white rounded-md px-3 py-2"
                          >
                            <option value="" disabled>Wybierz kategorię</option>
                            {round1Categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trudność (punkty)</FormLabel>
                        <div className="flex gap-2">
                          {[5, 10, 15, 20].map(value => (
                            <Button
                              key={value}
                              type="button"
                              variant={field.value === value ? "default" : "outline"}
                              className={field.value === value ? "bg-neon-pink" : "border-gray-700 text-white"}
                              onClick={() => field.onChange(value)}
                            >
                              {value}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treść pytania</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Wpisz treść pytania..."
                          className="bg-black/50 border border-gray-700 text-white resize-none min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Warianty odpowiedzi</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctAnswerIndex === index}
                          onChange={() => setCorrectAnswerIndex(index)}
                          className="w-4 h-4"
                        />
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Odpowiedź ${index + 1}`}
                          className="bg-black/50 border border-gray-700 text-white flex-1"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Zaznacz przycisk radio przy poprawnej odpowiedzi
                  </p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-700 text-white"
                  >
                    Anuluj
                  </Button>
                  <Button type="submit" className="bg-neon-pink hover:bg-neon-pink/80">
                    Zapisz pytanie
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        
        {/* Lista pytań */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-base font-medium">Lista pytań Rundy 1</h4>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-black/50 border border-gray-700 text-white rounded-md px-3 py-1 text-sm"
            >
              <option value="wszystkie">Wszystkie kategorie</option>
              {round1Categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-4">
            {mockQuestions.map((question) => (
              <div 
                key={question.id}
                className="bg-black/40 border border-gray-800 rounded-lg overflow-hidden"
              >
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="flex gap-2">
                    <QuestionDifficultyBadge difficulty={question.difficulty} />
                    <Badge className="bg-purple-600 text-white">
                      {question.category}
                    </Badge>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Star size={18} className="text-gray-400" />
                  </Button>
                </div>
                
                <div className="px-4 py-3">
                  <h4 className="text-white font-medium mb-2">{question.question}</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {question.options?.map((option, index) => (
                      <div 
                        key={index}
                        className={`p-2 rounded ${option === question.answer ? 'bg-green-900/30 border border-green-600/50' : 'bg-black/50 border border-gray-700'}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 p-2 bg-black/30">
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30">
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {mockQuestions.length === 0 && (
              <p className="text-gray-400 text-center py-6">
                Brak pytań w tej rundzie. Dodaj pierwsze pytanie używając przycisku "Dodaj pytanie".
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Round1Questions;
