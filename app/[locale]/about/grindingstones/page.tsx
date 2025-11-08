'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Компонент ціни (локалізуємо note, додаємо dark класи)
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
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
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>
          <motion.p
            className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        {/* --- Diamond Stones --- */}
        <section id="professional-stone" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left Content */}
            <motion.div
              className="lg:w-3/5 space-y-8 order-2 lg:order-1"
              {...fadeInLeft}
            >
              <motion.div
                className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {t('diamond.tag')}
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-2 dark:text-neutral-100 dark:border-blue-400">
                {t('diamond.title')}
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed dark:text-neutral-300">
                {t('diamond.description')}
              </p>

              {/* Technical Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-neutral-100">
                  {t('diamond.specsTitle')}
                </h3>
                <motion.div
                  className="space-y-2 text-md text-gray-600 dark:text-neutral-400"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {['Type', 'Size', 'Material', 'Conc', 'Tolerance'].map(
                    (spec) => (
                      <motion.div key={spec} variants={listItemVariant}>
                        <strong className="mr-1 dark:text-neutral-100">
                          {t(`diamond.spec${spec}Label`)}:
                        </strong>
                        <span>{t(`diamond.spec${spec}Value`)}</span>
                      </motion.div>
                    )
                  )}
                </motion.div>

                <div className="mt-10">
                  <PriceBlock
                    price={t('diamond.price')}
                    note={t('diamond.priceNote')}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Block (Image + Details + Price) */}
            <motion.div
              className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2"
              {...fadeInRight}
            >
              <motion.div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-neutral-800">
                <img
                  src="/images/diamondstones.jpg"
                  alt={t('diamond.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                className="mt-8 space-y-3"
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
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 dark:bg-blue-300"></div>
                    <span className="text-gray-700 dark:text-neutral-300">
                      {t(`diamond.feature${num}`)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.hr
          className="my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Aluminum Oxide Stones --- */}
        <section id="premium-stone" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            <motion.div
              className="lg:w-3/5 space-y-8 order-2 lg:order-1"
              {...fadeInLeft}
            >
              <motion.div
                className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3 dark:bg-neutral-200 dark:text-black"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {t('oxide.tag')}
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('oxide.title')}
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed dark:text-neutral-300">
                {t('oxide.description')}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-neutral-100">
                  {t('oxide.specsTitle')}
                </h3>
                <motion.div
                  className="space-y-2 text-md text-gray-600 dark:text-neutral-400"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {['Size', 'Material', 'Grit', 'Shape'].map((spec) => (
                    <motion.div key={spec} variants={listItemVariant}>
                      <strong className="mr-1 dark:text-neutral-100">
                        {t(`oxide.spec${spec}Label`)}:
                      </strong>
                      <span>{t(`oxide.spec${spec}Value`)}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-10">
                  <PriceBlock
                    price={t('oxide.price')}
                    note={t('oxide.priceNote')}
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2"
              {...fadeInRight}
            >
              <motion.div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-neutral-800">
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
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300">
                      {t(`oxide.feature${num}`)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.hr
          className="my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Comparison Table --- */}
        <motion.section
          id="comparison"
          className="mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center mt-12 dark:text-neutral-100">
            {t('comparison.title')}
          </h2>

          <div className="flex justify-center">
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <table className="min-w-[800px] border-collapse mx-auto text-center">
                <thead className="bg-gray-900 text-white dark:bg-neutral-800 dark:text-white">
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

                <motion.tbody
                  className="bg-white dark:bg-neutral-900"
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
                  ].map((row, index) => (
                    <motion.tr
                      key={row}
                      className="border-t border-gray-200 dark:border-neutral-800"
                      variants={listItemVariant}
                      whileHover={{
                        backgroundColor: 'rgb(30, 30, 30)',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="p-4 font-semibold text-left text-gray-800 dark:text-neutral-100">
                        {t_comp(row)}
                      </td>
                      <td
                        className={`p-4 text-center ${
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
                        className={`p-4 text-center ${
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
            </motion.div>
          </div>
        </motion.section>

        <motion.hr
          className="my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Usage Guide --- */}
        <motion.section
          id="usage-guide"
          className="mb-20 scroll-mt-24 bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 shadow-md dark:from-neutral-900/90 dark:to-neutral-800/10 dark:border-neutral-800/30 dark:bg-gradient-to-br"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 dark:text-neutral-100">
            {t('usageGuide.title')}
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md dark:bg-gray-900 dark:border-neutral-900"
                variants={listItemVariant}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-neutral-800 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
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
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[4, 5, 6].map((step) => (
              <motion.div
                key={step}
                className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md dark:bg-gray-900 dark:border-neutral-800"
                variants={listItemVariant}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3 dark:bg-neutral-300 dark:text-black"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
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
          </motion.div>
        </motion.section>

        <motion.hr
          className="my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Care Instructions --- */}
        <motion.section
          id="care-instructions"
          className="mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <motion.div
            className="bg-white border border-gray-300 p-8 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-neutral-100">
              {t('care.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x divide-gray-200 dark:divide-neutral-800">
              {/* Diamond Stones Care */}
              <motion.div
                className="pr-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-neutral-100">
                  <span className="text-blue-600">◇</span>{' '}
                  {t('care.diamondTitle')}
                </h3>
                <motion.ul
                  className="space-y-3 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[1, 2, 3, 4].map((num) => (
                    <motion.li
                      key={num}
                      variants={listItemVariant}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {t(`care.diamond${num}`)}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Aluminum Oxide Stones Care */}
              <motion.div
                className="pl-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 dark:text-neutral-100">
                  <span className="text-gray-900 dark:text-neutral-200">◇</span>{' '}
                  {t('care.oxideTitle')}
                </h3>
                <motion.ul
                  className="space-y-3 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[1, 2, 3, 4].map((num) => (
                    <motion.li
                      key={num}
                      variants={listItemVariant}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {t(`care.oxide${num}`)}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
