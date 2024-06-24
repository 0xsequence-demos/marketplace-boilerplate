'use client';

import { CollectibleInfo } from '../_components/Info';
import { useCollectableData } from '../_hooks/useCollectableData';
import { Box, Flex, cn } from 'system';

export default function Sidebar() {
  const {
    collectionMetadata,
    chainId,
    collectibleMetadata,
    collectionId,
    tokenId,
  } = useCollectableData();
  return (
    <Box className="basis-[400px]">
      <Flex
        className={cn('flex-col gap-4', '@4xl/collectibleViewContainer:sticky')}
        style={{
          top: 'calc(var(--headerHeight) + 50px)',
        }}
      >
        <CollectibleInfo
          chainId={Number(chainId)}
          collectionAddress={collectionId}
          contractType={collectionMetadata.data?.type}
          tokenId={tokenId}
          collectionName={collectionMetadata.data?.name}
          collectionImageUrl={
            collectionMetadata.data?.extensions?.ogImage ?? ''
          }
          tokenName={collectibleMetadata?.data?.[0]?.name}
          tokenDecimals={collectibleMetadata?.data?.[0]?.decimals ?? 0}
          loading={
            collectibleMetadata.isLoading || collectionMetadata.isLoading
          }
        />

        <Flex className="flex-col gap-3">
          {/* <CollectibleTradeActions
         chainId={chainId}
         collectionAddress={collectionId}
         tokenId={tokenId}
        /> */}
        </Flex>
      </Flex>
    </Box>
  );
}
