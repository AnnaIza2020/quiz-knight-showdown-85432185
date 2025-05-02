
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
import { useForm } from 'react-hook-form';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface WheelCategory {
  id: string;
  name: string;
  color: string;
}

type FormValues = {
  category: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

const WHEEL_COLORS = [
  { name: 'red', value: 'bg-red-600' },
  { name: 'blue', value: 'bg-blue-600' },
  { name: 'green', value: 'bg-green-600' },
  { name: 'yellow', value: 'bg-yellow-600' },
  { name: 'purple', value: 'bg-purple-600' },
  { name: 'pink', value: 'bg-pink-600' },
  { name: 'orange', value: 'bg-orange-600' },
  { name: 'teal', value: 'bg-teal-600' },
];

const Round3Questions = () => {
  const { categories, addCategory, removeCategory } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-blue-600');
  const [showAddForm, setShowAddForm] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [selectedWheelCategory, setSelectedWheelCategory] = useState('');
  
  // Filtrowanie kategorii tylko dla Rundy 3
  const wheelCategories = categories
    .filter(cat => cat.name.startsWith('R3_'))
    .map(cat => ({
      id: cat.id,
      name: cat.name.replace('R3_', ''),
      color: cat.questions[0]?.difficulty === 1 ? 'bg-red-600' : 
             cat.questions[0]?.difficulty === 2 ? 'bg-blue-600' : 
             cat.questions[0]?.difficulty === 3 ? 'bg-green-600' : 
             cat.questions[0]?.difficulty === 4 ? 'bg-yellow-600' : 
             cat.questions[0]?.difficulty === 5 ? 'bg-purple-600' : 
             cat.questions[0]?.difficulty === 6 ? 'bg-pink-600' : 
             cat.questions[0]?.difficulty === 7 ? 'bg-orange-600' : 'bg-teal-600'
    }));
  
  const form = useForm<FormValues>({
    defaultValues: {
      category: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }
  });
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Nazwa kategorii koła nie może być pusta');
      return;
    }
    
    const categoryExists = categories.some(cat => 
      cat.name.toLowerCase() === `R3_${newCategoryName.trim().toUpperCase()}`
    );
    
    if (categoryExists) {
      toast.error('Kategoria o takiej nazwie już istnieje w Kole Fortuny');
      return;
    }
    
    // Ustalenie indeksu koloru (1-8) bazując na wybranym kolorze
    const colorIndex = WHEEL_COLORS.findIndex(c => c.value === newCategoryColor) + 1;
    
    addCategory({
      id: uuidv4(),
      name: `R3_${newCategoryName.trim().toUpperCase()}`,
      questions: [{
        id: uuidv4(),
        category: `R3_${newCategoryName.trim().toUpperCase()}`,
        difficulty: colorIndex, // Używamy difficulty jako identyfikatora koloru
        question: '', // Placeholder
        answer: '',
      }]
    });
    
    setNewCategoryName('');
    toast.success(`Dodano kategorię do koła: ${newCategoryName.toUpperCase()}`);
  };
  
  const handleRemoveCategory = (categoryId: string) => {
    removeCategory(categoryId);
    toast.success('Kategoria została usunięta z koła');
  };
  
  const handleSubmit = (values: FormValues) => {
    // Tu dodać logikę zapisywania pytań dla koła fortuny
    console.log('Zapisuję pytanie dla koła:', values);
    toast.success('Pytanie zostało dodane do koła');
    setShowAddForm(false);
    form.reset();
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  // Testowe pytania dla prezentacji
  const mockQuestions = [
    {
      id: "r3q1",
      category: "HISTORIA",
      question: "Kto był pierwszym królem Polski?",
      options: ["Mieszko I", "Bolesław Chrobry", "Władysław Łokietek", "Kazimierz Wielki"],
      answer: "Bolesław Chrobry"
    },
    {
      id: "r3q2",
      category: "GEOGRAFIA",
      question: "Które z tych miast jest stolicą Australii?",
      options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      answer: "Canberra"
    }
  ];
  
  return (
    <div>
      {/* Zarządzanie kategoriami koła */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">Kategorie Koła Fortuny</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {wheelCategories.map((category) => (
            <div 
              key={category.id}
              className={`${category.color} rounded-lg p-3 flex justify-between items-center`}
            >
              <span className="font-medium">{category.name}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-black/20"
                onClick={() => handleRemoveCategory(category.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          
          {wheelCategories.length === 0 && (
            <p className="text-gray-400 text-sm col-span-3">
              Brak kategorii w kole. Dodaj kategorie poniżej.
            </p>
          )}
        </div>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Nazwa nowej kategorii koła"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="bg-black/50 border border-gray-700 text-white"
          />
          
          <select 
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="bg-black/50 border border-gray-700 text-white rounded-md px-3"
          >
            <option value="bg-red-600">Czerwony</option>
            <option value="bg-blue-600">Niebieski</option>
            <option value="bg-green-600">Zielony</option>
            <option value="bg-yellow-600">Żółty</option>
            <option value="bg-purple-600">Fioletowy</option>
            <option value="bg-pink-600">Różowy</option>
            <option value="bg-orange-600">Pomarańczowy</option>
            <option value="bg-teal-600">Turkusowy</option>
          </select>
          
          <Button onClick={handleAddCategory} className="bg-neon-purple hover:bg-neon-purple/80 gap-1">
            <Plus size={16} /> Dodaj
          </Button>
        </div>
      </div>
      
      {/* Dodawanie nowego pytania do koła */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Pytania Koła Fortuny</h3>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={`${showAddForm ? 'bg-gray-600' : 'bg-neon-purple'} gap-2`}
          >
            <Plus size={16} /> {showAddForm ? 'Anuluj' : 'Dodaj pytanie'}
          </Button>
        </div>
        
        {showAddForm && (
          <div className="bg-black/30 border border-gray-700 rounded-md p-4 mb-6">
            <h4 className="text-base font-medium mb-4">Nowe pytanie - Koło Fortuny</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategoria koła</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="w-full bg-black/50 border border-gray-700 text-white rounded-md px-3 py-2"
                        >
                          <option value="" disabled>Wybierz kategorię koła</option>
                          {wheelCategories.map(cat => (
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
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treść pytania</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Wpisz treść pytania dla koła fortuny..."
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
                  <Button type="submit" className="bg-neon-purple hover:bg-neon-purple/80">
                    Zapisz pytanie
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        
        {/* Lista pytań */}
        <div className="space-y-4">
          {mockQuestions.map((question) => (
            <div 
              key={question.id}
              className="bg-black/40 border border-gray-800 rounded-lg overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-2">
                <Badge className="bg-purple-600 text-white">
                  {question.category}
                </Badge>
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
              Brak pytań dla koła fortuny. Dodaj pierwsze pytanie używając przycisku "Dodaj pytanie".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Round3Questions;
