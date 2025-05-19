
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, AlertCircle } from 'lucide-react';
import { SpecialCard, Player } from '@/types/game-types';
import CardDisplay from '@/components/cards/CardDisplay';

interface AdvancedCardEditorProps {
  card: SpecialCard;
  onChange: (updates: Partial<SpecialCard>) => void;
  onTestEffect: (card: SpecialCard, testParams?: any) => void;
}

interface EffectHook {
  code: string;
  isValid: boolean;
  errorMessage?: string;
}

// Card effect types
const EFFECT_TYPES = [
  { value: 'points', label: 'Punkty (modyfikacja punktów)' },
  { value: 'health', label: 'Życie (modyfikacja zdrowia)' },
  { value: 'block', label: 'Blokada (blokowanie akcji)' },
  { value: 'skip', label: 'Pomiń (pomijanie pytania)' },
  { value: 'steal', label: 'Kradzież (kradzież punktów/kart)' },
  { value: 'redirect', label: 'Przekierowanie (pytanie do innego gracza)' },
  { value: 'custom', label: 'Niestandardowy (własny kod)' },
];

const DEFAULT_HOOK_CODE = `// Ten kod jest wykonywany gdy karta jest użyta
// Parametry:
// - player: aktualny gracz (obiekt Player)
// - context: kontekst gry z dostępnymi metodami
// - params: dodatkowe parametry karty

export default function executeCardEffect(player, context, params) {
  // Przykład: dodaj 100 punktów do aktualnego gracza
  context.awardPoints(player.id, 100);
  
  // Przykład: zmniejsz życie aktualnego gracza o 1
  // context.deductHealth(player.id, 1);
  
  // Przykład: dodaj dodatkowe życie
  // const updatedPlayer = {...player, health: player.health + 1};
  // context.updatePlayer(updatedPlayer);
  
  // Zwróć true jeśli efekt został pomyślnie wykonany
  return true;
}`;

const AdvancedCardEditor: React.FC<AdvancedCardEditorProps> = ({ card, onChange, onTestEffect }) => {
  const [effectHook, setEffectHook] = useState<EffectHook>({
    code: card.effectHook || DEFAULT_HOOK_CODE,
    isValid: true
  });
  
  const [effectType, setEffectType] = useState(card.effectType || 'points');
  const [effectParams, setEffectParams] = useState<Record<string, any>>(card.effectParams || {});
  
  // Dummy player for testing
  const dummyPlayer: Player = {
    id: 'test-player-id',
    name: 'Gracz Testowy',
    points: 150,
    health: 2,
    lives: 3,
    isEliminated: false,
    specialCards: [card.id]
  };
  
  // Validate hook code
  const validateHook = (code: string) => {
    try {
      // Basic syntax validation
      Function('player', 'context', 'params', code);
      
      setEffectHook({
        code,
        isValid: true
      });
      
      onChange({ 
        effectHook: code,
        effectType,
        effectParams
      });
      
      return true;
    } catch (error) {
      setEffectHook({
        code,
        isValid: false,
        errorMessage: (error as Error).message
      });
      return false;
    }
  };
  
  // Handle code change
  const handleCodeChange = (code: string) => {
    setEffectHook({
      ...effectHook,
      code
    });
  };
  
  // Save code changes
  const handleSaveCode = () => {
    if (validateHook(effectHook.code)) {
      onChange({ 
        effectHook: effectHook.code,
        effectType,
        effectParams
      });
    }
  };
  
  // Handle effect type change
  const handleEffectTypeChange = (type: string) => {
    setEffectType(type);
    onChange({ 
      effectType: type,
      effectParams
    });
  };
  
  // Handle effect parameter change
  const handleParamChange = (key: string, value: any) => {
    const updatedParams = {
      ...effectParams,
      [key]: value
    };
    
    setEffectParams(updatedParams);
    onChange({ 
      effectParams: updatedParams 
    });
  };
  
  // Test the effect
  const handleTestEffect = () => {
    if (validateHook(effectHook.code)) {
      onTestEffect(card, {
        player: dummyPlayer,
        effectParams
      });
    }
  };
  
  // Render parameters based on effect type
  const renderEffectParams = () => {
    switch (effectType) {
      case 'points':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pointsAmount">Liczba punktów</Label>
              <Input 
                id="pointsAmount" 
                type="number" 
                value={effectParams.amount || 100} 
                onChange={(e) => handleParamChange('amount', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="isNegative" 
                checked={effectParams.isNegative || false}
                onCheckedChange={(checked) => handleParamChange('isNegative', checked)}
              />
              <Label htmlFor="isNegative">Odejmij punkty (zamiast dodawać)</Label>
            </div>
          </div>
        );
        
      case 'health':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="healthAmount">Zmiana zdrowia</Label>
              <Input 
                id="healthAmount" 
                type="number" 
                value={effectParams.amount || 1} 
                onChange={(e) => handleParamChange('amount', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="isHealing" 
                checked={effectParams.isHealing || false}
                onCheckedChange={(checked) => handleParamChange('isHealing', checked)}
              />
              <Label htmlFor="isHealing">Dodaj życie (zamiast odejmować)</Label>
            </div>
          </div>
        );
        
      case 'block':
      case 'skip':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Czas trwania (liczba tur)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="1"
                value={effectParams.duration || 1} 
                onChange={(e) => handleParamChange('duration', parseInt(e.target.value))}
              />
            </div>
          </div>
        );
        
      case 'steal':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="stealType">Co ukraść</Label>
              <Select 
                value={effectParams.stealType || 'points'}
                onValueChange={(value) => handleParamChange('stealType', value)}
              >
                <SelectTrigger id="stealType">
                  <SelectValue placeholder="Wybierz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Punkty</SelectItem>
                  <SelectItem value="card">Kartę specjalną</SelectItem>
                  <SelectItem value="life">Życie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {effectParams.stealType === 'points' && (
              <div>
                <Label htmlFor="amount">Liczba punktów</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={effectParams.amount || 50} 
                  onChange={(e) => handleParamChange('amount', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        );
        
      case 'redirect':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="allowPlayerSelection" 
                checked={effectParams.allowPlayerSelection || true}
                onCheckedChange={(checked) => handleParamChange('allowPlayerSelection', checked)}
              />
              <Label htmlFor="allowPlayerSelection">Pozwól graczowi wybrać cel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="redirectQuestion" 
                checked={effectParams.redirectQuestion || true}
                onCheckedChange={(checked) => handleParamChange('redirectQuestion', checked)}
              />
              <Label htmlFor="redirectQuestion">Przekieruj aktualne pytanie</Label>
            </div>
          </div>
        );
        
      case 'custom':
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <CardDisplay card={card} size="medium" showDescription={true} />
              
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="effectType">Typ efektu</Label>
                  <Select 
                    value={effectType} 
                    onValueChange={handleEffectTypeChange}
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
                
                {renderEffectParams()}
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleTestEffect}
                >
                  <PlayCircle className="mr-2 h-4 w-4" /> Testuj efekt
                </Button>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="space-y-2">
                <Label htmlFor="effectHook">
                  Kod efektu (JavaScript)
                </Label>
                <div className="relative">
                  <Textarea 
                    id="effectHook" 
                    className="font-mono h-80 bg-black/50"
                    value={effectHook.code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                  />
                  {!effectHook.isValid && (
                    <div className="mt-2 text-destructive flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                      <span className="text-sm">{effectHook.errorMessage}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={handleSaveCode}
                  >
                    Zapisz kod
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCardEditor;
