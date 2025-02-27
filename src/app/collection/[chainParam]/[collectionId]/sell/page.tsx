'use client';

import { NotConnectedWarning } from '~/components/NotConnectedWarning';
import { Box, Text } from '~/components/ui';
import type { Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { OrderSide } from '@0xsequence/marketplace-sdk';
import { useListCollectibles } from '@0xsequence/marketplace-sdk/react';
import { observer } from '@legendapp/state/react';
import { useAccount } from 'wagmi';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam);
  const { collectionId } = params;
  const { address, isConnected } = useAccount();

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();

  const {
    data: collectibles,
    isLoading: collectiblesLoading,
    fetchNextPage: fetchNextCollectibles,
  } = useListCollectibles({
    chainId: String(chainId),
    collectionAddress: collectionId,
    filter: {
      searchText: text,
      includeEmpty: !filters$.showListedOnly.get(),
      properties,
      inAccounts: address ? [address] : undefined,
    },
    side: OrderSide.listing,
  });

  if (!address) {
    return <NotConnectedWarning isConnected={isConnected} />;
  }

  const collectiblesFlat =
    collectibles?.pages.flatMap((p) => p.collectibles) ?? [];

  //TODO: Implement error handling, loading states, and improve this message
  if (collectiblesFlat.length === 0 && !collectiblesLoading) {
    return (
      <Box className="flex items-center justify-center">
        <Text className="text-foreground/60 text-lg">
          You don&lsquo;t own any collectable matching your current filters
        </Text>
      </Box>
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
