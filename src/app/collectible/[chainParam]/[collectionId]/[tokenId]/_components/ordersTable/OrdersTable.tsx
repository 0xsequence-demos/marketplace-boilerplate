import { Box, Table } from '../../../../../../../components/ui';
import OrdersTableBody from './_components/Body';
import OrdersTableFooter from './_components/Footer';
import OrdersTableHeader from './_components/Header';
import OrdersTableBodySkeleton from './_components/Skeletons';
import type { Order, Page } from '@0xsequence/marketplace-sdk';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';

export const PAGE_SIZE_OPTIONS = {
  5: { label: '5', value: 5 },
  10: { label: '10', value: 10 },
  20: { label: '20', value: 20 },
};

type OrdersTableProps = {
  chainId: string;
  collectionAddress: Hex;
  tokenId: string;
  orders: Order[] | undefined;
  ordersCount: number | undefined;
  ordersCountLoading: boolean;
  page$: Observable<Page>;
  isLoading: boolean;
};

const OrdersTable = observer((props: OrdersTableProps) => {
  const {
    collectionAddress,
    page$,
    orders,
    ordersCount,
    ordersCountLoading,
  } = props;

  const columns = ['Price', 'Quantity', 'By', 'Expires', 'Marketplace'];

  return (
    <Box className="overflow-hidden rounded-md border border-foreground/20">
      <Table.Root>
        <OrdersTableHeader items={columns} isLoading={props.isLoading} />

        {props.isLoading && (
          <OrdersTableBodySkeleton
            columns={columns.length}
            pageSize={page$.pageSize.get()}
          />
        )}

        {!props.isLoading && (
              <OrdersTableBody
            orders={orders}
            collectionAddress={collectionAddress}
          />
        )}

        <OrdersTableFooter
          page$={page$}
          ordersCount={ordersCount}
          ordersCountLoading={ordersCountLoading}
        />
      </Table.Root>
    </Box>
  );
});

export default OrdersTable;
