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
  textColor?: string;
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
  textColor = 'black',
  fontWeight = 'small'
}: QuantityCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        −
      </button>

      <Counter
        value={value}
        places={places}
        fontSize={fontSize}
        padding={padding}
        gap={gap}
        textColor={textColor}
        fontWeight={fontWeight}
      />

      <button
        onClick={onIncrease}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        +
      </button>
    </div>
  );
}
