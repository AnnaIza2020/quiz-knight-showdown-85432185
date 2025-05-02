
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Play, Pause, SkipForward, X, Volume2, VolumeX, Save, ChevronRight, PlayCircle } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveGameEdition } from '@/lib/supabase';
import { toast } from 'sonner';
import { GameRound } from '@/types/game-types';

interface ControlPanelProps {
  isPaused: boolean;
  handleTogglePause: () => void;
  handleSkipQuestion: () => void;
  handleFinishGame: () => void;
  resetGame: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isPaused, 
  handleTogglePause, 
  handleSkipQuestion, 
  handleFinishGame, 
  resetGame 
}) => {
  const navigate = useNavigate();
  const [soundMuted, setSoundMuted] = React.useState(false);
  const [editionName, setEditionName] = React.useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  
  const { playSound, setEnabled: setSoundsEnabled, round, setRound } = useGameContext();

  const handleSoundToggle = () => {
    setSoundMuted(!soundMuted);
    setSoundsEnabled(!soundMuted);
    toast.info(soundMuted ? 'Dźwięki włączone' : 'Dźwięki wyciszone');
  };
  
  const handleSaveEdition = async () => {
    if (!editionName.trim()) {
      toast.error('Nazwa edycji nie może być pusta');
      return;
    }
    
    // Get all game data to save
    const gameData = {
      players: localStorage.getItem('gameShowPlayers') ? 
        JSON.parse(localStorage.getItem('gameShowPlayers')!) : [],
      categories: localStorage.getItem('gameShowCategories') ? 
        JSON.parse(localStorage.getItem('gameShowCategories')!) : [],
      specialCards: localStorage.getItem('gameShowSpecialCards') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCards')!) : [],
      specialCardRules: localStorage.getItem('gameShowSpecialCardRules') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCardRules')!) : [],
      settings: localStorage.getItem('gameShowSettings') ? 
        JSON.parse(localStorage.getItem('gameShowSettings')!) : {},
      savedAt: new Date().toISOString()
    };
    
    // Save to Supabase
    const result = await saveGameEdition(gameData, editionName);
    
    if (result.success) {
      toast.success(`Edycja "${editionName}" zapisana pomyślnie!`);
      setSaveDialogOpen(false);
    }
  };
  
  // Start game with intro
  const startGameWithIntro = () => {
    // Play intro sound/animation
    playSound('round-start');
    toast.success('Czołówka teleturnieju!');
    
    // After intro finishes, start round 1
    setTimeout(() => {
      setRound(GameRound.ROUND_ONE);
      toast.success('Runda 1 rozpoczęta!');
      playSound('success');
    }, 5000); // Adjust time according to your intro animation
  };

  return (
    <div className="hidden lg:block w-64 space-y-4">
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">Akcje</h3>
        
        <div className="space-y-3">
          {round === GameRound.SETUP && (
            <button 
              className="w-full py-3 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md hover:bg-neon-green/20 flex items-center justify-center transition-colors font-bold"
              onClick={startGameWithIntro}
            >
              <PlayCircle size={18} className="mr-2" /> Start Gry
            </button>
          )}
          
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-purple text-neon-purple rounded-md hover:bg-neon-purple/20 flex items-center justify-center transition-colors"
            onClick={resetGame}
          >
            <RotateCcw size={18} className="mr-2" /> Nowa Gra
          </button>
          
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center transition-colors"
              >
                <Save size={18} className="mr-2" /> Zapisz Edycję
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Zapisz edycję gry</DialogTitle>
                <DialogDescription>
                  Podaj nazwę edycji, aby zapisać aktualny stan gry, w tym pytania, graczy i ustawienia.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edition-name" className="text-right">
                    Nazwa
                  </Label>
                  <Input
                    id="edition-name"
                    value={editionName}
                    onChange={(e) => setEditionName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleSaveEdition}>Zapisz</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20 flex items-center justify-center transition-colors"
            onClick={handleTogglePause}
          >
            {isPaused ? (
              <><Play size={18} className="mr-2" /> Wznów Grę</>
            ) : (
              <><Pause size={18} className="mr-2" /> Przerwa</>
            )}
          </button>
          
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center transition-colors"
            onClick={handleSkipQuestion}
          >
            <SkipForward size={18} className="mr-2" /> Pomiń Pytanie
          </button>

          <button 
            className="w-full py-3 px-4 bg-black border border-neon-green text-neon-green rounded-md hover:bg-neon-green/20 flex items-center justify-center transition-colors"
            onClick={handleSoundToggle}
          >
            {soundMuted ? (
              <><VolumeX size={18} className="mr-2" /> Włącz Dźwięk</>
            ) : (
              <><Volume2 size={18} className="mr-2" /> Wycisz Dźwięk</>
            )}
          </button>
          
          <button 
            className="w-full py-4 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md hover:bg-neon-red/20 flex items-center justify-center font-bold mt-6 transition-colors"
            onClick={handleFinishGame}
          >
            <X size={18} className="mr-2" /> Zakończ Grę
          </button>
        </div>
      </div>
      
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-2 text-white">Nawigacja</h3>
        <div className="space-y-2">
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/')}
          >
            Strona Główna
          </button>
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/overlay')}
          >
            Przejdź do Overlay
          </button>
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/settings')}
          >
            Ustawienia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
