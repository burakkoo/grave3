import { cn } from '@/lib/cn';
import { SVGProps, useRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { mergeProps, useFocusRing, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';

const toggle = cva('flex cursor-pointer select-none items-center gap-3 rounded-full px-4 py-2 active:ring-4', {
  variants: {
    color: {
      red: 'hover:bg-destructive-foreground/30 focus:outline-none',
      blue: 'hover:bg-blue-200 focus:outline-none dark:hover:bg-blue-900',
      purple: 'hover:bg-primary-accent/30 focus:outline-none',
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

const icon = cva('h-6 w-6', {
  variants: {
    color: {
      red: 'fill-destructive-foreground',
      blue: 'fill-blue-500 dark:fill-blue-600',
      purple: 'fill-primary-accent',
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

interface ToggleStepperProps {
  isSelected: boolean;
  onPress?: () => void;
  onChange?: () => void;
  Icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  quantity: number;
}

export function ToggleStepper({ isSelected, quantity, Icon, onPress, onChange }: ToggleStepperProps) {
  const ref = useRef<HTMLButtonElement>(null);
  
  const handleClick = () => {
    if (typeof onChange === 'function') {
      onChange();
    } else if (typeof onPress === 'function') {
      onPress();
    }
  };

  return (
    <button
      type="button"
      ref={ref}
      onClick={handleClick}
      className={cn(
        'transition-transform active:scale-90',
        toggle({ color: 'purple' }),
        'focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
      )}>
      <Icon 
        width={24} 
        height={24} 
        className={cn(isSelected ? icon({ color: 'purple' }) : 'stroke-muted-foreground')} 
      />
      <p className="text-lg font-medium text-muted-foreground">
        {quantity}
      </p>
    </button>
  );
}
