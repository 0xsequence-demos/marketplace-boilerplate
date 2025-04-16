'use client';

import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';

import { Image, cn } from '$ui';

const defaultDesktopLogoUrl = '/sequence-logo.png';
const defaultMobileLogoUrl = '/logo/152x152.png';

export const Logo = ({
  logoUrl: _logoUrl,
  className,
  containerClassName,
  disableShadow,
  disableMaxHeight,
}: {
  logoUrl?: string;
  className?: string;
  containerClassName?: string;
  disableMaxHeight?: boolean;
  disableShadow?: boolean;
}) => {
  const isDesktop = useIsMinWidth('@md');

  const defaultLogoUrl = isDesktop
    ? defaultDesktopLogoUrl
    : defaultMobileLogoUrl;
  const logoUrl = _logoUrl ? _logoUrl : defaultLogoUrl;

  return (
    <Image
      src={logoUrl}
      containerClassName={cn(
        'flex h-full w-auto max-w-[200px] items-center',
        !disableMaxHeight ? 'max-h-(--headerHeight)' : '',
        !disableShadow
          ? 'hover:threed-drop-shadow-1 active:threed-drop-shadow-1'
          : '',
        containerClassName,
      )}
      alt="Logo"
      className={cn('max-h-[60%] md:max-h-[80%]', className)}
    />
  );
};
