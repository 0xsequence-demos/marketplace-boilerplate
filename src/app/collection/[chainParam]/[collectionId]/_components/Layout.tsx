import { Box, Flex, Grid, Text, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

import { FilterBadges } from './Badges';

type CollectionViewPageLayoutProps = {
  banner: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  controls: React.ReactNode;
  content: React.ReactNode;

  collectionConfig?: MarketplaceConfig['collections'][0];
  chainError?: string | null;
};

const defaultGridContainerClassName = [
  classNames.collectionViewLayout,
  '@container/collectionViewContainer',
  'px-2 md:px-4 xl:px-8',
  'min-h-screen gap-y-8 md:gap-y-12',
] as const;

export const CollectionViewPageLayout = ({
  chainError,
  banner,
  sidebar,
  header,
  controls,
  content,
  collectionConfig,
}: CollectionViewPageLayoutProps) => {
  if (chainError) {
    return (
      <Flex className="mx-auto h-full w-full max-w-[1200px] items-center justify-center">
        <Text className="text-center text-lg text-destructive">
          {chainError}
        </Text>
      </Flex>
    );
  }

  let layout: 'default' | 'banner' = 'default';

  if (collectionConfig?.bannerUrl) {
    layout = 'banner';
  }

  switch (layout) {
    case 'default': {
      return (
        <Grid.Root
          className={cn(defaultGridContainerClassName, 'mt-12')}
          template={`
            [row1-start] "collection-header collection-header" min-content [row1-end]
            [row2-start] "collection-details collection-details" min-content [row2-end]
            [row3-start] "collection-controls collection-controls" min-content [row3-end]
            [row4-start] "collection-sidebar collection-content" 1fr [row4-end]
            / auto 1fr
          `}
        >
          <Grid.Child
            name="collection-header"
            className="duration-300 animate-in fade-in"
          >
            {header}
          </Grid.Child>
          <Grid.Child name="collection-sidebar">{sidebar}</Grid.Child>
          <Grid.Child
            name="collection-controls"
            className="sticky z-19"
            style={{
              top: 'calc(var(--headerHeight) - 1px)',
            }}
          >
            {controls}
          </Grid.Child>
          <Grid.Child name="collection-content">
            {collectionConfig && (
              <FilterBadges
                chainId={collectionConfig.chainId}
                collectionAddress={collectionConfig.collectionAddress}
              />
            )}
            {content}
          </Grid.Child>
        </Grid.Root>
      );
    }

    case 'banner': {
      return (
        <>
          <Box
            className="relative mb-4 h-[300px] lg:mb-12"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            style={{ '--bannerUrl': `url(${collectionConfig?.bannerUrl})` }}
          >
            {banner}

            <Box className="absolute bottom-6 left-1/2 mx-auto w-full -translate-x-1/2 px-4">
              <Box className="rounded-lg bg-background/80 shadow-md backdrop-blur-md">
                <Box className="rounded-lg bg-foreground/20 p-4">{header}</Box>
              </Box>
            </Box>
          </Box>

          <Grid.Root
            className={cn(
              defaultGridContainerClassName,
              `${classNames.collectionViewLayout}-with-banner`,
            )}
            template={`
              [row1-start] "collection-details collection-details" min-content [row1-end]
              [row2-start] "collection-controls collection-controls" min-content [row2-end]
              [row3-start] "collection-sidebar collection-content" 1fr [row3-end]
              / auto 1fr
            `}
          >
            <Grid.Child name="collection-sidebar">{sidebar}</Grid.Child>
            <Grid.Child
              name="collection-controls"
              className="sticky z-19"
              style={{
                top: 'calc(var(--headerHeight) - 1px)',
              }}
            >
              {controls}
            </Grid.Child>
            <Grid.Child name="collection-content">
              {collectionConfig && (
                <FilterBadges
                  chainId={collectionConfig.chainId}
                  collectionAddress={collectionConfig.collectionAddress}
                />
              )}
              {content}
            </Grid.Child>
          </Grid.Root>
        </>
      );
    }
  }
};
