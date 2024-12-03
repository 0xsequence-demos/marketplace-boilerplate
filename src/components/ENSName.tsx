'use client';

import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';

type ENSNameProps = {
  address?: string;
  truncateAt?: number;
};

const ENSName = ({ address, truncateAt }: ENSNameProps) => {
  const { data } = useEnsName({ address: address as Address });

  if (!address) {
    return null;
  }

  if (!data) {
    if (truncateAt) {
      return truncateMiddle(address, truncateAt);
    } else {
      return address;
    }
  }

  return data;
};

export default ENSName;
