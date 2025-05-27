
import React from 'react';
import { useGameState } from '@/context/GameStateContext';
import Timer from '@/components/common/Timer';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCameraProps {
  player: any;
  dimensions: { width: number; height: number };
  isActive?: boolean;
}

const PlayerCamera: React.FC<PlayerCameraProps> = ({ player, dimensions, isActive = false }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border-4 ${
        isActive ? 'border-[#FF3E9D] shadow-[0_0_20px_#FF3E9D]' : 'border-white/20'
      }`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        borderColor: player.color || '#FFFFFF'
      }}
      animate={isActive ? { 
        boxShadow: [`0 0 20px ${player.color}`, `0 0 40px ${player.color}`, `0 0 20px ${player.color}`]
      } : {}}
      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
    >
      {/* Camera Content */}
      {player.cameraUrl ? (
        <iframe
          src={player.cameraUrl}
          className="w-full h-full"
          style={{ border: 'none' }}
          allow="camera; microphone"
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center text-white font-bold text-6xl"
          style={{ backgroundColor: player.color || '#666' }}
        >
          {player.nickname?.charAt(0)?.toUpperCase() || 'G'}
        </div>
      )}

      {/* Player Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
        <div className="flex justify-between items-center">
          <span className="font-bold" style={{ color: player.color }}>
            {player.nickname}
          </span>
          <span className="text-[#00FFA3] font-bold">
            {player.points} pkt
          </span>
        </div>
        
        {/* Health Bar */}
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-1">
          <motion.div 
            className={`h-full transition-all duration-500 ${
              player.health > 70 ? 'bg-green-500' :
              player.health > 40 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${Math.max(0, player.health)}%` }}
            initial={{ width: '100%' }}
            animate={{ width: `${Math.max(0, player.health)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const GameOverlay: React.FC = () => {
  const { gameState, players, currentQuestion, appSettings } = useGameState();
  
  const activePlayers = players.filter(p => !p.isEliminated);
  const activePlayer = players.find(p => p.id === gameState.activePlayerId);

  // Round 1 Layout (1920x1080)
  if (gameState.currentRound === 'round1') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0C0C13] to-[#1a1a2e] overflow-hidden">
        {/* Top Row - 5 Players */}
        <div className="flex justify-center" style={{ height: '330px' }}>
          {activePlayers.slice(0, 5).map((player, index) => (
            <PlayerCamera
              key={player.id}
              player={player}
              dimensions={{ width: 384, height: 330 }}
              isActive={player.id === gameState.activePlayerId}
            />
          ))}
        </div>

        {/* Middle Row */}
        <div className="flex" style={{ height: '330px' }}>
          {/* Host Camera */}
          <div className="relative border-4 border-white/20 overflow-hidden" style={{ width: '420px', height: '330px' }}>
            {appSettings.hostCameraUrl ? (
              <iframe
                src={appSettings.hostCameraUrl}
                className="w-full h-full"
                style={{ border: 'none' }}
                allow="camera; microphone"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                HOST
              </div>
            )}
          </div>

          {/* Question Container */}
          <div className="flex-1 bg-black/30 border-4 border-white/10 p-6 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {currentQuestion.text}
                  </h2>
                  
                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="bg-white/10 border border-white/20 rounded-lg p-4 text-white font-semibold"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer in top-right of question container */}
            {gameState.timerRunning && (
              <div className="absolute top-4 right-4">
                <Timer
                  seconds={gameState.timerSeconds}
                  isRunning={gameState.timerRunning}
                  size="md"
                  color="#00E0FF"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - 5 Players */}
        <div className="flex justify-center" style={{ height: '330px' }}>
          {activePlayers.slice(5, 10).map((player, index) => (
            <PlayerCamera
              key={player.id}
              player={player}
              dimensions={{ width: 384, height: 330 }}
              isActive={player.id === gameState.activePlayerId}
            />
          ))}
        </div>

        {/* Info Bar at bottom */}
        <div className="h-[90px] bg-[#111827]/80 flex items-center overflow-hidden">
          <motion.div
            className="text-white text-lg whitespace-nowrap"
            animate={{ x: [-1920, 1920] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            Discord Game Show • Runda 1: Eliminacje • {activePlayers.length} aktywnych graczy
          </motion.div>
        </div>
      </div>
    );
  }

  // Round 2 Layout
  if (gameState.currentRound === 'round2') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0C0C13] to-[#1a1a2e] overflow-hidden">
        {/* Top Row - 3 Players */}
        <div className="flex justify-center" style={{ height: '330px' }}>
          {activePlayers.slice(0, 3).map((player, index) => (
            <PlayerCamera
              key={player.id}
              player={player}
              dimensions={{ width: 640, height: 330 }}
              isActive={player.id === gameState.activePlayerId}
            />
          ))}
        </div>

        {/* Middle Row */}
        <div className="flex" style={{ height: '330px' }}>
          {/* Host Camera */}
          <div className="relative border-4 border-white/20 overflow-hidden" style={{ width: '640px', height: '330px' }}>
            {appSettings.hostCameraUrl ? (
              <iframe
                src={appSettings.hostCameraUrl}
                className="w-full h-full"
                style={{ border: 'none' }}
                allow="camera; microphone"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                HOST
              </div>
            )}
          </div>

          {/* Round 2 Title */}
          <div className="flex items-center justify-center" style={{ width: '640px', height: '330px' }}>
            <h1 className="text-6xl font-bold text-[#00E0FF] animate-pulse">
              RUNDA 2
            </h1>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center" style={{ width: '640px', height: '330px' }}>
            {gameState.timerRunning && (
              <Timer
                seconds={gameState.timerSeconds}
                isRunning={gameState.timerRunning}
                size="lg"
                color={gameState.timerSeconds <= 1 ? '#FF3E3E' : '#FFA500'}
              />
            )}
          </div>
        </div>

        {/* Bottom Row - 3 Players */}
        <div className="flex justify-center" style={{ height: '330px' }}>
          {activePlayers.slice(3, 6).map((player, index) => (
            <PlayerCamera
              key={player.id}
              player={player}
              dimensions={{ width: 640, height: 330 }}
              isActive={player.id === gameState.activePlayerId}
            />
          ))}
        </div>

        {/* Info Bar */}
        <div className="h-[90px] bg-[#111827]/80 flex items-center overflow-hidden">
          <motion.div
            className="text-white text-lg whitespace-nowrap"
            animate={{ x: [-1920, 1920] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            Discord Game Show • Runda 2: Szybka Odpowiedź • 5 sekund na odpowiedź • {activePlayers.length} graczy pozostało
          </motion.div>
        </div>
      </div>
    );
  }

  // Round 3 Layout - podobny do Round 2, ale z miejscem na koło fortuny
  if (gameState.currentRound === 'round3') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0C0C13] to-[#1a1a2e] overflow-hidden">
        {/* Top Row - 3 Players (finaliści) */}
        <div className="flex justify-center" style={{ height: '330px' }}>
          {activePlayers.slice(0, 3).map((player, index) => (
            <PlayerCamera
              key={player.id}
              player={player}
              dimensions={{ width: 640, height: 330 }}
              isActive={player.id === gameState.activePlayerId}
            />
          ))}
        </div>

        {/* Middle Section for Wheel/Question */}
        <div className="flex items-center justify-center" style={{ height: '330px' }}>
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#8B5CF6] mb-4">
              RUNDA 3
            </h1>
            <p className="text-2xl text-[#FF3E9D]">Koło Fortuny</p>
          </div>
        </div>

        {/* Bottom space for additional content */}
        <div style={{ height: '330px' }} className="flex items-center justify-center">
          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/50 border border-[#8B5CF6] rounded-lg p-8 max-w-4xl"
            >
              <h2 className="text-3xl font-bold text-white text-center">
                {currentQuestion.text}
              </h2>
            </motion.div>
          )}
        </div>

        {/* Info Bar */}
        <div className="h-[90px] bg-[#111827]/80 flex items-center overflow-hidden">
          <motion.div
            className="text-white text-lg whitespace-nowrap"
            animate={{ x: [-1920, 1920] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            Discord Game Show • Runda 3: Koło Fortuny • Finał • {activePlayers.length} finalistów
          </motion.div>
        </div>
      </div>
    );
  }

  // Default/Lobby view
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0C0C13] to-[#1a1a2e] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1 className="text-8xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E0FF] to-[#FF3E9D] bg-clip-text text-transparent mb-4">
            Discord Game Show
          </h1>
        </motion.div>
        <p className="text-2xl text-white/80">Przygotowanie do gry...</p>
        
        {players.length > 0 && (
          <div className="mt-8">
            <p className="text-lg text-[#00FFA3] mb-4">Gracze w lobby:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  style={{ borderColor: player.color }}
                >
                  {player.nickname}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOverlay;
