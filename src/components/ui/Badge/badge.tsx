import type * as React from 'react';

import { cn } from '$ui';
import { type VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  [
    'badge',
    'rounded-radius inline-flex h-fit w-fit items-center border-transparent font-light font-medium transition-colors',
    'pre-wrap whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary/10 text-secondary-foreground',
        success: 'bg-success/50 text-success-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        muted: 'bg-foreground/10 text-foreground/70',
        outline: 'border border-border bg-transparent text-foreground/70',
        outlinePrimary: 'border border-primary bg-transparent text-primary',
      },
      size: {
        default: 'rounded-md px-2.5 py-1.5 text-xs',
        sm: 'py-0.75 px-1 text-xs',
        md: 'rounded-lg px-3 py-2 text-sm',
        lg: 'rounded-lg px-4 py-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  loading?: boolean;
}

function Badge({
  className,
  variant,
  size,
  loading = false,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        loading ? 'loading' : '',
        className,
      )}
      {...props}
    />
  );
}

export { Badge,  };
