
import React, { useCallback } from 'react';
import PlayerStats from '@/components/player/PlayerStats';
import QuestionSection from '@/components/player/QuestionSection';
import AnswerInput from '@/components/player/AnswerInput';
import TimerWrapper from '@/components/player/TimerWrapper';
import CardDisplay from '@/components/player/CardDisplay';
import StatusPanel from '@/components/player/StatusPanel';
import GameEventNotification from '@/components/player/GameEventNotification';
import ConnectionIndicator from '@/components/player/ConnectionIndicator';
import { usePlayerConnection } from '@/hooks/usePlayerConnection';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyLoadedImage } from '@/components/ui/LazyLoadedImage';
import { useMemoizedSelector } from '@/hooks/useMemoizedSelector';

interface PlayerViewContentProps {
  player: any;
}

const PlayerViewContent: React.FC<PlayerViewContentProps> = ({ player }) => {
  const { 
    gameEvent,
    timerRunning,
    timerSeconds,
    connectionStatus,
    question
  } = usePlayerConnection({
    playerId: player.id,
    playerNickname: player.nickname
  });
  
  // Optymalizacja renderowania przy korzystaniu z kontekstu gry
  const gameSettings = useMemoizedSelector(state => ({
    primaryColor: state.primaryColor,
    secondaryColor: state.secondaryColor
  }));
  
  const handleAnswerSubmit = useCallback((answer: string) => {
    console.log('Submitted answer:', answer);
    // Here you would typically send the answer to the game host/server
  }, []);

  const handleUseCard = useCallback((cardId: string) => {
    console.log('Using card:', cardId);
    // Here you would typically send the card usage to the game host/server
  }, []);
  
  const playerCards = player.specialCards?.map((cardId: string) => {
    // This would typically fetch card details from a cards context/state
    // For now, just create some placeholder data
    return {
      id: cardId,
      name: `Karta ${cardId.substr(0, 4)}`,
      description: 'Karta specjalna z mocą strategiczną',
      type: 'Bonus'
    };
  }) || [];
  
  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Connection status indicator */}
      <ConnectionIndicator status={connectionStatus} />
      
      {/* Player stats (points, health) */}
      <PlayerStats player={player} />
      
      {/* Game events notification */}
      <GameEventNotification message={gameEvent} />
      
      {/* Timer display */}
      <TimerWrapper 
        seconds={timerSeconds} 
        isRunning={timerRunning}
        size="lg"
      />
      
      {/* Question display if available */}
      {question && <QuestionSection question={question} />}
      
      {/* Answer input if question is available */}
      {question && (
        <AnswerInput 
          onSubmit={handleAnswerSubmit}
          options={question.options}
          multipleChoice={question.type === 'multiple_choice'}
          disabled={!timerRunning}
        />
      )}
      
      {/* Camera preview - zoptymalizowane z lazy loading */}
      <div className="aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/20 mb-6">
        {player.camera_url ? (
          <iframe 
            src={player.camera_url} 
            className="w-full h-full" 
            allowFullScreen
            title="Player camera"
            loading="lazy"
          />
        ) : player.avatar_url ? (
          <LazyLoadedImage 
            src={player.avatar_url} 
            alt={player.nickname} 
            className="w-full h-full object-cover"
            fallbackElement={
              <Skeleton className="w-full h-full bg-gray-800/50" />
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/50">Brak kamery</span>
          </div>
        )}
      </div>
      
      {/* Player cards display if available */}
      {playerCards.length > 0 && (
        <CardDisplay 
          cards={playerCards} 
          onUseCard={handleUseCard}
        />
      )}
      
      {/* Status panel */}
      <StatusPanel player={player} />
    </div>
  );
};

// Wykorzystanie memo do zoptymalizowania renderowania komponentu
export default React.memo(PlayerViewContent, (prevProps, nextProps) => {
  return prevProps.player.id === nextProps.player.id &&
         prevProps.player.nickname === nextProps.player.nickname &&
         prevProps.player.points === nextProps.player.points &&
         prevProps.player.health === nextProps.player.health;
});
