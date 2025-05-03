
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  options?: string[];
  multipleChoice?: boolean;
  disabled?: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ 
  onSubmit,
  options = [],
  multipleChoice = false,
  disabled = false
}) => {
  const [answer, setAnswer] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };
  
  if (multipleChoice && options.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSubmit(option)}
            variant="outline"
            className="p-4 h-auto text-left border-white/20 hover:bg-white/10"
            disabled={disabled}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Wpisz odpowiedź..."
          className="bg-black/30 border-white/20"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !answer.trim()}
          variant="outline"
        >
          Wyślij
        </Button>
      </div>
    </form>
  );
};

export default AnswerInput;
