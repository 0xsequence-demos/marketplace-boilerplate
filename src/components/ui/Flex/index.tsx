import React from 'react';

import { cn } from '$ui';
import { Slot } from '@radix-ui/react-slot';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn('flex', className)} {...props} />;
  },
);
Flex.displayName = 'Flex';

export { Flex };
