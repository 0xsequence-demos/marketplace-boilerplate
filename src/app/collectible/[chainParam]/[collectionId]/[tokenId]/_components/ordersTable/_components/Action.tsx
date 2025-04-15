import { toast } from 'react-toastify';

import { Button } from '@0xsequence/design-system';
import { type Order, OrderSide } from '@0xsequence/marketplace-sdk';
import {
  useBalanceOfCollectible,
  useBuyModal,
  useCancelOrder,
  useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

const OrdersTableAction = ({
  collectionAddress,
  chainId,
  tokenId,
  order,
}: {
  collectionAddress: Hex;
  chainId: number;
  tokenId: string;
  order: Order;
}) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalanceOfCollectible({
    collectableId: tokenId,
    collectionAddress,
    chainId,
    userAddress: accountAddress,
    query: {
      enabled: !!accountAddress,
    },
  });
  const { show: showSellModal } = useSellModal();
  const { cancelOrder } = useCancelOrder({
    chainId,
    collectionAddress,
    onError: (error) => {
      toast('An error occurred while cancelling the order', {
        type: 'error',
      });
      console.error(error);
    },
    onSuccess: () => {
      toast('You canceled the order', {
        type: 'success',
      });
    },
  });
  const { show: openBuyModal } = useBuyModal({
    onError: (error) => {
      toast('An error occurred while purchasing', {
        type: 'error',
      });
      console.error(error);
    },
    onSuccess: () => {
      toast('You purchased the collectible', {
        type: 'success',
      });
    },
  });
  const accountHasCollectible = !!balance?.balance || false;
  const orderCreatedByAccount =
    order.createdBy === accountAddress?.toLowerCase();
  const buttonProps: {
    label: string;
    onClick: () => void | Promise<void>;
  } | null =
    (order.side === OrderSide.offer &&
      accountHasCollectible && { label: 'Sell', onClick: handleSell }) ||
    (order.side === OrderSide.offer &&
      orderCreatedByAccount && {
        label: 'Cancel',
        onClick: handleCancelOrder,
      }) ||
    (order.side === OrderSide.listing &&
      orderCreatedByAccount && {
        label: 'Cancel',
        onClick: handleCancelOrder,
      }) ||
    (order.side === OrderSide.listing && {
      label: 'Buy',
      onClick: handleBuy,
    }) ||
    null;

  function handleSell() {
    showSellModal({
      chainId,
      collectionAddress,
      tokenId,
      order,
    });
  }

  async function handleCancelOrder() {
    await cancelOrder({
      orderId: order.orderId,
      marketplace: order.marketplace,
    });
  }

  function handleBuy() {
    openBuyModal({
      collectionAddress,
      chainId,
      collectibleId: tokenId,
      orderId: order.orderId,
      marketplace: order.marketplace,
    });
  }

  if (!buttonProps) {
    return null;
  }

  return (
    <Button
      label={buttonProps.label}
      onClick={buttonProps.onClick}
      variant="primary"
      size="xs"
    />
  );
};

export default OrdersTableAction;
