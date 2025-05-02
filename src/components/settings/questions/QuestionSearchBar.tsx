
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface QuestionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showUsed: boolean;
  setShowUsed: (show: boolean) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
}

const QuestionSearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  showUsed, 
  setShowUsed, 
  showFavorites, 
  setShowFavorites 
}: QuestionSearchBarProps) => {
  return (
    <>
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
    </>
  );
};

export default QuestionSearchBar;
