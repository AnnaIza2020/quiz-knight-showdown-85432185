import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Save, X } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import { loadGameData } from '@/lib/supabase';
import { toast } from 'sonner';

const TopBar = () => {
  const { round, setRound, gameTitle, setGameTitle } = useGameContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Load game password on component mount
  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const result = await loadGameData('game_password');
        if (result.success && result.data) {
          setStoredPassword(result.data);
        }
      } catch (error) {
        console.error('Error loading game password:', error);
      }
    };

    fetchPassword();
  }, []);

  const handleEditClick = () => {
    if (storedPassword && !isPasswordChecked) {
      setIsPasswordDialogOpen(true);
    } else {
      startEditing();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedTitle(gameTitle);
  };

  const handleSaveClick = () => {
    setGameTitle(editedTitle);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const checkPassword = () => {
    setIsAuthenticating(true);
    
    setTimeout(() => {
      if (password === storedPassword) {
        setIsPasswordChecked(true);
        setIsPasswordDialogOpen(false);
        startEditing();
        toast.success('Password verified!');
      } else {
        toast.error('Incorrect password!');
      }
      setPassword('');
      setIsAuthenticating(false);
    }, 500);
  };

  const getRoundLabel = () => {
    switch(round) {
      case GameRound.SETUP:
        return 'Przygotowanie';
      case GameRound.ROUND_ONE:
        return 'Runda 1';
      case GameRound.ROUND_TWO:
        return 'Runda 2';
      case GameRound.ROUND_THREE:
        return 'Runda 3';
      case GameRound.FINISHED:
        return 'Zakończono';
      default:
        return `Runda ${round}`;
    }
  };

  const getBadgeColor = () => {
    switch(round) {
      case GameRound.SETUP:
        return 'bg-blue-500';
      case GameRound.ROUND_ONE:
        return 'bg-green-500';
      case GameRound.ROUND_TWO:
        return 'bg-yellow-500';
      case GameRound.ROUND_THREE:
        return 'bg-purple-500';
      case GameRound.FINISHED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-lg mb-4">
      <div className="flex items-center">
        <Badge 
          variant="secondary" 
          className={`${getBadgeColor()} text-white mr-4 px-3 py-1`}
        >
          {getRoundLabel()}
        </Badge>
        
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-64 bg-slate-700 border-slate-600"
            />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSaveClick}
              className="text-green-400 hover:text-green-500 hover:bg-slate-700"
            >
              <Save size={16} className="mr-1" /> Zapisz
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleCancelClick}
              className="text-red-400 hover:text-red-500 hover:bg-slate-700"
            >
              <X size={16} /> Anuluj
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-white mr-2">
              {gameTitle || 'Discord Game Show'}
            </h2>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleEditClick}
              className="text-blue-400 hover:text-blue-500 hover:bg-slate-700"
            >
              <Pencil size={14} />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Wymagane hasło</DialogTitle>
            <DialogDescription>
              Podaj hasło aby edytować nazwę gry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="password">Hasło</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wprowadź hasło"
                  className="bg-slate-700 border-slate-600"
                  onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!password || isAuthenticating}
                onClick={checkPassword}
              >
                {isAuthenticating ? 'Sprawdzanie...' : 'Weryfikuj'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopBar;
