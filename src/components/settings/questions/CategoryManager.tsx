
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const CategoryManager = () => {
  const { categories, addCategory, removeCategory } = useGameContext();
  const [newCategory, setNewCategory] = useState('');
  
  const handleAddCategory = () => {
    if (!newCategory) return;
    
    addCategory({
      id: Math.random().toString(36).substring(2, 9),
      name: newCategory.toUpperCase(),
      questions: []
    });
    
    setNewCategory('');
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3">Zarządzanie kategoriami pytań</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(CATEGORY_COLORS).map(([category, bgColor]) => (
          <div key={category} className="flex items-center">
            <Badge className={`${bgColor} text-white flex items-center gap-1 pl-2 pr-1 py-1`}>
              {category}
              <button 
                className="hover:bg-black/20 rounded-full p-0.5"
                onClick={() => removeCategory(category)}
              >
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
  );
};

export default CategoryManager;
