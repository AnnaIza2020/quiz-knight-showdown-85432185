
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, Plus, Trash, Edit, RotateCcw } from 'lucide-react';
import SettingsLayout from '@/components/SettingsLayout';
import { toast } from 'sonner';

interface WheelCategory {
  id: string;
  name: string;
  color: string;
  weight: number; // probability weight
  description?: string;
}

const SettingsWheelCategories: React.FC = () => {
  const [categories, setCategories] = useState<WheelCategory[]>([
    {
      id: '1',
      name: 'Język polskiego internetu',
      color: '#FF3E9D',
      weight: 1,
      description: 'Memy, slang internetowy, kultura online'
    },
    {
      id: '2',
      name: 'Polska scena Twitcha',
      color: '#8B5CF6',
      weight: 1,
      description: 'Streamers, wydarzenia, społeczność'
    },
    {
      id: '3',
      name: 'Zagadki',
      color: '#00E0FF',
      weight: 1,
      description: 'Logiczne zagadki i łamigłówki'
    },
    {
      id: '4',
      name: 'Czy jesteś mądrzejszy od 8-klasisty',
      color: '#00FFA3',
      weight: 1,
      description: 'Wiedza podstawowa z różnych dziedzin'
    },
    {
      id: '5',
      name: 'Gry, które podbiły Polskę',
      color: '#FFA500',
      weight: 1,
      description: 'Popularne gry w Polsce'
    },
    {
      id: '6',
      name: 'Technologie i internet w Polsce',
      color: '#FF6B6B',
      weight: 1,
      description: 'IT, technologie, cyfryzacja'
    }
  ]);

  const [newCategory, setNewCategory] = useState<Partial<WheelCategory>>({
    name: '',
    color: '#FF3E9D',
    weight: 1,
    description: ''
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const predefinedColors = [
    '#FF3E9D', '#8B5CF6', '#00E0FF', '#00FFA3', 
    '#FFA500', '#FF6B6B', '#FFD700', '#FF69B4',
    '#32CD32', '#FF4500', '#9370DB', '#20B2AA'
  ];

  const addCategory = () => {
    if (!newCategory.name) {
      toast.error('Podaj nazwę kategorii');
      return;
    }

    const category: WheelCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      color: newCategory.color || '#FF3E9D',
      weight: newCategory.weight || 1,
      description: newCategory.description || ''
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', color: '#FF3E9D', weight: 1, description: '' });
    toast.success('Kategoria została dodana');
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success('Kategoria została usunięta');
  };

  const updateCategory = (categoryId: string, updates: Partial<WheelCategory>) => {
    setCategories(prev =>
      prev.map(cat => cat.id === categoryId ? { ...cat, ...updates } : cat)
    );
  };

  const resetToDefaults = () => {
    setCategories([
      {
        id: '1',
        name: 'Język polskiego internetu',
        color: '#FF3E9D',
        weight: 1,
        description: 'Memy, slang internetowy, kultura online'
      },
      {
        id: '2',
        name: 'Polska scena Twitcha',
        color: '#8B5CF6',
        weight: 1,
        description: 'Streamers, wydarzenia, społeczność'
      },
      {
        id: '3',
        name: 'Zagadki',
        color: '#00E0FF',
        weight: 1,
        description: 'Logiczne zagadki i łamigłówki'
      },
      {
        id: '4',
        name: 'Czy jesteś mądrzejszy od 8-klasisty',
        color: '#00FFA3',
        weight: 1,
        description: 'Wiedza podstawowa z różnych dziedzin'
      },
      {
        id: '5',
        name: 'Gry, które podbiły Polskę',
        color: '#FFA500',
        weight: 1,
        description: 'Popularne gry w Polsce'
      },
      {
        id: '6',
        name: 'Technologie i internet w Polsce',
        color: '#FF6B6B',
        weight: 1,
        description: 'IT, technologie, cyfryzacja'
      }
    ]);
    toast.success('Przywrócono domyślne kategorie');
  };

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Kategorie Koła Fortuny" 
        description="Zarządzaj kategoriami pytań dla Rundy 3 - Koło Fortuny"
        actions={
          <Button onClick={resetToDefaults} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Przywróć Domyślne
          </Button>
        }
      >
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-400">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    Waga: {category.weight} ({Math.round((category.weight / totalWeight) * 100)}%)
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(category.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeCategory(category.id)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {isEditing === category.id && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div>
                    <Label>Nazwa Kategorii</Label>
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Opis</Label>
                    <Input
                      value={category.description || ''}
                      onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Kolor</Label>
                    <div className="flex gap-2 mt-1">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            category.color === color ? 'border-white' : 'border-white/20'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateCategory(category.id, { color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Waga Prawdopodobieństwa</Label>
                    <Input
                      type="number"
                      value={category.weight}
                      onChange={(e) => updateCategory(category.id, { weight: Number(e.target.value) })}
                      min={1}
                      max={10}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsEditing(null)}
                      className="bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black"
                    >
                      Zapisz
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(null)}
                    >
                      Anuluj
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Dodaj Nową Kategorię" 
        description="Stwórz nową kategorię dla koła fortuny"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Nazwa Kategorii</Label>
            <Input
              id="categoryName"
              value={newCategory.name || ''}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="np. Historia Polski, Sport"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="categoryDescription">Opis (opcjonalny)</Label>
            <Input
              id="categoryDescription"
              value={newCategory.description || ''}
              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Krótki opis kategorii"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Kolor Kategorii</Label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newCategory.color === color ? 'border-white' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="categoryWeight">Waga Prawdopodobieństwa</Label>
            <Input
              id="categoryWeight"
              type="number"
              value={newCategory.weight || 1}
              onChange={(e) => setNewCategory(prev => ({ ...prev, weight: Number(e.target.value) }))}
              min={1}
              max={10}
              className="mt-1"
            />
            <p className="text-sm text-gray-400 mt-1">
              Wyższa waga = większe prawdopodobieństwo wylosowania
            </p>
          </div>
          
          <Button onClick={addCategory} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Dodaj Kategorię
          </Button>
        </div>
      </SettingsLayout>
    </div>
  );
};

export default SettingsWheelCategories;
