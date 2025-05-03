
import React, { useState, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useHostActions } from '@/hooks/useHostActions';
import { useEditionManagement } from '@/hooks/useEditionManagement';
import GameStatusPanel from './host/panels/GameStatusPanel';
import GameTabsPanel from './host/panels/GameTabsPanel';
import TopBarControls from './hostpanel/TopBarControls';
import MenuPanel from './host/panels/MenuPanel';
import EditionManager from './host/panels/EditionManager';

const UnifiedHostPanel = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('preparation');
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Panel hosta uruchomiony"
  ]);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Context
  const { round, players } = useGameContext();
  
  // Helper function to add events to the event bar
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 9)]);
  };
  
  // Panel reference for fullscreen functionality
  const panelRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(panelRef, {
    onEnter: () => addEvent('Tryb pełnoekranowy aktywny'),
    onExit: () => addEvent('Tryb pełnoekranowy wyłączony')
  });
  
  // Custom hooks for host functionality
  const { 
    soundMuted, 
    toggleSound, 
    startGame, 
    startNewGame, 
    handleSaveLocal, 
    handleLoadLocal 
  } = useHostActions(addEvent);
  
  const { 
    editionName, 
    setEditionName, 
    saveDialogOpen, 
    setSaveDialogOpen, 
    loadDialogOpen, 
    setLoadDialogOpen, 
    availableEditions, 
    handleSaveEdition, 
    handleLoadEdition 
  } = useEditionManagement(addEvent);

  return (
    <div ref={panelRef} className="min-h-screen bg-neon-background p-4 flex flex-col">
      <TopBarControls
        soundMuted={soundMuted}
        toggleSound={toggleSound}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        setSaveDialogOpen={setSaveDialogOpen}
        saveDialogOpen={saveDialogOpen}
        setLoadDialogOpen={setLoadDialogOpen}
        loadDialogOpen={loadDialogOpen}
        editionName={editionName}
        setEditionName={setEditionName}
        handleSaveEdition={handleSaveEdition}
        handleLoadEdition={handleLoadEdition}
        availableEditions={availableEditions}
      />
      
      <GameStatusPanel 
        lastEvents={lastEvents}
        startGame={startGame}
        startNewGame={startNewGame}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        soundMuted={soundMuted}
        toggleSound={toggleSound}
      />
      
      <MenuPanel
        round={round}
        soundMuted={soundMuted}
        toggleSound={toggleSound}
        startGame={startGame}
        startNewGame={startNewGame}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        players={players}
      />
      
      <EditionManager
        saveDialogOpen={saveDialogOpen}
        setSaveDialogOpen={setSaveDialogOpen}
        loadDialogOpen={loadDialogOpen}
        setLoadDialogOpen={setLoadDialogOpen}
        editionName={editionName}
        setEditionName={setEditionName}
        handleSaveEdition={handleSaveEdition}
        handleLoadEdition={handleLoadEdition}
        availableEditions={availableEditions}
      />
      
      <GameTabsPanel 
        activeView={activeView}
        setActiveView={setActiveView}
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
      />
    </div>
  );
};

export default UnifiedHostPanel;
