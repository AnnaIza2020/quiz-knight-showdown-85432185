
import { useGameContextLegacy } from './useGameContextLegacy';

/**
 * Hook for overlay-specific functionality that builds on
 * the existing game context but may add overlay-specific features.
 */
export const useOverlayContext = () => {
  const gameContext = useGameContextLegacy();
  
  // Add any overlay-specific functionality here
  
  return {
    ...gameContext,
    // Overlay-specific methods can go here
  };
};
