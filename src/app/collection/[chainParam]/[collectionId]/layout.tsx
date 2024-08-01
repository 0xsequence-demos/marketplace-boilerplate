import { getMarketConfig } from '~/config/marketplace';
import { getChainId } from '~/config/networks';
import type { Routes } from '~/lib/routes';
import { compareAddress } from '~/lib/utils/helpers';

import CollectionBanner from './_components/Banner';
import CollectionControls from './_components/Controls';
import CollectionHeader from './_components/Header';
import { CollectionViewPageLayout } from './_components/Layout';
import { CollectionSidebar } from './_components/Sidebar';

const Layout = async ({
  params: { chainParam, collectionId },
  children,
}: {
  children: React.ReactNode;
  params: typeof Routes.collection.params;
}) => {
  const chainId = getChainId(chainParam)!;
  const marketConfig = await getMarketConfig();

  const collectionConfig = marketConfig.collections?.find(
    (c) =>
      compareAddress(c.collectionAddress, collectionId) && chainId == c.chainId,
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
          marketConfig={marketConfig}
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
