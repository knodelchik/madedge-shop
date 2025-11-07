'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

// --- Types and Constants ---
interface Accessory {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  features: string[];
  details: string[];
}

interface AccessoryItemProps {
  accessory: Accessory;
  t: (key: string) => string;
}

const AccessoryItem: React.FC<AccessoryItemProps> = ({ accessory, t }) => (
  <div id={accessory.id} className="scroll-mt-24">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-600">
      {accessory.name}
    </h2>

    <div className="lg:flex lg:space-x-12">
      {/* Image and Price/Specs block (left) */}
      <div className="lg:w-1/3 flex flex-col items-start mb-6 lg:mb-0">
        <div className="w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900 dark:border-neutral-800">
          <img
            src={accessory.imageSrc}
            alt={accessory.name}
            className="w-full h-auto object-contain p-6 bg-white dark:bg-transparent"
          />
          <div className="p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-neutral-800">
            <p className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-1">
              {t('itemPrice')}: ${accessory.price.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Content (right) */}
      <div className="lg:w-2/3 space-y-8">
        {/* Key Features */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3 dark:text-neutral-100 dark:border-blue-400">
            {t('itemFeaturesTitle')}
          </h3>
          <ul className="space-y-2 text-lg text-gray-700 list-disc list-inside dark:text-neutral-300">
            {accessory.features.map((feature, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: feature }} />
            ))}
          </ul>
        </div>

        {/* Technical Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3 dark:text-neutral-100 dark:border-blue-400">
            {t('itemDetailsTitle')}
          </h3>
          <ul className="space-y-2 text-md text-gray-600 list-disc list-inside ml-4 dark:text-neutral-300">
            {accessory.details.map((detail, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: detail }} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AccessoriesPage: React.FC = () => {
  const t = useTranslations('AccessoriesPage');

  // safe fallback if translations missing
  const raw = t.raw ? t.raw('accessoriesData') : null;
  const accessoriesData = (raw || []) as Accessory[];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 text-xl text-gray-500 mb-16 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800">
          {t('heroSubtitle')}
        </p>

        <div className="space-y-16">
          {accessoriesData.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-neutral-400">
              {t('noAccessories') ?? 'No accessories available.'}
            </div>
          ) : (
            accessoriesData.map((accessory: Accessory, index: number) => (
              <React.Fragment key={accessory.id}>
                <AccessoryItem accessory={accessory} t={t} />
                {index < accessoriesData.length - 1 && (
                  <hr className="my-16 border-gray-200 dark:border-neutral-800" />
                )}
              </React.Fragment>
            ))
          )}
        </div>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        <div
          id="authenticity"
          className="scroll-mt-24 bg-blue-50 p-8 rounded-xl border border-blue-200 shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center dark:text-neutral-100">
            <ShieldCheck className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300" />
            {t('authenticity.title')}
          </h2>

          <p className="text-lg text-gray-900 dark:text-neutral-200">
            {t.rich
              ? t.rich('authenticity.text', {
                  strong: (children) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                })
              : t('authenticity.text')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessoriesPage;
