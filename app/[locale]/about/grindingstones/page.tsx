'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Компонент ціни (без змін)
const PriceBlock = ({ price, note }: { price: string; note: string }) => (
  <motion.div
    className="mt-2"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, type: 'spring' }}
  >
    <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
      {price}
    </p>
    <p className="text-sm text-gray-500 dark:text-neutral-400">{note}</p>
  </motion.div>
);

export default function GrindingStonesPage() {
  const t = useTranslations('GrindingStonesPage');
  const t_comp = useTranslations('GrindingStonesPage.comparison');

  // Анімації без змін
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const listItemVariant = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        {/* === Diamond Stones === */}
        <section
          id="professional-stone"
          className="mb-16 sm:mb-20 scroll-mt-24"
        >
          <div className="flex flex-col lg:flex-row lg:space-x-12 gap-8 lg:gap-0">
            {/* Зображення та фічі — спочатку на мобілці */}
            <div className="lg:w-2/5 order-1 lg:order-2">
              <motion.div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-neutral-800">
                <img
                  src="/images/diamondstones.jpg"
                  alt={t('diamond.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                className="mt-6 sm:mt-8 space-y-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-blue-600 rounded-full mt-2 mr-3 dark:bg-blue-300"></div>
                    <span className="text-gray-700 dark:text-neutral-300 text-base">
                      {t(`diamond.feature${num}`)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Текстовий контент */}
            <div className="lg:w-3/5 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <motion.div
                className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3"
                whileHover={{ scale: 1.05 }}
              >
                {t('diamond.tag')}
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-blue-600 pl-2 dark:text-neutral-100 dark:border-blue-400">
                {t('diamond.title')}
              </h2>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed dark:text-neutral-300">
                {t('diamond.description')}
              </p>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 dark:text-neutral-100">
                  {t('diamond.specsTitle')}
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-neutral-400">
                  {['Type', 'Size', 'Material', 'Conc', 'Tolerance'].map(
                    (spec) => (
                      <div key={spec}>
                        <strong className="mr-1 dark:text-neutral-100">
                          {t(`diamond.spec${spec}Label`)}:
                        </strong>
                        <span>{t(`diamond.spec${spec}Value`)}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-8 sm:mt-10">
                  <PriceBlock
                    price={t('diamond.price')}
                    note={t('diamond.priceNote')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <motion.hr
          className="my-12 sm:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* === Aluminum Oxide Stones === */}
        <section id="premium-stone" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="flex flex-col lg:flex-row lg:space-x-12 gap-8 lg:gap-0">
            {/* Зображення та фічі — спочатку */}
            <div className="lg:w-2/5 order-1 lg:order-2">
              <motion.div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-neutral-800">
                <img
                  src="/images/sharpstones-1.jpg"
                  alt={t('oxide.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                className="mt-6 space-y-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-black rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300 text-base">
                      {t(`oxide.feature${num}`)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Текст */}
            <div className="lg:w-3/5 space-y-6 sm:space-y-8 order-2 lg:order-1">
              <motion.div
                className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3 dark:bg-neutral-200 dark:text-black"
                whileHover={{ scale: 1.05 }}
              >
                {t('oxide.tag')}
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-black pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('oxide.title')}
              </h2>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed dark:text-neutral-300">
                {t('oxide.description')}
              </p>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 dark:text-neutral-100">
                  {t('oxide.specsTitle')}
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-neutral-400">
                  {['Size', 'Material', 'Grit', 'Shape'].map((spec) => (
                    <div key={spec}>
                      <strong className="mr-1 dark:text-neutral-100">
                        {t(`oxide.spec${spec}Label`)}:
                      </strong>
                      <span>{t(`oxide.spec${spec}Value`)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 sm:mt-10">
                  <PriceBlock
                    price={t('oxide.price')}
                    note={t('oxide.priceNote')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === Comparison Table (FIXED CENTER) === */}
        <motion.section
          id="comparison"
          className="mb-16 sm:mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center dark:text-neutral-100">
            {t('comparison.title')}
          </h2>

          {/* ADDED: flex justify-center to wrapper */}
          <div className="overflow-x-auto -mx-4 sm:-mx-0 flex justify-center">
            {/* ADDED: mx-auto to table and w-1/3 to headers */}
            <table className="min-w-full sm:min-w-[800px] mx-auto border-collapse text-sm sm:text-base table-fixed">
              <thead className="bg-neutral-900 text-white dark:bg-neutral-800">
                <tr>
                  <th className="p-3 sm:p-4 text-left w-1/3">
                    {t_comp('feature')}
                  </th>
                  <th className="p-3 sm:p-4 text-center w-1/3">
                    {t_comp('diamondStonesTitle')}
                  </th>
                  <th className="p-3 sm:p-4 text-center w-1/3">
                    {t_comp('aluminumOxideTitle')}
                  </th>
                </tr>
              </thead>
              <motion.tbody
                className="bg-neutral-100 dark:bg-neutral-900"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  'material',
                  'size',
                  'gritRange',
                  'durability',
                  'bestFor',
                  'price',
                ].map((row) => (
                  <motion.tr
                    key={row}
                    className="border-t border-gray-200 dark:border-neutral-800"
                    variants={listItemVariant}
                  >
                    <td className="p-3 sm:p-4 font-semibold text-left text-gray-800 dark:text-neutral-100">
                      {t_comp(row)}
                    </td>
                    <td
                      className={`p-3 sm:p-4 text-center ${
                        row === 'durability'
                          ? 'text-blue-600 font-bold dark:text-blue-300'
                          : 'text-gray-700 dark:text-neutral-300'
                      } ${
                        row === 'price'
                          ? 'font-bold text-gray-900 dark:text-neutral-100'
                          : ''
                      }`}
                    >
                      {row === 'material'
                        ? t_comp('materialDiamond')
                        : row === 'size'
                        ? '150 × 25 × 3'
                        : row === 'gritRange'
                        ? t_comp('gritRangeDiamond')
                        : row === 'durability'
                        ? t_comp('durabilityDiamond')
                        : row === 'bestFor'
                        ? t_comp('bestForDiamond')
                        : t('diamond.price')}
                    </td>
                    <td
                      className={`p-3 sm:p-4 text-center ${
                        row === 'price'
                          ? 'font-bold text-gray-900 dark:text-neutral-100'
                          : 'text-gray-700 dark:text-neutral-300'
                      }`}
                    >
                      {row === 'material'
                        ? t_comp('materialOxide')
                        : row === 'size'
                        ? '160 × 25 × 6'
                        : row === 'gritRange'
                        ? t_comp('gritRangeOxide')
                        : row === 'durability'
                        ? t_comp('durabilityOxide')
                        : row === 'bestFor'
                        ? t_comp('bestForOxide')
                        : t('oxide.price')}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.section>

        {/* === Usage Guide === */}
        <motion.section
          id="usage-guide"
          className="mb-16 sm:mb-20 scroll-mt-24 bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 sm:p-8 border border-blue-100 shadow-md dark:from-neutral-900/90 dark:to-neutral-800/10 dark:border-neutral-800/30"
          {...fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 dark:text-neutral-100">
            {t('usageGuide.title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <motion.div
                key={step}
                className="flex flex-col items-start p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md dark:bg-gray-900 dark:border-neutral-800"
                variants={listItemVariant}
                whileHover={{ scale: 1.03, y: -5 }}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div
                  className={`flex-shrink-0 w-10 h-10 ${
                    step <= 3
                      ? 'bg-blue-600'
                      : 'bg-gray-900 dark:bg-neutral-300 dark:text-black'
                  } text-white rounded-full flex items-center justify-center font-bold text-xl mb-3`}
                  whileHover={{ rotate: 360 }}
                >
                  {step}
                </motion.div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 dark:text-neutral-100">
                  {t(`usageGuide.step${step}.heading`)}
                </h3>
                <p className="text-gray-700 text-sm dark:text-neutral-300">
                  {t(`usageGuide.step${step}.text`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* === Care Instructions === */}
        <motion.section
          id="care-instructions"
          className="mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <motion.div className="bg-white border border-gray-300 p-6 sm:p-8 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-800">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 dark:text-neutral-100">
              {t('care.title')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x divide-gray-200 dark:divide-neutral-800">
              {/* Diamond Care */}
              <div className="lg:pr-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-neutral-100">
                  <span className="text-blue-600">◇</span>{' '}
                  {t('care.diamondTitle')}
                </h3>
                <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300 text-base">
                  {[1, 2, 3, 4].map((num) => (
                    <motion.li
                      key={num}
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {t(`care.diamond${num}`)}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Oxide Care */}
              <div className="lg:pl-4 mt-8 lg:mt-0">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-neutral-100">
                  <span className="text-gray-900 dark:text-neutral-200">◇</span>{' '}
                  {t('care.oxideTitle')}
                </h3>
                <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300 text-base">
                  {[1, 2, 3, 4].map((num) => (
                    <motion.li
                      key={num}
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {t(`care.oxide${num}`)}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
