
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Bot, Clock, Zap, Settings } from 'lucide-react';
import SettingsLayout from '@/components/SettingsLayout';
import { toast } from 'sonner';

interface AutomationSettings {
  autoStart: {
    enabled: boolean;
    delay: number; // seconds
    minPlayers: number;
  };
  autoAdvance: {
    enabled: boolean;
    questionTime: number;
    pauseBetweenQuestions: number;
    pauseBetweenRounds: number;
  };
  autoElimination: {
    enabled: boolean;
    healthThreshold: number;
  };
  notifications: {
    discordEnabled: boolean;
    webhookUrl: string;
    events: string[];
  };
}

const SettingsAutomation: React.FC = () => {
  const [automation, setAutomation] = useState<AutomationSettings>({
    autoStart: {
      enabled: false,
      delay: 10,
      minPlayers: 4
    },
    autoAdvance: {
      enabled: true,
      questionTime: 30,
      pauseBetweenQuestions: 5,
      pauseBetweenRounds: 15
    },
    autoElimination: {
      enabled: true,
      healthThreshold: 0
    },
    notifications: {
      discordEnabled: false,
      webhookUrl: '',
      events: ['game_start', 'round_end', 'player_eliminated']
    }
  });

  const availableEvents = [
    { key: 'game_start', label: 'Start Gry' },
    { key: 'round_start', label: 'Start Rundy' },
    { key: 'round_end', label: 'Koniec Rundy' },
    { key: 'player_eliminated', label: 'Eliminacja Gracza' },
    { key: 'game_end', label: 'Koniec Gry' },
    { key: 'question_answered', label: 'Odpowiedź na Pytanie' },
    { key: 'card_used', label: 'Użycie Karty' }
  ];

  const updateAutoStart = (key: keyof typeof automation.autoStart, value: any) => {
    setAutomation(prev => ({
      ...prev,
      autoStart: {
        ...prev.autoStart,
        [key]: value
      }
    }));
  };

  const updateAutoAdvance = (key: keyof typeof automation.autoAdvance, value: any) => {
    setAutomation(prev => ({
      ...prev,
      autoAdvance: {
        ...prev.autoAdvance,
        [key]: value
      }
    }));
  };

  const updateNotifications = (key: keyof typeof automation.notifications, value: any) => {
    setAutomation(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const toggleNotificationEvent = (eventKey: string) => {
    setAutomation(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        events: prev.notifications.events.includes(eventKey)
          ? prev.notifications.events.filter(e => e !== eventKey)
          : [...prev.notifications.events, eventKey]
      }
    }));
  };

  const saveAutomationSettings = () => {
    // Save to context/localStorage
    toast.success('Ustawienia automatyzacji zostały zapisane');
  };

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Automatyczny Start Gry" 
        description="Automatyczne rozpoczynanie gry po spełnieniu warunków"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Automatyczny Start</Label>
            <Switch
              checked={automation.autoStart.enabled}
              onCheckedChange={(checked) => updateAutoStart('enabled', checked)}
            />
          </div>
          
          {automation.autoStart.enabled && (
            <>
              <div>
                <Label>Opóźnienie Startu ({automation.autoStart.delay}s)</Label>
                <Slider
                  value={[automation.autoStart.delay]}
                  onValueChange={([value]) => updateAutoStart('delay', value)}
                  min={5}
                  max={60}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Minimalna Liczba Graczy</Label>
                <Input
                  type="number"
                  value={automation.autoStart.minPlayers}
                  onChange={(e) => updateAutoStart('minPlayers', parseInt(e.target.value))}
                  min={2}
                  max={10}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Automatyczne Przechodzenie" 
        description="Automatyczne przechodzenie między pytaniami i rundami"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Automatyczne Przechodzenie</Label>
            <Switch
              checked={automation.autoAdvance.enabled}
              onCheckedChange={(checked) => updateAutoAdvance('enabled', checked)}
            />
          </div>
          
          {automation.autoAdvance.enabled && (
            <>
              <div>
                <Label>Czas na Pytanie ({automation.autoAdvance.questionTime}s)</Label>
                <Slider
                  value={[automation.autoAdvance.questionTime]}
                  onValueChange={([value]) => updateAutoAdvance('questionTime', value)}
                  min={10}
                  max={120}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Pauza Między Pytaniami ({automation.autoAdvance.pauseBetweenQuestions}s)</Label>
                <Slider
                  value={[automation.autoAdvance.pauseBetweenQuestions]}
                  onValueChange={([value]) => updateAutoAdvance('pauseBetweenQuestions', value)}
                  min={2}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Pauza Między Rundami ({automation.autoAdvance.pauseBetweenRounds}s)</Label>
                <Slider
                  value={[automation.autoAdvance.pauseBetweenRounds]}
                  onValueChange={([value]) => updateAutoAdvance('pauseBetweenRounds', value)}
                  min={5}
                  max={60}
                  step={5}
                  className="mt-2"
                />
              </div>
            </>
          )}
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Automatyczna Eliminacja" 
        description="Automatyczne eliminowanie graczy na podstawie ich stanu zdrowia"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Automatyczna Eliminacja</Label>
            <Switch
              checked={automation.autoElimination.enabled}
              onCheckedChange={(checked) => 
                setAutomation(prev => ({
                  ...prev,
                  autoElimination: { ...prev.autoElimination, enabled: checked }
                }))
              }
            />
          </div>
          
          {automation.autoElimination.enabled && (
            <div>
              <Label>Próg Zdrowia dla Eliminacji ({automation.autoElimination.healthThreshold}%)</Label>
              <Slider
                value={[automation.autoElimination.healthThreshold]}
                onValueChange={([value]) => 
                  setAutomation(prev => ({
                    ...prev,
                    autoElimination: { ...prev.autoElimination, healthThreshold: value }
                  }))
                }
                min={0}
                max={50}
                step={5}
                className="mt-2"
              />
            </div>
          )}
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Powiadomienia Discord" 
        description="Automatyczne powiadomienia na Discord o wydarzeniach w grze"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Powiadomienia Discord</Label>
            <Switch
              checked={automation.notifications.discordEnabled}
              onCheckedChange={(checked) => updateNotifications('discordEnabled', checked)}
            />
          </div>
          
          {automation.notifications.discordEnabled && (
            <>
              <div>
                <Label>URL Webhooka Discord</Label>
                <Input
                  value={automation.notifications.webhookUrl}
                  onChange={(e) => updateNotifications('webhookUrl', e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Wydarzenia do Powiadamiania</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.map((event) => (
                    <label key={event.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={automation.notifications.events.includes(event.key)}
                        onChange={() => toggleNotificationEvent(event.key)}
                        className="rounded"
                      />
                      <span className="text-sm">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SettingsLayout>

      <div className="flex justify-end">
        <Button onClick={saveAutomationSettings} className="bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black">
          <Bot className="w-4 h-4 mr-2" />
          Zapisz Automatyzację
        </Button>
      </div>
    </div>
  );
};

export default SettingsAutomation;
