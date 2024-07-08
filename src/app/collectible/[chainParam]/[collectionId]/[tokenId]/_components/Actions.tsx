'use client';

import { useState } from 'react';

import { getOrderStatus } from '~/app/collection/[chainParam]/[collectionId]/_components/ListingOfferModal';
import { OrderModalContent } from '~/components/modals/OrderModalContent';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { useCollectionCurrencies } from '~/hooks/useCollectionCurrencies';
import { balanceQueries, collectableQueries } from '~/lib/queries';
import {
  MarketplaceKind,
  type Order,
  OrderSide,
} from '~/lib/queries/marketplace/marketplace.gen';
import { _addToCart_ } from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';
import { defaultSelectionQuantity } from '~/lib/utils/quantity';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, ScrollArea, Text } from '$ui';
import { useCollectableData } from '../_hooks/useCollectableData';
import { type OrderbookOrder } from '@0xsequence/indexer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface CollectibleTradeActionsProps {
  chainId: number;
  tokenId: string;
  collectionAddress: string;
}
export const CollectibleTradeActions = ({
  chainId,
  tokenId,
  collectionAddress,
}: CollectibleTradeActionsProps) => {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  const { currencies } = useCollectionCurrencies({
    chainId: chainId,
    collectionId: collectionAddress,
  });

  const currencyAddresses = currencies?.map((c) => c.contractAddress) || [];

  const { data: bestOffers, isLoading: isLoadingBestOffers } = useQuery({
    ...collectableQueries.highestOffer({
      chainId,
      contractAddress: collectionAddress,
      tokenId: tokenId,
      filter: {
        marketplace: [MarketplaceKind.sequence_marketplace_v1],
      },
    }),
    enabled: !!currencies,
  });

  const bestOffer = getOrderbookOrder(bestOffers?.order);

  const { data: bestListings, isLoading: isLoadingBestListings } = useQuery({
    ...collectableQueries.lowestListing({
      chainId,
      contractAddress: collectionAddress,
      tokenId: tokenId,
      filter: {
        marketplace: [MarketplaceKind.sequence_marketplace_v1],
      },
    }),
    enabled: !!currencies,
  });

  const bestListing = getOrderbookOrder(bestListings?.order);
  const { collectionMetadata, collectibleMetadata } = useCollectableData();

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalanceResp, isLoading: isBalanceLoading } =
    useInfiniteQuery({
      ...balanceQueries.list({
        chainId: chainId,
        contractAddress: collectionAddress,
        tokenId,
        includeMetadata: false,
        accountAddress: address as string,
      }),
      enabled: !!isConnected && !!address,
    });

  const userBalance = userBalanceResp?.pages?.[0]?.balances[0]?.balance;

  const item721AlreadyOwned = !!userBalance && !isERC1155;

  const isLoading =
    isLoadingBestOffers ||
    isLoadingBestListings ||
    (isConnected && isBalanceLoading);

  const onClickBuy = () => {
    if (!bestListing || !bestListings || !userBalance) return;
    _addToCart_({
      item: {
        chainId,
        itemType: OrderItemType.BUY,
        collectibleMetadata: {
          collectionAddress: bestListings.order.collectionContractAddress,
          tokenId: bestListing.tokenId,
          name: collectibleMetadata.data?.name || '',
          imageUrl: collectibleMetadata.data?.image || '',
          decimals: collectibleMetadata.data?.decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.BUY,
          tokenDecimals: collectibleMetadata.data?.decimals || 0,
          tokenUserBalance: BigInt(userBalance.toString() || 0),
          tokenAvailableAmount: BigInt(Number(bestListing.quantityRemaining)),
        }),
        orderId: bestListing.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  const onClickSell = () => {
    if (!bestOffer || !bestOffers) return;
    _addToCart_({
      item: {
        chainId,
        itemType: OrderItemType.SELL,
        collectibleMetadata: {
          collectionAddress: bestOffers.order.collectionContractAddress,
          tokenId: bestOffer.tokenId,
          name: collectibleMetadata.data?.name || '',
          imageUrl: collectibleMetadata.data?.image || '',
          decimals: collectibleMetadata.data?.decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.SELL,
          tokenDecimals: collectibleMetadata.data?.decimals || 0,
          tokenUserBalance: BigInt(userBalance?.toString() || 0),
          tokenAvailableAmount: BigInt(Number(bestOffer.quantityRemaining)),
        }),
        orderId: bestOffer.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  const buyDisabled = !bestListing || item721AlreadyOwned;
  const offerDisabled = !isConnected;
  const listingDisabled = !isConnected || !userBalance;
  const sellDisabled = !bestOffer || !userBalance;

  return (
    <Flex className="flex-col gap-4">
      <Flex className="flex-row gap-4">
        <Button
          size="lg"
          className="w-full justify-between"
          loading={isLoading}
          disabled={buyDisabled}
          onClick={onClickBuy}
        >
          <Text className="text-inherit">Buy</Text>
        </Button>
        <Flex className="w-full flex-col gap-3">
          <Dialog.Root
            open={isOfferModalOpen}
            onOpenChange={(isOpen) => setIsOfferModalOpen(isOpen)}
          >
            <Dialog.Trigger asChild>
              <Button
                className="w-full justify-between"
                size="lg"
                loading={false}
                disabled={offerDisabled}
              >
                <Text className="text-inherit">Offer</Text>
              </Button>
            </Dialog.Trigger>

            <Dialog.BaseContent
              container={getThemeManagerElement()}
              className="max-h-screen max-w-[700px] p-5"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Dialog.Title>Create an offer</Dialog.Title>
              <OrderModalContent
                chainId={chainId}
                collectionAddress={collectionAddress}
                tokenId={tokenId}
                bestOrder={bestListing}
                open={isOfferModalOpen}
                setOpen={setIsOfferModalOpen}
                type="offer"
              />
            </Dialog.BaseContent>
          </Dialog.Root>
        </Flex>
      </Flex>
      <Flex className="flex-row gap-4">
        <Button
          className="w-full justify-between"
          size="lg"
          loading={isLoading}
          disabled={sellDisabled}
          onClick={onClickSell}
        >
          <Text className="text-inherit">Sell</Text>
        </Button>

        <Flex className="w-full flex-col gap-3">
          <Dialog.Root
            open={isListingModalOpen}
            onOpenChange={(isOpen) => setIsListingModalOpen(isOpen)}
          >
            <Dialog.Trigger asChild>
              <Button
                className="w-full justify-between"
                size="lg"
                loading={false}
                disabled={listingDisabled}
              >
                <Text className="text-inherit">List</Text>
              </Button>
            </Dialog.Trigger>

            <Dialog.BaseContent
              container={getThemeManagerElement()}
              className="flex max-w-[700px] flex-col overflow-hidden p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <ScrollArea.Base viewportClassName="max-h-screen">
                <Flex className="h-full w-full flex-col gap-4 p-5">
                  <Dialog.Title>Make a listing</Dialog.Title>

                  <OrderModalContent
                    chainId={chainId}
                    collectionAddress={collectionAddress}
                    tokenId={tokenId}
                    bestOrder={bestOffer}
                    open={isListingModalOpen}
                    setOpen={setIsListingModalOpen}
                    type="listing"
                  />
                </Flex>
              </ScrollArea.Base>
            </Dialog.BaseContent>
          </Dialog.Root>
        </Flex>
      </Flex>
    </Flex>
  );
};

const getOrderbookOrder = (order?: Order) => {
  if (!order) return undefined;
  //TODO, unify Order and OrderbookOrder
  return {
    orderId: order.orderId,
    tokenContract: order.collectionContractAddress,
    tokenId: order.tokenId,
    isListing: order.side === OrderSide.listing,
    quantity: order.quantityInitial,
    quantityRemaining: order.quantityRemaining,
    currencyAddress: order.priceCurrencyAddress,
    pricePerToken: order.priceAmount,
    expiry: order.validUntil,
    orderStatus: getOrderStatus(order.status),
    createdBy: order.createdBy,
    createdAt: Math.round(new Date(order.createdAt).getTime() / 1000),
    orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
  } satisfies OrderbookOrder;
};
