'use client';

import { Text, cn } from '$ui';

type DescriptionProps = {
  description: string;
  className?: string;
};

export const Description = ({ description, className }: DescriptionProps) => (
  <Text
    title={description}
    className={cn('text-sm text-foreground/50 line-clamp-3', className)}
  >
    {description}
  </Text>
);
