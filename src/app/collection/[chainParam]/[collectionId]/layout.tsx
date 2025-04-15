import { ssrClient } from '~/config/marketplace-sdk/ssr';
import type { Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import CollectionBanner from './_components/Banner';
import CollectionControls from './_components/Controls';
import CollectionHeader from './_components/Header';
import { CollectionViewPageLayout } from './_components/Layout';
import { CollectionSidebar } from './_components/Sidebar';
import type { ChainId } from '@0xsequence/network';

const Layout = async (props: {
  children: React.ReactNode;
  params: Promise<typeof Routes.collection.params>;
}) => {
  const params = await props.params;

  const { chainParam, collectionId } = params;

  const { children } = props;

  const chainId = getChainId(chainParam);
  const client = await ssrClient();
  const marketplaceConfig = await client.getMarketplaceConfig();

  const collectionConfig = marketplaceConfig.collections?.find(
    (c) =>
      c.address.toLowerCase() === collectionId.toLowerCase() &&
      chainId === (c.chainId as ChainId),
  );

  return (
    <CollectionViewPageLayout
      collectionConfig={collectionConfig}
      banner={<CollectionBanner bannerUrl={collectionConfig?.bannerUrl} />}
      sidebar={
        <CollectionSidebar
          chainId={chainId!}
          collectionAddress={collectionId}
        />
      }
      header={
        <CollectionHeader
          chainId={chainId!}
          collectionAddress={collectionId}
          marketplaceConfig={marketplaceConfig}
        />
      }
      controls={
        <CollectionControls chainId={chainId!} collectionId={collectionId} />
      }
      content={children}
    />
  );
};

export default Layout;

export const runtime = 'edge';
