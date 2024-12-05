'use client';

import ENSName from '~/components/ENSName';
import { InfoGrid } from '~/components/InfoGrid';
import { getChain } from '~/lib/utils/getChain';

import { Box, Button, LinkIcon, cn } from '$ui';

export const CollectibleAddresses = ({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: number;
}) => {
  if (!chainId) {
    return null;
  }

  const addresses = [
    {
      label: 'Collection',
      address: contractAddress,
      chainId,
    },
  ];
  return (
    <Box className="@container/addressesBox">
      <InfoGrid
        className={cn(
          'grid-cols-1 @sm/addressesBox:grid-cols-2 @xl/addressesBox:grid-cols-3',
        )}
        values={addresses.map((a) => {
          const explorerUrl = getChain(a.chainId)?.blockExplorer?.rootUrl;
          return {
            label: a.label,
            children: (
              <Button asChild variant="ghost" size="sm" className="uppercase">
                <a href={`${explorerUrl}address/${a.address}`} target="_blank">
                  <LinkIcon />
                  <ENSName address={a.address} truncateAt={4} />
                </a>
              </Button>
            ),
          };
        })}
      />
    </Box>
  );
};

export default CollectibleAddresses;
