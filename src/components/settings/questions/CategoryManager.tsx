
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/context/GameContext';
import { Category } from '@/types/interfaces';
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CategoryManager: React.FC = () => {
  const { categories, setCategories, addCategory, removeCategory } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedRound, setSelectedRound] = useState(1);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Podaj nazwę kategorii');
      return;
    }

    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      description: '',
      round: selectedRound,
      questions: []
    };

    // Use functional update for setCategories
    setCategories((prevCategories: Category[]) => [...prevCategories, newCategory]);
    setNewCategoryName('');
    toast.success('Kategoria została dodana');
  };

  const handleRemoveCategory = (categoryId: string) => {
    // Use functional update for setCategories
    setCategories((prevCategories: Category[]) => 
      prevCategories.filter(category => category.id !== categoryId)
    );
    toast.success('Kategoria została usunięta');
  };

  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Zarządzanie kategoriami</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new category */}
        <div className="flex gap-2">
          <Input
            placeholder="Nazwa kategorii"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="bg-black/60 text-white border-gray-600"
          />
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(Number(e.target.value))}
            className="bg-black/60 text-white border border-gray-600 rounded px-3 py-2"
          >
            <option value={1}>Runda 1</option>
            <option value={2}>Runda 2</option>
            <option value={3}>Runda 3</option>
          </select>
          <Button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj
          </Button>
        </div>

        {/* Categories list */}
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-black/20 rounded border border-gray-700"
            >
              <div>
                <span className="text-white font-medium">{category.name}</span>
                <span className="text-gray-400 ml-2">(Runda {category.round})</span>
                <span className="text-gray-500 ml-2">
                  {category.questions?.length || 0} pytań
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRemoveCategory(category.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p>Brak kategorii</p>
              <p className="text-sm">Dodaj pierwsze kategorie pytań</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
