
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SettingsPlayers from '@/components/settings/SettingsPlayers';
import SettingsQuestions from '@/components/settings/SettingsQuestions';
import SettingsCards from '@/components/settings/SettingsCards';
import SettingsThemes from '@/components/settings/SettingsThemes';
import SettingsSounds from '@/components/settings/SettingsSounds';
import SettingsRoles from '@/components/settings/SettingsRoles';
import SettingsRanking from '@/components/settings/SettingsRanking';
import SettingsAutomation from '@/components/settings/SettingsAutomation';

const Settings = () => {
  const [activeTab, setActiveTab] = useState("gracze");
  
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
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download size={14} className="mr-1" /> Pokaż ustawienia haseł
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Upload size={14} className="mr-1" /> Wyloguj
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <Tabs 
          defaultValue="gracze" 
          value={activeTab}
          onValueChange={setActiveTab}
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
          </TabsList>
          
          <TabsContent value="gracze" className="mt-4">
            <SettingsPlayers />
          </TabsContent>
          
          <TabsContent value="pytania" className="mt-4">
            <SettingsQuestions />
          </TabsContent>
          
          <TabsContent value="karty" className="mt-4">
            <SettingsCards />
          </TabsContent>
          
          <TabsContent value="motywy" className="mt-4">
            <SettingsThemes />
          </TabsContent>
          
          <TabsContent value="dzwieki" className="mt-4">
            <SettingsSounds />
          </TabsContent>
          
          <TabsContent value="role" className="mt-4">
            <SettingsRoles />
          </TabsContent>
          
          <TabsContent value="ranking" className="mt-4">
            <SettingsRanking />
          </TabsContent>
          
          <TabsContent value="automatyzacja" className="mt-4">
            <SettingsAutomation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
