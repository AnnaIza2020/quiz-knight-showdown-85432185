
import React, { useState } from 'react';
import { Eye, X, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PreviewModeProps {
  onToggle: (active: boolean) => void;
  isActive: boolean;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ onToggle, isActive }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isActive;
    onToggle(newState);
    
    toast.info(
      newState 
        ? 'Tryb podglądu aktywny' 
        : 'Tryb podglądu wyłączony', 
      {
        description: newState 
          ? 'Możesz testować aplikację bez aktywnych graczy' 
          : 'Powrót do normalnego trybu gry'
      }
    );
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center">
          {isActive ? (
            <Eye className="mr-2 text-neon-green" size={20} />
          ) : (
            <EyeOff className="mr-2 text-white/70" size={20} />
          )}
          <h3 className={`font-medium ${isActive ? 'text-neon-green' : 'text-white'}`}>
            Tryb Podglądu
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-0.5 rounded">
              Aktywny
            </span>
          )}
          {expanded ? 
            <ChevronUp size={18} /> :
            <ChevronDown size={18} />
          }
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-white/10">
              <p className="text-sm text-white/70 mb-4">
                Tryb podglądu pozwala na testowanie funkcji gry bez konieczności dołączania graczy. 
                Idealny do sprawdzenia ustawień, animacji i interfejsu.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/20 rounded p-3 text-sm">
                  <h4 className="font-medium mb-1">Bez graczy</h4>
                  <p className="text-xs text-white/60">
                    Możliwość testowania bez konieczności dołączania graczy
                  </p>
                </div>
                
                <div className="bg-black/20 rounded p-3 text-sm">
                  <h4 className="font-medium mb-1">Wszystkie funkcje</h4>
                  <p className="text-xs text-white/60">
                    Dostęp do wszystkich funkcji hosta i podglądu nakładek
                  </p>
                </div>
              </div>
              
              <Button
                className={isActive ? "bg-gray-700 hover:bg-gray-600" : "bg-neon-green text-black hover:bg-neon-green/80"}
                onClick={handleToggle}
                size="sm"
                className="w-full"
              >
                {isActive ? (
                  <><X size={16} className="mr-1" /> Wyłącz tryb podglądu</>
                ) : (
                  <><Eye size={16} className="mr-1" /> Włącz tryb podglądu</>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreviewMode;
