/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TokenMetadata } from '@0xsequence/metadata';

type CollectibleProperty = {
  name: string;
  value: string;
};

type CollectibleAttribute = {
  name: string;
  value: string;
};

export const formatProperties = (
  properties: TokenMetadata['properties'] | undefined,
): CollectibleProperty[] => {
  let updatedProperties: CollectibleProperty[] = [];

  if (!properties) {
    return updatedProperties;
  }

  updatedProperties = Object.entries(properties)
    .map((el: [string, string | { name: string; value: string }], i) => {
      if (el[1] && typeof el[1] === 'object') {
        if (el[1].name && el[1].value) {
          if (typeof el[1].value === 'object') {
            return {
              name: el[1].name,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore

              value: el[1].value[0] ? el[1].value[0].name : '--',
            };
          }
          return {
            name: el[1].name,
            value: el[1].value,
          };
        }
      } else {
        return {
          name: el[0],
          value: el[1],
        };
      }
      return null;
    })
    .filter((el) => !!el) as CollectibleProperty[];
  return updatedProperties;
};

export const formatAttributes = (
  attributes: TokenMetadata['attributes'] | undefined,
): CollectibleAttribute[] => {
  let updatedAttributes: CollectibleAttribute[] = [];

  if (!attributes) {
    return updatedAttributes;
  }

  updatedAttributes = attributes
    .map((el) => {
      if (el.trait_type && (el.value || el.value === 0)) {
        return {
          name: el.trait_type,
          value: el.value,
        };
      } else if (el.value) {
        return {
          name: el.value,
          value: el.value,
        };
      }

      return;
    })
    .filter((el) => !!el) as CollectibleAttribute[];

  return updatedAttributes;
};
