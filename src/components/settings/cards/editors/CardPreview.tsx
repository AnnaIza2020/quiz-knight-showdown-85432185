
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { SpecialCard } from '@/types/card-types';
import { CardDisplay } from '@/components/cards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CardPreviewProps {
  card: SpecialCard;
  effectType: string;
  onEffectTypeChange: (type: string) => void;
  onTestEffect: () => void;
}

// Available effect types
const EFFECT_TYPES = [
  { value: 'points', label: 'Punkty (modyfikacja punktów)' },
  { value: 'health', label: 'Życie (modyfikacja zdrowia)' },
  { value: 'block', label: 'Blokada (blokowanie akcji)' },
  { value: 'skip', label: 'Pomiń (pomijanie pytania)' },
  { value: 'steal', label: 'Kradzież (kradzież punktów/kart)' },
  { value: 'redirect', label: 'Przekierowanie (pytanie do innego gracza)' },
  { value: 'custom', label: 'Niestandardowy (własny kod)' },
];

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  effectType,
  onEffectTypeChange,
  onTestEffect
}) => {
  return (
    <div className="space-y-4">
      <CardDisplay card={card} size="md" showDescription={true} />
      
      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="effectType">Typ efektu</Label>
          <Select 
            value={effectType} 
            onValueChange={onEffectTypeChange}
          >
            <SelectTrigger id="effectType">
              <SelectValue placeholder="Wybierz typ efektu" />
            </SelectTrigger>
            <SelectContent>
              {EFFECT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={onTestEffect}
        >
          <PlayCircle className="mr-2 h-4 w-4" /> Testuj efekt
        </Button>
      </div>
    </div>
  );
};

export default CardPreview;
