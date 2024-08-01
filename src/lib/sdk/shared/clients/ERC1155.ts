/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getERC1155Contract } from '../../niftyswap-v2';
import { ERC1155_ABI } from '../abi/token/ERC1155';
import type { Hex } from 'viem';
import { encodeFunctionData } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

export class ERC1155 {
  static setApprovalForAll = async (
    erc1155Address: string,
    operator: string,
    approved: boolean,
    signer: GetWalletClientData<any, any>,
  ): Promise<string> => {
    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: erc1155Address as Hex,
      abi: ERC1155_ABI,
      functionName: 'setApprovalForAll',
      args: [operator as Hex, approved],
    });

    return txHash;
  };

  static setApprovalForAll_data = (
    operator: string,
    approved: boolean,
  ): string => {
    return encodeFunctionData({
      abi: ERC1155_ABI,
      functionName: 'setApprovalForAll',
      args: [operator as Hex, approved],
    });
  };

  static isApprovedForAll = async (
    erc1155Address: string,
    owner: string,
    operator: string,
    chainId: number,
  ) => {
    const contract = getERC1155Contract({
      contractAddress: erc1155Address,
      chainId,
    });
    return contract.read.isApprovedForAll([owner as Hex, operator as Hex]);
  };

  static balanceOf = async (
    erc1155Address: string,
    owner: string,
    tokenId: string,
    chainId: number,
  ): Promise<bigint> => {
    const contract = getERC1155Contract({
      contractAddress: erc1155Address,
      chainId,
    });
    return contract.read.balanceOf([owner as Hex, BigInt(tokenId)]);
  };
}
