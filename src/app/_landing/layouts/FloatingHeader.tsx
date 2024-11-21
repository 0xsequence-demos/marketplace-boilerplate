import { Logo } from '~/components/Logo';
import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

import { Box, Flex, cn } from '$ui';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import { Description } from '../Hero/Description';
import { Socials } from '../Hero/Socials';
import { Title } from '../Hero/Title';

export const FloatingBanner = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
  logoUrl,
}: MarketplaceConfig) => {
  return (
    <Flex className={cn('mx-auto mb-16 h-full w-full flex-col gap-16')}>
      <Box className="relative">
        <BannerImage
          className="h-[350px] w-full"
          src={landingBannerUrl}
          title={title}
          description={shortDescription}
        />
        {landingBannerUrl ? (
          <Flex
            className={cn(
              'w-full max-w-[1200px] px-3 backdrop-blur',
              'absolute bottom-6 left-1/2 -translate-x-1/2',
            )}
          >
            <Flex className="w-full rounded-md bg-background/80">
              <Flex
                className={cn(
                  'w-full flex-col gap-2 rounded-[inherit] bg-foreground/10 p-4',
                  !landingBannerUrl ? 'bg-foreground/10' : '',
                )}
              >
                {logoUrl ? (
                  <Box className="h-[50px]">
                    <Logo
                      logoUrl={logoUrl}
                      className="w-auto"
                      disableMaxHeight
                      disableShadow
                    />
                  </Box>
                ) : null}
                <Flex className="w-full flex-col md:flex-row md:items-center md:justify-between">
                  <Title className="text-2xl" title={title || 'unknown'} />
                  <Socials socials={socials} className="hidden md:flex" />
                </Flex>
                {shortDescription ? (
                  <Description description={shortDescription} />
                ) : null}
                <Socials socials={socials} className="md:hidden" />
              </Flex>
            </Flex>
          </Flex>
        ) : null}
      </Box>
      <Box className="mx-auto w-full max-w-[1200px] px-3">
        <LandingCollections collections={collections || []} />
      </Box>
    </Flex>
  );
};
