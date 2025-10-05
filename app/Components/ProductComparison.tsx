'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translation/translations';

const ProductComparison: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [firstId, setFirstId] = useState<number>(1);
  const [secondId, setSecondId] = useState<number>(2);

  const product1 = t.products.find((p) => p.id === firstId)!;
  const product2 = t.products.find((p) => p.id === secondId)!;

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
          {t.productComparison}
        </h2>

        {/* Selectors */}
        <div className="flex justify-center gap-6 mb-10">
          <select
            value={firstId}
            onChange={(e) => setFirstId(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            {t.products.map((p) => (
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
            {t.products.map((p) => (
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
            <Image
              src={`/images/madedgemodel${product1.id}-1.jpg`}
              alt={product1.name}
              width={320}
              height={320}
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
            <Image
              src={`/images/madedgemodel${product2.id}-1.jpg`}
              alt={product2.name}
              width={320}
              height={320}
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