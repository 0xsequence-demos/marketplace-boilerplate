import { Flex, Grid, Text, cn } from '$ui';
import { CollectionCard } from './Card/index';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';

type LandingCollectionsProps = {
  collections: MarketplaceConfig['collections'];
  className?: string;
};

export const LandingCollections = ({
  collections,
  className,
}: LandingCollectionsProps) => {
  return (
    <Flex className="flex-col gap-4 @container/publisherCollectionsGrid">
      <Text className="size-sm font-bold text-foreground/50">Collections</Text>
      <Grid.Root
        className={cn(
          'grid-flow-row auto-rows-[minmax(380px,381px)] grid-cols-[repeat(auto-fill,minmax(260px,1fr))] grid-rows-[minmax(380px,381px)] gap-4',
          'md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]',
          className,
        )}
      >
        {collections.map((d) => {
          return <CollectionCard key={d.collectionAddress} {...d} />;
        })}
      </Grid.Root>
    </Flex>
  );
};
