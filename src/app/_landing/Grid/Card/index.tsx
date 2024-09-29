'use client';

import { Suspense } from 'react';

import { NetworkIcon } from '~/components/NetworkLabel';
import { placeholderImgUrl } from '~/components/ui/Image/image';
import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';
import { isVideo } from '~/lib/utils/helpers';

import { Avatar, Badge, Flex, ScrollArea, Text, cn } from '$ui';
import { CollectionCardSkeleton } from './Skeleton';
import { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import {
  collectionOptions,
  useConfig,
} from '@0xsequence/marketplace-sdk/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import NextLink from 'next/link';

type CollectionCard = MarketplaceConfig['collections'][number];

export const CollectionCard = (params: CollectionCard) => {
  return (
    <Suspense fallback={<CollectionCardSkeleton />}>
      <Card {...params} />
    </Suspense>
  );
};

const Card = ({ chainId, collectionAddress, bannerUrl }: CollectionCard) => {
  const { data } = useSuspenseQuery(
    collectionOptions(
      {
        collectionAddress,
        chainId: chainId.toString(),
      },
      useConfig(),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const image = data?.extensions.ogImage || bannerUrl || placeholderImgUrl;
  const description = data?.extensions.description;
  const name = data?.name;
  const symbol = data?.symbol;
  const logoURI = data?.logoURI;
  const contractType = data?.type;

  return (
    <Flex
      asChild
      className={cn(
        'relative flex flex-col rounded-md bg-foreground/10',
        'cursor-pointer transition-colors',
        'hover:threed-shadow-base hover:threed-shadow-primary focus:outline-none focus:threed-shadow-base focus:threed-shadow-primary active:threed-shadow-sm',
        'duration-300 animate-in fade-in',
      )}
    >
      <NextLink
        href={Routes.collection({
          chainParam: chainId,
          collectionId: collectionAddress,
          mode: 'buy',
        })}
      >
        {isVideo(image) ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={image}
            className="min-h-[60%] w-full flex-1 rounded-b-none object-cover"
          />
        ) : (
          <img
            src={image}
            alt={'banner'}
            className="min-h-[60%] flex-1 rounded-b-none object-cover"
          />
        )}

        <Flex className="h-full flex-col gap-2 p-3">
          <Flex className="items-center gap-2">
            <Avatar.Base size="sm">
              <Avatar.Image src={logoURI} alt={symbol} />

              <Avatar.Fallback>{(symbol || name)?.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Base>

            <Text
              className="text-md font-semibold text-foreground max-lines-[1]"
              title={name}
            >
              {name}
            </Text>

            <NetworkIcon size="xs" chainId={chainId} />
          </Flex>

          <Text
            title={description}
            className="overflow-hidden text-sm font-medium text-foreground/50 max-lines-[3]"
          >
            {description}
          </Text>

          <ScrollArea.Base orientation="horizontal" className="mt-auto">
            <Flex
              className={cn(classNames.collectionHeaderBadges, 'mt-auto gap-2')}
            >
              {contractType && <Badge variant="muted">{contractType}</Badge>}
            </Flex>
          </ScrollArea.Base>
        </Flex>
      </NextLink>
    </Flex>
  );
};
