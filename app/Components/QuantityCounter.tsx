'use client';

import Counter from '../../components/Counter';
import React from 'react';

type QuantityCounterProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  fontSize?: number;
  places?: number[];
  padding?: number;
  gap?: number;
  fontWeight?: number | 'small' | 'medium' | 'bold';
};

export default function QuantityCounter({
  value,
  onIncrease,
  onDecrease,
  fontSize = 18,
  places = [10, 1],
  padding = 2,
  gap = 2,
  fontWeight = 'small',
}: QuantityCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white cursor-pointer"
      >
        −
      </button>

      <div className="text-black dark:text-white mt-2">
        <Counter
          value={value}
          places={places}
          fontSize={fontSize}
          padding={padding}
          gap={gap}
          fontWeight={fontWeight}
        />
      </div>

      <button
        onClick={onIncrease}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:hover:text-white cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
