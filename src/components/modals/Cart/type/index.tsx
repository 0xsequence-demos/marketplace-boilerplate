'use client';

import { memo } from 'react';

import { cartState } from '~/lib/stores/cart/Cart';

import { OrderbookOrderComponents } from './orderbook';
import { TransferOrderComponents } from './transfer';
import { useSnapshot } from 'valtio';
import { OrderItemType } from '~/lib/stores/cart/types';

// eslint-disable-next-line react/display-name
export const OrderRenderer = memo(() => {
  const {
    baseOrderInfo: { orderType },
  } = useSnapshot(cartState);

  switch (orderType) {
    case OrderItemType.TRANSFER:
      return <TransferOrderComponents />;
    case OrderItemType.BUY:
    case OrderItemType.SELL:
      return <OrderbookOrderComponents />;
    default:
      return <></>;
  }
});
