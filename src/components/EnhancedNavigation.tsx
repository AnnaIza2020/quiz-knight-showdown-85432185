
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Settings, Layout, Gamepad2 } from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const EnhancedNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navigationItems: NavigationItem[] = [
    {
      path: '/',
      label: 'Strona Główna',
      icon: <Home className="mr-2 h-4 w-4" />,
      color: 'from-neon-pink to-neon-blue'
    },
    {
      path: '/unified-host',
      label: 'Panel Hosta',
      icon: <Gamepad2 className="mr-2 h-4 w-4" />,
      color: 'from-neon-pink to-neon-blue'
    },
    {
      path: '/host',
      label: 'Host (Klasyczny)',
      icon: <Gamepad2 className="mr-2 h-4 w-4" />,
      color: 'from-neon-green to-neon-yellow'
    },
    {
      path: '/overlay',
      label: 'Nakładka OBS',
      icon: <Layout className="mr-2 h-4 w-4" />,
      color: 'from-neon-purple to-neon-blue'
    },
    {
      path: '/settings',
      label: 'Ustawienia',
      icon: <Settings className="mr-2 h-4 w-4" />,
      color: 'from-neon-blue to-neon-green'
    },
  ];

  return (
    <div className="w-full mt-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto bg-black/50 p-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="w-full"
              onClick={() => setActiveTab(item.path)}
            >
              <TabsTrigger 
                value={item.path}
                className={`w-full py-3 text-sm md:text-base flex items-center justify-center
                           transition-all duration-300`}
              >
                {item.icon}
                <span className="md:ml-1">{item.label}</span>
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default EnhancedNavigation;
