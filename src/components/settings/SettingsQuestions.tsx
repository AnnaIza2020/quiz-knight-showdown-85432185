
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryManager from './questions/CategoryManager';
import QuestionsStatistics from './questions/QuestionsStatistics';
import QuestionSearchBar from './questions/QuestionSearchBar';
import QuestionList from './questions/QuestionList';

const SettingsQuestions = () => {
  const [selectedTab, setSelectedTab] = useState('wszystkie');
  const [showUsed, setShowUsed] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Zarządzanie Pytaniami</h2>
      <p className="text-white/60 text-sm mb-6">
        Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
      </p>
      
      {/* Category management */}
      <CategoryManager />
      
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
        
        <QuestionsStatistics />
        
        {/* Search and filters */}
        <QuestionSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showUsed={showUsed}
          setShowUsed={setShowUsed}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
        
        {/* Add question button */}
        <Button className="mb-6 bg-neon-blue hover:bg-neon-blue/80 gap-2">
          <Plus size={16} /> Dodaj pytanie
        </Button>
        
        {/* Questions list */}
        <QuestionList />
      </div>
    </div>
  );
};

export default SettingsQuestions;
