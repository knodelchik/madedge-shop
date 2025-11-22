'use client';

import React from 'react';
import { Calendar, Wrench, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('title')}
          </h1>
          <motion.p
            className="mt-4 text-lg sm:text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* --- Our Background --- */}
        <motion.section
          id="our-background"
          className="mb-16 md:mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-100">
            {t('backgroundTitle')}
          </h2>

          <div className="prose prose-base sm:prose-lg max-w-none dark:prose-invert">
            <motion.p
              className="text-gray-700 mb-4 text-base sm:text-lg dark:text-neutral-100"
              dangerouslySetInnerHTML={{ __html: t.raw('backgroundText1') }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            />

            <motion.h3
              className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-200 dark:text-neutral-200 dark:border-neutral-800 pb-2"
              {...fadeInUp}
            >
              {t('journeySubtitle')}
            </motion.h3>

            <motion.p
              className="text-gray-700 mb-4 text-base dark:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: t.raw('journeyText') }}
              {...fadeInUp}
            />

            <motion.h3
              className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800"
              {...fadeInUp}
            >
              {t('milestonesSubtitle')}
            </motion.h3>

            <motion.div
              className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.ul
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {['2016', '2017', '2018', '2021', '2025'].map((year, index) => (
                  <motion.li
                    key={year}
                    className="flex items-start"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100 text-sm sm:text-base">
                      {year}:
                    </span>
                    <span className="text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                      {t(`milestone${year}`)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.section>

        <motion.hr
          className="my-12 md:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Our Values --- */}
        <motion.section
          id="our-values"
          className="mb-16 md:mb-20 scroll-mt-24"
          {...fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('valuesTitle')}
          </h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'text-blue-600',
                darkBg:
                  'dark:bg-[linear-gradient(135deg,rgba(10,25,47,0.6),rgba(8,18,35,0.6))]',
                darkBorder: 'dark:border-blue-800/50',
                darkIcon: 'dark:text-blue-300',
                key: 'Precision',
              },
              {
                bg: 'bg-green-50',
                border: 'border-green-200',
                icon: 'text-green-600',
                darkBg:
                  'dark:bg-[linear-gradient(135deg,rgba(6,50,30,0.55),rgba(6,35,22,0.55))]',
                darkBorder: 'dark:border-green-800/50',
                darkIcon: 'dark:text-green-300',
                key: 'Sustainability',
              },
              {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                icon: 'text-purple-600',
                darkBg:
                  'dark:bg-[linear-gradient(135deg,rgba(35,10,43,0.55),rgba(20,8,25,0.55))]',
                darkBorder: 'dark:border-purple-800/50',
                darkIcon: 'dark:text-purple-300',
                key: 'Innovation',
              },
              {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                icon: 'text-orange-600',
                darkBg:
                  'dark:bg-[linear-gradient(135deg,rgba(60,30,6,0.45),rgba(40,20,4,0.45))]',
                darkBorder: 'dark:border-orange-800/50',
                darkIcon: 'dark:text-orange-300',
                key: 'CustomerFocus',
              },
            ].map((value, index) => (
              <motion.div
                key={value.key}
                className={`${value.bg} p-4 sm:p-6 rounded-xl border ${value.border} shadow-sm hover:shadow-md transition ${value.darkBg} ${value.darkBorder}`}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center dark:text-neutral-100">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ChevronRight
                      className={`w-5 h-5 mr-2 ${value.icon} ${value.darkIcon}`}
                    />
                  </motion.div>
                  {t(`value${value.key}Title`)}
                </h3>
                <p
                  className="text-gray-700 dark:text-neutral-300 text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: t.raw(`value${value.key}Text`),
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.hr
          className="my-12 md:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Manufacturing --- */}
        <motion.section
          id="manufacturing"
          className="mb-16 md:mb-20 scroll-mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('manufacturingTitle')}
          </h2>

          <motion.p
            className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg dark:text-neutral-300"
            dangerouslySetInnerHTML={{ __html: t.raw('manufacturingText') }}
            {...fadeInUp}
          />

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-200 pb-2 dark:text-neutral-100 dark:border-neutral-800">
            {t('productionProcessSubtitle')}
          </h3>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6 mb-6 sm:mb-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4, 5].map((step) => (
              <motion.div
                key={step}
                className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600"
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100 text-sm sm:text-base">
                  {t(`step${step}Title`)}
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm dark:text-neutral-300">
                  {t(`step${step}Text`)}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.h3
            className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 dark:text-neutral-200 dark:border-neutral-800"
            {...fadeInUp}
          >
            {t('sustainabilitySubtitle')}
          </motion.h3>
          <motion.p
            className="text-gray-700 mb-4 dark:text-neutral-300 text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: t.raw('sustainabilityText') }}
            {...fadeInUp}
          />
        </motion.section>

        <motion.hr
          className="my-12 md:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- MadEdge Services --- */}
        <motion.section
          id="madedge-services"
          className="mb-16 md:mb-20 scroll-mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('servicesTitle')}
          </h2>

          <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg dark:text-neutral-300">
            {t('servicesText')}
          </p>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800">
            {t('howToUseSubtitle')}
          </h3>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-8 rounded-xl mb-6 sm:mb-8 border border-blue-200 shadow-lg dark:from-neutral-900/90 dark:to-neutral-800/30 dark:border-neutral-800/40"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-bold text-gray-900 mb-4 text-lg sm:text-xl dark:text-neutral-100">
              {t('instructionsTitle')}
            </h4>

            <motion.ol
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <motion.li
                  key={num}
                  className="flex items-start"
                  variants={fadeInUp}
                  whileHover={{ x: 5 }}
                >
                  <motion.span
                    className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3 sm:mr-4 text-sm sm:text-base"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {num}
                  </motion.span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-neutral-100 text-sm sm:text-base">
                      {t(`inst${num}Title`)}
                    </p>
                    <p className="text-gray-700 text-xs sm:text-sm dark:text-neutral-300">
                      {t(`inst${num}Text`)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            <motion.div
              className="mt-6 p-4 bg-white rounded-lg dark:bg-gray-900 dark:border-blue-800/40"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs sm:text-sm text-gray-700 dark:text-neutral-300">
                <strong className="text-blue-600 dark:text-blue-400">
                  {t('proTipStrong')}
                </strong>
                {t('proTipText')}
              </p>
            </motion.div>
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800">
            {t('additionalServicesSubtitle')}
          </h3>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: (
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 dark:text-blue-300" />
                ),
                key: 'Maintenance',
              },
              {
                icon: (
                  <span className="text-blue-600 mr-2 dark:text-blue-300">
                    ◆
                  </span>
                ),
                key: 'Engraving',
              },
              {
                icon: (
                  <span className="text-blue-600 mr-2 dark:text-blue-300">
                    ◆
                  </span>
                ),
                key: 'Workshops',
              },
              {
                icon: (
                  <span className="text-blue-600 mr-2 dark:text-blue-300">
                    ◆
                  </span>
                ),
                key: 'BulkOrders',
              },
            ].map((service, index) => (
              <motion.div
                key={service.key}
                className="border border-gray-200 p-4 sm:p-5 rounded-lg hover:shadow-lg transition-shadow dark:border-neutral-800 dark:bg-gray-900"
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center dark:text-neutral-100 text-sm sm:text-base">
                  {service.icon}
                  {t(`service${service.key}Title`)}
                </h4>
                <p className="text-gray-700 dark:text-neutral-300 text-xs sm:text-sm">
                  {t(`service${service.key}Text`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.hr
          className="my-12 md:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* --- Upcoming Events --- */}
        <motion.section
          id="upcoming-events"
          className="mb-12 md:mb-16 scroll-mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 shadow-md dark:bg-neutral-900 dark:border-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-gray-900 mb-3 dark:text-neutral-100 text-base sm:text-lg">
              {t('stayUpdatedTitle')}
            </h3>
            <p className="text-gray-700 mb-4 dark:text-neutral-300 text-sm sm:text-base">
              {t('stayUpdatedText')}
            </p>
            <motion.button
              className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 dark:bg-neutral-600 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('subscribeButton')}
            </motion.button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
