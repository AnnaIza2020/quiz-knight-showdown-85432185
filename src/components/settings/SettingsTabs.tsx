
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircleQuestion, 
  CreditCard, 
  Layers, 
  Palette, 
  Volume2, 
  ShieldCheck, 
  Trophy, 
  PieChart, 
  Bot, 
  Lock, 
  BarChart, 
  Calendar, 
  Bug, 
  Save 
} from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mb-4">
      <TabsTrigger value="gracze" className="flex items-center px-2">
        <Users className="w-4 h-4 mr-1" /> Gracze
      </TabsTrigger>
      <TabsTrigger value="pytania" className="flex items-center px-2">
        <MessageCircleQuestion className="w-4 h-4 mr-1" /> Pytania
      </TabsTrigger>
      <TabsTrigger value="karty" className="flex items-center px-2">
        <CreditCard className="w-4 h-4 mr-1" /> Karty
      </TabsTrigger>
      <TabsTrigger value="rundy" className="flex items-center px-2">
        <Layers className="w-4 h-4 mr-1" /> Rundy
      </TabsTrigger>
      <TabsTrigger value="motywy" className="flex items-center px-2">
        <Palette className="w-4 h-4 mr-1" /> Motywy
      </TabsTrigger>
      <TabsTrigger value="dzwieki" className="flex items-center px-2">
        <Volume2 className="w-4 h-4 mr-1" /> Dźwięki
      </TabsTrigger>
      <TabsTrigger value="role" className="flex items-center px-2">
        <ShieldCheck className="w-4 h-4 mr-1" /> Role
      </TabsTrigger>
      <TabsTrigger value="ranking" className="flex items-center px-2">
        <Trophy className="w-4 h-4 mr-1" /> Ranking
      </TabsTrigger>
      <TabsTrigger value="kolo" className="flex items-center px-2">
        <PieChart className="w-4 h-4 mr-1" /> Koło
      </TabsTrigger>
      <TabsTrigger value="automatyzacja" className="flex items-center px-2">
        <Bot className="w-4 h-4 mr-1" /> Automatyzacja
      </TabsTrigger>
      <TabsTrigger value="diagnostyka" className="flex items-center px-2">
        <Bug className="w-4 h-4 mr-1" /> Diagnostyka
      </TabsTrigger>
      <TabsTrigger value="backupy" className="flex items-center px-2">
        <Save className="w-4 h-4 mr-1" /> Backupy
      </TabsTrigger>
      <TabsTrigger value="haslo" className="flex items-center px-2">
        <Lock className="w-4 h-4 mr-1" /> Hasło
      </TabsTrigger>
      <TabsTrigger value="testy" className="flex items-center px-2">
        <BarChart className="w-4 h-4 mr-1" /> Testy
      </TabsTrigger>
      <TabsTrigger value="kalendarz" className="flex items-center px-2">
        <Calendar className="w-4 h-4 mr-1" /> Kalendarz
      </TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabs;
