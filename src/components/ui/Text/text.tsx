import React, { createElement } from 'react';

import { cn } from '$ui';
import { Slot } from '@radix-ui/react-slot';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: string;
  asChild?: boolean;

  loading?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as = 'p', asChild, loading = false, ...props }, ref) => {
    const classname = cn(
      'text-foreground',
      loading ? 'loading' : '',
      className,
    );

    if (asChild) {
      return <Slot className={classname} {...props} />;
    }

    return createElement(as, {
      ref,
      className: classname,
      ...props,
    });
  },
);

Text.displayName = 'Text';

export { Text };
