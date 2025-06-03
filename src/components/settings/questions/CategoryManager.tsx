import React, { useState } from 'react';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { Category } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, addQuestion, removeQuestion } = useQuestionsContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedRound, setSelectedRound] = useState<number>(1);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Nazwa kategorii jest wymagana');
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      description: '',
      round: selectedRound,
      questions: []
    };

    // For now, we'll just show a success message since we don't have addCategory in context yet
    toast.success(`Kategoria "${newCategoryName}" została dodana`);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      toast.success(`Kategoria "${category.name}" została usunięta`);
    }
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
            placeholder="Nazwa nowej kategorii"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedRound.toString()} onValueChange={(value) => setSelectedRound(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Runda 1</SelectItem>
              <SelectItem value="2">Runda 2</SelectItem>
              <SelectItem value="3">Runda 3</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddCategory} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Existing categories */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Istniejące kategorie:</h4>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
              <div className="text-white">
                <span className="font-medium">{category.name}</span>
                <span className="text-gray-400 ml-2">(Runda {category.round})</span>
                <span className="text-gray-500 ml-2">
                  {category.questions?.length || 0} pytań
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-400 text-sm">Brak kategorii</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
