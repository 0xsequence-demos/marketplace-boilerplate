'use client';

import { Accordion } from '~/components/ui';

import { CollectibleAccordionItem } from '../_components/AccordionItem';
import CollectibleAddresses from '../_components/Addresses';
import { CollectibleDescription } from '../_components/Description';
import { useCollectableData } from '../_hooks/useCollectableData';
import { CollectibleImage } from './_components/Image';
import ListingsTable from './_components/ListingsTable';
import OffersTable from './_components/OffersTable';
import { CollectibleProperties } from './_components/Properties';

export default function Page() {
  const { collectibleMetadata, collectionId, chainId } = useCollectableData();
  return (
    <>
      <CollectibleImage
        id={collectibleMetadata.data?.tokenId}
        src={collectibleMetadata.data?.image}
        loading={collectibleMetadata.isLoading}
        animationSrc={collectibleMetadata.data?.animation_url}
      />

      <Accordion.Root
        type="multiple"
        defaultValue={[
          'description',
          'listings',
          'offers',
          'properties',
          'details',
          'market-data',
          'transaction-history',
          'actions',
        ]}
      >
        <CollectibleAccordionItem id="description" label="Description">
          {collectibleMetadata.data?.description ? (
            <CollectibleDescription
              description={collectibleMetadata.data?.description}
              loading={collectibleMetadata.isLoading}
            />
          ) : null}
          <CollectibleProperties
            properties={collectibleMetadata.data?.properties}
            attributes={collectibleMetadata.data?.attributes}
          />
        </CollectibleAccordionItem>

        <CollectibleAccordionItem id="listings" label="Listings">
          <ListingsTable />
        </CollectibleAccordionItem>

        <CollectibleAccordionItem id="offers" label="Offers">
          <OffersTable />
        </CollectibleAccordionItem>

        <CollectibleAccordionItem id="details" label="Details">
          <CollectibleAddresses
            contractAddress={collectionId}
            chainId={chainId}
          />
        </CollectibleAccordionItem>
      </Accordion.Root>
    </>
  );
}

export const runtime = 'edge';
