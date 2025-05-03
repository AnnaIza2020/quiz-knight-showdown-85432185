
import React from 'react';

// Update the type to match usePlayerConnection's ConnectionStatus type
export type ConnectionStatus = 'connected' | 'error' | 'checking';

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({ status }) => {
  // Map status to display text in Polish
  const statusText = {
    'connected': 'Połączono',
    'error': 'Problem z połączeniem',
    'checking': 'Sprawdzanie połączenia'
  };

  // Map status to color classes
  const statusColor = {
    'connected': 'bg-green-500',
    'error': 'bg-red-500',
    'checking': 'bg-yellow-500'
  };

  return (
    <div className="absolute top-2 right-2 flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${statusColor[status]}`} />
      <span className="text-xs text-white/70">
        {statusText[status]}
      </span>
    </div>
  );
};

export default ConnectionIndicator;
