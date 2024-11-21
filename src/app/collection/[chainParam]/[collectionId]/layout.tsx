import type { Routes } from '~/lib/routes';
import { getChainId } from '~/lib/utils/getChain';

import CollectionBanner from './_components/Banner';
import CollectionControls from './_components/Controls';
import CollectionHeader from './_components/Header';
import { CollectionViewPageLayout } from './_components/Layout';
import { CollectionSidebar } from './_components/Sidebar';
import { ssrClient } from '~/config/marketplace-sdk/ssr';

const Layout = async ({
  params: { chainParam, collectionId },
  children,
}: {
  children: React.ReactNode;
  params: typeof Routes.collection.params;
}) => {
  const chainId = getChainId(chainParam)!;
  const { getMarketplaceConfig } = ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();

  const collectionConfig = marketplaceConfig.collections?.find(
    (c) =>
      c.collectionAddress.toLowerCase() == collectionId.toLowerCase() &&
      chainId == c.chainId,
  );

  return (
    <CollectionViewPageLayout
      collectionConfig={collectionConfig}
      banner={<CollectionBanner bannerUrl={collectionConfig?.bannerUrl} />}
      sidebar={
        <CollectionSidebar chainId={chainId} collectionAddress={collectionId} />
      }
      header={
        <CollectionHeader
          chainId={chainId}
          collectionAddress={collectionId}
          marketplaceConfig={marketplaceConfig}
        />
      }
      controls={
        <CollectionControls chainId={chainId} collectionId={collectionId} />
      }
      content={children}
    />
  );
};

export default Layout;

export const runtime = 'edge';
