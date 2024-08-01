import { getPublicClient } from '~/config/networks/wagmi/rpcClients';
import { EIP2981_ABI } from '~/lib/sdk/shared/abi/standard/EIP2981';

import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { getContract } from 'viem';

interface Props {
  chainId: number;
  contractAddress: string;
  tokenId: string;
}

export const useCollectionRoyalty = (
  arg: Partial<Props> & { disabled?: boolean },
) =>
  useQuery({
    queryKey: ['useCollectionRoyalties', arg],
    queryFn: () =>
      getRoyalties({
        chainId: arg.chainId!,
        contractAddress: arg.contractAddress!,
        tokenId: arg.tokenId!,
      }),
    retry: false,
    enabled:
      !!arg.chainId && !!arg.contractAddress && !!arg.tokenId && !arg.disabled,
  });

export const getRoyalties = async ({
  chainId,
  contractAddress,
  tokenId,
}: Props) => {
  const publicClient = getPublicClient(chainId);

  const contract = getContract({
    address: contractAddress as Hex,
    abi: EIP2981_ABI,
    client: publicClient,
  });

  try {
    const [_, royaltyPercentage] = await contract.read.royaltyInfo([
      BigInt(tokenId),
      100n,
    ]);

    return royaltyPercentage;
  } catch {
    return 0n;
  }
};
