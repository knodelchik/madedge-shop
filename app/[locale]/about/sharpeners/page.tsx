'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function SharpenersPage() {
  const t = useTranslations('SharpenersPage');

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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          // Змінено: зменшено відступ на мобільному (mb-10), на ПК залишився mb-16
          className="mb-10 lg:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Змінено: text-3xl для мобільного, sm:text-4xl для планшетів/ПК */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>

          <motion.p
            // Змінено: text-lg для мобільного, text-xl для ПК
            className="mt-4 text-lg lg:text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        {/* --- Model 1 --- */}
        {/* Змінено: mb-12 для мобільного, lg:mb-20 для ПК */}
        <section id="model-1" className="mb-12 lg:mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left: Description */}
            <motion.div
              className="lg:w-3/5 order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Змінено: розмір шрифту заголовка та тексту адаптовано */}
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('model1.title')}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg dark:text-neutral-300">
                {t('model1.description')}
              </p>
            </motion.div>

            {/* Right: Image + Price + List */}
            <motion.div
              className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start mb-8 lg:mb-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="/images/madedgemodel1-1.jpg"
                  alt={t('model1.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.ul
                className="space-y-3 mb-4 w-full"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.li
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-gray-900 rounded-full mt-2 mr-4 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                      {t(`model1.feature${num}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {t('model1.price')}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.hr
          // Змінено: my-10 для мобільного, my-16 для ПК
          className="my-10 lg:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Digital model --- */}
        <section id="digital-angle" className="mb-12 lg:mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left: Description */}
            <motion.div className="lg:w-3/5 order-2 lg:order-1" {...fadeInLeft}>
              <motion.h2
                className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-400"
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {t('digital.title')}
              </motion.h2>
              <p
                className="text-gray-700 text-base lg:text-lg dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('digital.description'),
                }}
              />
            </motion.div>

            {/* Right: Image + Price + List */}
            <motion.div
              className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start mb-8 lg:mb-0"
              {...fadeInRight}
            >
              <motion.div
                className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-[linear-gradient(135deg,rgba(10,40,80,0.4),rgba(6,20,40,0.4))]"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="/images/madedgemodel3-1.jpg"
                  alt={t('digital.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.ul
                className="space-y-3 mb-4 w-full"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.li
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-gray-900 rounded-full mt-2 mr-4 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                      {t(`digital.feature${num}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {t('digital.price')}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.hr
          className="my-10 lg:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Model 2 --- */}
        <section id="model-2" className="mb-12 lg:mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            <motion.div className="lg:w-3/5 order-2 lg:order-1" {...fadeInLeft}>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('model2.title')}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg dark:text-neutral-300">
                {t('model2.description')}
              </p>
            </motion.div>

            <motion.div
              className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start mb-8 lg:mb-0"
              {...fadeInRight}
            >
              <motion.div
                className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="/images/madedgemodel2-1.jpg"
                  alt={t('model2.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.ul
                className="space-y-3 mb-4 w-full"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.li
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                      {t(`model2.feature${num}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {t('model2.price')}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.hr
          className="my-10 lg:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Convex --- */}
        <section id="convex" className="mb-12 lg:mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left: Description */}
            <motion.div
              className="lg:w-3/5 order-2 lg:order-1 mb-8 lg:mb-0"
              {...fadeInLeft}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('convex.title')}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg dark:text-neutral-300">
                {t('convex.description')}
              </p>

              <motion.div
                className="bg-blue-50 p-4 lg:p-6 rounded-lg border border-blue-200 mt-6 dark:bg-gray-900 dark:border-blue-900/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-gray-700 text-sm sm:text-base dark:text-neutral-300">
                  <strong className="text-blue-600 dark:text-blue-400">
                    {t('convex.proTipStrong')}
                  </strong>
                  {t('convex.proTipText')}
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Image + Price + List */}
            <motion.div
              className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start mb-8 lg:mb-0"
              {...fadeInRight}
            >
              <motion.div
                className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="/images/madedgemodel4-1.jpg"
                  alt={t('convex.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.ul
                className="space-y-3 mb-4 w-full"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[1, 2, 3].map((num) => (
                  <motion.li
                    key={num}
                    className="flex items-start"
                    variants={listItemVariant}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-2 h-2 shrink-0 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                    <span className="text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                      {t(`convex.feature${num}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {t('convex.price')}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
