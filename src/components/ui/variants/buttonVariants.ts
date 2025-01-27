import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'group flex flex-row items-center justify-center font-semibold transition-colors focus:outline-none active:scale-95 active:ring-4 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      size: {
        huge: 'gap-4 rounded-2xl px-8 py-5 text-lg',
        large: 'gap-4 rounded-2xl px-8 py-5 text-base',
        medium: 'gap-3 rounded-xl px-6 py-4 text-base',
        small: 'gap-3 rounded-lg px-4 py-[9px] text-[13px]',
        icon: 'h-10 w-10 rounded-full p-2',
      },
      mode: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-accent active:ring-primary/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-accent active:ring-secondary-foreground/20',
        subtle:
          'border-2 border-primary-accent bg-transparent text-primary-accent hover:border-primary-accent/70 hover:text-primary-accent/90 active:ring-primary-accent/30',
        ghost: 'font-semibold text-muted-foreground hover:bg-muted/30 active:ring-muted-foreground/20',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:ring-destructive/30',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      expand: {
        full: 'w-full',
        half: 'w-1/2',
        none: '',
      },
      shape: {
        pill: 'rounded-full',
        rounded: '',
      },
      isLoading: {
        true: 'relative !text-transparent transition-none hover:!text-transparent [&>*]:invisible',
        false: '',
      },
    },
    defaultVariants: {
      size: 'medium',
      mode: 'primary',
      expand: 'none',
      shape: 'rounded',
      isLoading: false,
    },
  },
);

export const buttonIconVariants = cva('', {
  variants: {
    size: {
      huge: 'h-7 w-7',
      large: 'h-6 w-6',
      medium: 'h-5 w-5',
      small: 'h-4 w-4',
      icon: 'h-5 w-5',
    },
    mode: {
      primary: 'stroke-primary-foreground',
      secondary: 'stroke-secondary-foreground',
      subtle: 'stroke-primary-accent',
      ghost: 'stroke-muted-foreground',
      destructive: 'stroke-destructive-foreground',
      link: 'stroke-primary',
    },
  },
  defaultVariants: {
    size: 'medium',
    mode: 'primary',
  },
});
