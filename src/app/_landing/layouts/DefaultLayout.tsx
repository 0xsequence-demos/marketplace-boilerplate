import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

import { Flex, cn } from '$ui';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import { Description } from '../Hero/Description';
import { Socials } from '../Hero/Socials';
import { Title } from '../Hero/Title';

export const DefaultLayout = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
}: MarketplaceConfig) => {
  return (
    <Flex
      className={cn(
        'mx-auto my-16 h-full w-full max-w-[1200px] flex-col gap-16 px-4',
      )}
    >
      <Flex className="min-h-[120px] flex-col gap-4 md:flex-row">
        <BannerImage
          className="max-h-[300px] w-full rounded-md md:max-h-[unset] md:w-[300px]"
          src={landingBannerUrl}
          title={title}
          description={shortDescription}
        />
        {landingBannerUrl ? (
          <Flex className="flex-col gap-2">
            <Flex className="items-center justify-between">
              <Title title={title} className="ellipsis-unset" />
              <Socials socials={socials} className="hidden md:flex" />
            </Flex>
            <Description description={shortDescription} />
            <Socials socials={socials} className="md:hidden" />
          </Flex>
        ) : null}
      </Flex>
      <LandingCollections collections={collections} />
    </Flex>
  );
};
