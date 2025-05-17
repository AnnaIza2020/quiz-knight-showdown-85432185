
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GameRound } from '@/types/game-types';
import { QuestionFilterOptions, QuestionFiltersProps } from '@/types/questions-types';
import { Badge } from '@/components/ui/badge';

const QuestionFilters: React.FC<QuestionFiltersProps> = ({ 
  filters, 
  onFilterChange,
  categories,
  totalQuestions,
  filteredCount
}) => {
  // Helper to update a single filter value
  const updateFilter = (key: keyof QuestionFilterOptions, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Filter stats */}
      {totalQuestions !== undefined && filteredCount !== undefined && (
        <div className="flex items-center justify-end mb-2">
          <Badge variant="outline" className="text-xs bg-black/20">
            Pokazano {filteredCount} z {totalQuestions} pytań
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Round filter */}
        <div className="space-y-2">
          <Label htmlFor="round-filter">Runda</Label>
          <Select
            value={filters.round?.toString() || ''}
            onValueChange={(value) => updateFilter('round', value ? parseInt(value) : null)}
          >
            <SelectTrigger id="round-filter">
              <SelectValue placeholder="Wszystkie rundy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie rundy</SelectItem>
              <SelectItem value={GameRound.ROUND_ONE.toString()}>Runda 1</SelectItem>
              <SelectItem value={GameRound.ROUND_TWO.toString()}>Runda 2</SelectItem>
              <SelectItem value={GameRound.ROUND_THREE.toString()}>Runda 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category filter */}
        <div className="space-y-2">
          <Label htmlFor="category-filter">Kategoria</Label>
          <Select
            value={filters.category || ''}
            onValueChange={(value) => updateFilter('category', value || null)}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Wszystkie kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie kategorie</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search term filter */}
        <div className="space-y-2">
          <Label htmlFor="search-filter">Szukaj</Label>
          <Input
            id="search-filter"
            placeholder="Wpisz tekst..."
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
          />
        </div>

        {/* Used status filter */}
        <div className="flex items-center space-x-4 pt-8">
          <Switch
            id="used-filter"
            checked={filters.used === true}
            onCheckedChange={(checked) => {
              if (checked) {
                updateFilter('used', true);
              } else if (filters.used === true) {
                updateFilter('used', null);
              } else {
                updateFilter('used', false);
              }
            }}
          />
          <Label htmlFor="used-filter">
            {filters.used === true 
              ? "Tylko użyte" 
              : filters.used === false 
                ? "Tylko nieużyte" 
                : "Wszystkie (użyte/nieużyte)"}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilters;
