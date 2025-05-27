
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash, Pencil } from 'lucide-react';
import { SpecialCard } from '@/types/interfaces';

const SettingsCards = () => {
  const { specialCards, addSpecialCard, updateSpecialCard, removeSpecialCard } = useGameContext();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<Partial<SpecialCard>>({
    id: uuidv4(),
    name: '',
    description: '',
    soundEffect: '',
    iconName: '',
    animationStyle: 'glow',
    type: 'bonus',
    defaultQuantity: 1
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedCardId) {
      const card = specialCards.find(c => c.id === selectedCardId);
      if (card) {
        setNewCard({
          ...card,
          animationStyle: card.animationStyle || 'glow'
        });
        setIsEditing(true);
      }
    } else {
      setNewCard({
        id: uuidv4(),
        name: '',
        description: '',
        soundEffect: '',
        iconName: '',
        animationStyle: 'glow',
        type: 'bonus',
        defaultQuantity: 1
      });
      setIsEditing(false);
    }
  }, [selectedCardId, specialCards]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCard(prevCard => ({
      ...prevCard,
      [name]: value
    }));
  };

  const handleAddCard = () => {
    if (!newCard.name || !newCard.type) {
      toast.error('Podaj nazwę i typ karty');
      return;
    }
    
    const cardToAdd: SpecialCard = {
      id: newCard.id || uuidv4(),
      name: newCard.name,
      description: newCard.description || '',
      type: newCard.type,
      soundEffect: newCard.soundEffect || '',
      iconName: newCard.iconName || '',
      animationStyle: newCard.animationStyle || 'glow',
      defaultQuantity: newCard.defaultQuantity || 1
    };
    
    addSpecialCard(cardToAdd);
    
    // Reset form
    setNewCard({
      id: uuidv4(),
      name: '',
      description: '',
      soundEffect: '',
      iconName: '',
      animationStyle: 'glow',
      type: 'bonus',
      defaultQuantity: 1
    });
    
    toast.success('Karta dodana pomyślnie!');
  };

  const handleUpdateCard = () => {
    if (!newCard.id) {
      toast.error('Karta nie została wybrana');
      return;
    }
    
    if (!newCard.name || !newCard.type) {
      toast.error('Podaj nazwę i typ karty');
      return;
    }
    
    const cardToUpdate: SpecialCard = {
      id: newCard.id,
      name: newCard.name,
      description: newCard.description || '',
      type: newCard.type,
      soundEffect: newCard.soundEffect || '',
      iconName: newCard.iconName || '',
      animationStyle: newCard.animationStyle || 'glow',
      defaultQuantity: newCard.defaultQuantity || 1
    };
    
    updateSpecialCard(cardToUpdate.id, cardToUpdate);
    
    // Reset selection
    setSelectedCardId(null);
    
    toast.success('Karta zaktualizowana pomyślnie!');
  };

  const handleRemoveCard = () => {
    if (!newCard.id) {
      toast.error('Karta nie została wybrana');
      return;
    }
    
    removeSpecialCard(newCard.id);
    
    // Reset selection
    setSelectedCardId(null);
    
    toast.success('Karta usunięta pomyślnie!');
  };

  const renderCardList = () => (
    <div className="space-y-2">
      {specialCards.map(card => (
        <div
          key={card.id}
          className={`p-3 rounded-md bg-black/30 border ${selectedCardId === card.id ? 'border-neon-blue' : 'border-gray-700'} text-white cursor-pointer flex justify-between items-center`}
          onClick={() => setSelectedCardId(card.id)}
        >
          {card.name}
          {selectedCardId === card.id && <Pencil size={16} className="text-blue-500" />}
        </div>
      ))}
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Nazwa karty"
        value={newCard.name || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="description"
        placeholder="Opis karty"
        value={newCard.description || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="soundEffect"
        placeholder="Nazwa efektu dźwiękowego"
        value={newCard.soundEffect || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="iconName"
        placeholder="Nazwa ikony"
        value={newCard.iconName || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <select
        name="animationStyle"
        value={newCard.animationStyle || 'glow'}
        onChange={handleInputChange}
        className="w-full bg-black/40 border border-gray-700 text-white rounded px-3 py-2"
      >
        <option value="glow">Glow</option>
        <option value="neon-blue">Neon Blue</option>
        <option value="neon-green">Neon Green</option>
        <option value="neon-red">Neon Red</option>
        <option value="neon-purple">Neon Purple</option>
        <option value="rainbow">Rainbow</option>
      </select>
      <select
        name="type"
        value={newCard.type || 'bonus'}
        onChange={handleInputChange}
        className="w-full bg-black/40 border border-gray-700 text-white rounded px-3 py-2"
      >
        <option value="bonus">Bonus</option>
        <option value="defense">Defense</option>
        <option value="attack">Attack</option>
        <option value="manipulation">Manipulation</option>
      </select>
      <Input
        type="number"
        name="defaultQuantity"
        placeholder="Domyślna ilość"
        value={newCard.defaultQuantity || 1}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
        min="1"
      />
      
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleUpdateCard} className="bg-blue-500 hover:bg-blue-400 text-white">
              <Save size={16} className="mr-2" /> Zapisz
            </Button>
            <Button onClick={handleRemoveCard} className="bg-red-500 hover:bg-red-400 text-white">
              <Trash size={16} className="mr-2" /> Usuń
            </Button>
          </>
        ) : (
          <Button onClick={handleAddCard} className="bg-green-500 hover:bg-green-400 text-white">
            <Plus size={16} className="mr-2" /> Dodaj
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Zarządzanie Kartami Specjalnymi</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Lista Kart</h3>
          {renderCardList()}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            {isEditing ? 'Edytuj Kartę' : 'Dodaj Kartę'}
          </h3>
          {renderCardForm()}
        </div>
      </div>
    </div>
  );
};

export default SettingsCards;
