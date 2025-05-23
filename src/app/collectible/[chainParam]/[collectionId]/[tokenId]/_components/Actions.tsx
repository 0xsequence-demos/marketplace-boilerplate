'use client';

import { Button, Flex, Text, toast } from '$ui';
import { useCollectableData } from '../_hooks/useCollectableData';
import {
  useBalanceOfCollectible,
  useBuyModal,
  useCreateListingModal,
  useCurrencies,
  useHighestOffer,
  useLowestListing,
  useMakeOfferModal,
  useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

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
  const onError = (error: Error) => {
    toast.error(error.message);
  };

  const { show: showListModal } = useCreateListingModal({ onError });
  const { show: showOfferModal } = useMakeOfferModal({
    onError,
  });
  const { show: showSellModal } = useSellModal({ onError });
  const { show: showBuyModal } = useBuyModal({
    onSuccess(hash) {
      console.log('Buy transaction sent with hash: ', hash);
    },
    onError,
  });
  const { data: currencies } = useCurrencies({
    chainId,
    collectionAddress,
  });

  const currencyAddresses = currencies?.map((c) => c.contractAddress) || [];

  const { data: highestOffer, isLoading: isLoadingHighestOffer } =
    useHighestOffer({
      chainId,
      collectionAddress,
      tokenId: tokenId,
      filter: {
        currencies: currencyAddresses,
      },
      query: {
        enabled: !!currencies,
      },
    });

  const { data: lowestListing, isLoading: loadingLowestListing } =
    useLowestListing({
      chainId,
      collectionAddress,
      tokenId,
      query: {
        enabled: !!currencies,
      },
    });

  const { collectionMetadata } = useCollectableData();

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalanceResp, isLoading: isBalanceLoading } =
    useBalanceOfCollectible({
      chainId: chainId,
      collectionAddress,
      collectableId: tokenId,
      userAddress: address,
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
    showBuyModal({
      chainId,
      collectionAddress,
      collectibleId: tokenId,
      orderId: lowestListing!.orderId,
      marketplace: lowestListing!.marketplace,
    });
  };

  const onClickSell = () => {
    showSellModal({
      collectionAddress,
      chainId,
      tokenId,
      order: highestOffer!,
    });
  };

  const onClickOffer = () => {
    showOfferModal({
      collectionAddress,
      chainId,
      collectibleId: tokenId,
    });
  };

  const onClickList = () => {
    showListModal({
      collectionAddress,
      chainId,
      collectibleId: tokenId,
    });
  };

  const buyDisabled = !isConnected || !lowestListing || item721AlreadyOwned;
  const offerDisabled = !isConnected || item721AlreadyOwned;
  const listingDisabled = !isConnected || !tokenBalance;
  const sellDisabled = !isConnected || !highestOffer || !tokenBalance;

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
