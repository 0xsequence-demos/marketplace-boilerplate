/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublicClient } from '~/config/networks/wagmi/rpcClients';

import { Orderbook_ABI } from '../contracts/abi/orderbook';
import { isEmptyOrder } from '../contracts/utils';
import type { Hex } from 'viem';
import { encodeFunctionData, getContract } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

interface IOrderbook {
  chainId: number;
  contractAddress: Hex;
}

interface ContractInstanceParams {
  contractAddress: Hex;
  chainId: number;
  signer?: GetWalletClientData<any, any>;
}

interface CreateRequestArg {
  isListing: boolean;
  isERC1155: boolean;
  tokenContract: Hex;
  tokenId: bigint;
  quantity: bigint;
  expiry: bigint;
  currency: Hex;
  pricePerToken: bigint;
}

export interface OrderRequest {
  creator: Hex;
  isListing: boolean;
  isERC1155: boolean;
  tokenContract: Hex;
  tokenId: bigint;
  quantity: bigint;
  expiry: bigint;
  currency: Hex;
  pricePerToken: bigint;
}

export const getOrderbookInstance = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress,
    abi: Orderbook_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};

export class Orderbook {
  chainId: number;
  contractAddress: Hex;

  orderbook: ReturnType<typeof getOrderbookInstance>;

  constructor({ chainId, contractAddress }: IOrderbook) {
    this.chainId = chainId;
    this.contractAddress = contractAddress;

    this.orderbook = getOrderbookInstance({
      contractAddress: this.contractAddress,
      chainId: this.chainId,
    });
  }

  /* getters */
  getRequest = async (requestId: bigint): Promise<OrderRequest | null> => {
    const order = await this.orderbook.read.getRequest([requestId]);

    if (isEmptyOrder(order)) {
      return null;
    }
    return order;
  };

  getRequestBatch = async (
    orderIds: readonly string[],
  ): Promise<(OrderRequest | null)[]> => {
    const orders = await this.orderbook.read.getRequestBatch([orderIds as any]);

    return orders.map((order) => (isEmptyOrder(order) ? null : order));
  };

  getRoyaltyInfo = async (
    tokenContractAddress: string,
    tokenId: string,
    cost: bigint,
  ): Promise<readonly [string, bigint]> => {
    const contract = getOrderbookInstance({
      contractAddress: this.contractAddress,
      chainId: this.chainId,
    });
    return contract.read.getRoyaltyInfo([
      tokenContractAddress as Hex,
      BigInt(tokenId),
      cost,
    ]);
  };

  isRequestValid = async (
    requestId: bigint,
    quantity: bigint,
  ): Promise<{
    isValid: boolean;
    order: OrderRequest | null;
  }> => {
    const res = await this.orderbook.read.isRequestValid([requestId, quantity]);

    const isValid = res[0];
    const order = isEmptyOrder(res[1]) ? null : res[1];

    return {
      isValid,
      order,
    };
  };

  isRequestValidBatch = async (
    requestIds: readonly bigint[],
    quantities: readonly bigint[],
  ): Promise<{
    isValid: readonly boolean[];
    orders: readonly (OrderRequest | null)[];
  }> => {
    const res = await this.orderbook.read.isRequestValidBatch([
      requestIds,
      quantities,
    ]);

    const isValid = res[0];
    const orders = res[1].map((order: any) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
      isEmptyOrder(order) ? null : order,
    );

    return {
      isValid,
      orders,
    };
  };

  /* setters */

  // need to check approvals before execution
  /*
    - is ask order (isListing true)
      - check _hasApprovedTokens
      - if ERC1155
        -  isApprovedForAll(wallet, orderbook.address)
      - if ERC721
        - check tokenOwner + operator
    - is bid order (isListing false)
      - check _hasApprovedCurrency
        - ERC20 allowance(owner, orderbook.address)
  */
  createRequest = async (
    args: CreateRequestArg,
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    const {
      isListing,
      isERC1155,
      tokenContract,
      tokenId,
      quantity,
      expiry,
      currency,
      pricePerToken,
    } = args;

    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'createRequest',
      args: [
        {
          isListing,
          isERC1155,
          tokenContract,
          tokenId,
          quantity,
          expiry,
          currency,
          pricePerToken,
        },
      ],
    });
  };

  createRequestBatch = async (
    orderRequests: readonly CreateRequestArg[],
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'createRequestBatch',
      args: [
        orderRequests.map((orderRequest) => {
          const {
            isListing,
            isERC1155,
            tokenContract,
            tokenId,
            quantity,
            expiry,
            currency,
            pricePerToken,
          } = orderRequest;

          return {
            isListing,
            isERC1155,
            tokenContract,
            tokenId,
            quantity,
            expiry,
            currency,
            pricePerToken,
          };
        }),
      ],
    });
  };

  acceptRequest = async (
    arg: {
      orderId: bigint;
      quantity: bigint;
      receiver: Hex;
      additionalFees: readonly bigint[];
      additionalFeeReceivers: readonly Hex[];
    },
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'acceptRequest',
      args: [
        arg.orderId,
        arg.quantity,
        arg.receiver,
        arg.additionalFees,
        arg.additionalFeeReceivers,
      ],
    });
  };

  acceptRequest_data = (arg: {
    orderId: bigint;
    quantity: bigint;
    receiver: Hex;
    additionalFees: readonly bigint[];
    additionalFeeReceivers: readonly Hex[];
  }): Hex => {
    return encodeFunctionData({
      abi: Orderbook_ABI,
      functionName: 'acceptRequest',
      args: [
        arg.orderId,
        arg.quantity,
        arg.receiver,
        arg.additionalFees,
        arg.additionalFeeReceivers,
      ],
    });
  };

  acceptRequestBatch = async (
    arg: {
      orderIds: readonly bigint[];
      quantities: readonly bigint[];
      receivers: readonly Hex[];
      additionalFees: readonly bigint[];
      additionalFeeReceivers: readonly Hex[];
    },
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'acceptRequestBatch',
      args: [
        arg.orderIds,
        arg.quantities,
        arg.receivers,
        arg.additionalFees,
        arg.additionalFeeReceivers,
      ],
    });
  };

  acceptRequestBatch_data = (arg: {
    orderIds: readonly bigint[];
    quantities: readonly bigint[];
    receivers: readonly Hex[];
    additionalFees: readonly bigint[];
    additionalFeeReceivers: readonly Hex[];
  }): Hex => {
    return encodeFunctionData({
      abi: Orderbook_ABI,
      functionName: 'acceptRequestBatch',
      args: [
        arg.orderIds,
        arg.quantities,
        arg.receivers,
        arg.additionalFees,
        arg.additionalFeeReceivers,
      ],
    });
  };

  cancelRequest = async (
    requestId: bigint,
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'cancelRequest',
      args: [requestId],
    });
  };

  cancelRequestBatch = async (
    requestIds: readonly bigint[],
    signer: GetWalletClientData<any, any>,
  ): Promise<Hex> => {
    return await signer.writeContract({
      chain: signer.chain,
      address: this.orderbook.address,
      abi: Orderbook_ABI,
      functionName: 'cancelRequestBatch',
      args: [requestIds],
    });
  };
}
