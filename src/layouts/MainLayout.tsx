
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import SoundPreloader from '@/components/SoundPreloader';

export interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      {children || <Outlet />}
      <Toaster position="top-right" richColors closeButton />
      <SoundPreloader />
    </>
  );
};

export default MainLayout;
