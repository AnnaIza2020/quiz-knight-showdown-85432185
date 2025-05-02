
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
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
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
  
  // Progress bar animation with dynamic pacing
  useEffect(() => {
    if (!show) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // Add some randomness to the progress for more dynamic feeling
        const increment = Math.random() * 1.5 + 0.5;
        const newProgress = prev + increment;
        
        // When progress gets to 95%, start countdown if not already started
        if (prev < 95 && newProgress >= 95 && !countdownActive) {
          setCountdownActive(true);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [show, countdownActive]);
  
  // Countdown animation
  useEffect(() => {
    if (!countdownActive) return;
    
    const interval = setInterval(() => {
      setCountdownNumber(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(interval);
          // When countdown finishes, trigger onFinished after a short delay
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 1000);
          return 0;
        }
        return newCount;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdownActive, onFinished]);
  
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
          className="fixed inset-0 bg-neon-background z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dynamic animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Grid lines background */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-grid-pattern"></div>
            </div>
            
            {/* Moving light blobs */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: i % 3 === 0 ? primaryColor : i % 3 === 1 ? secondaryColor : '#33ff88',
                    width: Math.random() * 400 + 100,
                    height: Math.random() * 400 + 100,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: 'blur(100px)',
                  }}
                  animate={{
                    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                    y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                    scale: [1, 1.2, 0.8, 1.1, 1],
                    opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: Math.random() * 15 + 10,
                  }}
                />
              ))}
            </div>
            
            {/* Animated lines */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute h-px w-full overflow-hidden"
                  style={{
                    top: `${10 + i * 10}%`,
                    background: `linear-gradient(90deg, transparent 0%, ${i % 2 === 0 ? primaryColor : secondaryColor} 50%, transparent 100%)`,
                    opacity: 0.4,
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.random() * 5 + 10,
                    ease: "linear",
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
            {/* Game logo with dynamic entrance */}
            <motion.div 
              className="mb-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100,
                damping: 10,
                delay: 0.5
              }}
            >
              <motion.div
                animate={{
                  filter: [
                    `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`, 
                    `drop-shadow(0 0 20px ${primaryColor}) drop-shadow(0 0 15px ${secondaryColor})`, 
                    `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <NeonLogo size="lg" />
              </motion.div>
            </motion.div>
            
            {/* Title with neon flicker effect */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-center"
              style={{ 
                color: primaryColor,
                textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`
              }}
              animate={{
                textShadow: [
                  `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
                  `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}`,
                  `0 0 5px ${primaryColor}, 0 0 15px ${primaryColor}`,
                  `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}`,
                  `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              DISCORD GAME SHOW
            </motion.h1>
            
            {/* Subtitle with fade in/out effect */}
            <motion.p 
              className="text-2xl md:text-3xl text-white mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                times: [0, 0.1, 0.9, 1],
              }}
            >
              Zaraz zaczynamy!
            </motion.p>
            
            {/* Progress bar with neon glow and color transition */}
            <div className="w-64 md:w-96 h-4 bg-black/50 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/10">
              <motion.div 
                className="h-full rounded-full relative"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 10px ${primaryColor}, 0 0 20px ${secondaryColor}`
                }}
                animate={{ 
                  width: `${progress}%`,
                  background: [
                    `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                    `linear-gradient(90deg, ${secondaryColor}, #33ff88)`,
                    `linear-gradient(90deg, #33ff88, ${primaryColor})`,
                    `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  ]
                }}
                transition={{ 
                  width: { duration: 0.1 },
                  background: { duration: 10, repeat: Infinity }
                }}
              >
                {/* Animated glow effect inside progress bar */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-20 bg-white/30"
                  animate={{
                    left: ['-10%', '110%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: 'blur(10px)'
                  }}
                />
              </motion.div>
            </div>
            
            {/* Countdown animation only appears when countdown is active */}
            <AnimatePresence>
              {countdownActive && countdownNumber > 0 && (
                <motion.div
                  key="countdown"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute text-8xl font-bold"
                  style={{
                    color: countdownNumber <= 2 ? '#ff3366' : countdownNumber <= 3 ? '#ffcc00' : '#33ff88',
                    textShadow: `0 0 20px ${countdownNumber <= 2 ? '#ff3366' : countdownNumber <= 3 ? '#ffcc00' : '#33ff88'}`
                  }}
                >
                  {countdownNumber}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Audio control with improved styling */}
            <motion.button
              className="absolute bottom-8 right-8 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-colors"
              onClick={toggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: audioPlaying 
                  ? ['0 0 0px rgba(255,255,255,0.3)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0.3)'] 
                  : ['0 0 0px rgba(255,255,255,0.3)']
              }}
              transition={{
                boxShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }
              }}
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
