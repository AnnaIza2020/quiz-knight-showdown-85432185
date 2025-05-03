
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import SoundPreloader from './SoundPreloader';

const MainLayout = () => {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
      <SoundPreloader />
    </>
  );
};

export default MainLayout;
