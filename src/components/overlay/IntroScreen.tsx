
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIntroAudio } from '@/hooks/useIntroAudio';

// Import our component files
import AnimatedBackground from './intro/AnimatedBackground';
import GameLogo from './intro/GameLogo';
import IntroTitle from './intro/IntroTitle';
import IntroSubtitle from './intro/IntroSubtitle';
import AudioControl from './intro/AudioControl';
import FlashEffect from './intro/FlashEffect';
import StartButton from './intro/StartButton';

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
  primaryColor = '#39FF14', // Neon lime green for Discord
  secondaryColor = '#FF00FF', // Magenta/fuschia for Game Show
  onStartClick,
  isStarting = false
}) => {
  const navigate = useNavigate();
  const [flashActive, setFlashActive] = useState(false);
  
  // Use our custom audio hook
  const {
    audioPlaying,
    toggleAudio,
  } = useIntroAudio({
    autoplay,
    onIntroComplete: () => {
      // Loop the audio instead of finishing
    }
  });
  
  // Function to handle navigation with animation
  const handleNavigation = (path: string) => {
    // Show flash effect
    setFlashActive(true);
    
    // Navigate after animation
    setTimeout(() => {
      navigate(path);
      if (onFinished) onFinished();
    }, 500);
  };
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #1A1F2C 0%, #0A0A0F 100%)',
            backgroundImage: `
              radial-gradient(circle at top right, rgba(121, 68, 154, 0.2), transparent),
              radial-gradient(circle at 20% 80%, rgba(41, 196, 255, 0.13), transparent)
            `
          }}
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
            <IntroTitle primaryColor={primaryColor} secondaryColor={secondaryColor} />
            
            {/* Subtitle */}
            <IntroSubtitle />
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 mb-8">
              {onStartClick ? (
                <StartButton 
                  onClick={onStartClick} 
                  primaryColor={primaryColor} 
                  label="Rozpocznij Show"
                />
              ) : (
                <>
                  <motion.button
                    onClick={() => handleNavigation('/unified-host')}
                    className="px-6 py-3 text-lg rounded-lg text-white border-2 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      backgroundColor: '#10B981', // Vivid green
                      borderColor: '#059669', // Darker green
                    }}
                  >
                    Panel Hosta
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleNavigation('/player/demo')}
                    className="px-6 py-3 text-lg rounded-lg text-white border-2 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      backgroundColor: '#1F2937', // Dark graphite/anthracite
                      borderColor: '#E5E7EB', // Light gray/white
                    }}
                  >
                    Widok Gracza
                  </motion.button>
                </>
              )}
            </div>
            
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
