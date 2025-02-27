import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';

import { filters$ } from '../../FilterStore';
import { use$ } from '@legendapp/state/react';

export const useIntRangeFilter = (
  name: string,
  filterMin?: number,
  filterMax?: number,
) => {
  const range = use$(() => filters$.getIntFilterRange(name));
  const currentMin = range?.[0];
  const currentMax = range?.[1];
  const [localMin, setMin] = useState(
    currentMin !== undefined ? String(currentMin) : '',
  );
  const [localMax, setMax] = useState(
    currentMax !== undefined ? String(currentMax) : '',
  );
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (isEditingRef.current) return;

    if (range === undefined) {
      setMin('');
      setMax('');
    } else {
      setMin(range[0] !== undefined ? String(range[0]) : '');
      setMax(range[1] !== undefined ? String(range[1]) : '');
    }
  }, [range]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    boundaryValue?: number,
    isMin = true,
  ) => {
    isEditingRef.current = true;

    const value = e.target.value;

    if (value === '') {
      setter('');
      return;
    }

    const numValue = Number(value);

    if (
      boundaryValue !== undefined &&
      ((isMin && numValue < boundaryValue) ||
        (!isMin && numValue > boundaryValue))
    ) {
      setter(String(boundaryValue));
    } else {
      setter(value);
    }
  };

  const isValid = useMemo(() => {
    if (localMin === '' && localMax === '') {
      return false;
    }

    const minValue = localMin === '' ? (filterMin ?? 0) : Number(localMin);
    const maxValue = localMax === '' ? (filterMax ?? 0) : Number(localMax);

    return !(minValue > maxValue && maxValue !== 0);
  }, [localMin, localMax, filterMin, filterMax]);

  const applyFilter = () => {
    if (!isValid) return;

    const minValue = localMin === '' ? (filterMin ?? 0) : Number(localMin);
    const maxValue = localMax === '' ? (filterMax ?? 0) : Number(localMax);

    isEditingRef.current = false;

    filters$.setIntFilterValue(name, minValue, maxValue);
  };

  return {
    localMin,
    localMax,
    isValid,
    handleMinChange: (e: ChangeEvent<HTMLInputElement>) =>
      handleInputChange(e, setMin, filterMin, true),
    handleMaxChange: (e: ChangeEvent<HTMLInputElement>) =>
      handleInputChange(e, setMax, filterMax, false),
    applyFilter,
  };
};
