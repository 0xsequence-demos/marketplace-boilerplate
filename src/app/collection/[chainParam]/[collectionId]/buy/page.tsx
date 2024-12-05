'use client';

import { type Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { observer } from '@legendapp/state/react';
import { useListCollectibles } from '@0xsequence/marketplace-sdk/react';
import { OrderSide } from '@0xsequence/marketplace-sdk';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam)!;
  const { collectionId } = params;

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();
  const includeEmpty = !filters$.showAvailableOnly.get();

  const collectiblesResponse = useListCollectibles({
    chainId: String(chainId),
    collectionAddress: collectionId,
    filter: {
      searchText: text,
      includeEmpty,
      properties,
    },
    side: OrderSide.listing,
  });

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((p) => p.collectibles) ?? [];

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
