'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star as StarIcon } from 'lucide-react';

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
    <div
      className={`bg-white dark:bg-neutral-800/80 rounded-2xl shadow-md dark:shadow-neutral-800 overflow-hidden transition-colors duration-500 ${className}`}
      style={style}
    >
      {image}
      {footer}
    </div>
  );
};

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      {initials}
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  const t = useTranslations('Reviews');
  const [showAll, setShowAll] = useState(false);
  const reviewers = t.raw('reviewers') as Reviewer[];
  const visibleReviews = showAll ? reviewers : reviewers.slice(0, 3);

  return (
    <section className="py-12 pb-0 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className="w-5 h-5 text-gray-800 dark:text-yellow-400 transition-colors duration-500"
              />
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
            {t('reviewsTitle')}
          </h2>
          <p className="text-gray-600 dark:text-[#888888] mt-2 transition-colors duration-500">
            {t('reviewsSubtitle')}
          </p>
        </div>

        {/* Відгуки */}
        <div className="grid gap-6 md:grid-cols-3">
          {visibleReviews.map((r, idx) => (
            <SpotlightCard
              key={idx}
              className="transition hover:shadow-lg dark:hover:shadow-neutral-700"
              image={
                <div className="w-full h-24 bg-gray-100 dark:bg-neutral-800 flex items-end p-4 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                        {r.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-[#888888] transition-colors duration-500">
                        {r.role}
                      </div>
                    </div>
                  </div>
                </div>
              }
              footer={
                <div className="px-6 pb-6 pt-4">
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
                    "{r.text}"
                  </p>
                </div>
              }
            />
          ))}
        </div>

        {/* Кнопка показати/приховати */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-neutral-300 transition-colors duration-300"
          >
            {showAll ? t('showLessReviews') : t('showMoreReviews')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
