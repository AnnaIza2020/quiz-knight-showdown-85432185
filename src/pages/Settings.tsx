
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ThemeSettings from '@/components/settings/ThemeSettings';
import SettingsSounds from '@/components/settings/SettingsSounds';
import SettingsRoles from '@/components/settings/SettingsRoles';
import SettingsRanking from '@/components/settings/SettingsRanking';
import SettingsAutomation from '@/components/settings/SettingsAutomation';
import SettingsPlayers from '@/components/settings/SettingsPlayers';
import SettingsQuestions from '@/components/settings/SettingsQuestions';
import SettingsCards from '@/components/settings/SettingsCards';
import GamePasswordSettings from '@/components/settings/GamePasswordSettings';
import SettingsTests from '@/components/settings/SettingsTests';
import SettingsWheelCategories from '@/components/settings/SettingsWheelCategories';
import RoundSettingsPanel from '@/components/settings/RoundSettingsPanel';
import PlayerAvailabilityCalendar from '@/components/settings/player/PlayerAvailabilityCalendar';
import DiagnosticsPanel from '@/components/diagnostics/DiagnosticsPanel';
import ImportExportPanel from '@/components/diagnostics/ImportExportPanel';
import { useSettingsExport } from '@/hooks/useSettingsExport';
import { pathToTab } from '@/components/settings/SettingsTabsMapping';
import { useGameContext } from '@/context/GameContext';
import { LogsProvider } from '@/context/LogsContext';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleExportSettings, handleImportSettings } = useSettingsExport();
  const { players } = useGameContext();
  
  // Determine active tab based on current path
  const getCurrentTab = () => {
    const path = location.pathname;
    // Default to 'gracze' if path not found
    return pathToTab[path] || "gracze";
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  
  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);
  
  // Funkcja do zmiany zakładki
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Naviguj do odpowiedniej ścieżki
    const path = Object.entries(pathToTab).find(([_, tab]) => tab === value)?.[0];
    if (path) {
      navigate(path);
    }
  };
  
  return (
    <LogsProvider>
      <div className="min-h-screen bg-black text-white p-4 pb-24">
        {/* Header */}
        <SettingsHeader 
          onExportSettings={handleExportSettings} 
          onImportSettings={handleImportSettings}
        />
        
        {/* Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <SettingsTabs 
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
            
            {/* Content based on active tab */}
            <TabsContent value="gracze">
              <SettingsPlayers />
            </TabsContent>
            
            <TabsContent value="pytania">
              <SettingsQuestions />
            </TabsContent>
            
            <TabsContent value="karty">
              <SettingsCards />
            </TabsContent>
            
            <TabsContent value="rundy">
              <RoundSettingsPanel />
            </TabsContent>
            
            <TabsContent value="motywy">
              <ThemeSettings />
            </TabsContent>
            
            <TabsContent value="dzwieki">
              <SettingsSounds />
            </TabsContent>
            
            <TabsContent value="role">
              <SettingsRoles />
            </TabsContent>
            
            <TabsContent value="ranking">
              <SettingsRanking />
            </TabsContent>
            
            <TabsContent value="kolo">
              <SettingsWheelCategories />
            </TabsContent>
            
            <TabsContent value="automatyzacja">
              <SettingsAutomation />
            </TabsContent>
            
            <TabsContent value="diagnostyka">
              <DiagnosticsPanel />
            </TabsContent>
            
            <TabsContent value="backupy">
              <ImportExportPanel />
            </TabsContent>
            
            <TabsContent value="haslo">
              <GamePasswordSettings />
            </TabsContent>
            
            <TabsContent value="testy">
              <SettingsTests />
            </TabsContent>
            
            {/* Availability Calendar */}
            <TabsContent value="kalendarz">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Kalendarz dostępności graczy</h2>
                <PlayerAvailabilityCalendar 
                  players={players}
                  isHost={true}
                  onSaveAvailability={(availability) => {
                    console.log('Saving availability:', availability);
                    // Here you would save this to your database or state
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LogsProvider>
  );
};

export default Settings;
