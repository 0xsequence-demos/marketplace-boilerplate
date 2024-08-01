import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { Orderbook } from '~/lib/sdk/orderbook/clients/Orderbook';

import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

export interface UseOrderbookIsValidBatchArgs {
  requestIds: bigint[];
  quantities: bigint[];
  chainId: number;
}

export const useOrderbookIsValidBatch = (args: UseOrderbookIsValidBatchArgs) =>
  useQuery({
    queryKey: [
      'useOrderbookIsValid',
      {
        ...args,
        requestIds: args.requestIds.map((r) => r.toString()),
        quantities: args.quantities.map((q) => q.toString()),
      },
    ],
    queryFn: () => {
      const orderbook = new Orderbook({
        chainId: args.chainId,
        contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
      });

      return orderbook.isRequestValidBatch(args.requestIds, args.quantities);
    },
    retry: false,
    enabled:
      !!args.chainId && !!args.requestIds.length && !!args.quantities.length,
  });
