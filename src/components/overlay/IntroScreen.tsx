
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonLogo from '@/components/NeonLogo';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

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
  secondaryColor = '#00ffff'
}) => {
  const [progress, setProgress] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(autoplay);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/intro-music.mp3') : null
  );

  // Set up audio events
  useEffect(() => {
    if (!audio) return;
    
    const handleCanPlay = () => setAudioLoaded(true);
    const handleEnded = () => {
      setAudioPlaying(false);
      if (onFinished) onFinished();
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.loop = true; // Loop the intro music
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audio, onFinished]);
  
  // Handle audio play/pause based on show prop
  useEffect(() => {
    if (!audio || !audioLoaded) return;
    
    if (show && audioPlaying) {
      audio.volume = 0.7;
      audio.play().catch(e => console.log('Error playing intro audio:', e));
    } else {
      audio.pause();
    }
    
    return () => {
      audio.pause();
    };
  }, [show, audio, audioLoaded, audioPlaying]);
  
  // Progress bar animation
  useEffect(() => {
    if (!show) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [show]);
  
  // Toggle audio
  const toggleAudio = () => {
    if (!audio) return;
    
    if (audioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Error playing intro audio:', e));
    }
    setAudioPlaying(!audioPlaying);
  };
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-neon-background z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background animated effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: i % 2 === 0 ? primaryColor : secondaryColor,
                    width: Math.random() * 300 + 50,
                    height: Math.random() * 300 + 50,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: 'blur(80px)',
                  }}
                  animate={{
                    x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                    y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: Math.random() * 10 + 5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Game logo */}
            <div className="mb-8">
              <motion.div
                animate={{
                  filter: ['drop-shadow(0 0 8px rgba(255, 0, 255, 0.7))', 'drop-shadow(0 0 16px rgba(255, 0, 255, 0.9))', 'drop-shadow(0 0 8px rgba(255, 0, 255, 0.7))'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <NeonLogo size="lg" />
              </motion.div>
            </div>
            
            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-center"
              style={{ 
                color: primaryColor,
                textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`
              }}
              animate={{
                textShadow: [
                  `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
                  `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}`,
                  `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              Discord Game Show
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-2xl md:text-3xl text-white mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Zaraz zaczynamy!
            </motion.p>
            
            {/* Progress bar */}
            <div className="w-64 md:w-96 h-3 bg-black/30 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            {/* Audio control */}
            <motion.button
              className="absolute bottom-8 right-8 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white"
              onClick={toggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {audioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
