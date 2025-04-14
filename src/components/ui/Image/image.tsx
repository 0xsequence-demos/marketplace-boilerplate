'use client';

import { forwardRef, memo } from 'react';

import { cn } from '$ui';

interface ImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;

  children?: React.ReactNode;

  containerClassName?: string;
  elementClassName?: string;

  fallbackSrc?: string;
  // disableFadeIn?: boolean
  loading?: boolean;
}

export const placeholderImgUrl = '/images/placeholder.png';

export const BaseImage = memo(
  forwardRef<HTMLImageElement, ImageProps>(
    (
      {
        fallbackSrc = placeholderImgUrl,
        className,
        onLoad,
        children,
        elementClassName,
        containerClassName,
        ...props
      },
      ref,
    ) => {
      //Disabling fade in for now, the onLoad event is firing to early for the useState hook

      // const [loaded, setLoaded] = useState(disableFadeIn ? true : false)

      return (
        <div className={cn('rounded-md', containerClassName)}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            ref={ref}
            className={cn(
              'h-full w-full rounded-[inherit] object-contain',
              className,
            )}
            src={props.src}
          />

          {children ? (
            <div className={cn(elementClassName)}>{children}</div>
          ) : null}
        </div>
      );
    },
  ),
);
