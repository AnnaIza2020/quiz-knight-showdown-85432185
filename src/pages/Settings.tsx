
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
import { useSettingsExport } from '@/hooks/useSettingsExport';
import { pathToTab } from '@/components/settings/SettingsTabsMapping';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleExportSettings } = useSettingsExport();
  
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
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* Header */}
      <SettingsHeader onExportSettings={handleExportSettings} />
      
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
          
          <TabsContent value="automatyzacja">
            <SettingsAutomation />
          </TabsContent>
          
          <TabsContent value="haslo">
            <GamePasswordSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
