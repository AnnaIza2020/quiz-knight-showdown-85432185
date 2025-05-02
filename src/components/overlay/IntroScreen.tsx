
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntroAudio } from '@/hooks/useIntroAudio';
import { useIntroProgress } from '@/hooks/useIntroProgress';

// Import our new component files
import AnimatedBackground from './intro/AnimatedBackground';
import GameLogo from './intro/GameLogo';
import IntroTitle from './intro/IntroTitle';
import IntroSubtitle from './intro/IntroSubtitle';
import ProgressBar from './intro/ProgressBar';
import StartButton from './intro/StartButton';
import NarratorOverlay from './intro/NarratorOverlay';
import Countdown from './intro/Countdown';
import AudioControl from './intro/AudioControl';
import FlashEffect from './intro/FlashEffect';

interface IntroScreenProps {
  show: boolean;
  onFinished?: () => void;
  autoplay?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  onStartClick?: () => void;
  isStarting?: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ 
  show, 
  onFinished,
  autoplay = true,
  primaryColor = '#ff00ff',
  secondaryColor = '#00ffff',
  onStartClick,
  isStarting = false
}) => {
  const [manualIntroControl, setManualIntroControl] = React.useState(false);
  
  // Use our custom hooks
  const {
    audioPlaying,
    narratorPlaying,
    narratorFinished,
    toggleAudio,
    startNarrator
  } = useIntroAudio({
    autoplay,
    onNarratorComplete: () => {
      // After narrator finishes, show flash effect and trigger finish callback
      triggerFlash();
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 1000);
    }
  });
  
  const {
    progress,
    countdownActive,
    countdownNumber,
    flashActive,
    triggerFlash
  } = useIntroProgress({
    show,
    isStarting,
    onCountdownComplete: () => {
      if (!manualIntroControl) {
        if (onFinished) onFinished();
      }
    }
  });
  
  // Handle intro completion
  const handleIntroFinished = () => {
    if (!manualIntroControl) {
      if (onFinished) onFinished();
    }
  };
  
  // Start narrator when "Start" is clicked
  React.useEffect(() => {
    if (isStarting && !narratorPlaying) {
      startNarrator();
    }
  }, [isStarting, narratorPlaying, startNarrator]);
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-neon-background z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Flash effect */}
          <FlashEffect active={flashActive} />

          {/* Animated background */}
          <AnimatedBackground 
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Game logo */}
            <GameLogo 
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
            
            {/* Title */}
            <IntroTitle primaryColor={primaryColor} />
            
            {/* Subtitle */}
            <IntroSubtitle />
            
            {/* Progress bar */}
            <ProgressBar 
              progress={progress}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
            
            {/* Start button - only shown for host */}
            {onStartClick && !isStarting && !narratorPlaying && (
              <StartButton 
                onClick={onStartClick}
                primaryColor={primaryColor}
              />
            )}
            
            {/* Narrator text overlay */}
            <NarratorOverlay isPlaying={narratorPlaying} />
            
            {/* Countdown */}
            <Countdown 
              active={countdownActive} 
              number={countdownNumber} 
            />
            
            {/* Audio control */}
            <AudioControl 
              playing={audioPlaying}
              onToggle={toggleAudio}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
