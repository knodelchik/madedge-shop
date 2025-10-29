'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

// Компонент ціни (залишаємо без змін, але локалізуємо note)
const PriceBlock = ({ price, note }: { price: string; note: string }) => (
  <div className="mt-2">
    <p className="text-3xl font-bold text-gray-900">{price}</p>
    <p className="text-sm text-gray-500">{note}</p>
  </div>
);

export default function GrindingStonesPage() {
  const t = useTranslations('GrindingStonesPage'); // 👈 Ініціалізуємо переклади
  const t_comp = useTranslations('GrindingStonesPage.comparison'); // 👈 Окремий простір для таблиці

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          {t('hero.subtitle')}
        </p>
      </div>
      {/* --- Diamond Stones --- */}
      <section id="diamond-stone" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left Content */}
          <div className="lg:w-3/5 space-y-8 order-2 lg:order-1">
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3">
              {t('diamond.tag')}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-2">
              {t('diamond.title')}
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              {t('diamond.description')}
            </p>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 ">
                {t('diamond.specsTitle')}
              </h3>
              <p className="space-y-2 text-md text-gray-600 list-disc list-inside ">
                <ol>
                  <strong>{t('diamond.specTypeLabel')}:</strong>{' '}
                  {t('diamond.specTypeValue')}
                </ol>
                <ol>
                  <strong>{t('diamond.specSizeLabel')}:</strong>{' '}
                  {t('diamond.specSizeValue')}
                </ol>
                <ol>
                  <strong>{t('diamond.specMaterialLabel')}:</strong>{' '}
                  {t('diamond.specMaterialValue')}
                </ol>
                <ol>
                  <strong>{t('diamond.specConcLabel')}:</strong>{' '}
                  {t('diamond.specConcValue')}
                </ol>
                <ol>
                  <strong>{t('diamond.specToleranceLabel')}:</strong>{' '}
                  {t('diamond.specToleranceValue')}
                </ol>
              </p>
              <div className="mt-10">
                <PriceBlock
                  price={t('diamond.price')}
                  note={t('diamond.priceNote')} // 🚀 Локалізація note
                />
              </div>
            </div>
          </div>

          {/* Right Block (Image + Details + Price) */}
          <div className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2">
            <div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm">
              <img
                src="/images/diamondstones.jpg"
                alt={t('diamond.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('diamond.feature1')}</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('diamond.feature2')}</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('diamond.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" />
      {/* --- Aluminum Oxide Stones --- */}
      <section id="aluminum-stone" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left Content */}
          <div className="lg:w-3/5 space-y-8 order-2 lg:order-1">
            <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3">
              {t('oxide.tag')}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-3">
              {t('oxide.title')}
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              {t('oxide.description')}
            </p>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t('oxide.specsTitle')}
              </h3>
              <p className="space-y-2 text-md text-gray-600 list-disc list-inside ">
                <ol>
                  <strong>{t('oxide.specSizeLabel')}:</strong>{' '}
                  {t('oxide.specSizeValue')}
                </ol>
                <ol>
                  <strong>{t('oxide.specMaterialLabel')}:</strong>{' '}
                  {t('oxide.specMaterialValue')}
                </ol>
                <ol>
                  <strong>{t('oxide.specGritLabel')}:</strong>{' '}
                  {t('oxide.specGritValue')}
                </ol>
                <ol>
                  <strong>{t('oxide.specShapeLabel')}:</strong>{' '}
                  {t('oxide.specShapeValue')}
                </ol>
              </p>
              <div className="mt-10">
                <PriceBlock
                  price={t('oxide.price')}
                  note={t('oxide.priceNote')} // 🚀 Локалізація note
                />
              </div>
            </div>
          </div>

          {/* Right Block (Image + Details + Price) */}
          <div className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2">
            <div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm">
              <img
                src="/images/sharpstones-1.jpg"
                alt={t('oxide.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('oxide.feature1')}</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('oxide.feature2')}</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('oxide.feature3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" />
      {/* --- Comparison Table --- */}
      <section id="comparison" className="mb-20 scroll-mt-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center mt-12">
          {t('comparison.title')}
        </h2>
        <div className="flex justify-center">
          <div className="overflow-x-auto">
            <table className="min-w-[800px] border-1 border-gray-500 mx-auto text-center">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4 text-left w-1/3">{t_comp('feature')}</th>
                  <th className="p-4 text-center w-1/3">
                    {t_comp('diamondStonesTitle')}
                  </th>
                  <th className="p-4 text-center w-1/3">
                    {t_comp('aluminumOxideTitle')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">
                    {t_comp('material')}
                  </td>
                  <td className="p-4 text-center">
                    {t_comp('materialDiamond')}
                  </td>
                  <td className="p-4 text-center">{t_comp('materialOxide')}</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">
                    {t_comp('size')}
                  </td>
                  <td className="p-4 text-center">150 × 25 × 3</td>
                  <td className="p-4 text-center">160 × 25 × 6</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">
                    {t_comp('gritRange')}
                  </td>
                  <td className="p-4 text-center">
                    {t_comp('gritRangeDiamond')}
                  </td>
                  <td className="p-4 text-center">
                    {t_comp('gritRangeOxide')}
                  </td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">
                    {t_comp('durability')}
                  </td>
                  <td className="p-4 text-center text-blue-600 font-bold">
                    {t_comp('durabilityDiamond')}
                  </td>
                  <td className="p-4 text-center">
                    {t_comp('durabilityOxide')}
                  </td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">
                    {t_comp('bestFor')}
                  </td>
                  <td className="p-4 text-center">
                    {t_comp('bestForDiamond')}
                  </td>
                  <td className="p-4 text-center">{t_comp('bestForOxide')}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-left">
                    {t_comp('price')}
                  </td>
                  <td className="p-4 text-center font-bold">
                    {t('diamond.price')}
                  </td>
                  <td className="p-4 text-center font-bold">
                    {t('oxide.price')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" /> {/* --- Usage Guide --- */}
      <section
        id="usage-guide"
        className="mb-20 scroll-mt-24 bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 ">
          {t('usageGuide.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1-3 */}
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3">
                {step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {t(`usageGuide.step${step}.heading`)}
              </h3>
              <p className="text-gray-700 text-sm">
                {t(`usageGuide.step${step}.text`)}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Step 4-6 */}
          {[4, 5, 6].map((step) => (
            <div
              key={step}
              className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3">
                {step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {t(`usageGuide.step${step}.heading`)}
              </h3>
              <p className="text-gray-700 text-sm">
                {t(`usageGuide.step${step}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>
      <hr className="my-16 border-gray-200" /> {/* --- Care Instructions --- */}
      <section id="care-instructions" className="mb-20 scroll-mt-24">
        <div className="bg-white border border-gray-300 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('care.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x divide-gray-200">
            {/* Diamond Stones Care */}
            <div className="pr-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">◇</span>{' '}
                {t('care.diamondTitle')}
              </h3>
              <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4">
                <li>{t('care.diamond1')}</li>
                <li>{t('care.diamond2')}</li>
                <li>{t('care.diamond3')}</li>
                <li>{t('care.diamond4')}</li>
              </ul>
            </div>
            {/* Aluminum Oxide Stones Care */}
            <div className="pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-gray-900">◇</span> {t('care.oxideTitle')}
              </h3>
              <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4">
                <li>{t('care.oxide1')}</li>
                <li>{t('care.oxide2')}</li>
                <li>{t('care.oxide3')}</li>
                <li>{t('care.oxide4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
