'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const selectorsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <section
      id="product-comparison"
      className="py-12 sm:py-16 bg-white dark:bg-black transition-colors duration-500"
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Заголовок */}
        <motion.h2
          variants={titleVariants}
          className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-gray-900 dark:text-white"
        >
          {t('productComparison')}
        </motion.h2>

        {/* Селектори продуктів */}
        <motion.div
          variants={selectorsVariants}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-8 sm:mb-10"
        >
          <motion.select
            value={firstId}
            onChange={(e) => setFirstId(Number(e.target.value))}
            className="border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-gray-800 dark:text-white rounded-lg px-4 py-2.5 transition-colors duration-300 cursor-pointer text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </motion.select>

          <motion.select
            value={secondId}
            onChange={(e) => setSecondId(Number(e.target.value))}
            className="border border-gray-300 dark:border-neutral-800 bg-white dark:bg-[#111111] text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2.5 transition-colors duration-300 cursor-pointer text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </motion.select>
        </motion.div>

        {/* Десктопна версія (md+) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-10 items-start text-center">
          {/* Продукт 1 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`product1-${firstId}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div>
                <Image
                  src={`/images/madedgemodel${product1.id}-1.jpg`}
                  alt={product1.name}
                  width={320}
                  height={320}
                  onError={onImgError}
                  className="mx-auto rounded-xl shadow-lg w-full max-w-[280px] lg:max-w-[320px] aspect-square object-cover border border-gray-200 dark:border-neutral-800"
                />
              </motion.div>
              <motion.h3
                className="mt-4 font-semibold text-base lg:text-lg text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product1.name}
              </motion.h3>
            </motion.div>
          </AnimatePresence>

          {/* Характеристики */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full max-w-md">
              {product1.features.map((f, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center py-3 lg:py-4 text-center"
                >
                  <motion.div
                    className="w-1/3 text-xs lg:text-sm cursor-pointer text-gray-700 dark:text-[#888888] hover:text-black dark:hover:text-white px-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {f.value}
                  </motion.div>

                  <div className="w-1/3 flex flex-col items-center">
                    <motion.div className="bg-gray-100 dark:bg-[#111111] text-gray-800 dark:text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium border border-gray-200 dark:border-neutral-800 transition-colors duration-300">
                      {f.name}
                    </motion.div>

                    {idx !== product1.features.length - 1 && (
                      <motion.div
                        className="h-6 lg:h-8 border-l-2 border-gray-200 dark:border-neutral-800 mt-2"
                        style={{ transform: 'translateY(4px)' }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.3 }}
                      />
                    )}
                  </div>

                  <motion.div
                    className="w-1/3 text-xs lg:text-sm cursor-pointer text-gray-700 dark:text-[#888888] hover:text-black dark:hover:text-white px-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {product2.features[idx].value}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Продукт 2 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`product2-${secondId}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div>
                <Image
                  src={`/images/madedgemodel${product2.id}-1.jpg`}
                  alt={product2.name}
                  width={320}
                  height={320}
                  onError={onImgError}
                  className="mx-auto rounded-xl shadow-lg w-full max-w-[280px] lg:max-w-[320px] aspect-square object-cover border border-gray-200 dark:border-neutral-800"
                />
              </motion.div>
              <motion.h3
                className="mt-4 font-semibold text-base lg:text-lg text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product2.name}
              </motion.h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Мобільна та планшетна версія (до md) */}
        <div className="md:hidden space-y-8">
          {/* Продукт 1 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-product1-${firstId}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800"
            >
              <Image
                src={`/images/madedgemodel${product1.id}-1.jpg`}
                alt={product1.name}
                width={400}
                height={400}
                onError={onImgError}
                className="mx-auto rounded-xl shadow-lg w-full max-w-[300px] sm:max-w-[350px] aspect-square object-cover border border-neutral-200 dark:border-neutral-800"
              />
              <h3 className="mt-4 font-semibold text-lg text-center text-gray-900 dark:text-white">
                {product1.name}
              </h3>

              <div className="mt-6 space-y-3">
                {product1.features.map((f, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={featureVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                  >
                    <span className="text-sm text-neutral-600 dark:text-neutral-500">
                      {f.name}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {f.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Продукт 2 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-product2-${secondId}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800"
            >
              <Image
                src={`/images/madedgemodel${product2.id}-1.jpg`}
                alt={product2.name}
                width={400}
                height={400}
                onError={onImgError}
                className="mx-auto rounded-xl shadow-lg w-full max-w-[300px] sm:max-w-[350px] aspect-square object-cover border border-neutral-200 dark:border-neutral-800"
              />
              <h3 className="mt-4 font-semibold text-lg text-center text-neutral-900 dark:text-white">
                {product2.name}
              </h3>

              <div className="mt-6 space-y-3">
                {product2.features.map((f, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={featureVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-start justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 last:border-0 gap-4"
                  >
                    <span className="text-sm text-neutral-600 dark:text-neutral-500">
                      {f.name}
                    </span>

                    <span className="text-sm font-medium text-neutral-900 dark:text-white text-right whitespace-normal break-words">
                      {f.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default ProductComparison;
