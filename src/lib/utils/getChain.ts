import { networks } from '@0xsequence/network';

export type ChainNameOrId = string | number;

export const getChain = (nameOrId: ChainNameOrId) => {
  for (const network of Object.values(networks)) {
    if (
      network.name === String(nameOrId).toLowerCase() ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      network.chainId === Number(nameOrId)
    ) {
      return network;
    }
  }
};

export const getChainName = (nameOrId: ChainNameOrId) =>
  getChain(nameOrId)?.name;
export const getChainId = (nameOrId: ChainNameOrId) =>
  getChain(nameOrId)?.chainId;
export const getPresentableChainName = (nameOrId: ChainNameOrId) =>
  getChain(nameOrId)?.title;

export const getCurrencyIconUrl = (chainId: number): string => {
  return `https://assets.sequence.info/images/networks/medium/${chainId}.webp`;
};
