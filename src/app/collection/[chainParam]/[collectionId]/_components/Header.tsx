'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

import { ContractTypeBadge } from '~/components/ContractTypeBadge';
import { classNames } from '~/config/classNames';

import {
  Grid,
  Text,
  Button,
  Box,
  Avatar,
  cn,
  GlobeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BugIcon,
} from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { useCollection } from '@0xsequence/marketplace-sdk/react/hooks';
import Markdown from 'markdown-to-jsx';
import Head from 'next/head';

interface CollectionHeaderProps {
  chainId: number;
  collectionAddress: string;
  marketplaceConfig: MarketplaceConfig;
}

const MIN_HEIGHT = 140;
const CollectionHeader = ({
  chainId,
  collectionAddress,
  marketplaceConfig,
}: CollectionHeaderProps) => {
  const collectionMetadata = useCollection({
    chainId: chainId.toString(),
    collectionAddress,
  });

  const { data: collection, isLoading, isError } = collectionMetadata;
  const name = collection?.name;
  const logo = collection?.logoURI;
  const symbol = collection?.symbol;
  const image = collection?.extensions?.ogImage;
  const description = collection?.extensions?.description;
  const socials = marketplaceConfig.socials;

  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [showBtnType, setShowBtnType] = useState<'show-more' | 'show-less'>(
    'show-more',
  );

  const [descriptionMaxH, setDescriptionMaxH] = useState<
    'max-h-11' | 'max-h-unset'
  >('max-h-11');

  const descripionContainerRef = useRef<HTMLDivElement | null>(null);
  const descripionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (descripionRef.current && descripionContainerRef.current) {
      setShowMoreBtn(
        descripionRef.current.offsetHeight >
          descripionContainerRef.current.offsetHeight,
      );
      setShowBtnType('show-more');
    }
  }, [, descripionRef, descripionContainerRef, description]);

  const onShowMoreClick = () => {
    if (showBtnType === 'show-more') {
      setDescriptionMaxH('max-h-unset');
      setShowBtnType('show-less');
    } else {
      setDescriptionMaxH('max-h-11');
      setShowBtnType('show-more');
    }
  };

  if (isError) {
    return (
      <Grid.Root
        className={cn(classNames.collectionHeader, `min-h-${MIN_HEIGHT} p-4`)}
      >
        <BugIcon />
        <Text className="text-destructive">
          Error loading Collection Metadata. please try again later.
        </Text>
      </Grid.Root>
    );
  }

  return (
    <>
      <Head>
        {image ? <link rel="preload" as="image" href={image} /> : null}
      </Head>

      <Grid.Root
        className={cn(classNames.collectionHeader, 'gap-x-4 gap-y-2')}
        template={`
          [row1-start] "collection-head" min-content [row1-end]
          [row2-start] "collection-description" 1fr [row2-end]
          [row3-start] "collection-badges" min-content [row3-end]
          / 1fr
        `}
      >
        <Grid.Root
          className="gap-x-2"
          template={`
        [row1-start] "collection-name collection-type-and-network  . collection-social" [row1-end]
        / minmax(auto, max-content) min-content min-content auto max-content 
        `}
        >
          <Grid.Child
            name="collection-name"
            className="flex items-center gap-2 overflow-x-hidden"
          >
            <Avatar.Base>
              <Avatar.Image src={logo} />
              <Avatar.Fallback>
                {symbol?.slice(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Base>

            <Text
              as="h1"
              className={cn(
                'ellipsis text-lg font-semibold text-foreground',
                isLoading ? 'loading' : '',
              )}
            >
              {name || '<unknown>'}
            </Text>
          </Grid.Child>

          <Grid.Child
            name="collection-type-and-network"
            className="flex items-center gap-2"
          >
            {chainId && <NetworkImage chainId={chainId} size="sm" />}

            <ContractTypeBadge
              chainId={chainId}
              collectionAddress={collectionAddress}
            />
          </Grid.Child>

          <Grid.Child name="." />

          <Grid.Child name="collection-social" className="flex gap-2">
            {socials?.website ? (
              <Button asChild variant="ghost">
                <a href={socials.website} target="_blank">
                  <GlobeIcon />
                </a>
              </Button>
            ) : null}
          </Grid.Child>
        </Grid.Root>

        <Grid.Child
          ref={descripionContainerRef}
          name="collection-description"
          className="flex max-w-6xl flex-col gap-1"
        >
          <Box className={cn(descriptionMaxH, 'overflow-hidden')}>
            {description && !isLoading ? (
              <Text
                as="div"
                ref={descripionRef}
                loading={isLoading}
                className="flex flex-col gap-1 whitespace-pre-wrap text-sm font-medium leading-5 text-foreground/60"
                aria-label="Collection Description"
              >
                <Markdown
                  options={{
                    wrapper: Fragment,
                    overrides: {
                      a: {
                        component: ({ children, ...props }) => (
                          <a target="_blank" {...props}>
                            {children}
                          </a>
                        ),
                      },
                    },
                  }}
                >
                  {description}
                </Markdown>
              </Text>
            ) : null}
          </Box>

          {showMoreBtn ? (
            <Button
              className="px-0"
              size="xs"
              variant="primaryLink"
              onClick={onShowMoreClick}
            >
              {showBtnType === 'show-more' ? (
                <>
                  Show More
                  <ChevronDownIcon />
                </>
              ) : null}

              {showBtnType === 'show-less' ? (
                <>
                  Show Less
                  <ChevronUpIcon />
                </>
              ) : null}
            </Button>
          ) : null}
        </Grid.Child>
      </Grid.Root>
    </>
  );
};

export default CollectionHeader;
