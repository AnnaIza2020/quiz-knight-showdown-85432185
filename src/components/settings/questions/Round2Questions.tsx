
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
import { Plus, Star, Edit, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Round2Question {
  id: string;
  question: string;
  answer: string;
}

type FormValues = {
  question: string;
  answer: string;
};

const Round2Questions = () => {
  const { categories, addCategory } = useGameContext();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      question: '',
      answer: '',
    }
  });
  
  const handleImportQuestions = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.csv';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Tutaj logika importu pytań z pliku
          toast.success('Import pytań rozpoczęty');
          // Dodać faktyczną logikę importu
        } catch (error) {
          console.error('Błąd podczas importu pytań:', error);
          toast.error('Nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
  
  const handleSubmit = (values: FormValues) => {
    // Sprawdź czy runda 2 ma już swoją kategorię
    let round2Category = categories.find(cat => cat.name === 'R2_5SECONDS');
    
    if (!round2Category) {
      // Jeśli nie istnieje, utwórz nową kategorię dla rundy 2
      const newCategory = {
        id: uuidv4(),
        name: 'R2_5SECONDS',
        questions: []
      };
      addCategory(newCategory);
      round2Category = newCategory;
    }
    
    // Tu dodać logikę dodawania pytania do kategorii
    
    console.log('Dodaję pytanie do rundy 2:', values);
    toast.success('Pytanie zostało dodane');
    setShowAddForm(false);
    form.reset();
  };
  
  // Testowe pytania dla prezentacji
  const mockQuestions: Round2Question[] = [
    {
      id: "r2q1",
      question: "Wymień 3 europejskie stolice",
      answer: "np. Paryż, Berlin, Madryt, Londyn, Rzym, Warszawa"
    },
    {
      id: "r2q2",
      question: "Wymień 3 kolory podstawowe",
      answer: "Czerwony, niebieski, żółty"
    },
    {
      id: "r2q3",
      question: "Wymień 3 planety Układu Słonecznego",
      answer: "np. Merkury, Wenus, Ziemia, Mars, Jowisz, Saturn, Uran, Neptun"
    }
  ];
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-lg mb-1">Pytania Rundy 2: 5 Sekund</h3>
            <p className="text-sm text-gray-400">
              W tej rundzie pytania są krótkie i wymagają szybkiej odpowiedzi w 5 sekund.
              Zwykle mają format: "Wymień 3..."
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleImportQuestions}
          >
            <Upload size={16} /> Importuj z pliku
          </Button>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={`${showAddForm ? 'bg-gray-600' : 'bg-neon-blue'} gap-2`}
          >
            <Plus size={16} /> {showAddForm ? 'Anuluj' : 'Dodaj pytanie'}
          </Button>
        </div>
        
        {showAddForm && (
          <div className="bg-black/30 border border-gray-700 rounded-md p-4 mb-6">
            <h4 className="text-base font-medium mb-4">Nowe pytanie - Runda 2: 5 Sekund</h4>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treść pytania</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="np. Wymień 3 marki samochodów..."
                          className="bg-black/50 border border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Przykładowe odpowiedzi (opcjonalnie)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="np. Toyota, BMW, Mercedes, Audi, Volkswagen..."
                          className="bg-black/50 border border-gray-700 text-white resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-700 text-white"
                  >
                    Anuluj
                  </Button>
                  <Button type="submit" className="bg-neon-blue hover:bg-neon-blue/80">
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
              <div className="flex justify-between items-center px-4 py-3">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{question.question}</h4>
                  {question.answer && (
                    <p className="text-gray-400 text-sm">Przykłady: {question.answer}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30">
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {mockQuestions.length === 0 && (
            <p className="text-gray-400 text-center py-6">
              Brak pytań w rundzie 5 sekund. Dodaj pierwsze pytanie używając przycisku "Dodaj pytanie".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Round2Questions;
