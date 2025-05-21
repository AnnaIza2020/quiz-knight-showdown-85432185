import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, GameRound } from '@/types/game-types';
import { toast } from 'sonner';

const CategoryManager = () => {
  const { categories, addCategory } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedRound, setSelectedRound] = useState<GameRound>(GameRound.ROUND_ONE);
  const [error, setError] = useState('');
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      setError('Nazwa kategorii nie może być pusta');
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      description: '',
      round: selectedRound as unknown as GameRound, // Fix the type conversion
      questions: []
    };
    
    addCategory(newCategory);
    setNewCategoryName('');
    setError('');
    toast.success(`Kategoria "${newCategoryName}" została dodana pomyślnie`);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Zarządzanie Kategoriami</h3>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryName" className="text-sm text-white/70">Nazwa kategorii</Label>
        <Input
          id="categoryName"
          className="bg-black/50 border-white/20 text-white"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Wpisz nazwę kategorii"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="roundSelect" className="text-sm text-white/70">Wybierz rundę</Label>
        <Select onValueChange={(value) => setSelectedRound(value as GameRound)} defaultValue={GameRound.ROUND_ONE}>
          <SelectTrigger className="bg-black/50 border-white/20 text-white">
            <SelectValue placeholder="Wybierz rundę" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={GameRound.ROUND_ONE}>Runda 1</SelectItem>
            <SelectItem value={GameRound.ROUND_TWO}>Runda 2</SelectItem>
            <SelectItem value={GameRound.ROUND_THREE}>Runda 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleAddCategory} className="bg-neon-blue text-black hover:bg-neon-blue/80">
        Dodaj kategorię
      </Button>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white">Lista Kategorii</h4>
        {categories.length === 0 ? (
          <p className="text-white/50">Brak kategorii. Dodaj kategorię powyżej.</p>
        ) : (
          <ul className="list-none space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="text-white">{category.name} ({category.round})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
