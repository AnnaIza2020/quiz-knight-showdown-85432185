
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SpecialCard, Player } from '@/types/game-types';
import CardPreview from './editors/CardPreview';
import EffectTypeEditor from './editors/EffectTypeEditor';
import CodeEditor from './editors/CodeEditor';

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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <CardPreview 
                card={card}
                effectType={effectType}
                onEffectTypeChange={handleEffectTypeChange}
                onTestEffect={handleTestEffect}
              />
              
              <EffectTypeEditor 
                effectType={effectType}
                effectParams={effectParams}
                onParamChange={handleParamChange}
              />
            </div>
            
            <div className="md:w-2/3">
              <CodeEditor 
                code={effectHook.code}
                onCodeChange={handleCodeChange}
                onSave={handleSaveCode}
                isValid={effectHook.isValid}
                errorMessage={effectHook.errorMessage}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCardEditor;
