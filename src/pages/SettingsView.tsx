
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useGameState } from '@/context/GameStateContext';
import NeonButton from '@/components/common/NeonButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const { appSettings, updateAppSettings, roundSettings, updateRoundSettings } = useGameState();
  
  const [localAppSettings, setLocalAppSettings] = useState(appSettings);
  const [localRoundSettings, setLocalRoundSettings] = useState(roundSettings);

  const handleSaveSettings = () => {
    updateAppSettings(localAppSettings);
    updateRoundSettings(localRoundSettings);
    // TODO: Save to backend/localStorage
    console.log('Settings saved:', { localAppSettings, localRoundSettings });
  };

  const handleResetSettings = () => {
    setLocalAppSettings(appSettings);
    setLocalRoundSettings(roundSettings);
  };

  return (
    <div className="min-h-screen bg-[#0C0C13] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Powrót
            </button>
            <h1 className="text-4xl font-bold text-[#00FFA3]">Ustawienia</h1>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Resetuj
            </Button>
            <NeonButton onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Zapisz Zmiany
            </NeonButton>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="appearance">Wygląd</TabsTrigger>
            <TabsTrigger value="rounds">Rundy</TabsTrigger>
            <TabsTrigger value="sounds">Dźwięki</TabsTrigger>
            <TabsTrigger value="advanced">Zaawansowane</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colors Section */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Kolory Dominujące</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor">Kolor Główny</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={localAppSettings.primaryColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={localAppSettings.primaryColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Kolor Drugorzędny</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={localAppSettings.secondaryColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={localAppSettings.secondaryColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accentColor">Kolor Akcentu</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="accentColor"
                        type="color"
                        value={localAppSettings.accentColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={localAppSettings.accentColor}
                        onChange={(e) => setLocalAppSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphics Section */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Grafiki i Logo</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gameLogo">Logo Gry (URL)</Label>
                    <Input
                      id="gameLogo"
                      value={localAppSettings.gameLogo || ''}
                      onChange={(e) => setLocalAppSettings(prev => ({ ...prev, gameLogo: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="overlayBackground">Tło Overlay (URL)</Label>
                    <Input
                      id="overlayBackground"
                      value={localAppSettings.overlayBackground || ''}
                      onChange={(e) => setLocalAppSettings(prev => ({ ...prev, overlayBackground: e.target.value }))}
                      placeholder="https://example.com/background.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hostCameraUrl">URL Kamery Hosta</Label>
                    <Input
                      id="hostCameraUrl"
                      value={localAppSettings.hostCameraUrl || ''}
                      onChange={(e) => setLocalAppSettings(prev => ({ ...prev, hostCameraUrl: e.target.value }))}
                      placeholder="https://vod.ninja/view?v=hostcamera"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Rounds Tab */}
          <TabsContent value="rounds" className="space-y-8">
            <div className="space-y-8">
              {/* Round 1 Settings */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Runda 1 - Eliminacje</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Startowe Życie (%)</Label>
                    <Slider
                      value={[localRoundSettings.round1.startingHealth]}
                      onValueChange={([value]) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round1: { ...prev.round1, startingHealth: value }
                        }))
                      }
                      max={100}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-400">{localRoundSettings.round1.startingHealth}%</span>
                  </div>
                  
                  <div>
                    <Label>Pytań na Kategorię</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round1.questionsPerCategory}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round1: { ...prev.round1, questionsPerCategory: parseInt(e.target.value) || 0 }
                        }))
                      }
                      min={1}
                      max={10}
                    />
                  </div>
                </div>
              </div>

              {/* Round 2 Settings */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Runda 2 - Szybka Odpowiedź</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label>Startowe Życie (%)</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round2.startingHealth}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round2: { ...prev.round2, startingHealth: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                  
                  <div>
                    <Label>Punkty za Odpowiedź</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round2.pointValue}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round2: { ...prev.round2, pointValue: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                  
                  <div>
                    <Label>Limit Czasu (s)</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round2.timeLimit}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round2: { ...prev.round2, timeLimit: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Round 3 Settings */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Runda 3 - Koło Fortuny</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Startowe Życie (%)</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round3.startingHealth}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round3: { ...prev.round3, startingHealth: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                  
                  <div>
                    <Label>Punkty za Odpowiedź</Label>
                    <Input
                      type="number"
                      value={localRoundSettings.round3.pointValue}
                      onChange={(e) => 
                        setLocalRoundSettings(prev => ({
                          ...prev,
                          round3: { ...prev.round3, pointValue: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sounds Tab */}
          <TabsContent value="sounds" className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Ustawienia Dźwięku</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Dźwięki Włączone</Label>
                  <input
                    type="checkbox"
                    checked={localAppSettings.soundsEnabled}
                    onChange={(e) => setLocalAppSettings(prev => ({ ...prev, soundsEnabled: e.target.checked }))}
                    className="w-5 h-5"
                  />
                </div>
                
                <div>
                  <Label>Głośność Główna</Label>
                  <Slider
                    value={[localAppSettings.volume * 100]}
                    onValueChange={([value]) => 
                      setLocalAppSettings(prev => ({ ...prev, volume: value / 100 }))
                    }
                    max={100}
                    step={5}
                    className="mt-2"
                    disabled={!localAppSettings.soundsEnabled}
                  />
                  <span className="text-sm text-gray-400">{Math.round(localAppSettings.volume * 100)}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#00E0FF] mb-4">Ustawienia Zaawansowane</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Czcionka</Label>
                  <select
                    id="fontFamily"
                    value={localAppSettings.fontFamily}
                    onChange={(e) => setLocalAppSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="backgroundColor">Kolor Tła</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={localAppSettings.backgroundColor}
                      onChange={(e) => setLocalAppSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localAppSettings.backgroundColor}
                      onChange={(e) => setLocalAppSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsView;
