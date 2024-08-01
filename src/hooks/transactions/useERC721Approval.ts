import { ERC721 } from '~/lib/sdk/shared/clients/ERC721';
import { BigIntReplacer } from '~/lib/utils/bigint';

import { useQuery } from '@tanstack/react-query';

interface Props {
  operatorAddress: string;
  erc721Address: string;
  ownerAddress: string;
  chainId: number;
}

export const useERC721Approval = (
  arg: Partial<Props & { disabled?: boolean }>,
) =>
  useQuery({
    queryKey: ['erc1155-approval', JSON.stringify(arg, BigIntReplacer)],
    queryFn: () =>
      getERC721Approval({
        operatorAddress: arg.operatorAddress!,
        erc721Address: arg.erc721Address!,
        ownerAddress: arg.ownerAddress!,
        chainId: arg.chainId!,
      }),
    retry: false,
    refetchInterval: 15000,
    enabled:
      !!arg.operatorAddress &&
      !!arg.erc721Address &&
      !!arg.ownerAddress &&
      !!arg.chainId &&
      !arg.disabled,
  });

const getERC721Approval = async (arg: Props) => {
  const isApprovedForAll = await ERC721.isApprovedForAll(
    arg.erc721Address,
    arg.ownerAddress,
    arg.operatorAddress,
    arg.chainId,
  );

  return {
    isApprovedForAll,
  };
};
