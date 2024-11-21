import { memo } from 'react';

import { classNames } from '~/config/classNames';

import { Avatar, Flex, Image, Text, cn } from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import NextLink from 'next/link';

/* ************* CURRENCY AVATAR ***************** */
type CurrencyAvatarProps = {
  amount: number | string;
  currency: { src: string | undefined; symbol: string | undefined };
  title?: string | number;

  className?: string;
  justify?: 'justify-center' | 'justify-start' | 'justify-end';

  size?: 'default' | 'sm' | 'lg';

  loading?: boolean;
};

/* ************* COLLECTION AVATAR ***************** */
type CollectionAvatarProps = {
  name: string;
  src: string;
  chainId?: number;

  justify?: 'justify-center' | 'justify-start' | 'justify-end';
};

export const CollectionAvatar = ({
  name,
  src,
  chainId,
  justify = 'justify-start',
}: CollectionAvatarProps) => {
  return (
    <Flex
      className={cn(classNames.collectionAvatar, 'items-center gap-2', justify)}
    >
      <Avatar.Base>
        <Avatar.Image src={src} />
      </Avatar.Base>

      <Text className="text-foreground/90 font-medium">{name}</Text>
      {chainId ? <NetworkImage size="sm" chainId={chainId} /> : null}
    </Flex>
  );
};

/* ************* POOL AVATAR ***************** */
type PoolAvatarProps = {
  name: string;
  src: string;
  tokenId?: number | string;
  chainId?: number;

  link?: string | object;

  nameClassName?: string;
  imageClassName?: string;

  loading?: boolean;
  justify?: 'justify-center' | 'justify-start' | 'justify-end';
};

export const PoolAvatar = memo(
  ({
    name,
    src,
    tokenId,
    chainId,
    nameClassName,
    imageClassName,
    loading = false,
    justify = 'justify-center',
    link,
  }: PoolAvatarProps) => {
    const hasName = name && !loading;

    const Content = () => (
      <>
        <Image
          src={src}
          className={cn('h-[40px] w-[30px] min-w-[30px]', imageClassName)}
          loading={loading}
        />

        <Flex className="h-full flex-col justify-center">
          <Flex className="items-center gap-2">
            <Text
              className={cn(
                !hasName
                  ? 'text-foreground/30 font-light italic'
                  : 'text-foreground/90 font-medium',
                'max-lines-[1]',
                link
                  ? 'hover:text-foreground/80 hover:underline hover:underline-offset-2'
                  : '',
                nameClassName,
              )}
              loading={loading}
              title={name}
            >
              {name || '<unknown>'}
            </Text>

            {chainId ? (
              <Flex className="min-w-[20px]">
                <NetworkImage size='sm' chainId={chainId} />
              </Flex>
            ) : null}
          </Flex>

          {tokenId ? (
            <Text
              className={cn('text-foreground/40 text-left')}
              as="span"
              loading={loading}
              title={`${tokenId}`}
            >
              #{truncateMiddle(`${tokenId}`, 10)}
            </Text>
          ) : null}
        </Flex>
      </>
    );

    return (
      <Flex
        // {...linkProps}
        asChild={!!link}
        className={cn(
          classNames.poolAvatar,
          'w-fit justify-center gap-3',
          justify,
        )}
      >
        {!!link ? (
          <NextLink href={link as string}>
            <Content />
          </NextLink>
        ) : (
          <Content />
        )}
      </Flex>
    );
  },
);

PoolAvatar.displayName = 'PoolAvatar';
