'use client';

import { Badge } from '$ui';
import { useCollection } from '@0xsequence/marketplace-sdk/react';

interface Props {
  chainId: number;
  collectionAddress: string;
}

export const ContractTypeBadge = ({ chainId, collectionAddress }: Props) => {
  const {
    data: collectionMetadataResp,
    isLoading: isCollectionMetadataLoading,
  } = useCollection({
    chainId: chainId.toString(),
    collectionAddress,
  });
  return (
    <Badge variant="muted" loading={isCollectionMetadataLoading}>
      {collectionMetadataResp?.type || 'unknown'}
    </Badge>
  );
};
