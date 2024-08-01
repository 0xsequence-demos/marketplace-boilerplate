import * as React from 'react';

import { cn } from '$ui';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  [
    'btn',
    'flex w-fit items-center justify-center gap-2 rounded-md transition-all',
    'pre-wrap whitespace-nowrap text-sm',
    'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default:
          'btn-primary bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'btn-secondary bg-secondary/20 text-secondary-foreground hover:bg-secondary/30',
        muted: 'bg-foreground/10 text-foreground/90 hover:bg-foreground/20',
        destructive:
          'bg-destructive/70 text-destructive-foreground hover:bg-destructive/60',
        warning: 'bg-warning/70 text-warning-foreground hover:bg-warning/60',
        success: 'bg-success/70 text-success-foreground hover:bg-success/60',
        pink: 'bg-pink text-pink-foreground hover:bg-pink/90',
        outline:
          'border border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground',

        ghost:
          'text-foreground/70 hover:bg-foreground/10 hover:text-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
        primaryLink:
          'text-secondary-foreground underline-offset-4 hover:underline',
        none: '',
      },
      size: {
        xs: 'h-7 px-2 text-xs font-medium',
        sm: 'h-9 px-3 text-sm font-bold',
        default: 'h-10 px-3.5 text-sm font-bold',
        lg: 'text-md h-14 px-5 font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      loading,
      label,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <LoadingBox /> : null}
            {!loading ? (children ?? label) : null}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

const LoadingBox = () => {
  return (
    <svg
      className="mx-auto flex scale-90 items-center justify-center overflow-hidden fill-current object-cover"
      aria-busy="true"
      aria-live="polite"
      width="30"
      height="20"
      viewBox="0 0 30 20"
      fill="inherit"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <rect x="0" y="6" width="6" height="6" fill="inherit" opacity="1">
        <animate
          attributeName="y"
          values="6;0;6;6;6"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
        <animate
          attributeName="opacity"
          values="0.5;1;0.5;0.5;0.5"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
      </rect>
      <rect x="12" y="6" width="6" height="6" fill="inherit">
        <animate
          attributeName="y"
          values="6;6;0;6;6"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.5;1;0.5;0.5"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
      </rect>
      <rect x="24" y="6" width="6" height="6" fill="inherit">
        <animate
          attributeName="y"
          values="6;6;6;0;6"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.5;0.5;1;0.5"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99;0.31 0.34 0.41 0.99"
        />
      </rect>
    </svg>
  );
};
