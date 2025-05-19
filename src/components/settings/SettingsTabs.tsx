
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, FileQuestion, Layers, Palette, Volume2, 
  UserCog, Trophy, PieChart, BotIcon, Lock, 
  TestTube, BarChart, Calendar
} from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <TabsList className="bg-black/40 border border-white/10 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
      <TabsTrigger
        value="gracze"
        className={`flex items-center ${
          activeTab === 'gracze' ? 'bg-neon-blue text-white' : 'text-white/70'
        }`}
      >
        <Users size={16} className="mr-2" /> Gracze
      </TabsTrigger>
      
      <TabsTrigger
        value="pytania"
        className={`flex items-center ${
          activeTab === 'pytania' ? 'bg-neon-green text-black' : 'text-white/70'
        }`}
      >
        <FileQuestion size={16} className="mr-2" /> Pytania
      </TabsTrigger>
      
      <TabsTrigger
        value="karty"
        className={`flex items-center ${
          activeTab === 'karty' ? 'bg-neon-yellow text-black' : 'text-white/70'
        }`}
      >
        <Layers size={16} className="mr-2" /> Karty
      </TabsTrigger>
      
      <TabsTrigger
        value="rundy"
        className={`flex items-center ${
          activeTab === 'rundy' ? 'bg-neon-purple text-white' : 'text-white/70'
        }`}
      >
        <BarChart size={16} className="mr-2" /> Rundy
      </TabsTrigger>
      
      <TabsTrigger
        value="motywy"
        className={`flex items-center ${
          activeTab === 'motywy' ? 'bg-neon-pink text-white' : 'text-white/70'
        }`}
      >
        <Palette size={16} className="mr-2" /> Motywy
      </TabsTrigger>
      
      <TabsTrigger
        value="dzwieki"
        className={`flex items-center ${
          activeTab === 'dzwieki' ? 'bg-neon-blue/70 text-white' : 'text-white/70'
        }`}
      >
        <Volume2 size={16} className="mr-2" /> Dźwięki
      </TabsTrigger>
      
      <TabsTrigger
        value="role"
        className={`flex items-center ${
          activeTab === 'role' ? 'bg-neon-green/70 text-black' : 'text-white/70'
        }`}
      >
        <UserCog size={16} className="mr-2" /> Role
      </TabsTrigger>
      
      <TabsTrigger
        value="ranking"
        className={`flex items-center ${
          activeTab === 'ranking' ? 'bg-neon-yellow/70 text-black' : 'text-white/70'
        }`}
      >
        <Trophy size={16} className="mr-2" /> Ranking
      </TabsTrigger>
      
      <TabsTrigger
        value="kolo"
        className={`flex items-center ${
          activeTab === 'kolo' ? 'bg-neon-purple/70 text-white' : 'text-white/70'
        }`}
      >
        <PieChart size={16} className="mr-2" /> Koło
      </TabsTrigger>
      
      <TabsTrigger
        value="automatyzacja"
        className={`flex items-center ${
          activeTab === 'automatyzacja' ? 'bg-neon-pink/70 text-white' : 'text-white/70'
        }`}
      >
        <BotIcon size={16} className="mr-2" /> Boty
      </TabsTrigger>
      
      <TabsTrigger
        value="haslo"
        className={`flex items-center ${
          activeTab === 'haslo' ? 'bg-neon-blue/40 text-white' : 'text-white/70'
        }`}
      >
        <Lock size={16} className="mr-2" /> Hasło
      </TabsTrigger>
      
      <TabsTrigger
        value="testy"
        className={`flex items-center ${
          activeTab === 'testy' ? 'bg-neon-green/40 text-black' : 'text-white/70'
        }`}
      >
        <TestTube size={16} className="mr-2" /> Testy
      </TabsTrigger>
      
      <TabsTrigger
        value="kalendarz"
        className={`flex items-center ${
          activeTab === 'kalendarz' ? 'bg-neon-yellow/40 text-black' : 'text-white/70'
        }`}
      >
        <Calendar size={16} className="mr-2" /> Kalendarz
      </TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabs;
