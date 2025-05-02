
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SettingsCards = () => {
  const [activeTab, setActiveTab] = useState("zasady");
  
  // Mock data for special cards
  const specialCards = [
    {
      id: "card1",
      condition: "3 poprawne odpowiedzi z rzędu",
      cardName: "Déjà Vu",
      description: "Pozwala na powtórzenie pytania"
    },
    {
      id: "card2",
      condition: "50+ punktów w Rundzie 1",
      cardName: "Turbo",
      description: "Podwaja zdobyte punkty za poprawną odpowiedź"
    },
    {
      id: "card3",
      condition: "Runda bez utraty życia",
      cardName: "Na Ratunek",
      description: "Ratuje przed eliminacją, przywraca 1 życie"
    },
    {
      id: "card4",
      condition: "Najwięcej punktów w Rundzie 1",
      cardName: "Refleks x2",
      description: "Daje dwa razy więcej czasu na odpowiedź"
    },
    {
      id: "card5",
      condition: "Awans z rundy",
      cardName: "Kontra",
      description: "Pozwala przejąć pytanie innego gracza"
    }
  ];
  
  const rescueCards = [
    {
      id: "rescue1",
      condition: "Po R1 - gracz z najmniejszą liczbą punktów",
      cardName: "Na Ratunek"
    },
    {
      id: "rescue2",
      condition: "Na start R3 - gracz z najmniejszą liczbą żyć",
      cardName: "Na Ratunek"
    }
  ];
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Karty Specjalne</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="bg-black/30 w-full justify-start overflow-x-auto border-b border-gray-800">
          <TabsTrigger value="zasady" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Zasady przyznawania
          </TabsTrigger>
          <TabsTrigger value="test" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Test animacji
          </TabsTrigger>
          <TabsTrigger value="przydziel" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Przydziel kartę
          </TabsTrigger>
          <TabsTrigger value="obrazy" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Obrazy kart
          </TabsTrigger>
          <TabsTrigger value="animacje" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Animacje kart
          </TabsTrigger>
          <TabsTrigger value="akcje" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Animacje akcji
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="zasady" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Automatyczne przyznawanie kart</h3>
            <Button className="bg-neon-green hover:bg-neon-green/80 gap-2">
              <Plus size={16} /> Nowa zasada
            </Button>
          </div>
          
          <div className="space-y-4 mb-8">
            {specialCards.map((card) => (
              <div 
                key={card.id}
                className="bg-black/30 border border-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-white/70">{card.condition}</p>
                  <p className="font-semibold text-neon-green mt-1">Karta: {card.cardName}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-white">
                    Edytuj
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-red-400 hover:text-red-300">
                    Usuń
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Karty "Na Ratunek"</h3>
          <div className="space-y-3">
            {rescueCards.map((card) => (
              <div 
                key={card.id}
                className="bg-black/30 border border-gray-800 p-3 rounded-lg"
              >
                <p className="text-white">{card.condition}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="test" className="mt-6">
          <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-white/60">Tutaj będzie test animacji kart</p>
          </div>
        </TabsContent>
        
        <TabsContent value="przydziel" className="mt-6">
          <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-white/60">Panel przydzielenia kart graczom</p>
          </div>
        </TabsContent>
        
        <TabsContent value="obrazy" className="mt-6">
          <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-white/60">Zarządzanie obrazami kart</p>
          </div>
        </TabsContent>
        
        <TabsContent value="animacje" className="mt-6">
          <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-white/60">Zarządzanie animacjami kart</p>
          </div>
        </TabsContent>
        
        <TabsContent value="akcje" className="mt-6">
          <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-white/60">Zarządzanie animacjami akcji</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsCards;
