
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, Upload, Download, Trash2, Edit, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GameRound } from '@/types/game-types';

const CATEGORY_COLORS: Record<string, string> = {
  "WIEDZA OGÓLNA": "bg-blue-600",
  "MEMY": "bg-purple-600",
  "TRENDY": "bg-pink-600",
  "TWITCH": "bg-violet-600",
  "INTERNET": "bg-indigo-600",
  "CIEKAWOSTKI": "bg-cyan-600",
  "GRY": "bg-emerald-600",
  "FILMY": "bg-yellow-600", 
  "MUZYKA": "bg-red-600",
  "SPORT": "bg-green-600",
  "Technologia": "bg-teal-600",
  "Streaming": "bg-orange-600",
};

const QuestionDifficultyBadge = ({ difficulty }: { difficulty: number }) => {
  let color = "bg-gray-600";
  let label = "Nieznana";
  
  if (difficulty === 5) {
    color = "bg-green-600";
    label = "Łatwe (5 pkt)";
  } else if (difficulty === 10) {
    color = "bg-yellow-600";
    label = "Średnie (10 pkt)";
  } else if (difficulty === 15) {
    color = "bg-orange-600";
    label = "Trudne (15 pkt)";
  } else if (difficulty === 20) {
    color = "bg-red-600";
    label = "Ekstremalne (20 pkt)";
  }
  
  return (
    <Badge className={`${color} text-white text-xs`}>
      {label}
    </Badge>
  );
};

const SettingsQuestions = () => {
  const { categories, addCategory, removeCategory } = useGameContext();
  const [newCategory, setNewCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState('wszystkie');
  const [showUsed, setShowUsed] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddCategory = () => {
    if (!newCategory) return;
    
    addCategory({
      id: Math.random().toString(36).substring(2, 9),
      name: newCategory.toUpperCase(),
      questions: []
    });
    
    setNewCategory('');
  };
  
  // Mock data for questions
  const mockQuestions = [
    {
      id: "q1",
      category: "Technologia",
      difficulty: 5,
      question: "Co to jest HTML?",
      answer: "Język znaczników",
      options: ["Język programowania", "Rodzaj bazy danych", "Protokół internetowy", "Język znaczników"],
      round: GameRound.ROUND_ONE
    },
    {
      id: "q2",
      category: "MEMY",
      difficulty: 10,
      question: "Kto stworzył pierwszego cyfrowego mema?",
      answer: "Scott Fahlman",
      options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Scott Fahlman"],
      round: GameRound.ROUND_ONE
    },
    {
      id: "q3",
      category: "Streaming",
      difficulty: 5,
      question: "Z jakiego kraju pochodzi Twitch?",
      answer: "USA",
      options: ["USA", "Japonia", "Chiny", "Niemcy"],
      round: GameRound.ROUND_TWO
    }
  ];
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Zarządzanie Pytaniami</h2>
      <p className="text-white/60 text-sm mb-6">
        Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
      </p>
      
      {/* Category management */}
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3">Zarządzanie kategoriami pytań</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(CATEGORY_COLORS).map(([category, bgColor]) => (
            <div key={category} className="flex items-center">
              <Badge className={`${bgColor} text-white flex items-center gap-1 pl-2 pr-1 py-1`}>
                {category}
                <button className="hover:bg-black/20 rounded-full p-0.5">
                  <X size={14} />
                </button>
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Nazwa nowej kategorii"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-black/50 border border-gray-700 text-white"
          />
          <Button onClick={handleAddCategory} size="icon" className="bg-neon-blue hover:bg-neon-blue/80">
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      {/* Question tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="bg-black/30 w-full justify-start overflow-x-auto border-b border-gray-800">
          <TabsTrigger value="wszystkie" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue data-[state=active]:shadow-none">
            Wszystkie
          </TabsTrigger>
          <TabsTrigger value="runda1" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue data-[state=active]:shadow-none">
            Runda 1: Wiedza
          </TabsTrigger>
          <TabsTrigger value="runda2" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue data-[state=active]:shadow-none">
            Runda 2: Szybka
          </TabsTrigger>
          <TabsTrigger value="runda3" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue data-[state=active]:shadow-none">
            Runda 3: Koło
          </TabsTrigger>
          <TabsTrigger value="standardowe" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue data-[state=active]:shadow-none">
            Standardowe
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2">Zarządzanie wszystkimi pytaniami</h3>
        <p className="text-white/60 text-sm mb-3">
          Tu możesz dodawać, importować i eksportować wszystkie pytania niezależnie od rundy.
        </p>
        
        <div className="flex gap-2 mb-6">
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Upload size={16} /> Importuj pytania
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Download size={16} /> Eksportuj
          </Button>
          <Button variant="outline" className="text-white border-gray-600 gap-2">
            <Trash2 size={16} /> Wyczyść wszystkie
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Wszystkie pytania</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Runda 1: Wiedza</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Runda 2: Szybka</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Runda 3: Koło</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Standardowe</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Użyte pytania</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          
          <div className="bg-black/30 rounded p-4 text-center">
            <h4 className="text-sm text-white/70 mb-2">Ulubione</h4>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Szukaj pytań..." 
              className="bg-black/50 border border-gray-700 text-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select className="bg-black/50 border border-gray-700 text-white px-3 py-2 rounded-md">
            <option>Wszystkie</option>
          </select>
          
          <select className="bg-black/50 border border-gray-700 text-white px-3 py-2 rounded-md">
            <option>Wszystkie</option>
          </select>
          
          <Button variant="outline" className="border-gray-700 text-white">
            Wyczyść filtry
          </Button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="show-used" 
              checked={showUsed} 
              onCheckedChange={(checked) => setShowUsed(!!checked)} 
            />
            <label htmlFor="show-used" className="text-sm text-white cursor-pointer">
              Pokaż użyte
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="show-favorites" 
              checked={showFavorites} 
              onCheckedChange={(checked) => setShowFavorites(!!checked)} 
            />
            <label htmlFor="show-favorites" className="text-sm text-white cursor-pointer">
              Tylko ulubione
            </label>
          </div>
        </div>
        
        {/* Add question button */}
        <Button className="mb-6 bg-neon-blue hover:bg-neon-blue/80 gap-2">
          <Plus size={16} /> Dodaj pytanie
        </Button>
        
        {/* Questions list */}
        <div className="space-y-4">
          {mockQuestions.map((question) => (
            <div 
              key={question.id} 
              className="bg-black/40 border border-gray-800 rounded-lg overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-2">
                <div className="flex gap-2">
                  <QuestionDifficultyBadge difficulty={question.difficulty} />
                  <Badge className={`${CATEGORY_COLORS[question.category] || 'bg-gray-600'} text-white`}>
                    {question.category}
                  </Badge>
                  <Badge className="bg-blue-600 text-white">
                    {question.round === GameRound.ROUND_ONE ? 'Runda 1' : 
                     question.round === GameRound.ROUND_TWO ? 'Runda 2' : 'Runda 3'}
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
        </div>
      </div>
    </div>
  );
};

export default SettingsQuestions;
