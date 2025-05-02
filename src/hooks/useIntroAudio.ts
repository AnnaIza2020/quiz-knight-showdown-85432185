
import { useRef, useState, useEffect } from 'react';

interface UseIntroAudioOptions {
  autoplay?: boolean;
  onIntroComplete?: () => void;
  onNarratorComplete?: () => void;
  loop?: boolean;
}

export const useIntroAudio = ({ 
  autoplay = true,
  onIntroComplete,
  onNarratorComplete,
  loop = true
}: UseIntroAudioOptions = {}) => {
  const [audioPlaying, setAudioPlaying] = useState<boolean>(autoplay);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  const [narratorPlaying, setNarratorPlaying] = useState<boolean>(false);
  const [narratorFinished, setNarratorFinished] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/intro-music.mp3') : null
  );
  
  const narratorRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/narrator.mp3') : null
  );

  // Set up audio events
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const handleCanPlay = () => setAudioLoaded(true);
    const handleEnded = () => {
      if (loop) {
        // Loop the audio if loop option is enabled
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Error replaying intro audio:', e));
      } else {
        setAudioPlaying(false);
        onIntroComplete?.();
      }
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.loop = loop; // Set the loop property based on the option
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [onIntroComplete, loop]);
  
  // Set up narrator events
  useEffect(() => {
    if (!narratorRef.current) return;
    
    const narrator = narratorRef.current;
    const handleNarratorEnded = () => {
      setNarratorPlaying(false);
      setNarratorFinished(true);
      onNarratorComplete?.();
    };
    
    narrator.addEventListener('ended', handleNarratorEnded);
    
    return () => {
      narrator.removeEventListener('ended', handleNarratorEnded);
      narrator.pause();
    };
  }, [onNarratorComplete]);
  
  // Play/pause intro audio
  useEffect(() => {
    if (!audioRef.current || !audioLoaded) return;
    
    const audio = audioRef.current;
    
    if (audioPlaying) {
      audio.volume = 0.7;
      audio.play().catch(e => console.log('Error playing intro audio:', e));
    } else {
      audio.pause();
    }
    
    return () => {
      audio.pause();
    };
  }, [audioLoaded, audioPlaying]);

  // Toggle audio playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    if (audioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Error playing intro audio:', e));
    }
    setAudioPlaying(!audioPlaying);
  };
  
  // Start narrator playback (fading out intro music)
  const startNarrator = () => {
    if (!narratorRef.current || narratorPlaying) return;
    
    // Fade out intro music
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          audio.pause();
          clearInterval(fadeOutInterval);
          
          // Start narrator
          narratorRef.current.volume = 1.0;
          narratorRef.current.play().catch(e => console.log('Error playing narrator audio:', e));
          setNarratorPlaying(true);
        }
      }, 100);
    } else {
      // If no intro audio, just play narrator
      narratorRef.current.volume = 1.0;
      narratorRef.current.play().catch(e => console.log('Error playing narrator audio:', e));
      setNarratorPlaying(true);
    }
  };
  
  return {
    audioPlaying,
    audioLoaded,
    narratorPlaying,
    narratorFinished,
    toggleAudio,
    startNarrator,
    setAudioPlaying
  };
};
