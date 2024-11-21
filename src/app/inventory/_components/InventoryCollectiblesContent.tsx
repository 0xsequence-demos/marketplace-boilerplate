'use client';

import { CollectibleCard } from '~/app/collection/[chainParam]/[collectionId]/_components/Grid/Card/CollectableCard';
import { ContractTypeBadge } from '~/components/ContractTypeBadge';
import { Spinner } from '~/components/Spinner';

import {
  Accordion,
  Avatar,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
  cn,
} from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import type { TokenBalance } from '@0xsequence/indexer';
import {
  useCollection,
  useListBalances
} from '@0xsequence/marketplace-sdk/react';
import { ContractType } from '@0xsequence/metadata';
import { type Hex } from 'viem';

type InventoryCollectiblesContent = {
  collectionBalances: TokenBalance[];
};

export const InventoryCollectiblesContent = ({
  collectionBalances,
}: InventoryCollectiblesContent) => {
  return (
    <>
      <Accordion.Root
        type="multiple"
        className="w-full"
        defaultValue={collectionBalances.map((c) => c.contractAddress)}
      >
        {collectionBalances.map((c) => {
          return <CollectionSection key={c.contractAddress} {...c} />;
        })}
      </Accordion.Root>
    </>
  );
};

const CollectionSection = ({
  chainId,
  contractAddress: collectionAddress,
  accountAddress,
}: TokenBalance) => {
  const {
    data: collectionBalances,
    isLoading: collectionBalancesLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useListBalances({
    chainId,
    accountAddress,
    contractAddress: collectionAddress,
  });
  const { data: collectionMetadata, isLoading: isCollectionMetadataLoading } =
    useCollection({ chainId, collectionAddress });

  // const { isGridView } = useViewType();

  const isGridView = true;

  const collectibles =
    collectionBalances?.pages.flatMap((p) => p.balances) || [];

  const handleLoadMore = () => {
    if (isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  };

  if (collectionBalancesLoading || isCollectionMetadataLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (collectibles.length === 0)
    return <Text className="w-full text-center text-pink">Empty.</Text>;

  return (
    <Accordion.Item
      disabled={collectionBalancesLoading}
      value={collectionAddress}
      className="mb-8 max-w-[100vw] bg-transparent px-0 focus-within:ring-0 md:px-3"
    >
      <Flex
        className="sticky z-20 bg-background py-2"
        style={{ top: 'calc(var(--headerHeight))' }}
      >
        <ScrollArea.Base orientation="horizontal" className="max-w-full">
          <Accordion.Trigger className={cn('w-full min-w-max self-start')}>
            <Flex className="items-center gap-3">
              <Avatar.Base>
                <Avatar.Image
                  alt={collectionMetadata?.name}
                  src={collectionMetadata?.logoURI}
                />
              </Avatar.Base>

              <Text className="text-sm">
                {collectionMetadata?.name || collectionAddress}
              </Text>
              <NetworkImage chainId={Number(collectionMetadata?.chainId)} />
              <ContractTypeBadge
                chainId={chainId}
                collectionAddress={collectionAddress}
              />
            </Flex>

            <Text className="ml-auto text-sm text-foreground/50">
              ITEMS {collectibles.length}
            </Text>
          </Accordion.Trigger>
        </ScrollArea.Base>
      </Flex>

      <Accordion.Content className="mt-0 p-1">
        <ContentWrapper isGridView={isGridView}>
          {collectibles.map((c) => {
            return isGridView ? (
              <CollectibleCard
                collectionAddress={collectionAddress as Hex}
                tokenId={c.tokenID!}
                collectionChainId={String(c.chainId)}
              />
            ) : (
              <InventoryRow />
            );
          })}
        </ContentWrapper>

        {hasNextPage ? (
          <Button
            className="mt-2"
            variant="secondary"
            label="Load More"
            onClick={handleLoadMore}
            loading={isFetchingNextPage}
          />
        ) : null}
      </Accordion.Content>
    </Accordion.Item>
  );
};

const getContractType = (contractType?: string) => {
  switch (contractType?.toUpperCase()) {
    case 'ERC721':
      return ContractType.ERC721;
    case 'ERC1155':
      return ContractType.ERC1155;
    default:
      return ContractType.UNKNOWN;
  }
};

const ContentWrapper = ({
  isGridView,
  children,
}: {
  isGridView: boolean;
  children: React.ReactNode;
}) => {
  return isGridView ? (
    <Grid.Root
      className={cn(
        'grid-flow-row gap-0.5 sm:gap-3',
        'auto-rows-[minmax(250px,min-content)] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] grid-rows-[repeat(auto-fill,minmax(250px,min-content))]',
        'sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]',
      )}
    >
      {children}
    </Grid.Root>
  ) : (
    <>{children}</>
  );
};
const InventoryRow = () => null;
// TODO: Implement InventoryRow
// {
//   data,
// }: {
//   data: Exclude<CollectibleCardData, undefined | null>;
// }) => {
//   const badge = data.badges![0];
//   return (
//     <Flex className="justify-between border-b border-b-border py-3">
//       <Flex className="gap-3">
//         <PoolAvatar
//           src={data.image || ''}
//           name={data.name || ''}
//           chainId={data.addToCartButtonProps?.addToCartData.item.chainId}
//           tokenId={data.tokenId}
//           link={data.link}
//         />
//         <Badge variant="muted" title={String(badge.title)}>
//           {badge.label}:<span className="ml-1">{badge.value}</span>
//         </Badge>
//       </Flex>
//       {data.addToCartButtonProps?.addToCartData && (
//         <AddToCartButton
//           isAvailable={true}
//           addToCartData={data.addToCartButtonProps?.addToCartData}
//           itemType={OrderItemType.TRANSFER}
//         />
//       )}
//     </Flex>
//   );
// };
