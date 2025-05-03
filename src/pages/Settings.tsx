
import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Tabs } from '@/components/ui/tabs';
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
  
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* Header */}
      <SettingsHeader onExportSettings={handleExportSettings} />
      
      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          // Navigate to the corresponding path
          const path = Object.entries(pathToTab).find(([_, tab]) => tab === value)?.[0];
          if (path) {
            navigate(path);
          }
        }}>
          <SettingsTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          {/* Content based on current route */}
          <Routes>
            <Route index element={<SettingsPlayers />} />
            <Route path="pytania" element={<SettingsQuestions />} />
            <Route path="karty" element={<SettingsCards />} />
            <Route path="motywy" element={<ThemeSettings />} />
            <Route path="dzwieki" element={<SettingsSounds />} />
            <Route path="role" element={<SettingsRoles />} />
            <Route path="ranking" element={<SettingsRanking />} />
            <Route path="automatyzacja" element={<SettingsAutomation />} />
            <Route path="haslo" element={<GamePasswordSettings />} />
            <Route path="*" element={<SettingsPlayers />} />
          </Routes>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
