
import React, { ReactNode } from 'react';

interface SettingsLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  title, 
  description, 
  children, 
  actions 
}) => {
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
          {description && (
            <p className="text-white/60 text-sm">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      
      {children}
    </div>
  );
};

export default SettingsLayout;
