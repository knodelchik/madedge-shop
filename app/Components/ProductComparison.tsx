'use client';

import React, { useState } from 'react';

interface Feature {
  name: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  features: Feature[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'MadEdge Model 1',
    image: '/item1.jpg',
    features: [
      { name: 'Sharpening angle', value: '15°-30°' },
      { name: 'Body material', value: 'Aluminum' },
      { name: 'Knife fixation', value: 'Standard' },
      { name: 'Set', value: 'Basic kit' },
      { name: 'Price', value: '$170' },
    ],
  },
  {
    id: 2,
    name: 'MadEdge Model 2',
    image: '/item2.jpg',
    features: [
      { name: 'Sharpening angle', value: '10°-40°' },
      { name: 'Body material', value: 'Steel + Aluminum' },
      { name: 'Knife fixation', value: 'Reinforced with rubber inserts' },
      { name: 'Set', value: 'Extended kit' },
      { name: 'Price', value: '$220' },
    ],
  },
  {
    id: 3,
    name: 'MadEdge Model 3',
    image: '/item3.jpg',
    features: [
      { name: 'Sharpening angle', value: '20°-35°' },
      { name: 'Body material', value: 'Titanium' },
      { name: 'Knife fixation', value: 'Magnetic' },
      { name: 'Set', value: 'Pro kit' },
      { name: 'Price', value: '$280' },
    ],
  },
  {
    id: 4,
    name: 'MadEdge Model 4',
    image: '/item2.jpg',
    features: [
      { name: 'Sharpening angle', value: '12°-38°' },
      { name: 'Body material', value: 'Carbon fiber' },
      { name: 'Knife fixation', value: 'Advanced magnetic system' },
      { name: 'Set', value: 'Ultimate kit' },
      { name: 'Price', value: '$350' },
    ],
  },
];

const ProductComparison: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(1);
  const [secondId, setSecondId] = useState<number>(2);

  const product1 = products.find((p) => p.id === firstId)!;
  const product2 = products.find((p) => p.id === secondId)!;

  const placeholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
        <rect width='100%' height='100%' fill='#f3f4f6'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='20'>Image not found</text>
      </svg>
    `);

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = placeholder;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Product Comparison
        </h2>

        {/* Selectors */}
        <div className="flex justify-center gap-6 mb-10">
          <select
            value={firstId}
            onChange={(e) => setFirstId(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={secondId}
            onChange={(e) => setSecondId(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center">
          {/* Product 1 */}
          <div>
            <img
              src={product1.image}
              alt={product1.name}
              onError={onImgError}
              className="mx-auto rounded-xl shadow-lg w-80 h-80 object-cover"
            />
            <h3 className="mt-4 font-semibold text-lg">{product1.name}</h3>
          </div>

          {/* Features */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-md">
              {product1.features.map((f, idx) => (
                <div key={idx} className="flex items-center py-4 text-center">
                  <div className="w-1/3 text-sm text-gray-600">{f.value}</div>

                  <div className="w-1/3 flex flex-col items-center">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {f.name}
                    </div>
                    {idx !== product1.features.length - 1 && (
                      <div
                        className="h-8 border-l-2 border-gray-200 mt-2"
                        style={{ transform: 'translateY(4px)' }}
                      />
                    )}
                  </div>

                  <div className="w-1/3 text-sm text-gray-600">
                    {product2.features[idx].value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product 2 */}
          <div>
            <img
              src={product2.image}
              alt={product2.name}
              onError={onImgError}
              className="mx-auto rounded-xl shadow-lg w-80 h-80 object-cover"
            />
            <h3 className="mt-4 font-semibold text-lg">{product2.name}</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
