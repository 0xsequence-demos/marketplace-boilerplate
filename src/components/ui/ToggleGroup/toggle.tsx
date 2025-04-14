'use client';

import * as React from 'react';

import { cn } from '$ui';
import * as TogglePrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps, cva } from 'class-variance-authority';

const ToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn('flex rounded-md border border-border', className)}
    {...props}
  />
));

ToggleGroupRoot.displayName = TogglePrimitive.Root.displayName;

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    'hover:bg-muted hover:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'data-[state=on]:bg-foreground/20 data-[state=on]:text-foreground/80',
    'ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent text-foreground/50',
        outline:
          'border border-input bg-transparent hover:bg-foreground/10 hover:text-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const ToggleItem = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Item
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

ToggleItem.displayName = TogglePrimitive.Item.displayName;

export { ToggleGroupRoot, ToggleItem,  };
