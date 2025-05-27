
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black border-[#00FFA3] shadow-[0_0_20px_#00FFA3]/50 hover:shadow-[0_0_30px_#00FFA3]/70';
      case 'secondary':
        return 'bg-[#00E0FF] hover:bg-[#00E0FF]/80 text-black border-[#00E0FF] shadow-[0_0_20px_#00E0FF]/50 hover:shadow-[0_0_30px_#00E0FF]/70';
      case 'accent':
        return 'bg-[#FF3E9D] hover:bg-[#FF3E9D]/80 text-white border-[#FF3E9D] shadow-[0_0_20px_#FF3E9D]/50 hover:shadow-[0_0_30px_#FF3E9D]/70';
      default:
        return 'bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black border-[#00FFA3]';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-montserrat font-bold border-2 transition-all duration-300 transform hover:scale-105',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {children}
    </Button>
  );
};

export default NeonButton;
