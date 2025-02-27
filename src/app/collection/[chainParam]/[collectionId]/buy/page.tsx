'use client';

import type { Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import { Box, Button, Flex, Text } from '$ui';
import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { OrderSide } from '@0xsequence/marketplace-sdk';
import { useListCollectibles } from '@0xsequence/marketplace-sdk/react';
import { observer, use$ } from '@legendapp/state/react';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam);
  const { collectionId } = params;

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();
  const includeEmpty = !filters$.showListedOnly.get();

  const clearAllFilters = () => filters$.clearAllFilters();
  const appliedFilters = use$(() => filters$.appliedFilters);

  const {
    data: collectibles,
    isLoading: collectiblesLoading,
    fetchNextPage: fetchNextCollectibles,
  } = useListCollectibles({
    chainId: String(chainId),
    collectionAddress: collectionId,
    filter: {
      searchText: text,
      includeEmpty,
      properties,
    },
    side: OrderSide.listing,
  });

  const collectiblesFlat =
    collectibles?.pages.flatMap((p) => p.collectibles) ?? [];

  if (
    collectiblesFlat.length === 0 &&
    !collectiblesLoading &&
    appliedFilters.length !== 0
  ) {
    return (
      <Flex className="pt-20 w-full items-center justify-center gap-4">
        <Text className="text-center text-lg text-destructive">
          No results found with the applied filters
        </Text>
        <Button
          variant="outline"
          size="sm"
          label="Clear all filters"
          onClick={() => clearAllFilters()}
        />
      </Flex>
    );
  }

  return (
    <>
      <CollectiblesGrid
        endReached={fetchNextCollectibles}
        collectibleOrders={collectiblesFlat}
        collectibleOrdersLoading={collectiblesLoading}
      />
    </>
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
