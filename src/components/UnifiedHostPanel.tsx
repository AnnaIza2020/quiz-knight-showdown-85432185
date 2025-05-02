
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import Host from '@/pages/Host';
import HostPanel from '@/pages/HostPanel';

const UnifiedHostPanel = () => {
  const [activeView, setActiveView] = useState<string>('modern');
  const { round } = useGameContext();

  return (
    <div className="min-h-screen bg-neon-background p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white text-center mb-4">Panel Prowadzącego</h1>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="modern" className="text-base py-3">
              Panel Nowoczesny
            </TabsTrigger>
            <TabsTrigger value="classic" className="text-base py-3">
              Panel Klasyczny
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="modern">
              <HostPanel />
            </TabsContent>
            <TabsContent value="classic">
              <Host />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedHostPanel;
