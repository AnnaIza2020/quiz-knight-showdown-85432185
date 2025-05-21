import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash, Pencil } from 'lucide-react';
import { SpecialCard } from '@/types/card-types';

const SettingsCards = () => {
  const { specialCards, addSpecialCard, updateSpecialCard, removeSpecialCard } = useGameContext();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<Partial<SpecialCard>>({
    id: uuidv4(),
    name: '',
    description: '',
    imageUrl: '',
    image_url: '',
    soundEffect: '',
    sound_effect: '',
    iconName: '',
    icon_name: '',
    animationStyle: '',
    animation_style: '',
    type: 'bonus' // Set default type
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedCardId) {
      const card = specialCards.find(c => c.id === selectedCardId);
      if (card) {
        setNewCard({
          ...card,
          // Make sure all fields are properly set for both legacy and new formats
          imageUrl: card.imageUrl || card.image_url || '',
          image_url: card.image_url || card.imageUrl || '',
          soundEffect: card.soundEffect || card.sound_effect || '',
          sound_effect: card.sound_effect || card.soundEffect || '',
          iconName: card.iconName || card.icon_name || '',
          icon_name: card.icon_name || card.iconName || '',
          animationStyle: card.animationStyle || card.animation_style || '',
          animation_style: card.animation_style || card.animationStyle || ''
        });
        setIsEditing(true);
      }
    } else {
      setNewCard({
        id: uuidv4(),
        name: '',
        description: '',
        imageUrl: '',
        image_url: '',
        soundEffect: '',
        sound_effect: '',
        iconName: '',
        icon_name: '',
        animationStyle: '',
        animation_style: '',
        type: 'bonus'
      });
      setIsEditing(false);
    }
  }, [selectedCardId, specialCards]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCard(prevCard => {
      // Handle special cases for dual-named fields
      if (name === 'image_url') {
        return { ...prevCard, image_url: value, imageUrl: value };
      } else if (name === 'sound_effect') {
        return { ...prevCard, sound_effect: value, soundEffect: value };
      } else if (name === 'icon_name') {
        return { ...prevCard, icon_name: value, iconName: value };
      } else if (name === 'animation_style') {
        return { ...prevCard, animation_style: value, animationStyle: value };
      }
      return { ...prevCard, [name]: value };
    });
  };

  const handleAddCard = () => {
    if (!newCard.name || !newCard.type) {
      toast.error('Podaj nazwę i typ karty');
      return;
    }
    
    // Ensure all required fields are properly set
    const cardToAdd: SpecialCard = {
      id: newCard.id || uuidv4(),
      name: newCard.name,
      description: newCard.description || '',
      type: newCard.type,
      // Set both formats for compatibility
      imageUrl: newCard.imageUrl || newCard.image_url || '',
      image_url: newCard.image_url || newCard.imageUrl || '',
      soundEffect: newCard.soundEffect || newCard.sound_effect || '',
      sound_effect: newCard.sound_effect || newCard.soundEffect || '',
      iconName: newCard.iconName || newCard.icon_name || '',
      icon_name: newCard.icon_name || newCard.iconName || '',
      animationStyle: newCard.animationStyle || newCard.animation_style || '',
      animation_style: newCard.animation_style || newCard.animationStyle || '',
      effectType: newCard.effectType || '',
      effectHook: newCard.effectHook || '',
      effectParams: newCard.effectParams || {}
    };
    
    addSpecialCard(cardToAdd);
    
    // Reset form
    setNewCard({
      id: uuidv4(),
      name: '',
      description: '',
      imageUrl: '',
      image_url: '',
      soundEffect: '',
      sound_effect: '',
      iconName: '',
      icon_name: '',
      animationStyle: '',
      animation_style: '',
      type: 'bonus'
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
    
    // Ensure all required fields are properly set
    const cardToUpdate: SpecialCard = {
      id: newCard.id,
      name: newCard.name,
      description: newCard.description || '',
      type: newCard.type,
      // Set both formats for compatibility
      imageUrl: newCard.imageUrl || newCard.image_url || '',
      image_url: newCard.image_url || newCard.imageUrl || '',
      soundEffect: newCard.soundEffect || newCard.sound_effect || '',
      sound_effect: newCard.sound_effect || newCard.soundEffect || '',
      iconName: newCard.iconName || newCard.icon_name || '',
      icon_name: newCard.icon_name || newCard.iconName || '',
      animationStyle: newCard.animationStyle || newCard.animation_style || '',
      animation_style: newCard.animation_style || newCard.animationStyle || '',
      effectType: newCard.effectType || '',
      effectHook: newCard.effectHook || '',
      effectParams: newCard.effectParams || {}
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
        name="image_url"
        placeholder="URL obrazu"
        value={newCard.image_url || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="sound_effect"
        placeholder="Nazwa efektu dźwiękowego"
        value={newCard.sound_effect || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="icon_name"
        placeholder="Nazwa ikony"
        value={newCard.icon_name || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="animation_style"
        placeholder="Styl animacji"
        value={newCard.animation_style || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
      />
      <Input
        type="text"
        name="type"
        placeholder="Typ karty"
        value={newCard.type || ''}
        onChange={handleInputChange}
        className="bg-black/40 border-gray-700 text-white"
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
