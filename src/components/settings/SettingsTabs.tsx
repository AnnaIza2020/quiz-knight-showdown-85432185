
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tabToPath } from './SettingsTabsMapping';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(tabToPath[value]);
  };
  
  return (
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
  );
};

export default SettingsTabs;
