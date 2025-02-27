'use client';

import { Accordion } from '$ui';
import { IntFilter } from './IntFilter';
import { StringFilter } from './StringFilter';
import { type PropertyFilter, PropertyType } from '@0xsequence/metadata';

export type FilterProps = {
  filter: PropertyFilter;
};

type PropertyFiltersProps = {
  filters?: PropertyFilter[];
  loading?: boolean;
};

export const PropertyFilters = ({ filters, loading }: PropertyFiltersProps) => {
  if (loading) {
    return (
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="a" disabled className="loading">
          <Accordion.Trigger />
          <Accordion.Content />
        </Accordion.Item>

        <Accordion.Item value="b" disabled className="loading">
          <Accordion.Trigger />
          <Accordion.Content />
        </Accordion.Item>

        <Accordion.Item value="c" disabled className="loading">
          <Accordion.Trigger />
          <Accordion.Content />
        </Accordion.Item>
      </Accordion.Root>
    );
  }

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <Accordion.Root
      className="duration-300 animate-in fade-in"
      type="single"
      collapsible
    >
      {filters.map((filter) => {
        switch (filter.type) {
          case PropertyType.STRING:
          case PropertyType.ARRAY:
            return <StringFilter key={filter.name} filter={filter} />;
          case PropertyType.INT:
            return <IntFilter key={filter.name} filter={filter} />;
        }
      })}
    </Accordion.Root>
  );
};
