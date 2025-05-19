
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EffectTypeEditorProps {
  effectType: string;
  effectParams: Record<string, any>;
  onParamChange: (key: string, value: any) => void;
}

const EffectTypeEditor: React.FC<EffectTypeEditorProps> = ({ 
  effectType, 
  effectParams,
  onParamChange 
}) => {
  // Render parameters based on effect type
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
              onChange={(e) => onParamChange('amount', parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="isNegative" 
              checked={effectParams.isNegative || false}
              onCheckedChange={(checked) => onParamChange('isNegative', checked)}
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
              onChange={(e) => onParamChange('amount', parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="isHealing" 
              checked={effectParams.isHealing || false}
              onCheckedChange={(checked) => onParamChange('isHealing', checked)}
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
              onChange={(e) => onParamChange('duration', parseInt(e.target.value))}
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
              onValueChange={(value) => onParamChange('stealType', value)}
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
                onChange={(e) => onParamChange('amount', parseInt(e.target.value))}
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
              onCheckedChange={(checked) => onParamChange('allowPlayerSelection', checked)}
            />
            <Label htmlFor="allowPlayerSelection">Pozwól graczowi wybrać cel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="redirectQuestion" 
              checked={effectParams.redirectQuestion || true}
              onCheckedChange={(checked) => onParamChange('redirectQuestion', checked)}
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

export default EffectTypeEditor;
