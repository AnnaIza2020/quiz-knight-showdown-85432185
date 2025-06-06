
import React, { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import SoundPreloader from './SoundPreloader';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
      <SoundPreloader />
    </>
  );
};

export default MainLayout;
