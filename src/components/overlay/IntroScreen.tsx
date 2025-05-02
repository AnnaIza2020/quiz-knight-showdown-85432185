
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

interface IntroScreenProps {
  show: boolean;
  onFinished?: () => void;
  autoplay?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ 
  show, 
  onFinished,
  autoplay = true,
  primaryColor = '#ff00ff',
  secondaryColor = '#39FF14',
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
            <IntroTitle primaryColor={primaryColor} secondaryColor={secondaryColor} />
            
            {/* Subtitle */}
            <IntroSubtitle />
            
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 mb-8">
              <motion.button
                onClick={() => handleNavigation('/unified-host')}
                className="neon-button px-6 py-3 text-lg rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    `0 0 5px rgba(255,255,255,0.5), 0 0 10px ${secondaryColor}`,
                    `0 0 10px rgba(255,255,255,0.7), 0 0 20px ${secondaryColor}`,
                    `0 0 5px rgba(255,255,255,0.5), 0 0 10px ${secondaryColor}`
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }
                }}
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: secondaryColor,
                  color: secondaryColor
                }}
              >
                Panel Hosta
              </motion.button>
              
              <motion.button
                onClick={() => handleNavigation('/player/demo')}
                className="neon-button px-6 py-3 text-lg rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    `0 0 5px rgba(255,255,255,0.5), 0 0 10px #00FFFF`,
                    `0 0 10px rgba(255,255,255,0.7), 0 0 20px #00FFFF`,
                    `0 0 5px rgba(255,255,255,0.5), 0 0 10px #00FFFF`
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }
                }}
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: '#00FFFF',
                  color: '#00FFFF'
                }}
              >
                Widok Gracza
              </motion.button>
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
