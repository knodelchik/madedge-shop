'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ProductComparison: React.FC = () => {
  const t = useTranslations('Product');
  const [firstId, setFirstId] = useState<number>(1);
  const [secondId, setSecondId] = useState<number>(2);

  const products = t.raw('products') as {
    id: number;
    name: string;
    features: { name: string; value: string }[];
  }[];

  const product1 = products.find((p) => p.id === firstId)!;
  const product2 = products.find((p) => p.id === secondId)!;

  if (!product1 || !product2) {
    return (
      <section className="py-16 bg-white dark:bg-gray-950 text-center text-gray-700 dark:text-gray-300">
        Loading comparison data...
      </section>
    );
  }

  const placeholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
        <rect width='100%' height='100%' fill='#1f2937'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='20'>Image not found</text>
      </svg>
    `);

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = placeholder;
  };

  return (
    <section
      id="product-comparison"
      className="py-16 bg-white dark:bg-black transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          {t('productComparison')}
        </h2>

        {/* Селектори продуктів */}
        <div className="flex justify-center gap-6 mb-10">
          <select
            value={firstId}
            onChange={(e) => setFirstId(Number(e.target.value))}
            className="border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-gray-800 dark:text-white rounded-lg px-4 py-2 transition-colors duration-300"
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
            className="border border-gray-300  dark:border-neutral-800 bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 transition-colors duration-300"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Основна таблиця порівняння */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center">
          {/* Продукт 1 */}
          <div>
            <Image
              src={`/images/madedgemodel${product1.id}-1.jpg`}
              alt={product1.name}
              width={320}
              height={320}
              onError={onImgError}
              className="mx-auto rounded-xl shadow-lg w-80 h-80 object-cover border border-gray-200 dark:border-neutral-800"
            />
            <h3 className="mt-4 font-semibold text-lg text-gray-900 dark:text-white">
              {product1.name}
            </h3>
          </div>

          {/* Характеристики */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-md">
              {product1.features.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center py-4 text-center text-gray-700 dark:text-[#888888]"
                >
                  <div className="w-1/3 text-sm">{f.value}</div>

                  <div className="w-1/3 flex flex-col items-center">
                    <div className="bg-gray-100 dark:bg-[#111111] text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-200 dark:border-neutral-800 transition-colors duration-300">
                      {f.name}
                    </div>

                    {idx !== product1.features.length - 1 && (
                      <div
                        className="h-8 border-l-2 border-gray-200 dark:border-neutral-800 mt-2"
                        style={{ transform: 'translateY(4px)' }}
                      />
                    )}
                  </div>

                  <div className="w-1/3 text-sm">
                    {product2.features[idx].value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Продукт 2 */}
          <div>
            <Image
              src={`/images/madedgemodel${product2.id}-1.jpg`}
              alt={product2.name}
              width={320}
              height={320}
              onError={onImgError}
              className="mx-auto rounded-xl shadow-lg w-80 h-80 object-cover border border-gray-200 dark:border-neutral-800"
            />
            <h3 className="mt-4 font-semibold text-lg text-gray-900 dark:text-white">
              {product2.name}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
