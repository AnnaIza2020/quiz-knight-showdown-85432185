
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, Users, Play } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';

const Setup = () => {
  const { setRound, players } = useGameContext();
  
  const startGame = () => {
    setRound(GameRound.ROUND_ONE);
  };
  
  return (
    <div className="min-h-screen bg-neon-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-black/50 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">
            Przygotuj swoją grę
          </CardTitle>
          <CardDescription className="text-center text-white/70">
            Skonfiguruj graczy i ustawienia zanim rozpoczniesz grę
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Gracze
              </h3>
              <span className="text-sm text-white/60">
                {players.length} / 10
              </span>
            </div>
            <p className="text-sm text-white/70">
              {players.length === 0 ? 
                'Brak dodanych graczy. Dodaj graczy w ustawieniach.' :
                `${players.length} graczy gotowych do gry.`}
            </p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <h3 className="font-medium text-white flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Ustawienia gry
              </h3>
            </div>
            <p className="text-sm text-white/70">
              Skonfiguruj pytania, karty specjalne i inne opcje.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={startGame}
            disabled={players.length === 0}
          >
            <Play className="w-4 h-4 mr-2" />
            Rozpocznij grę
          </Button>
          
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/settings">Ustawienia</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">Powrót</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Setup;
