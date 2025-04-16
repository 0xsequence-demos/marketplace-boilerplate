import { Table } from '~/components/ui';

import OrdersTableRow from './TableRow';
import type { Order } from '@0xsequence/marketplace-sdk';
import type { Hex } from 'viem';

const OrdersTableBody = ({
  orders,
}: {
  orders: Order[] | undefined;
  collectionAddress: Hex;
}) => {
  return (
    <Table.Body className="text-foreground">
      {orders?.map((order: Order, index: number) => (
        <OrdersTableRow
          key={`order-${order.orderId}`}
          order={order}
          index={index}
        />
      ))}
    </Table.Body>
  );
};

export default OrdersTableBody;
