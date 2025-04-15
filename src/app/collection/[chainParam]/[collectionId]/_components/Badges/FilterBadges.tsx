'use client';

import { useCallback } from 'react';

import {
  Badge,
  CloseIcon,
  Flex,
  Grid,
  ScrollArea,
  Text,
  cn,
} from '~/components/ui';
import { classNames } from '~/config/classNames';

import { filters$ } from '../FilterStore';
import { IntBadge } from './IntBadge';
import { StringAndArrayBadge } from './StringAndArrayBadge';
import { OrderSide } from '@0xsequence/marketplace-sdk';
import {
  useCountOfCollectables,
  useFilters,
} from '@0xsequence/marketplace-sdk/react';
import { PropertyType } from '@0xsequence/metadata';
import { observer } from '@legendapp/state/react';
import type { Address } from 'viem';

type FilterBadgesProps = {
  chainId: number;
  collectionAddress: Address;
};

export const FilterBadges = observer(
  ({ chainId, collectionAddress }: FilterBadgesProps) => {
    const {
      filterOptions: filters,
      searchText,
      showListedOnly,
    } = filters$.get();

    const { data } = useFilters({
      chainId,
      collectionAddress,
    });

    const { data: filteredCollectiblesCount } = useCountOfCollectables({
      chainId,
      collectionAddress,
      filter: {
        searchText,
        includeEmpty: !showListedOnly,
        properties: filters,
      },
      side: OrderSide.listing,
    });

    const getFilterType = useCallback(
      (name: string) => data?.find((f) => f.name === name)?.type,
      [data],
    );

    if (!filters.length && !searchText) return null;

    return (
      <Grid.Child
        name="collection-filter-badges"
        className="sticky z-40 mb-6 bg-background py-4"
        style={{
          top: 'calc(var(--headerHeight) + var(--collectionControlsHeight) - 8px)',
        }}
      >
        <ScrollArea.Base orientation="horizontal" className="max-w-full">
          <Flex className={cn(classNames.collectionFilterBadges, 'w-0 gap-2')}>
            {searchText && (
              <Badge size="lg" variant="outline">
                Search: &quot
                <Text className="text-foreground">{searchText}</Text>
                &quot;
                <CloseIcon
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    filters$.clearSearchText();
                  }}
                />
              </Badge>
            )}

            {filters.map((filter) => {
              switch (getFilterType(filter.name)) {
                case PropertyType.STRING:
                case PropertyType.ARRAY:
                  if (filter?.values?.length) {
                    return (
                      <StringAndArrayBadge key={filter.name} filter={filter} />
                    );
                  }
                  return null;
                case PropertyType.INT:
                  if ('min' in filter && 'max' in filter) {
                    return (
                      <IntBadge
                        key={filter.name}
                        name={filter.name}
                        min={Number(filter.min) || 0}
                        max={Number(filter.max) || 0}
                      />
                    );
                  }
                  return null;
              }
            })}

            {(filters.length > 0 || searchText) && (
              <Badge size="lg" variant="outline" className="ml-auto">
                <Text className="text-foreground/80 font-medium">
                  {filteredCollectiblesCount || 0} results
                </Text>
              </Badge>
            )}

            {filters.length ? (
              <Badge
                size="lg"
                variant="outlinePrimary"
                className="cursor-pointer"
                onClick={() => {
                  filters$.clearAllFilters();
                }}
              >
                Clear All
                <CloseIcon className="ml-2" />
              </Badge>
            ) : null}
          </Flex>
        </ScrollArea.Base>
      </Grid.Child>
    );
  },
);
