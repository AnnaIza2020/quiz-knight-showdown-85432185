
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
import { motion } from 'framer-motion';

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
  const [isSkipping, setIsSkipping] = React.useState(false);
  
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
    
    try {
      // Save to Supabase
      const result = await saveGameEdition(gameData, editionName);
      
      if (result.success) {
        toast.success(`Edycja "${editionName}" zapisana pomyślnie!`);
        setSaveDialogOpen(false);
      } else {
        throw new Error('Failed to save game edition');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas zapisywania edycji');
      console.error(error);
    }
  };
  
  // Enhanced skip question functionality with animation
  const handleSkipQuestionWithFeedback = () => {
    setIsSkipping(true);
    playSound('wheel-tick');
    
    setTimeout(() => {
      handleSkipQuestion();
      toast.info('Pytanie pominięte!');
      setIsSkipping(false);
    }, 500);
  };
  
  // Start game with intro
  const startGame = () => {
    setRound(GameRound.ROUND_ONE);
    toast.success('Runda 1 rozpoczęta!');
    playSound('success');
  };

  return (
    <div className="hidden lg:block w-64 space-y-4">
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">Akcje</h3>
        
        <div className="space-y-3">
          {round === GameRound.SETUP && (
            <motion.button 
              className="w-full py-3 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md hover:bg-neon-green/20 flex items-center justify-center transition-colors font-bold"
              onClick={startGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlayCircle size={18} className="mr-2" /> Start Gry
            </motion.button>
          )}
          
          <motion.button 
            className="w-full py-3 px-4 bg-black border border-neon-purple text-neon-purple rounded-md hover:bg-neon-purple/20 flex items-center justify-center transition-colors"
            onClick={resetGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={18} className="mr-2" /> Nowa Gra
          </motion.button>
          
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                className="w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={18} className="mr-2" /> Zapisz Edycję
              </motion.button>
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
          
          <motion.button 
            className="w-full py-3 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20 flex items-center justify-center transition-colors"
            onClick={handleTogglePause}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPaused ? (
              <><Play size={18} className="mr-2" /> Wznów Grę</>
            ) : (
              <><Pause size={18} className="mr-2" /> Przerwa</>
            )}
          </motion.button>
          
          <motion.button 
            className={`w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center transition-colors ${isSkipping ? 'animate-pulse' : ''}`}
            onClick={handleSkipQuestionWithFeedback}
            disabled={isSkipping}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SkipForward size={18} className="mr-2" /> Pomiń Pytanie
          </motion.button>

          <motion.button 
            className="w-full py-3 px-4 bg-black border border-neon-green text-neon-green rounded-md hover:bg-neon-green/20 flex items-center justify-center transition-colors"
            onClick={handleSoundToggle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {soundMuted ? (
              <><VolumeX size={18} className="mr-2" /> Włącz Dźwięk</>
            ) : (
              <><Volume2 size={18} className="mr-2" /> Wycisz Dźwięk</>
            )}
          </motion.button>
          
          <motion.button 
            className="w-full py-4 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md hover:bg-neon-red/20 flex items-center justify-center font-bold mt-6 transition-colors"
            onClick={handleFinishGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X size={18} className="mr-2" /> Zakończ Grę
          </motion.button>
        </div>
      </div>
      
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-2 text-white">Nawigacja</h3>
        <div className="space-y-2">
          <motion.button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/')}
            whileHover={{ x: 5 }}
          >
            Strona Główna
          </motion.button>
          <motion.button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/overlay')}
            whileHover={{ x: 5 }}
          >
            Przejdź do Overlay
          </motion.button>
          <motion.button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left transition-colors"
            onClick={() => navigate('/settings')}
            whileHover={{ x: 5 }}
          >
            Ustawienia
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
