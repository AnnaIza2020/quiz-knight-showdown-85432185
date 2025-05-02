
import React from 'react';

const QuestionsStatistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Wszystkie pytania</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Runda 1: Wiedza</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Runda 2: Szybka</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Runda 3: Koło</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Standardowe</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Użyte pytania</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
      
      <div className="bg-black/30 rounded p-4 text-center">
        <h4 className="text-sm text-white/70 mb-2">Ulubione</h4>
        <p className="text-2xl font-bold text-white">0</p>
      </div>
    </div>
  );
};

export default QuestionsStatistics;
