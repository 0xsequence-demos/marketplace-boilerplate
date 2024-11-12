'use client';

import { useState } from 'react';

import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, ScrollArea, Text, toast } from '$ui';
import { useCollectableData } from '../_hooks/useCollectableData';
import { MarketplaceKind } from '@0xsequence/marketplace-sdk';
import {
  useCreateListingModal,
  useCurrencies,
  useHighestOffer,
  useLowestListing,
  useMakeOfferModal,
  useSellModal,
  useBalanceOfCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useAccount, useConnectorClient, useConnectors } from 'wagmi';
import { Hex } from 'viem';

interface CollectibleTradeActionsProps {
  chainId: number;
  tokenId: string;
  collectionAddress: Hex;
}
export const CollectibleTradeActions = ({
  chainId,
  tokenId,
  collectionAddress,
}: CollectibleTradeActionsProps) => {
  const { show: showListModal } = useCreateListingModal();
  const { show: showOfferModal } = useMakeOfferModal();
  const { show: showSellModal } = useSellModal();

  const { data: currencies } = useCurrencies({
    chainId,
    collectionAddress,
  });

  const currencyAddresses = currencies?.map((c) => c.contractAddress) || [];

  const { data: highestOffer, isLoading: isLoadingHighestOffer } =
    useHighestOffer({
      chainId: String(chainId),
      collectionAddress,
      tokenId: tokenId,
      filter: {
        marketplace: [MarketplaceKind.sequence_marketplace_v1],
        currencies: currencyAddresses,
      },
      query: {
        enabled: !!currencies,
      },
    });

  const { data: lowestListing, isLoading: loadingLowestListing } =
    useLowestListing({
      chainId: String(chainId),
      collectionAddress,
      tokenId,
      filters: {
        marketplace: [MarketplaceKind.sequence_marketplace_v1],
      },
      query: {
        enabled: !!currencies,
      },
    });

  const { collectionMetadata, collectibleMetadata } = useCollectableData();

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalanceResp, isLoading: isBalanceLoading } =
    useBalanceOfCollectible({
      chainId: chainId,
      collectionAddress,
      collectableId: tokenId,
      query: {
        enabled: !!isConnected && !!address,
      },
    });

  const tokenBalance = userBalanceResp?.balance;

  const item721AlreadyOwned = !!tokenBalance && !isERC1155;

  const isLoading =
    isLoadingHighestOffer ||
    loadingLowestListing ||
    (isConnected && isBalanceLoading);

  const onClickBuy = () => {
    //TODO: buy
  };

  const onClickSell = () => {
    showSellModal({
      collectionAddress,
      chainId: String(chainId),
      tokenId,
      collectibleName: collectibleMetadata.data?.name,
      order: highestOffer!.order!,
      messages: {
        sellCollectible: {
          onUnknownError: (error: any) => {
            console.log(error);
          },
        },
      },
    });
  };

  const onClickOffer = () => {
    showOfferModal({
      collectionAddress,
      chainId: String(chainId),
      collectibleId: tokenId,
    });
  };

  const onClickList = () => {
    showListModal({
      collectionAddress,
      chainId: String(chainId),
      collectibleId: tokenId,
      messages: {
        createListing: {
          onSuccess: () => {
            toast.success('Listing created successfully');
          },
          onUnknownError: (error: any) => {
            toast.warning('An error occurred while creating the listing');
          },
        },
      },
    });
  };

  const buyDisabled = !isConnected || !lowestListing || item721AlreadyOwned;
  const offerDisabled = !isConnected || item721AlreadyOwned;
  const listingDisabled = !isConnected || !tokenBalance;
  const sellDisabled = !isConnected || !highestOffer?.order || !tokenBalance;

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
          <Button
            className="w-full justify-between"
            onClick={onClickOffer}
            size="lg"
            loading={false}
            disabled={offerDisabled}
          >
            <Text className="text-inherit">Offer</Text>
          </Button>
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
          <Button
            className="w-full justify-between"
            onClick={onClickList}
            size="lg"
            loading={false}
            disabled={listingDisabled}
          >
            <Text className="text-inherit">List</Text>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
