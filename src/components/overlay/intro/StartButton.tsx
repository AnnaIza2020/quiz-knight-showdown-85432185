
import React from 'react';

interface StartButtonProps {
  onClick: () => void;
  primaryColor?: string;
  label?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ 
  onClick, 
  primaryColor = '#10B981', 
  label = "Rozpocznij Show" 
}) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 text-xl mb-8 px-6 py-3 rounded-lg text-white border-2"
      style={{ 
        backgroundColor: '#10B981', // Vivid green
        borderColor: '#059669', // Darker green
      }}
    >
      {label}
    </button>
  );
};

export default StartButton;
