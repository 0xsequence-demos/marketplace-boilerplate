'use client';

import { ContractTypeBadge } from '~/components/ContractTypeBadge';

import { Avatar, Flex, Text, cn } from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import NextLink from 'next/link';

type CollectibleInfoProps = {
  collectionName: string | undefined;
  contractType: string | undefined;
  collectionImageUrl: string;
  tokenName: string | undefined;
  loading: boolean;
  collectionAddress: string;
  chainId: number;
  tokenId: string;
  tokenDecimals: number;
};

export const CollectibleInfo = ({
  chainId,
  tokenId,
  collectionAddress,
  collectionName,
  collectionImageUrl,
  tokenName,
  tokenDecimals,
  loading,
}: CollectibleInfoProps) => {
  return (
    <Flex className="flex-col gap-2">
      <Flex className="items-center gap-2">
        <Avatar.Base>
          <Avatar.Image src={collectionImageUrl} />
          <Avatar.Fallback>{collectionName}</Avatar.Fallback>
        </Avatar.Base>

        <Flex className="flex-col">
          <Flex className="items-center gap-2">
            <NextLink
              className={cn(
                'text-md font-medium text-foreground/90 underline-offset-4 hover:underline focus:underline',
                loading ? 'loading' : '',
              )}
              href={''}
            >
              {collectionName ?? '<unknown>'}
            </NextLink>
            <NetworkImage size="sm" chainId={chainId} className='bg-red-300' />
          </Flex>
        </Flex>
        <ContractTypeBadge
          chainId={chainId}
          collectionAddress={collectionAddress}
        />
      </Flex>

      <Flex className="mt-4 flex-col gap-1">
        <Text
          as="h6"
          className="text-lg font-semibold text-foreground/50 animate-in fade-in"
          loading={loading}
          title={tokenId}
        >
          #{truncateMiddle(tokenId, 20) || '--'}
        </Text>

        <Text
          as="h1"
          className="text-xl font-bold text-foreground/90 animate-in fade-in"
          loading={loading}
        >
          {tokenName}
        </Text>
      </Flex>
    </Flex>
  );
};
