
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsTabs from '@/components/settings/SettingsTabs';
import SettingsTabContent from '@/components/settings/SettingsTabContent';
import { useSettingsExport } from '@/hooks/useSettingsExport';
import { pathToTab } from '@/components/settings/SettingsTabsMapping';

const Settings = () => {
  const location = useLocation();
  const { handleExportSettings } = useSettingsExport();
  
  // Determine active tab based on current path
  const getCurrentTab = () => {
    const path = location.pathname;
    // Default to 'gracze' if path not found
    return pathToTab[path] || "gracze";
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* Header */}
      <SettingsHeader onExportSettings={handleExportSettings} />
      
      {/* Tabs */}
      <div className="mb-6">
        <SettingsTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Content for each tab */}
        <SettingsTabContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Settings;
