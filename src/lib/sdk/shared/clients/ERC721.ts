/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getERC721Contract } from '../../niftyswap-v2';
import { ERC721_ABI } from '../abi/token/ERC721';
import type { Hex } from 'viem';
import { encodeFunctionData } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

export class ERC721 {
  static setApprovalForAll = async (
    ERC721Address: string,
    operator: string,
    approved: boolean,
    signer: GetWalletClientData<any, any>,
  ): Promise<string> => {
    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: ERC721Address as Hex,
      abi: ERC721_ABI,
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
      abi: ERC721_ABI,
      functionName: 'setApprovalForAll',
      args: [operator as Hex, approved],
    });
  };

  static approve = async (
    ERC721Address: string,
    to: string,
    tokenId: string,
    signer: GetWalletClientData<any, any>,
  ): Promise<string> => {
    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: ERC721Address as Hex,
      abi: ERC721_ABI,
      functionName: 'approve',
      args: [to as Hex, BigInt(tokenId)],
    });

    return txHash;
  };

  static isApprovedForAll = async (
    ERC721Address: string,
    owner: string,
    operator: string,
    chainId: number,
  ) => {
    const contract = getERC721Contract({
      contractAddress: ERC721Address,
      chainId,
    });
    return contract.read.isApprovedForAll([owner as Hex, operator as Hex]);
  };

  static balanceOf = async (
    ERC721Address: string,
    owner: string,
    chainId: number,
  ): Promise<bigint> => {
    const contract = getERC721Contract({
      contractAddress: ERC721Address,
      chainId,
    });
    return contract.read.balanceOf([owner as Hex]);
  };
}
