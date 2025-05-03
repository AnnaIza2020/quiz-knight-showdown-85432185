
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import ThemeSettings from '@/components/settings/ThemeSettings';
import SettingsSounds from '@/components/settings/SettingsSounds';
import SettingsRoles from '@/components/settings/SettingsRoles';
import SettingsRanking from '@/components/settings/SettingsRanking';
import SettingsAutomation from '@/components/settings/SettingsAutomation';
import SettingsPlayers from '@/components/settings/SettingsPlayers';
import SettingsQuestions from '@/components/settings/SettingsQuestions';
import SettingsCards from '@/components/settings/SettingsCards';
import GamePasswordSettings from '@/components/settings/GamePasswordSettings';

interface SettingsTabContentProps {
  activeTab: string;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ activeTab }) => {
  return (
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
  );
};

export default SettingsTabContent;
