import { getChain } from '../utils/getChain';
import { makeRoute } from './utils/makeRoute';
import { isAddress as viemIsAddress } from 'viem';
import { z } from 'zod';

const swapMode = ['buy', 'sell'] as const;
const swapModeEnum = z.enum(swapMode);

const isAddress = z.string().refine(viemIsAddress);

const chainParam = z.coerce.number().or(z.string());

const collectionId = isAddress;

const collectionParams = z.object({
  chainParam,
  collectionId,
  mode: swapModeEnum.optional(),
});

const collectibleParams = z.object({
  chainParam,
  collectionId,
  tokenId: z.string(),
});

const chainToName = (chainParam: number | string) => {
  const chainName = getChain(chainParam)?.name;
  return chainName ?? chainParam;
};

export const Routes = {
  // Landing
  landing: makeRoute(() => '/'),

  //collection
  collection: makeRoute(
    ({ chainParam, collectionId, mode }) =>
      `/collection/${chainToName(chainParam)}/${collectionId}/${mode}`,
    collectionParams,
  ),

  //collectible
  collectible: makeRoute(
    ({ chainParam, collectionId, tokenId }) =>
      `/collectible/${chainToName(chainParam)}/${collectionId}/${tokenId}`,
    collectibleParams,
  ),

  // inventory
  inventory: makeRoute(() => {
    return `/inventory`;
  }),

  terms: makeRoute(() => '/terms'),
  privacy: makeRoute(() => '/privacy'),
};
