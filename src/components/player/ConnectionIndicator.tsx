
import React from 'react';

interface ConnectionIndicatorProps {
  status: 'connected' | 'error' | 'checking';
}

const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({ status }) => {
  return (
    <div className="absolute top-2 right-2 flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${
        status === 'connected' ? 'bg-green-500' : 
        status === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <span className="text-xs text-white/70">
        {status === 'connected' ? 'Połączono' : 
         status === 'checking' ? 'Sprawdzanie połączenia' : 'Problem z połączeniem'}
      </span>
    </div>
  );
};

export default ConnectionIndicator;
