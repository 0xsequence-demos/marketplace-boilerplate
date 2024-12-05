'use client';

import { Box, Image, cn } from '$ui';
import { Description } from './Description';
import { Title } from './Title';

type BannerImageProps = {
  src?: string;
  className?: string;
  title?: string;
  description?: string;
};

export const BannerImage = ({
  src,
  className,
  title,
  description,
}: BannerImageProps) => {
  if (!!src) {
    return (
      <Image
        src={src}
        containerClassName={cn('h-full rounded-none', className)}
        className="object-cover"
        fallbackSrc=""
      />
    );
  }

  return (
    <Box
      className={cn(
        'h-full rounded-none flex justify-center flex-col text-center',
        className,
      )}
    >
      <Title title={title ?? 'unknown'} />
      <Description description={description ?? ''} />
    </Box>
  );
};
