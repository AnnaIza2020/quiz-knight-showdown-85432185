
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NeonLogo from '@/components/NeonLogo';
import { useGameContext } from '@/context/GameContext';

const Index = () => {
  const { playSound } = useGameContext();

  const handleButtonClick = () => {
    playSound('success');
  };

  return (
    <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-10">
          <NeonLogo size="lg" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple bg-clip-text text-transparent">
          Discord Game Show
        </h1>
        
        <p className="text-lg text-white/80 mb-10">
          Neonowa aplikacja quizowa z trzema unikalnymi rundami i pełnym wsparciem streamingu.
          Prowadź ekscytujące teleturnieje na żywo z graczami i widzami!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-neon-pink/30 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-neon-pink">Runda 1</h2>
            <p className="flex-grow text-white/70 mb-4 text-sm">
              Zróżnicowana wiedza z Internetu. 10 graczy rywalizuje o punkty i zdrowie. Do rundy 2 przechodzi 6 najlepszych.
            </p>
            <div className="text-xs text-neon-pink/50 font-bold">Pytania punktowane: 5-20 pkt</div>
          </div>
          
          <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-neon-blue/30 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-neon-blue">Runda 2</h2>
            <p className="flex-grow text-white/70 mb-4 text-sm">
              Runda 5 sekund. 6 graczy z trzema życiami odpowiada błyskawicznie. Do finału przechodzi 3 graczy.
            </p>
            <div className="text-xs text-neon-blue/50 font-bold">Odpowiedź w 5 sekund</div>
          </div>
          
          <div className="p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-neon-purple/30 flex flex-col">
            <h2 className="text-xl font-bold mb-3 text-neon-purple">Runda 3</h2>
            <p className="flex-grow text-white/70 mb-4 text-sm">
              Koło Fortuny. 3 finalistów walczy o zwycięstwo. Losowe kategorie i finałowa konfrontacja.
            </p>
            <div className="text-xs text-neon-purple/50 font-bold">Koło fortuny i eliminacje 1v1</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/host" className="col-span-1">
            <Button
              onClick={handleButtonClick}
              className="w-full py-6 text-lg bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 transition-opacity"
            >
              Panel Hosta
            </Button>
          </Link>
          
          <Link to="/overlay" className="col-span-1">
            <Button
              onClick={handleButtonClick}
              className="w-full py-6 text-lg bg-gradient-to-r from-neon-blue to-neon-green hover:opacity-90 transition-opacity"
            >
              Nakładka OBS
            </Button>
          </Link>
          
          <Link to="/settings" className="col-span-1">
            <Button
              onClick={handleButtonClick}
              className="w-full py-6 text-lg bg-gradient-to-r from-neon-yellow to-neon-orange hover:opacity-90 transition-opacity"
            >
              Ustawienia
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 text-white/40 text-sm">
          <p>Wersja 1.0.0 • Polski Discord Game Show</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
