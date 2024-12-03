'use client';

import { useCallback } from 'react';

import {
  Grid,
  Flex,
  cn,
  Badge,
  CloseIcon,
  ScrollArea,
  Text,
} from '~/components/ui';
import { classNames } from '~/config/classNames';

import { filters$ } from '../FilterStore';
import { IntBadge } from './IntBadge';
import { StringAndArrayBadge } from './StringAndArrayBadge';
import { useFilters } from '@0xsequence/marketplace-sdk/react';
import { PropertyType } from '@0xsequence/metadata';
import { observer } from '@legendapp/state/react';
import { type Hex } from 'viem';

type FilterBadgesProps = {
  chainId: number;
  collectionAddress: Hex;
};

export const FilterBadges = observer(
  ({ chainId, collectionAddress }: FilterBadgesProps) => {
    const { filterOptions: filters, searchText } = filters$.get();

    const { data } = useFilters({
      chainId: chainId.toString(),
      collectionAddress,
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

            {filters.map((filter, i) => {
              switch (getFilterType(filter.name)) {
                case PropertyType.STRING:
                case PropertyType.ARRAY:
                  if (filter?.values?.length) {
                    return <StringAndArrayBadge key={i} filter={filter} />;
                  }
                  return null;
                case PropertyType.INT:
                  if (filter?.values.length == 2) {
                    const min = filter.values[0] as number;
                    const max = filter.values[1] as number;
                    return (
                      <IntBadge
                        key={i}
                        name={filter.name}
                        min={min}
                        max={max}
                      />
                    );
                  }
                  return null;
              }
            })}

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
