import { cn, Table } from '~/components/ui';

import MarketplacePill from './MarketplacePill';
import { compareAddress, type Order } from '@0xsequence/marketplace-sdk';
import { formatDistance } from 'date-fns';
import { formatUnits, type Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useCurrencies } from '@0xsequence/marketplace-sdk/react';
import OrdersTableAction from './Action';
import AddressPill from './AddressPill';

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
              <p className="text-text50 text-xsmall font-bold">Quantity</p>

              <p className="text-text100 text-normal font-bold">
                {order.quantityRemaining}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text50 text-xsmall font-bold">
                Price
              </p>

              <p className="text-text100 text-normal font-bold">
                {formatUnits(
                  BigInt(order.priceAmount),
                  Number(currency?.decimals),
                )}{' '}
                {currency?.symbol}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text50 text-xsmall font-bold">Time left</p>

              <p className="text-text100 text-normal font-bold">
                {formatDistance(order.validUntil, new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-1 flex-grow">
              <p className="text-text50 text-xsmall font-bold">
                By
              </p>

              <AddressPill address={order.createdBy} />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text50 text-xsmall font-bold">
                On
              </p>

              <MarketplacePill
                marketplace={order.marketplace}
                originName={order.originName}
              />
            </div>

            {accountAddress && (
              <Table.Cell className="p-0">
                <OrdersTableAction
                  chainId={String(chainId)}
                  collectionAddress={collectionContractAddress as Hex}
                  tokenId={tokenId!}
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
          <p className="text-text80 text-small font-medium">
            {formatUnits(BigInt(order.priceAmount), Number(currency?.decimals))}{' '}
            {currency?.symbol}
          </p>
        </Table.Cell>

        <Table.Cell>{order.quantityRemaining}</Table.Cell>

        <Table.Cell>
          <AddressPill address={order.createdBy} />
        </Table.Cell>

        <Table.Cell>
          <p className="text-text80 text-small font-medium">
            {formatDistance(order.validUntil, new Date())}
          </p>
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
              tokenId={tokenId!}
              order={order}
            />
          </Table.Cell>
        )}
      </Table.Row>
    </>
  );
};

export default OrdersTableRow;
