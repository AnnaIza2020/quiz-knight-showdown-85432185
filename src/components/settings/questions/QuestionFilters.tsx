
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuestionFilters } from '@/types/questions-types';
import { Category, GameRound } from '@/types/game-types';
import { X, Filter, Search } from 'lucide-react';

interface QuestionFiltersProps {
  filters: QuestionFilters;
  setFilters: React.Dispatch<React.SetStateAction<QuestionFilters>>;
  categories: Category[];
  totalQuestions: number;
  filteredCount: number;
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  filters,
  setFilters,
  categories,
  totalQuestions,
  filteredCount
}) => {
  const resetFilters = () => {
    setFilters({
      round: null,
      category: null,
      used: null,
      difficulty: null,
      searchTerm: '',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleRoundChange = (value: string) => {
    setFilters(prev => ({ ...prev, round: value === 'all' ? null : parseInt(value) as GameRound }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value === 'all' ? null : value }));
  };

  const handleUsedChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      used: value === 'all' ? null : value === 'used' ? true : false 
    }));
  };

  const handleDifficultyChange = (value: string) => {
    setFilters(prev => ({ ...prev, difficulty: value === 'all' ? null : parseInt(value) }));
  };

  return (
    <div className="space-y-4 bg-black/20 p-4 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Filtrowanie pytań</h3>
        <Badge variant="outline" className="bg-blue-900/30 text-blue-300">
          {filteredCount} / {totalQuestions} pytań
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="col-span-1 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Szukaj w pytaniach i odpowiedziach..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-9 bg-black/30 border-gray-700 text-white"
            />
            {filters.searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Round filter */}
        <Select
          value={filters.round?.toString() || 'all'}
          onValueChange={handleRoundChange}
        >
          <SelectTrigger className="bg-black/30 border-gray-700 text-white">
            <SelectValue placeholder="Wszystkie rundy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie rundy</SelectItem>
            <SelectItem value="1">Runda 1</SelectItem>
            <SelectItem value="2">Runda 2</SelectItem>
            <SelectItem value="3">Runda 3</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Category filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="bg-black/30 border-gray-700 text-white">
            <SelectValue placeholder="Wszystkie kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie kategorie</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Used filter */}
        <Select
          value={filters.used === null ? 'all' : filters.used ? 'used' : 'unused'}
          onValueChange={handleUsedChange}
        >
          <SelectTrigger className="bg-black/30 border-gray-700 text-white">
            <SelectValue placeholder="Wszystkie statusy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie statusy</SelectItem>
            <SelectItem value="used">Użyte pytania</SelectItem>
            <SelectItem value="unused">Nieużyte pytania</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Difficulty filter */}
        <Select
          value={filters.difficulty?.toString() || 'all'}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger className="bg-black/30 border-gray-700 text-white">
            <SelectValue placeholder="Wszystkie poziomy trudności" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie poziomy</SelectItem>
            <SelectItem value="1">Poziom 1 (Łatwy)</SelectItem>
            <SelectItem value="2">Poziom 2 (Średni)</SelectItem>
            <SelectItem value="3">Poziom 3 (Trudny)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Reset filters */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="flex items-center gap-1 text-gray-300 hover:text-white"
        >
          <Filter size={14} /> Resetuj filtry
        </Button>
      </div>
    </div>
  );
};

export default QuestionFilters;
