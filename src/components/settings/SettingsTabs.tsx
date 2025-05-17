
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { tabDefinitions } from './SettingsTabsMapping';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const SettingsTabs = ({ activeTab, setActiveTab }: SettingsTabsProps) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Find the path for this tab
    const tabDef = tabDefinitions.find(tab => tab.id === value);
    if (tabDef) {
      navigate(tabDef.path);
    }
  };

  return (
    <TabsList className="grid grid-cols-10 mb-6">
      {tabDefinitions.map(tab => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          onClick={() => handleTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default SettingsTabs;
