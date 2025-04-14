import { type PropertyFilter, PropertyType } from '@0xsequence/metadata';
import { observable } from '@legendapp/state';
import { z } from 'zod';

interface CollectibleFilters {
  filtersSidebarOpen: boolean;
  showListedOnly: boolean;
  searchBarOpen: boolean;
  searchText: string;
  filterOptions: PropertyFilter[];
  appliedFilters: PropertyFilter[];
}

interface StringFilterValues {
  type: PropertyType.STRING;
  values: string[];
}

interface IntFilterValues {
  type: PropertyType.INT;
  min: number;
  max: number;
}

type FilterValues = StringFilterValues | IntFilterValues;

const initialFilters: CollectibleFilters = {
  filtersSidebarOpen: false,
  showListedOnly: false,
  searchBarOpen: false,
  searchText: '',
  filterOptions: [],
  appliedFilters: [],
};

export const filters$ = observable({
  ...initialFilters,
  getFilter: (name: string): PropertyFilter | undefined => {
    return filters$.filterOptions.get().find((f) => f.name === name);
  },

  getFilterValuesByName: (name: string): string[] | undefined => {
    const filter = filters$.getFilter(name);
    if (!filter || filter.type !== PropertyType.STRING) return undefined;

    return filter.values as string[];
  },

  isFilterActive: (name: string): boolean => {
    return !!filters$.getFilter(name);
  },

  isStringValueSelected: (name: string, value: string): boolean => {
    const filter = filters$.getFilter(name);
    if (!filter || filter.type !== PropertyType.STRING) return false;

    return (filter.values as string[])?.includes(value) ?? false;
  },

  toggleStringFilterValue: (name: string, value: string) => {
    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    const filter = filters$.getFilter(name);
    const existingValues =
      filter?.type === PropertyType.STRING
        ? ((filter.values as string[]) ?? [])
        : [];

    if (existingValues.includes(value)) {
      const newValues = existingValues.filter((v) => v !== value);

      if (newValues.length === 0) {
        filters$.filterOptions.set(otherFilters);
        filters$.applyFilters();
        return;
      }

      filters$.filterOptions.set([
        ...otherFilters,
        { name, type: PropertyType.STRING, values: newValues },
      ]);
    } else {
      filters$.filterOptions.set([
        ...otherFilters,
        {
          name,
          type: PropertyType.STRING,
          values: [...existingValues, value],
        },
      ]);
    }
    filters$.applyFilters();
  },

  isIntFilterActive: (name: string): boolean => {
    const filter = filters$.getFilter(name);
    return !!filter && filter.type === PropertyType.INT;
  },

  getIntFilterRange: (name: string): [number, number] | undefined => {
    const filter = filters$.getFilter(name);
    if (!filter || filter.type !== PropertyType.INT) return undefined;

    return [filter.min ?? 0, filter.max ?? 0];
  },

  setIntFilterValue: (name: string, min: number, max: number) => {
    if (min === max && min === 0) {
      filters$.deleteFilter(name);
      return;
    }

    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    filters$.filterOptions.set([
      ...otherFilters,
      { name, type: PropertyType.INT, min, max },
    ]);
    filters$.applyFilters();
  },

  applyFilters: () => {
    filters$.appliedFilters.set(filters$.filterOptions.get());
  },

  clearSearchText: () => {
    filters$.searchText.set('');
  },

  clearAllFilters: () => {
    filters$.showListedOnly.set(false);
    filters$.filterOptions.set([]);
    filters$.appliedFilters.set([]);
    filters$.searchText.set('');
  },

  deleteFilter: (name: string) => {
    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    filters$.filterOptions.set(otherFilters);
    filters$.appliedFilters.set(otherFilters);
  },
});
