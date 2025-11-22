'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
  index: number;
}

const AccessoryItem: React.FC<AccessoryItemProps> = ({
  accessory,
  t,
  index,
}) => {
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const listItemVariant = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };

  const isFirst = index === 0;

  return (
    <motion.div
      id={accessory.id}
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 50 }}
      {...(isFirst
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } })}
      transition={{ duration: 0.6, delay: isFirst ? 0 : index * 0.1 }}
    >
      {/* Заголовок — зменшуємо тільки на мобілці */}
      <motion.h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-600">
        {accessory.name}
      </motion.h2>

      <div className="flex flex-col lg:flex-row lg:space-x-12 gap-8 lg:gap-0">
        {/* ЛІВИЙ БЛОК — зображення + ціна */}
        <motion.div
          className="lg:w-1/3 flex flex-col items-start" // без order — на мобілці буде першим завдяки flex-col
          initial={{ opacity: 0, x: -30 }}
          {...(isFirst
            ? { animate: { opacity: 1, x: 0 } }
            : { whileInView: { opacity: 1, x: 0 }, viewport: { once: true } })}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-900 dark:border-neutral-800"
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* p-6 тільки на lg+, на мобілці менше — щоб текст не був величезним */}
            <motion.img
              src={accessory.imageSrc}
              alt={accessory.name}
              className="w-full h-auto object-contain p-4 lg:p-6 bg-white dark:bg-transparent"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Ціна — на мобілці менша і по центру, на ПК як було */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-neutral-800">
              <motion.p
                className="text-xl lg:text-xl font-semibold text-gray-900 dark:text-neutral-100 text-center lg:text-left"
                initial={{ scale: 0.9 }}
              >
                {t('itemPrice')}: ${accessory.price.toFixed(0)}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* ПРАВИЙ БЛОК — текст */}
        <motion.div
          className="lg:w-2/3 space-y-8"
          initial={{ opacity: 0, x: 30 }}
          {...(isFirst
            ? { animate: { opacity: 1, x: 0 } }
            : { whileInView: { opacity: 1, x: 0 }, viewport: { once: true } })}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Features */}
          <div>
            <motion.h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3 dark:text-neutral-100 dark:border-blue-400">
              {t('itemFeaturesTitle')}
            </motion.h3>
            <motion.ul
              className="space-y-2 text-lg text-gray-700 list-disc list-inside dark:text-neutral-300"
              variants={staggerContainer}
              initial="initial"
              {...(isFirst
                ? { animate: 'animate' }
                : { whileInView: 'animate', viewport: { once: true } })}
            >
              {accessory.features.map((feature, i) => (
                <motion.li
                  key={i}
                  dangerouslySetInnerHTML={{ __html: feature }}
                  variants={listItemVariant}
                />
              ))}
            </motion.ul>
          </div>

          {/* Details */}
          <div>
            <motion.h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3 dark:text-neutral-100 dark:border-blue-400">
              {t('itemDetailsTitle')}
            </motion.h3>
            <motion.ul
              className="space-y-2 text-lg text-gray-600 list-disc list-inside dark:text-neutral-300"
              variants={staggerContainer}
              initial="initial"
              {...(isFirst
                ? { animate: 'animate' }
                : { whileInView: 'animate', viewport: { once: true } })}
            >
              {accessory.details.map((detail, i) => (
                <motion.li
                  key={i}
                  dangerouslySetInnerHTML={{ __html: detail }}
                  variants={listItemVariant}
                />
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AccessoriesPage: React.FC = () => {
  const t = useTranslations('AccessoriesPage');
  const raw = t.raw ? t.raw('accessoriesData') : null;
  const accessoriesData = (raw || []) as Accessory[];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero — зменшуємо заголовок тільки на мобілці */}
        <motion.h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
          {t('heroTitle')}
        </motion.h1>
        <motion.p className="mt-4 text-lg lg:text-xl text-gray-500 mb-12 lg:mb-16 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800">
          {t('heroSubtitle')}
        </motion.p>

        <div className="space-y-16 lg:space-y-20">
          {accessoriesData.length === 0 ? (
            <div className="text-center py-20 text-gray-600 dark:text-neutral-400">
              {t('noAccessories') ?? 'No accessories available.'}
            </div>
          ) : (
            accessoriesData.map((accessory, index) => (
              <React.Fragment key={accessory.id}>
                <AccessoryItem accessory={accessory} t={t} index={index} />
                {index < accessoriesData.length - 1 && (
                  <motion.hr
                    className="my-12 lg:my-16 border-gray-200 dark:border-neutral-800"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Authenticity — без змін на ПК */}
        <motion.div
          id="authenticity"
          className="scroll-mt-24 mt-16 bg-blue-50 p-6 lg:p-8 rounded-xl border border-blue-200 shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3 dark:text-neutral-100">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </motion.div>
            {t('authenticity.title')}
          </motion.h2>

          <motion.p className="text-lg text-gray-900 dark:text-neutral-200">
            {t.rich
              ? t.rich('authenticity.text', {
                  strong: (children) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                })
              : t('authenticity.text')}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessoriesPage;
