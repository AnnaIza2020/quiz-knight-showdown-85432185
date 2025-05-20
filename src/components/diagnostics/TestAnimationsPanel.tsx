
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';

const TestAnimationsPanel: React.FC = () => {
  const { playSound } = useGameContext();
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState('card-reveal');
  
  const playAnimation = (animationType: string) => {
    setActiveAnimation(animationType);
    
    // Play corresponding sound effect
    switch (animationType) {
      case 'card-reveal':
        playSound('card-reveal');
        break;
      case 'correct-answer':
        playSound('success');
        break;
      case 'wrong-answer':
        playSound('failure');
        break;
      case 'elimination':
        playSound('eliminate');
        break;
      case 'victory':
        playSound('victory');
        break;
      case 'round-transition':
        playSound('round-start');
        break;
      default:
        break;
    }
    
    // Reset animation after it completes
    setTimeout(() => {
      setActiveAnimation(null);
    }, 2000);
    
    toast.success(`Playing ${animationType} animation`);
  };
  
  return (
    <div>
      <div className="p-4 bg-black/30 rounded-md border border-white/10">
        <h3 className="text-lg font-medium mb-4">Test Animations</h3>
        
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animation-select" className="mb-1 block text-sm">
                Select Animation
              </Label>
              <Select
                value={selectedAnimation}
                onValueChange={setSelectedAnimation}
              >
                <SelectTrigger id="animation-select">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card-reveal">Card Reveal</SelectItem>
                  <SelectItem value="correct-answer">Correct Answer</SelectItem>
                  <SelectItem value="wrong-answer">Wrong Answer</SelectItem>
                  <SelectItem value="elimination">Player Elimination</SelectItem>
                  <SelectItem value="victory">Victory</SelectItem>
                  <SelectItem value="round-transition">Round Transition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => playAnimation(selectedAnimation)}
                disabled={activeAnimation !== null}
                className="w-full"
              >
                Play Animation
              </Button>
            </div>
          </div>
          
          <Separator className="my-4 bg-white/10" />
          
          <div className="h-64 relative bg-black/40 border border-white/10 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {!activeAnimation && (
                <div className="text-white/40 text-sm">
                  Select and play an animation to preview it here
                </div>
              )}
              
              {activeAnimation === 'card-reveal' && (
                <CardRevealAnimation />
              )}
              
              {activeAnimation === 'correct-answer' && (
                <CorrectAnswerAnimation />
              )}
              
              {activeAnimation === 'wrong-answer' && (
                <WrongAnswerAnimation />
              )}
              
              {activeAnimation === 'elimination' && (
                <EliminationAnimation />
              )}
              
              {activeAnimation === 'victory' && (
                <VictoryAnimation />
              )}
              
              {activeAnimation === 'round-transition' && (
                <RoundTransitionAnimation />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animation Components
const CardRevealAnimation = () => (
  <motion.div
    initial={{ scale: 0, rotate: -15 }}
    animate={{ 
      scale: [0, 1.2, 1],
      rotate: [-15, 5, 0],
      y: [0, -20, 0]
    }}
    transition={{ duration: 0.6, times: [0, 0.6, 1] }}
    className="w-32 h-48 bg-purple-600/80 rounded-lg border-4 border-white flex items-center justify-center shadow-lg"
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-white font-bold text-xl"
    >
      CARD
    </motion.div>
  </motion.div>
);

const CorrectAnswerAnimation = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: [0, 1.2, 1] }}
    transition={{ duration: 0.5, times: [0, 0.6, 1] }}
    className="w-32 h-32 bg-green-500/80 rounded-full flex items-center justify-center"
  >
    <motion.div
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-white text-4xl"
    >
      ✓
    </motion.div>
  </motion.div>
);

const WrongAnswerAnimation = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 0.5, times: [0, 0.2, 0.8, 1] }}
    className="w-32 h-32 bg-red-500/80 rounded-full flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="text-white text-4xl"
    >
      ✗
    </motion.div>
  </motion.div>
);

const EliminationAnimation = () => (
  <motion.div className="relative">
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center"
    >
      <span role="img" aria-label="player" className="text-4xl">
        👤
      </span>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1.2 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute inset-0 flex items-center justify-center text-red-500 text-4xl font-bold"
    >
      ELIMINATED
    </motion.div>
  </motion.div>
);

const VictoryAnimation = () => (
  <div className="relative">
    <motion.div
      initial={{ scale: 0.5, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-32 h-32 bg-yellow-500/80 rounded-full flex items-center justify-center z-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.4, delay: 0.3, times: [0, 0.6, 1] }}
        className="text-white text-4xl"
      >
        🏆
      </motion.div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="absolute top-full left-0 right-0 text-center mt-4 text-yellow-300 font-bold text-xl"
    >
      WINNER!
    </motion.div>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * 200 - 100,
          y: Math.random() * 100 - 200,
          opacity: 0
        }}
        animate={{ 
          y: Math.random() * 300 - 100,
          opacity: [0, 1, 0],
          scale: [0, 0.5 + Math.random(), 0]
        }}
        transition={{ 
          duration: 2,
          delay: Math.random() * 0.5,
          repeat: 1,
          repeatDelay: Math.random()
        }}
        style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: `hsl(${Math.random() * 360}, 80%, 60%)`,
          zIndex: 5
        }}
      />
    ))}
  </div>
);

const RoundTransitionAnimation = () => (
  <motion.div className="text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white text-4xl font-bold"
    >
      ROUND
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-purple-400 text-6xl font-bold mt-2"
    >
      2
    </motion.div>
  </motion.div>
);

export default TestAnimationsPanel;
