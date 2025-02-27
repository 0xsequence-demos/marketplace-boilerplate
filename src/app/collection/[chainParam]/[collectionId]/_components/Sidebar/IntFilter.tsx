'use client';

import { Accordion, Button, Flex, Input, Text } from '$ui';
import { filters$ } from '../FilterStore';
import type { FilterProps } from './PropertyFilters';
import { useIntRangeFilter } from './_hooks/useIntRangeFilter';
import { observer, use$ } from '@legendapp/state/react';
import { capitalize } from 'radash';

export const IntFilter = observer(({ filter }: FilterProps) => {
  const { name, min, max } = filter;

  const {
    localMin,
    localMax,
    isValid,
    handleMinChange,
    handleMaxChange,
    applyFilter,
  } = useIntRangeFilter(name, min, max);

  const isActive = use$(() => filters$.isIntFilterActive(name));

  const onClearClick = () => {
    filters$.deleteFilter(name);
  };

  return (
    <Accordion.Item value={name}>
      <Accordion.Trigger>
        {capitalize(name)}
        <Flex className="ml-auto items-center gap-3">
          {isActive ? (
            <Text className="text-primary mr-2 text-xs">ACTIVE</Text>
          ) : null}
        </Flex>
      </Accordion.Trigger>
      <Accordion.Content asChild>
        <Flex className="flex-col gap-2 p-2 pb-0">
          <Flex className="mt-3 w-full items-center gap-4">
            <Input.Base
              id="property-min"
              type="number"
              placeholder={`Min (${min})`}
              min={min}
              max={max}
              value={localMin}
              className="w-full"
              onChange={handleMinChange}
            />
            <Text className="text-foreground/80 text-xs uppercase">to</Text>
            <Input.Base
              id="property-max"
              type="number"
              placeholder={`Max (${max})`}
              min={min}
              max={max}
              value={localMax}
              className="w-full"
              onChange={handleMaxChange}
            />
          </Flex>

          {!isValid && isActive && (
            <Text className="text-destructive text-xs mt-1">
              This range is invalid
            </Text>
          )}

          <Flex className="gap-2">
            <Button
              className="flex-1"
              variant="secondary"
              label="Apply"
              onClick={() => applyFilter()}
              disabled={!isValid}
            />
            {isActive && (
              <Button variant="outline" label="Clear" onClick={onClearClick} />
            )}
          </Flex>
        </Flex>
      </Accordion.Content>
    </Accordion.Item>
  );
});
