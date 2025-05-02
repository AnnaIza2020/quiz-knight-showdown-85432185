
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface RankingEntry {
  id: string;
  nick: string;
  points: number;
  cardsUsed: number;
  eliminationRound: string;
}

const SettingsRanking = () => {
  const [selectedEdition, setSelectedEdition] = useState('current');
  
  // Mock ranking data - in a real app, this would come from the GameContext
  const rankingData: RankingEntry[] = [];
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Ranking</h2>
      <p className="text-white/60 text-sm mb-6">
        Zestawienie wyników i przebiegu rozgrywek.
      </p>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="edition" className="text-white mr-2">Edycja:</label>
          <select 
            id="edition"
            className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded"
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(e.target.value)}
          >
            <option value="current">Bieżąca edycja</option>
            <option value="previous">Poprzednia edycja</option>
            <option value="archive">Archiwum</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="text-white border-gray-700 flex items-center gap-2">
            <Download size={16} /> Eksportuj do PDF
          </Button>
          <Button variant="outline" className="text-white border-gray-700 flex items-center gap-2">
            <Download size={16} /> Eksportuj do CSV
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/40 text-left">
              <th className="p-3 text-white">#</th>
              <th className="p-3 text-white">Nick</th>
              <th className="p-3 text-white">Punkty</th>
              <th className="p-3 text-white">Karty użyte</th>
              <th className="p-3 text-white">Runda eliminacji</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.length > 0 ? (
              rankingData.map((entry, index) => (
                <tr key={entry.id} className="border-t border-gray-800">
                  <td className="p-3 text-white">{index + 1}</td>
                  <td className="p-3 text-white font-medium">{entry.nick}</td>
                  <td className="p-3 text-white">{entry.points}</td>
                  <td className="p-3 text-white">{entry.cardsUsed}</td>
                  <td className="p-3 text-white">{entry.eliminationRound}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/60">
                  Brak danych do wyświetlenia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Statystyki graczy</h3>
        <div className="bg-black/30 rounded-lg p-6 border border-gray-800 text-center">
          <p className="text-white/60">Brak danych statystycznych</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsRanking;
