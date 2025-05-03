import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

interface CategoryManagerProps {
  round: number;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = (props) => {
  const [categoryName, setCategoryName] = useState('');
  const { addCategory } = useGameContext();

  // Update the function to include round parameter
  const handleAddCategory = () => {
    if (categoryName.trim() === '') return;
    
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: categoryName.trim(),
      round: props.round, // Use the round passed from props
      questions: [],
    };
    
    addCategory(newCategory);
    toast.success(`Dodano kategorię: ${newCategory.name}`);
    setCategoryName('');
    props.onClose();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Dodaj nową kategorię</h3>
      <Input
        type="text"
        placeholder="Nazwa kategorii"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="mb-4"
      />
      <div className="flex justify-end">
        <Button variant="secondary" onClick={props.onClose} className="mr-2">
          Anuluj
        </Button>
        <Button onClick={handleAddCategory}>Dodaj kategorię</Button>
      </div>
    </div>
  );
};

export default CategoryManager;
