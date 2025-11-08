'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star as StarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Reviewer = {
  name: string;
  role: string;
  text: string;
};

const SpotlightCard: React.FC<{
  image?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ image, footer, className = '', style }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-neutral-800/80 rounded-2xl shadow-md dark:shadow-neutral-800 overflow-hidden transition-colors duration-500 ${className}`}
      style={style}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {image}
      {footer}
    </motion.div>
  );
};

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <motion.div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {initials}
    </motion.div>
  );
};

const ReviewsSection: React.FC = () => {
  const t = useTranslations('Reviews');
  const [showAll, setShowAll] = useState(false);
  const reviewers = t.raw('reviewers') as Reviewer[];
  const visibleReviews = showAll ? reviewers : reviewers.slice(0, 3);

  // Варіанти анімацій
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        type: 'spring' as const,
        stiffness: 200,
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  return (
    <section
      id="reviews-section"
      className="py-12 pb-0 bg-white dark:bg-black transition-colors duration-500"
    >
      <motion.div
        className="max-w-6xl mx-auto px-4 pb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Заголовок */}
        <motion.div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={starVariants}
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <StarIcon className="w-5 h-5 text-gray-800 dark:text-yellow-400 transition-colors duration-500 fill-current" />
              </motion.div>
            ))}
          </div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {t('reviewsTitle')}
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-[#888888] mt-2 transition-colors duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {t('reviewsSubtitle')}
          </motion.p>
        </motion.div>

        {/* Відгуки */}
        <div className="relative">
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            animate={{
              height: showAll ? 'auto' : 'auto',
            }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {visibleReviews.map((r, idx) => (
                <motion.div
                  key={`${r.name}-${idx}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SpotlightCard
                    className="transition hover:shadow-lg dark:hover:shadow-neutral-700"
                    image={
                      <div className="w-full h-24 bg-gray-100 dark:bg-neutral-800 flex items-end p-4 transition-colors duration-500">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.name} />
                          <motion.div
                            className="text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                              {r.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-[#888888] transition-colors duration-500">
                              {r.role}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    }
                    footer={
                      <motion.div
                        className="px-6 pb-6 pt-4 h-32 flex items-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500 line-clamp-4">
                          "{r.text}"
                        </p>
                      </motion.div>
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Кнопка показати/приховати */}
        <motion.div
          className="flex justify-center mt-8"
          variants={buttonVariants}
        >
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? t('showLessReviews') : t('showMoreReviews')}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ReviewsSection;
