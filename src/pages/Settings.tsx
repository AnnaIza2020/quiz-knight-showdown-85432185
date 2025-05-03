
import React, { useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload, HelpCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeSettings from '@/components/settings/ThemeSettings';
import SettingsSounds from '@/components/settings/SettingsSounds';
import SettingsRoles from '@/components/settings/SettingsRoles';
import SettingsRanking from '@/components/settings/SettingsRanking';
import SettingsAutomation from '@/components/settings/SettingsAutomation';
import SettingsPlayers from '@/components/settings/SettingsPlayers';
import SettingsQuestions from '@/components/settings/SettingsQuestions';
import SettingsCards from '@/components/settings/SettingsCards';
import GamePasswordSettings from '@/components/settings/GamePasswordSettings';
import { usePlayerConnection } from '@/hooks/usePlayerConnection';
import { toast } from 'sonner';

// Tab mapping for URL handling
const tabToPath = {
  "gracze": "/settings",
  "pytania": "/settings/pytania",
  "karty": "/settings/karty",
  "motywy": "/settings/motywy",
  "dzwieki": "/settings/dzwieki",
  "role": "/settings/role",
  "ranking": "/settings/ranking",
  "automatyzacja": "/settings/automatyzacja",
  "haslo": "/settings/haslo"
};

const pathToTab = {
  "/settings": "gracze",
  "/settings/pytania": "pytania",
  "/settings/karty": "karty",
  "/settings/motywy": "motywy",
  "/settings/dzwieki": "dzwieki",
  "/settings/role": "role",
  "/settings/ranking": "ranking",
  "/settings/automatyzacja": "automatyzacja",
  "/settings/haslo": "haslo"
};

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status: connectionStatus } = usePlayerConnection();
  
  // Determine active tab based on current path
  const getCurrentTab = () => {
    const path = location.pathname;
    // Default to 'gracze' if path not found
    return pathToTab[path] || "gracze";
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(tabToPath[value]);
  };
  
  const handleExportSettings = () => {
    try {
      // Get all settings from localStorage
      const settings = {
        players: JSON.parse(localStorage.getItem('gameShowPlayers') || '[]'),
        categories: JSON.parse(localStorage.getItem('gameShowCategories') || '[]'),
        specialCards: JSON.parse(localStorage.getItem('gameShowSpecialCards') || '[]'),
        specialCardRules: JSON.parse(localStorage.getItem('gameShowSpecialCardRules') || '[]'),
        settings: JSON.parse(localStorage.getItem('gameShowSettings') || '{}'),
        theme: JSON.parse(localStorage.getItem('gameTheme') || '{}'),
        exportedAt: new Date().toISOString(),
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `gameshow_settings_${new Date().toLocaleDateString('pl-PL')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Ustawienia zostały wyeksportowane');
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Nie udało się wyeksportować ustawień');
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="text-neon-green hover:text-neon-green/80 flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Powrót do strony głównej</span>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Panel Ustawień</h1>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <HelpCircle size={16} className="text-white/60" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="max-w-xs">
                  W panelu ustawień możesz skonfigurować wszystkie aspekty gry.
                  Zmiany są zapisywane automatycznie.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-1 ml-3 bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Połączono z bazą danych
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="flex items-center gap-1 ml-3 bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Problem z połączeniem
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handleExportSettings}
          >
            <Download size={14} className="mr-1" /> Eksportuj ustawienia
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info('Wylogowywanie nie jest jeszcze zaimplementowane')}>
            <Upload size={14} className="mr-1" /> Wyloguj
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <Tabs 
          defaultValue="gracze" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="bg-neon-background/20 border-b border-gray-800 w-full flex justify-start overflow-x-auto">
            <TabsTrigger 
              value="gracze"
              className="data-[state=active]:text-neon-pink data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-pink rounded-none"
            >
              Gracze
            </TabsTrigger>
            <TabsTrigger 
              value="pytania"
              className="data-[state=active]:text-neon-blue data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue rounded-none"
            >
              Pytania
            </TabsTrigger>
            <TabsTrigger 
              value="karty"
              className="data-[state=active]:text-neon-green data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green rounded-none"
            >
              Karty
            </TabsTrigger>
            <TabsTrigger 
              value="motywy"
              className="data-[state=active]:text-neon-yellow data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-yellow rounded-none"
            >
              Motywy
            </TabsTrigger>
            <TabsTrigger 
              value="dzwieki"
              className="data-[state=active]:text-neon-purple data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-purple rounded-none"
            >
              Dźwięki
            </TabsTrigger>
            <TabsTrigger 
              value="role"
              className="data-[state=active]:text-neon-orange data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-orange rounded-none"
            >
              Role
            </TabsTrigger>
            <TabsTrigger 
              value="ranking"
              className="data-[state=active]:text-neon-teal data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-teal rounded-none"
            >
              Ranking
            </TabsTrigger>
            <TabsTrigger 
              value="automatyzacja"
              className="data-[state=active]:text-neon-cyan data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-cyan rounded-none"
            >
              Automatyzacja
            </TabsTrigger>
            <TabsTrigger 
              value="haslo"
              className="data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none"
            >
              Hasło
            </TabsTrigger>
          </TabsList>
          
          {/* Content for each tab */}
          <Routes>
            <Route index element={
              <TabsContent value="gracze" className="mt-4">
                <SettingsPlayers />
              </TabsContent>
            } />
            <Route path="pytania" element={
              <TabsContent value="pytania" className="mt-4">
                <SettingsQuestions />
              </TabsContent>
            } />
            <Route path="karty" element={
              <TabsContent value="karty" className="mt-4">
                <SettingsCards />
              </TabsContent>
            } />
            <Route path="motywy" element={
              <TabsContent value="motywy" className="mt-4">
                <ThemeSettings />
              </TabsContent>
            } />
            <Route path="dzwieki" element={
              <TabsContent value="dzwieki" className="mt-4">
                <SettingsSounds />
              </TabsContent>
            } />
            <Route path="role" element={
              <TabsContent value="role" className="mt-4">
                <SettingsRoles />
              </TabsContent>
            } />
            <Route path="ranking" element={
              <TabsContent value="ranking" className="mt-4">
                <SettingsRanking />
              </TabsContent>
            } />
            <Route path="automatyzacja" element={
              <TabsContent value="automatyzacja" className="mt-4">
                <SettingsAutomation />
              </TabsContent>
            } />
            <Route path="haslo" element={
              <TabsContent value="haslo" className="mt-4">
                <GamePasswordSettings />
              </TabsContent>
            } />
            <Route path="*" element={
              <TabsContent value="gracze" className="mt-4">
                <SettingsPlayers />
              </TabsContent>
            } />
          </Routes>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
