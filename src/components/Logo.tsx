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
        !disableMaxHeight ? 'max-h-[--headerHeight]' : '',
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

interface SVGProps {
  className?: string;
}

export const LogoSvg = ({ className }: SVGProps) => {
  return (
    <svg
      aria-label="Logo"
      className={className}
      style={{
        verticalAlign: 'middle',
        maxWidth: '100%',
        maxHeight: '100%',

        width: 150,
      }}
      width="203"
      height="40"
      viewBox="0 0 203 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M45.618 34.2857L47.8989 32V16H54.7416L57.0225 13.7143V9.14286H47.8989V6.85714H50.1798L52.4607 4.57143V0H43.3371L41.0562 2.28571V9.14286H38.7753L36.4944 11.4286V16H41.0562V34.2857H45.618Z"
        fill="#0489FF"
      />
      <path
        d="M34.2135 1.14286H29.6517L27.3708 3.42857V8H31.9326L34.2135 5.71429V1.14286Z"
        fill="#0489FF"
      />
      <path
        d="M6.8427 33.1429L4.5618 35.4286H0V12.5714L2.2809 10.2857H20.5281V14.8571H25.0899V33.1429L22.809 35.4286H18.2472V17.1429H6.8427V33.1429Z"
        fill="#0489FF"
      />
      <path
        d="M27.3708 12.5714L29.6517 10.2857H34.2135V33.1429L31.9326 35.4286H27.3708V12.5714Z"
        fill="#0489FF"
      />
      <path
        d="M61.5843 1.14286H66.1461V10.2857H70.7079V14.8571L68.427 17.1429H66.1461V28.5714H70.7079V33.1429L68.427 35.4286H63.8652V30.8571H59.3034V3.42857L61.5843 1.14286Z"
        fill="#0489FF"
      />
      <path
        d="M79.8315 10.2857H75.2697L72.9888 12.5714V26.2857H77.5506V30.8571H86.6742V33.1429H79.8315L77.5506 35.4286V40H86.6742L88.9551 37.7143V35.4286H91.236L93.5169 33.1429V10.2857H88.9551L86.6742 12.5714V24H79.8315V10.2857Z"
        fill="#0489FF"
      />
      <path
        d="M102.64 10.2857L100.36 12.5714V14.8571H98.0787L95.7978 17.1429V21.7143H100.36V26.2857H114.045V28.5714H98.0787L95.7978 30.8571V35.4286H114.045L116.326 33.1429V30.8571H118.607L120.888 28.5714V24H116.326V19.4286H102.64V17.1429H118.607L120.888 14.8571V10.2857H102.64Z"
        fill="#0489FF"
      />
      <path
        d="M125.449 10.2857H130.011V28.5714H132.292V21.7143L134.573 19.4286H139.135V28.5714H141.416V12.5714L143.697 10.2857H148.258V33.1429L145.978 35.4286H136.854V30.8571H134.573V33.1429L132.292 35.4286H123.169V12.5714L125.449 10.2857Z"
        fill="#0489FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M175.629 33.1429L173.348 35.4286H155.101V30.8571H150.539V26.2857L152.82 24H155.101V21.7143L157.382 19.4286H168.787V17.1429H155.101V12.5714L157.382 10.2857H171.067V14.8571H175.629V33.1429ZM157.382 26.2857V28.5714H168.787V26.2857H157.382Z"
        fill="#0489FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M180.191 10.2857L177.91 12.5714V40H182.472L184.753 37.7143V30.8571H196.157L198.438 28.5714V26.2857H200.719L203 24V14.8571H198.438V10.2857H180.191ZM196.157 17.1429H184.753V24H196.157V17.1429Z"
        fill="#0489FF"
      />
    </svg>
  );
};
