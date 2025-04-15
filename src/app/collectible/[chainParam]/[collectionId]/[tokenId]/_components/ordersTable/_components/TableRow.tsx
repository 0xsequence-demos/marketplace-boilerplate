import { cn, Table } from '~/components/ui';

import AddressPill from './AddressPill';
import MarketplacePill from './MarketplacePill';
import { Text } from '@0xsequence/design-system';
import { compareAddress, type Order } from '@0xsequence/marketplace-sdk';
import { formatDistance } from 'date-fns';
import { formatUnits, type Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useCurrencies } from '@0xsequence/marketplace-sdk/react';
import OrdersTableAction from './Action';

const OrdersTableRow = ({
  order,
  index,
}: {
  order: Order;
  index: number;
}) => {
  const { chainId, tokenId, collectionContractAddress } = order;
  const { address: accountAddress } = useAccount();
  const { data: currencies } = useCurrencies({
    chainId,
  });
  const currency = currencies?.find(
    (c) => compareAddress(c.contractAddress, order.priceCurrencyAddress)
  );
  return (
    <>
      {/* for small screens */}
      <Table.Row
        className={cn(
          index % 2 === 0 ? 'bg-muted/60' : '',
          'table-row md:hidden',
        )}
      >
        <Table.Cell className="p-2">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
              <Text color="text50" fontSize="xsmall" fontWeight="bold">
                Quantity
              </Text>

              <Text color="text100" fontSize="normal" fontWeight="bold">
                {order.quantityRemaining}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <Text color="text50" fontSize="xsmall" fontWeight="bold">
                Price
              </Text>

              <Text color="text100" fontSize="normal" fontWeight="bold">
                {formatUnits(
                  BigInt(order.priceAmount),
                  Number(currency?.decimals),
                )}{' '}
                {currency?.symbol}
              </Text>
            </div>

            <div className="flex flex-col gap-1">
              <Text color="text50" fontSize="xsmall" fontWeight="bold">
                Time left
              </Text>

              <Text color="text100" fontSize="normal" fontWeight="bold">
                {formatDistance(order.validUntil, new Date())}
              </Text>
            </div>
          </div>

          <div
            className="flex items-end justify-between gap-6"
          >
            <div className="flex flex-col gap-1 flex-grow">
              <Text color="text50" fontSize="xsmall" fontWeight="bold">
                By
              </Text>

              <AddressPill address={order.createdBy} />
            </div>

            <div className="flex flex-col gap-1">
              <Text color="text50" fontSize="xsmall" fontWeight="bold">
                On
              </Text>

              <MarketplacePill
                marketplace={order.marketplace}
                originName={order.originName}
              />
            </div>

            {accountAddress && (
              <Table.Cell className="p-0">
                <OrdersTableAction
                  chainId={chainId}
                  collectionAddress={collectionContractAddress as Hex}
                  tokenId={tokenId}
                  order={order}
                />
              </Table.Cell>
            )}
          </div>
        </Table.Cell>
      </Table.Row>

      {/* for wide screens */}

      <Table.Row
        className={cn(
          index % 2 === 0 ? 'bg-muted/60' : '',
          'hidden md:table-row',
        )}
      >
        <Table.Cell>
          <Text color="text80" fontSize="small" fontWeight="medium">
            {formatUnits(BigInt(order.priceAmount), Number(currency?.decimals))}{' '}
            {currency?.symbol}
          </Text>
        </Table.Cell>

        <Table.Cell>{order.quantityRemaining}</Table.Cell>

        <Table.Cell>
          <AddressPill address={order.createdBy} />
        </Table.Cell>

        <Table.Cell>
          <Text color="text80" fontSize="small" fontWeight="medium">
            {formatDistance(order.validUntil, new Date())}
          </Text>
        </Table.Cell>

        <Table.Cell>
          <MarketplacePill
            marketplace={order.marketplace}
            originName={order.originName}
          />
        </Table.Cell>

        {accountAddress && (
          <Table.Cell className="p-0 pr-2">
            <OrdersTableAction
              chainId={String(chainId)}
              collectionAddress={collectionContractAddress as Hex}
              tokenId={tokenId}
              order={order}
            />
          </Table.Cell>
        )}
      </Table.Row>
    </>
  );
};

export default OrdersTableRow;
