'use client';

import { NotConnectedWarning } from '~/components/NotConnectedWarning';
import { Box, Text } from '~/components/ui';
import { type Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { MarketplaceKind, OrderSide } from '@0xsequence/marketplace-sdk';
import { observer } from '@legendapp/state/react';
import { useAccount } from 'wagmi';
import { useListCollectibles } from '@0xsequence/marketplace-sdk/react';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam)!;
  const { collectionId } = params;
  const { address, isConnected } = useAccount();

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();

  const collectiblesResponse = useListCollectibles({
    chainId: String(chainId),
    collectionAddress: collectionId,
    filter: {
      searchText: text,
      includeEmpty: !filters$.showAvailableOnly.get(),
      properties,
      inAccounts: address ? [address] : undefined,
      marketplaces: [MarketplaceKind.sequence_marketplace_v1],
    },
    side: OrderSide.listing
  });

  if (!address) {
    return <NotConnectedWarning isConnected={isConnected} />;
  }

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((p) => p.collectibles) ?? [];

  //TODO: Implement error handling, loading states, and improve this message
  if (collectibles.length === 0 && !collectiblesResponse.isLoading) {
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
        endReached={collectiblesResponse.fetchNextPage}
        collectibleOrders={collectibles}
      />
    </>
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
