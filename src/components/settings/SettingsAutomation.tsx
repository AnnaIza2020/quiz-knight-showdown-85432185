
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

const SettingsAutomation = () => {
  const [streamerBotSettings, setStreamerBotSettings] = useState({
    ip: '127.0.0.1',
    port: '8080',
    password: ''
  });
  
  const [timerSettings, setTimerSettings] = useState({
    defaultTime: '30',
    autoStart: false,
    soundEnabled: true
  });
  
  const [autoMessages, setAutoMessages] = useState({
    roundStart: 'Rozpoczynamy rundę {round}! Powodzenia wszystkim gracz',
    correctAnswer: '{player} odpowiada poprawnie i zdobywa {points} punktów!',
    cardUsed: '{player} używa karty {card}! {effect}'
  });
  
  const handleStreamerBotChange = (field: string, value: string) => {
    setStreamerBotSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTimerChange = (field: string, value: string | boolean) => {
    setTimerSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAutoMessageChange = (field: string, value: string) => {
    setAutoMessages(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Automatyzacja i Integracja</h2>
      <p className="text-white/60 text-sm mb-6">
        Łączenie z botami, OBS, Discordem i czatem Twitcha.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Integration settings */}
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Streamer.bot</h3>
            <p className="text-sm text-white/70 mb-4">
              Połącz z aplikacją Streamer.bot, aby sterować scenami OBS i innymi akcjami.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ip-address">IP Address</Label>
                <Input
                  id="ip-address"
                  value={streamerBotSettings.ip}
                  onChange={(e) => handleStreamerBotChange('ip', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={streamerBotSettings.port}
                  onChange={(e) => handleStreamerBotChange('port', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Hasło (opcjonalnie)</Label>
                <Input
                  id="password"
                  type="password"
                  value={streamerBotSettings.password}
                  onChange={(e) => handleStreamerBotChange('password', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <Button className="bg-neon-purple hover:bg-neon-purple/80">
                Połącz
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Twitch</h3>
              <p className="text-sm text-white/70 mb-3">
                Połącz z kontem Twitch, aby zintegrować czat i powiadomienia.
              </p>
              <Button className="bg-[#9146FF] hover:bg-[#7d3ddb] w-full">
                Połącz z Twitch
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Discord</h3>
              <p className="text-sm text-white/70 mb-3">
                Połącz z serwerem Discord, aby zintegrować powiadomienia i kamerdy.
              </p>
              <Button className="bg-[#5865F2] hover:bg-[#4752c4] w-full">
                Połącz z Discord
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right column - Timer and automations */}
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Timer</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default-time">Domyślny czas (sekundy)</Label>
                <Input
                  id="default-time"
                  type="number"
                  value={timerSettings.defaultTime}
                  onChange={(e) => handleTimerChange('defaultTime', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                  min="1"
                  max="300"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-start-timer" 
                  checked={timerSettings.autoStart}
                  onCheckedChange={(checked) => handleTimerChange('autoStart', !!checked)}
                />
                <Label htmlFor="auto-start-timer" className="text-white cursor-pointer">
                  Automatycznie uruchamiaj timer po wybraniu pytania
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timer-sound" 
                  checked={timerSettings.soundEnabled}
                  onCheckedChange={(checked) => handleTimerChange('soundEnabled', !!checked)}
                />
                <Label htmlFor="timer-sound" className="text-white cursor-pointer">
                  Dźwięk końca czasu
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-gray-700 text-white"
                >
                  Zapisz ustawienia
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-700 text-white"
                >
                  Testuj timer
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Automatyczne wiadomości</h3>
            <p className="text-sm text-white/70 mb-4">
              Dostosuj wiadomości wysyłane automatycznie na czat.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="round-start-msg">Start rundy</Label>
                <Input
                  id="round-start-msg"
                  value={autoMessages.roundStart}
                  onChange={(e) => handleAutoMessageChange('roundStart', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="correct-answer-msg">Poprawna odpowiedź</Label>
                <Input
                  id="correct-answer-msg"
                  value={autoMessages.correctAnswer}
                  onChange={(e) => handleAutoMessageChange('correctAnswer', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="card-used-msg">Użycie karty</Label>
                <Input
                  id="card-used-msg"
                  value={autoMessages.cardUsed}
                  onChange={(e) => handleAutoMessageChange('cardUsed', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <Button className="w-full bg-neon-cyan hover:bg-neon-cyan/80">
                Zapisz wiadomości
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAutomation;
