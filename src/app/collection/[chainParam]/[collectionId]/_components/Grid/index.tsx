'use client';

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import { classNames } from '~/config/classNames';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import type { OrderItemType } from '~/lib/stores/cart/types';

import { Grid, cn } from '$ui';
import { CollectibleCard } from './Card/CollectableCard';

export type CollectiblesGridProps = {
  data: CollectibleOrder[];
  itemType: OrderItemType;
  endReached?: () => void;
};

export const CollectiblesGrid = ({
  endReached,
  data,
  itemType,
}: CollectiblesGridProps) => {
  return (
    <VirtuosoGrid
      className="@container/collectiblesGridContainer"
      useWindowScroll
      components={{
        List: GridContainer,
      }}
      itemContent={(index, data) => (
        <CollectibleCard key={index} itemType={itemType} data={data} />
      )}
      endReached={endReached}
      data={data}
    />
  );
};

type GridContainerProps = {
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const GridContainer = forwardRef(
  (props: GridContainerProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { className, ...otherProps } = props;

    return (
      <Grid.Root
        className={cn(
          `${classNames.collectiblesGrid} ${className}`,
          'auto-rows-[minmax(400px,min-content) grid-flow-row',
          'grid-rows-[repeat(auto-fill,minmax(300px, min-content))] grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-1',
          '@md/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(350px, min-content))] @md/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]',
          '@lg/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(350px, min-content))] @lg/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(225px,1fr))]',
          '@xl/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(400px, min-content))] @xl/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]',
          '@md/collectiblesGridContainer:gap-2 @xl/collectiblesGridContainer:gap-3',
        )}
        ref={ref}
        {...otherProps}
      />
    );
  },
);

GridContainer.displayName = 'GridContainer';
