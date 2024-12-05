'use client';

import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

import { Flex, cn } from '$ui';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import { Description } from '../Hero/Description';
import { Socials } from '../Hero/Socials';
import { Title } from '../Hero/Title';

export const BigLeftBanner = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
}: MarketplaceConfig) => {
  return (
    <Flex
      className={cn('mt-0 w-full gap-4 px-3 lg:px-0 lg:pr-3')}
      style={{ height: 'calc(100% - var(--footerHeight)' }}
    >
      <BannerImage
        className="hidden w-[50%] lg:flex"
        src={landingBannerUrl}
        title={title}
        description={shortDescription}
      />
      {landingBannerUrl ? (
        <Flex className="w-full flex-col gap-4 py-4">
          <Flex className="w-full justify-between">
            <Socials socials={socials} />
          </Flex>
          <Title title={title ?? 'unknown'} className="max-w-[90vw]" />
          <Description description={shortDescription ?? ''} className="mb-12" />
          <LandingCollections
            collections={collections ?? []}
            className="auto-rows-[380px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))] grid-rows-[repeat(auto-fill,minmax(360px,1fr))]"
          />
        </Flex>
      ) : null}
    </Flex>
  );
};
