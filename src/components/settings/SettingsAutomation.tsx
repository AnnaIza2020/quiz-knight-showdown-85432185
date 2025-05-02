
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { Code, Layers, Zap, Tv } from 'lucide-react';

const SettingsAutomation = () => {
  const [activeTab, setActiveTab] = useState('integration');
  const { saveGameData } = useGameContext();
  
  const [streamerBotSettings, setStreamerBotSettings] = useState({
    ip: '127.0.0.1',
    port: '8080',
    password: ''
  });
  
  const [streamElementsSettings, setStreamElementsSettings] = useState({
    jwtToken: '',
    channelId: '',
    enabled: false
  });
  
  const [streamLabsSettings, setStreamLabsSettings] = useState({
    apiKey: '',
    socketToken: '',
    enabled: false
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
  
  const [animations, setAnimations] = useState([
    { id: '1', name: 'Konfetti', trigger: 'poprawna_odpowiedz', file: 'confetti.json', enabled: true },
    { id: '2', name: 'Błyskawica', trigger: 'karta_specjalna', file: 'lightning.json', enabled: false },
    { id: '3', name: 'Eliminacja', trigger: 'eliminacja', file: 'elimination.json', enabled: true }
  ]);
  
  const [cameraHighlightSettings, setCameraHighlightSettings] = useState({
    enabled: true,
    correctAnswerColor: '#4ade80', // zielony
    wrongAnswerColor: '#ef4444', // czerwony
    defaultBorderWidth: '4px',
    animationDuration: '2',
  });
  
  const handleStreamerBotChange = (field, value) => {
    setStreamerBotSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStreamElementsChange = (field, value) => {
    setStreamElementsSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStreamLabsChange = (field, value) => {
    setStreamLabsSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTimerChange = (field, value) => {
    setTimerSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAutoMessageChange = (field, value) => {
    setAutoMessages(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCameraHighlightChange = (field, value) => {
    setCameraHighlightSettings(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddAnimation = () => {
    const newAnimation = {
      id: Date.now().toString(),
      name: 'Nowa animacja',
      trigger: 'poprawna_odpowiedz',
      file: '',
      enabled: true
    };
    
    setAnimations(prev => [...prev, newAnimation]);
  };
  
  const handleDeleteAnimation = (id) => {
    setAnimations(prev => prev.filter(anim => anim.id !== id));
  };
  
  const handleAnimationChange = (id, field, value) => {
    setAnimations(prev => 
      prev.map(anim => 
        anim.id === id ? { ...anim, [field]: value } : anim
      )
    );
  };
  
  const handleSaveSettings = () => {
    // Tu można dodać logikę zapisywania ustawień
    saveGameData();
    toast.success('Ustawienia automatyzacji zostały zapisane');
  };
  
  const handleConnect = (type) => {
    toast.info(`Próba połączenia z ${type} - funkcja w trakcie implementacji`);
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Automatyzacja i Integracja</h2>
      <p className="text-white/60 text-sm mb-6">
        Łączenie z botami, OBS, StreamElements, StreamLabs, Discordem i czatem Twitcha.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/30 w-full border-b border-gray-800 mb-6">
          <TabsTrigger 
            value="integration" 
            className="data-[state=active]:text-neon-purple data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-purple rounded-none"
          >
            <Code className="h-4 w-4 mr-2" />
            Integracje
          </TabsTrigger>
          <TabsTrigger 
            value="timer" 
            className="data-[state=active]:text-neon-cyan data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-cyan rounded-none"
          >
            <Zap className="h-4 w-4 mr-2" />
            Timer i wiadomości
          </TabsTrigger>
          <TabsTrigger 
            value="animations" 
            className="data-[state=active]:text-neon-green data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green rounded-none"
          >
            <Layers className="h-4 w-4 mr-2" />
            Animacje
          </TabsTrigger>
          <TabsTrigger 
            value="camera" 
            className="data-[state=active]:text-neon-pink data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-pink rounded-none"
          >
            <Tv className="h-4 w-4 mr-2" />
            Kamery i nakładki
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Streamer.bot */}
            <div className="mb-8 bg-black/20 p-5 rounded-lg border border-gray-700">
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
                
                <Button 
                  className="bg-neon-purple hover:bg-neon-purple/80"
                  onClick={() => handleConnect('Streamer.bot')}
                >
                  Połącz
                </Button>
              </div>
            </div>
            
            {/* Twitch & Discord */}
            <div className="space-y-6">
              <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Twitch</h3>
                <p className="text-sm text-white/70 mb-3">
                  Połącz z kontem Twitch, aby zintegrować czat i powiadomienia.
                </p>
                <Button 
                  className="bg-[#9146FF] hover:bg-[#7d3ddb] w-full"
                  onClick={() => handleConnect('Twitch')}
                >
                  Połącz z Twitch
                </Button>
              </div>
              
              <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Discord</h3>
                <p className="text-sm text-white/70 mb-3">
                  Połącz z serwerem Discord, aby zintegrować powiadomienia i kamendy.
                </p>
                <Button 
                  className="bg-[#5865F2] hover:bg-[#4752c4] w-full"
                  onClick={() => handleConnect('Discord')}
                >
                  Połącz z Discord
                </Button>
              </div>
            </div>
          </div>
          
          {/* StreamElements */}
          <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">StreamElements</h3>
                <p className="text-sm text-white/70">
                  Połącz z kontem StreamElements, aby zarządzać alertami i powiadomieniami.
                </p>
              </div>
              <Switch 
                checked={streamElementsSettings.enabled}
                onCheckedChange={(checked) => handleStreamElementsChange('enabled', checked)}
                className="data-[state=checked]:bg-neon-green"
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="jwt-token">JWT Token</Label>
                <Input
                  id="jwt-token"
                  type="password"
                  value={streamElementsSettings.jwtToken}
                  onChange={(e) => handleStreamElementsChange('jwtToken', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                  disabled={!streamElementsSettings.enabled}
                />
              </div>
              
              <div>
                <Label htmlFor="channel-id">Channel ID</Label>
                <Input
                  id="channel-id"
                  value={streamElementsSettings.channelId}
                  onChange={(e) => handleStreamElementsChange('channelId', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                  disabled={!streamElementsSettings.enabled}
                />
              </div>
              
              <Button 
                className="bg-[#27ae60] hover:bg-[#219652] w-full"
                onClick={() => handleConnect('StreamElements')}
                disabled={!streamElementsSettings.enabled}
              >
                Połącz z StreamElements
              </Button>
            </div>
          </div>
          
          {/* StreamLabs */}
          <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">StreamLabs</h3>
                <p className="text-sm text-white/70">
                  Połącz z kontem StreamLabs, aby zarządzać alertami i powiadomieniami.
                </p>
              </div>
              <Switch 
                checked={streamLabsSettings.enabled}
                onCheckedChange={(checked) => handleStreamLabsChange('enabled', checked)}
                className="data-[state=checked]:bg-neon-blue"
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={streamLabsSettings.apiKey}
                  onChange={(e) => handleStreamLabsChange('apiKey', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                  disabled={!streamLabsSettings.enabled}
                />
              </div>
              
              <div>
                <Label htmlFor="socket-token">Socket Token</Label>
                <Input
                  id="socket-token"
                  type="password"
                  value={streamLabsSettings.socketToken}
                  onChange={(e) => handleStreamLabsChange('socketToken', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                  disabled={!streamLabsSettings.enabled}
                />
              </div>
              
              <Button 
                className="bg-[#2980b9] hover:bg-[#2471a3] w-full"
                onClick={() => handleConnect('StreamLabs')}
                disabled={!streamLabsSettings.enabled}
              >
                Połącz z StreamLabs
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="timer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timer */}
            <div className="mb-8 bg-black/20 p-5 rounded-lg border border-gray-700">
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
                    onClick={handleSaveSettings}
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
            
            {/* Auto Messages */}
            <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
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
                
                <Button 
                  className="w-full bg-neon-cyan hover:bg-neon-cyan/80"
                  onClick={handleSaveSettings}
                >
                  Zapisz wiadomości
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="animations">
          <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Zarządzanie animacjami</h3>
              <Button 
                onClick={handleAddAnimation}
                className="bg-neon-green hover:bg-neon-green/80"
              >
                Dodaj animację
              </Button>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Konfiguruj animacje, które będą automatycznie wyświetlane podczas określonych zdarzeń w grze.
            </p>
            
            <div className="space-y-4 mt-6">
              {animations.map((animation) => (
                <div key={animation.id} className="bg-black/30 p-4 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor={`anim-name-${animation.id}`}>Nazwa</Label>
                    <Input
                      id={`anim-name-${animation.id}`}
                      value={animation.name}
                      onChange={(e) => handleAnimationChange(animation.id, 'name', e.target.value)}
                      className="bg-black/50 border border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Label htmlFor={`anim-trigger-${animation.id}`}>Wyzwalacz</Label>
                    <select
                      id={`anim-trigger-${animation.id}`}
                      value={animation.trigger}
                      onChange={(e) => handleAnimationChange(animation.id, 'trigger', e.target.value)}
                      className="w-full h-10 bg-black/50 border border-gray-700 text-white rounded-md px-3"
                    >
                      <option value="poprawna_odpowiedz">Poprawna odpowiedź</option>
                      <option value="bledna_odpowiedz">Błędna odpowiedź</option>
                      <option value="karta_specjalna">Użycie karty specjalnej</option>
                      <option value="eliminacja">Eliminacja gracza</option>
                      <option value="start_rundy">Start rundy</option>
                      <option value="koniec_gry">Koniec gry</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor={`anim-file-${animation.id}`}>Plik animacji (Lottie JSON lub URL)</Label>
                    <Input
                      id={`anim-file-${animation.id}`}
                      value={animation.file}
                      onChange={(e) => handleAnimationChange(animation.id, 'file', e.target.value)}
                      className="bg-black/50 border border-gray-700 text-white"
                      placeholder="konfetti.json lub URL"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end space-x-2">
                    <div className="flex items-center h-10 space-x-2">
                      <Switch 
                        checked={animation.enabled}
                        onCheckedChange={(checked) => handleAnimationChange(animation.id, 'enabled', checked)}
                        className="data-[state=checked]:bg-neon-green"
                      />
                      <span className="text-white/70 text-sm">
                        {animation.enabled ? 'Włączona' : 'Wyłączona'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeleteAnimation(animation.id)}
                      className="border-red-700 hover:bg-red-700/20 text-red-500"
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {animations.length > 0 && (
              <Button 
                onClick={handleSaveSettings}
                className="w-full mt-6 bg-neon-green hover:bg-neon-green/80"
              >
                Zapisz wszystkie animacje
              </Button>
            )}
            {animations.length === 0 && (
              <p className="text-center text-white/50 my-10">
                Nie dodano jeszcze żadnych animacji. Kliknij "Dodaj animację" aby rozpocząć.
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="camera">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Camera Highlight */}
            <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Podświetlenie kamery aktywnego gracza</h3>
                <Switch 
                  checked={cameraHighlightSettings.enabled}
                  onCheckedChange={(checked) => handleCameraHighlightChange('enabled', checked)}
                  className="data-[state=checked]:bg-neon-pink"
                />
              </div>
              
              <p className="text-sm text-white/70 mb-4">
                Konfiguruj wygląd podświetlenia kamery gracza podczas udzielania odpowiedzi.
              </p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="correct-color">Kolor przy poprawnej odpowiedzi</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded" style={{backgroundColor: cameraHighlightSettings.correctAnswerColor}}></div>
                    <Input
                      id="correct-color"
                      type="text"
                      value={cameraHighlightSettings.correctAnswerColor}
                      onChange={(e) => handleCameraHighlightChange('correctAnswerColor', e.target.value)}
                      className="bg-black/50 border border-gray-700 text-white flex-grow"
                      disabled={!cameraHighlightSettings.enabled}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="wrong-color">Kolor przy błędnej odpowiedzi</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded" style={{backgroundColor: cameraHighlightSettings.wrongAnswerColor}}></div>
                    <Input
                      id="wrong-color"
                      type="text"
                      value={cameraHighlightSettings.wrongAnswerColor}
                      onChange={(e) => handleCameraHighlightChange('wrongAnswerColor', e.target.value)}
                      className="bg-black/50 border border-gray-700 text-white flex-grow"
                      disabled={!cameraHighlightSettings.enabled}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="border-width">Grubość ramki (px)</Label>
                  <Input
                    id="border-width"
                    type="text"
                    value={cameraHighlightSettings.defaultBorderWidth}
                    onChange={(e) => handleCameraHighlightChange('defaultBorderWidth', e.target.value)}
                    className="bg-black/50 border border-gray-700 text-white"
                    disabled={!cameraHighlightSettings.enabled}
                  />
                </div>
                
                <div>
                  <Label htmlFor="animation-duration">Czas trwania animacji (sekundy)</Label>
                  <Input
                    id="animation-duration"
                    type="number"
                    value={cameraHighlightSettings.animationDuration}
                    onChange={(e) => handleCameraHighlightChange('animationDuration', e.target.value)}
                    className="bg-black/50 border border-gray-700 text-white"
                    min="0.5"
                    max="10"
                    step="0.5"
                    disabled={!cameraHighlightSettings.enabled}
                  />
                </div>
              </div>
            </div>
            
            {/* Info bar */}
            <div className="bg-black/20 p-5 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Pasek informacyjny na overlay</h3>
              <p className="text-sm text-white/70 mb-4">
                Konfiguracja paska informacyjnego wyświetlanego na dole ekranu.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-infobar" defaultChecked />
                  <Label htmlFor="show-infobar" className="text-white cursor-pointer">
                    Wyświetlaj pasek informacyjny
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="infobar-height">Wysokość paska (px)</Label>
                  <Input
                    id="infobar-height"
                    type="number"
                    defaultValue="80"
                    className="bg-black/50 border border-gray-700 text-white"
                    min="40"
                    max="120"
                  />
                </div>
                
                <div>
                  <Label htmlFor="infobar-bg-opacity">Przezroczystość tła (%)</Label>
                  <Input
                    id="infobar-bg-opacity"
                    type="number"
                    defaultValue="80"
                    className="bg-black/50 border border-gray-700 text-white"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="infobar-text-size">Rozmiar tekstu (px)</Label>
                  <Input
                    id="infobar-text-size"
                    type="number"
                    defaultValue="18"
                    className="bg-black/50 border border-gray-700 text-white"
                    min="12"
                    max="36"
                  />
                </div>
                
                <div>
                  <Label htmlFor="infobar-display-time">Czas wyświetlania informacji (sekundy)</Label>
                  <Input
                    id="infobar-display-time"
                    type="number"
                    defaultValue="10"
                    className="bg-black/50 border border-gray-700 text-white"
                    min="5"
                    max="60"
                  />
                </div>
                
                <Button 
                  className="w-full bg-neon-cyan hover:bg-neon-cyan/80"
                  onClick={handleSaveSettings}
                >
                  Zapisz ustawienia
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsAutomation;
