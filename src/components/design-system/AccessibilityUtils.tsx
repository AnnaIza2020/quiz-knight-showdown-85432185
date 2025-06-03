
import React from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ 
  children, 
  className 
}) => (
  <span className={cn(
    "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
    "clip-[rect(0,0,0,0)]",
    className
  )}>
    {children}
  </span>
);

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  active = true, 
  className 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => (
  <a
    href={href}
    className={cn(
      "absolute left-0 top-0 bg-neon-green text-black px-4 py-2 rounded-br-lg",
      "transform -translate-y-full focus:translate-y-0 transition-transform",
      "z-[9999] font-medium text-sm",
      "focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2",
      className
    )}
  >
    {children}
  </a>
);

interface AriaLiveProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  className?: string;
}

export const AriaLive: React.FC<AriaLiveProps> = ({ 
  children, 
  priority = 'polite', 
  atomic = true,
  className 
}) => (
  <div
    aria-live={priority}
    aria-atomic={atomic}
    className={cn("sr-only", className)}
  >
    {children}
  </div>
);

interface KeyboardShortcutProps {
  keys: string[];
  description: string;
  onActivate: () => void;
  disabled?: boolean;
}

export const useKeyboardShortcut = ({ 
  keys, 
  description, 
  onActivate, 
  disabled = false 
}: KeyboardShortcutProps) => {
  React.useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = [];
      
      if (event.ctrlKey) pressedKeys.push('ctrl');
      if (event.altKey) pressedKeys.push('alt');
      if (event.shiftKey) pressedKeys.push('shift');
      if (event.metaKey) pressedKeys.push('meta');
      
      pressedKeys.push(event.key.toLowerCase());
      
      const keysMatch = keys.every(key => pressedKeys.includes(key.toLowerCase()));
      
      if (keysMatch) {
        event.preventDefault();
        onActivate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, onActivate, disabled]);

  return { description };
};

interface ReducedMotionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ReducedMotion: React.FC<ReducedMotionProps> = ({ 
  children, 
  fallback 
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion && fallback ? fallback : children;
};

interface HighContrastProps {
  children: React.ReactNode;
  highContrastVersion?: React.ReactNode;
}

export const HighContrast: React.FC<HighContrastProps> = ({ 
  children, 
  highContrastVersion 
}) => {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = () => setPrefersHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast && highContrastVersion ? highContrastVersion : children;
};

interface ColorBlindFriendlyProps {
  children: React.ReactNode;
  type?: 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export const ColorBlindFriendly: React.FC<ColorBlindFriendlyProps> = ({ 
  children, 
  type 
}) => {
  const filterMap = {
    protanopia: 'contrast(1.2) saturate(1.5) hue-rotate(10deg)',
    deuteranopia: 'contrast(1.3) saturate(1.4) hue-rotate(-10deg)',
    tritanopia: 'contrast(1.1) saturate(1.6) hue-rotate(15deg)'
  };

  const style = type ? { filter: filterMap[type] } : {};

  return (
    <div style={style}>
      {children}
    </div>
  );
};

// Accessibility utilities export
export const AccessibilityUtils = {
  VisuallyHidden,
  FocusTrap,
  SkipLink,
  AriaLive,
  useKeyboardShortcut,
  ReducedMotion,
  HighContrast,
  ColorBlindFriendly
};
