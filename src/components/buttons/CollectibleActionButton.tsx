'use client';

import { Button, toast } from '$ui';
import {
  useBalanceOfCollectible,
  useBuyModal,
  useCreateListingModal,
  useHighestOffer,
  useLowestListing,
  useMakeOfferModal,
  useSellModal,
  useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { usePathname } from 'next/navigation';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

type OrderSide = 'buy' | 'sell' | 'transfer' | 'order' | 'listing' | undefined;

type CollectibleActionButtonProps = {
  className?: string;
  tokenId: string;
  collectionAddress: Hex;
  collectibleName?: string;
  collectionChainId: number;
};

export const CollectibleActionButton = ({
  className,
  tokenId,
  collectionAddress,
  collectibleName,
  collectionChainId,
}: CollectibleActionButtonProps) => {
  const { address } = useAccount();
  const pathname = usePathname();

  const onError = (error: Error) => {
    toast.error(error.message);
  };
  const { show: showCreateListingModal } = useCreateListingModal({ onError });
  const { show: showMakeOfferModal } = useMakeOfferModal({ onError });
  const { show: showSellModal } = useSellModal({ onError });
  const { show: showBuyModal } = useBuyModal({ onError });
  const { show: showTransferModal } = useTransferModal();
  const { data: tokenBalancesData } = useBalanceOfCollectible({
    chainId: collectionChainId,
    collectionAddress,
    collectableId: tokenId,
    userAddress: address,
  });
  const collectibleBalance = tokenBalancesData?.balance;
  const userOwnsCollectible = !!collectibleBalance;
  const { data: highestOffer } = useHighestOffer({
    chainId: collectionChainId,
    collectionAddress,
    tokenId,
  });
  const { data: lowestListing } = useLowestListing({
    chainId: collectionChainId,
    collectionAddress,
    tokenId,
  });

  let orderSide: OrderSide = undefined;

  // sellable collectible
  if (userOwnsCollectible && highestOffer) {
    orderSide = 'sell';
  }

  // buyable collectible
  if (!userOwnsCollectible && lowestListing) {
    orderSide = 'buy';
  }

  // transferable collectible
  if (userOwnsCollectible && !highestOffer) {
    orderSide = 'transfer';
  }

  // offerable collectible
  if (!userOwnsCollectible && !lowestListing) {
    orderSide = 'order';
  }

  // listable collectible
  if (userOwnsCollectible && !lowestListing) {
    orderSide = 'listing';
  }

  // inventory page
  if (pathname === '/inventory') {
    orderSide = 'transfer';
  }

  if (!orderSide) return null;

  let orderTypes:
    | Record<NonNullable<OrderSide>, { label: string; onClick: () => void }>
    | undefined = undefined;

  orderTypes = {
    buy: {
      label: 'Buy',
      onClick: () => {
        if (!lowestListing || !collectibleName)
          throw new Error(
            'lowestListing and collectibleName are required for buy',
          );
        showBuyModal({
          collectibleId: tokenId,
          collectionAddress,
          chainId: collectionChainId,
          orderId: lowestListing.orderId,
          marketplace: lowestListing.marketplace,
        });
      },
    },
    sell: {
      label: 'Sell',
      onClick: () => {
        if (!highestOffer || !collectibleName)
          throw new Error(
            'highestOffer and collectibleName are required for sell',
          );

        showSellModal({
          tokenId,
          collectionAddress,
          chainId: collectionChainId,
          order: highestOffer,
        });
      },
    },
    transfer: {
      label: 'Transfer',
      onClick: () => {
        showTransferModal({
          collectibleId: tokenId,
          collectionAddress: collectionAddress,
          chainId: collectionChainId,
        });
      },
    },
    order: {
      label: 'Place offer',
      onClick: () => {
        showMakeOfferModal({
          collectionAddress,
          chainId: collectionChainId,
          collectibleId: tokenId,
        });
      },
    },
    listing: {
      label: 'Create Listing',
      onClick: () => {
        showCreateListingModal({
          collectionAddress,
          chainId: collectionChainId,
          collectibleId: tokenId,
        });
      },
    },
  };

  const { label } = orderTypes[orderSide];

  return (
    <Button onClick={orderTypes[orderSide].onClick} className={className}>
      {label}
    </Button>
  );
};
