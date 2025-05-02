
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  active: boolean;
  number: number;
}

const Countdown: React.FC<CountdownProps> = ({ active, number }) => {
  return (
    <AnimatePresence>
      {active && number > 0 && (
        <motion.div
          key="countdown"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 0] }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute text-8xl font-bold"
          style={{
            color: number <= 2 ? '#ff3366' : number <= 3 ? '#ffcc00' : '#33ff88',
            textShadow: `0 0 20px ${number <= 2 ? '#ff3366' : number <= 3 ? '#ffcc00' : '#33ff88'}`
          }}
        >
          {number}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Countdown;
