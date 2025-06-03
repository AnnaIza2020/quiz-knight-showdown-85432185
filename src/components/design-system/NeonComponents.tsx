
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = true,
  className,
  onClick,
  disabled = false
}) => {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const variantClasses = {
    primary: "bg-neon-green text-black border-neon-green hover:bg-neon-green/80 focus:ring-neon-green",
    secondary: "bg-neon-blue text-black border-neon-blue hover:bg-neon-blue/80 focus:ring-neon-blue",
    accent: "bg-neon-pink text-white border-neon-pink hover:bg-neon-pink/80 focus:ring-neon-pink",
    outline: "bg-transparent text-neon-green border-neon-green hover:bg-neon-green hover:text-black focus:ring-neon-green",
    ghost: "bg-transparent text-white border-transparent hover:bg-white/10 focus:ring-white"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const glowClasses = glow ? {
    primary: "shadow-[0_0_20px_rgba(0,255,163,0.5)] hover:shadow-[0_0_30px_rgba(0,255,163,0.7)]",
    secondary: "shadow-[0_0_20px_rgba(0,224,255,0.5)] hover:shadow-[0_0_30px_rgba(0,224,255,0.7)]",
    accent: "shadow-[0_0_20px_rgba(255,62,157,0.5)] hover:shadow-[0_0_30px_rgba(255,62,157,0.7)]",
    outline: "hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]",
    ghost: ""
  } : {};

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && glowClasses[variant],
        "border-2 rounded-lg",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

interface NeonCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'gradient';
  glow?: boolean;
  className?: string;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  variant = 'glass',
  glow = false,
  className
}) => {
  const variantClasses = {
    glass: "bg-black/20 backdrop-blur-md border-white/20",
    solid: "bg-gray-900 border-gray-700",
    gradient: "bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30"
  };

  const glowClass = glow ? "shadow-[0_0_20px_rgba(0,255,163,0.2)]" : "";

  return (
    <Card className={cn(
      "border-2 rounded-xl transition-all duration-300",
      variantClasses[variant],
      glowClass,
      className
    )}>
      {children}
    </Card>
  );
};

interface NeonInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  glow?: boolean;
}

export const NeonInput: React.FC<NeonInputProps> = ({
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  className,
  label,
  error,
  glow = true
}) => {
  const inputId = React.useId();

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={inputId} className="text-white font-medium">
          {label}
        </Label>
      )}
      <Input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "bg-black/50 border-2 border-gray-600 text-white placeholder:text-gray-400",
          "focus:border-neon-blue focus:ring-0 transition-all duration-300",
          glow && "focus:shadow-[0_0_10px_rgba(0,224,255,0.3)]",
          error && "border-red-500 focus:border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

interface NeonBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  glow = true,
  className
}) => {
  const variantClasses = {
    default: "bg-neon-green/20 text-neon-green border-neon-green",
    success: "bg-green-500/20 text-green-400 border-green-400",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-400",
    error: "bg-red-500/20 text-red-400 border-red-400",
    info: "bg-blue-500/20 text-blue-400 border-blue-400"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const glowClasses = glow ? {
    default: "shadow-[0_0_10px_rgba(0,255,163,0.3)]",
    success: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    warning: "shadow-[0_0_10px_rgba(234,179,8,0.3)]",
    error: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    info: "shadow-[0_0_10px_rgba(59,130,246,0.3)]"
  } : {};

  return (
    <Badge
      className={cn(
        "border-2 rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        glow && glowClasses[variant],
        className
      )}
    >
      {children}
    </Badge>
  );
};

interface NeonProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  glow?: boolean;
  animated?: boolean;
  className?: string;
}

export const NeonProgress: React.FC<NeonProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  glow = true,
  animated = false,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const colorClasses = {
    primary: "bg-neon-green",
    secondary: "bg-neon-blue",
    accent: "bg-neon-pink"
  };

  const glowClasses = glow ? {
    primary: "shadow-[0_0_10px_rgba(0,255,163,0.5)]",
    secondary: "shadow-[0_0_10px_rgba(0,224,255,0.5)]",
    accent: "shadow-[0_0_10px_rgba(255,62,157,0.5)]"
  } : {};

  return (
    <div className={cn(
      "w-full bg-gray-700 rounded-full overflow-hidden border border-gray-600",
      sizeClasses[size],
      className
    )}>
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          colorClasses[color],
          glow && glowClasses[color],
          animated && "animate-pulse"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface NeonTextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  glow?: boolean;
  animated?: boolean;
  className?: string;
}

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  size = 'md',
  color = 'primary',
  glow = true,
  animated = false,
  className
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    '2xl': "text-2xl",
    '3xl': "text-3xl"
  };

  const colorClasses = {
    primary: "text-neon-green",
    secondary: "text-neon-blue",
    accent: "text-neon-pink",
    white: "text-white"
  };

  const glowClasses = glow && color !== 'white' ? {
    primary: "drop-shadow-[0_0_10px_rgba(0,255,163,0.8)]",
    secondary: "drop-shadow-[0_0_10px_rgba(0,224,255,0.8)]",
    accent: "drop-shadow-[0_0_10px_rgba(255,62,157,0.8)]"
  } : {};

  return (
    <span className={cn(
      "font-bold",
      sizeClasses[size],
      colorClasses[color],
      glow && color !== 'white' && glowClasses[color],
      animated && "animate-pulse",
      className
    )}>
      {children}
    </span>
  );
};

// Export all components
export const NeonComponents = {
  Button: NeonButton,
  Card: NeonCard,
  Input: NeonInput,
  Badge: NeonBadge,
  Progress: NeonProgress,
  Text: NeonText
};
