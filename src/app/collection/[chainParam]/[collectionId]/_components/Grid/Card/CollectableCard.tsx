import { CollectibleActionButton } from '~/components/buttons/CollectibleActionButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';

import { Footer } from './Footer';
import type { Order } from '@0xsequence/marketplace-sdk';
import { useCollectible } from '@0xsequence/marketplace-sdk/react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { type Hex } from 'viem';

type CollectibleCardProps = {
  order?: Order;
  tokenId: string;
  collectionAddress: Hex;
  collectionChainId: string;
};

export const CollectibleCard = ({
  order,
  tokenId,
  collectionAddress,
  collectionChainId,
}: CollectibleCardProps) => {
  const { isConnected, chainId: accountChainId } = useAccount();
  const { data: collectible, isLoading: collectibleLoading } = useCollectible({
    chainId: collectionChainId,
    collectionAddress,
    collectibleId: tokenId,
  });

  // TODO: Handle this better later
  if (collectibleLoading) return null;

  return (
    <article
      className={cn(
        classNames.collectibleSelectionIndicator,
        `relative flex h-full w-full flex-col align-top m-[0.1rem]`,
        'rounded-md bg-foreground/5 outline outline-2 outline-transparent',
        'z-10 overflow-hidden !outline transition-all',
      )}
    >
      <Link
        href={Routes.collectible({
          chainParam: collectionChainId,
          collectionId: collectionAddress,
          tokenId,
        })}
        className="peer h-full p-2"
      >
        <Image
          src={collectible?.image}
          containerClassName="bg-foreground/10 aspect-square rounded-sm overflow-hidden"
          className="aspect-square rounded-[inherit] hover:scale-125 ease-in duration-150"
        />
        <Footer tokenMetadata={collectible!} order={order} />
      </Link>
      {isConnected && accountChainId && (
        <CollectibleActionButton
          className={cn(
            'bottom-0 m-0 w-full !rounded-none ease-in-out hover:visible peer-hover:visible',
            '[@media(hover:hover)]:invisible [@media(hover:hover)]:absolute',
          )}
          tokenId={tokenId}
          collectionChainId={collectionChainId}
          collectionAddress={collectionAddress}
          collectibleName={collectible?.name}
        />
      )}
    </article>
  );
};
