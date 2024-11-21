import { Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import {
  useCollection,
  useCollectible
} from '@0xsequence/marketplace-sdk/react';

export const useCollectableData = () => {
  const { chainParam, collectionId, tokenId } = Routes.collectible.useParams();

  const chainId = getChainId(chainParam)!;

  const collectibleMetadata = useCollectible({
    chainId: String(chainId),
    collectionAddress: collectionId,
    collectibleId: tokenId
  });

  const collectionMetadata = useCollection({
    chainId,
    collectionAddress: collectionId,
  });

  return {
    chainId,
    tokenId,
    collectionId,
    collectionMetadata,
    collectibleMetadata,
    loading: collectionMetadata.isLoading || collectibleMetadata.isLoading,
  };
};
