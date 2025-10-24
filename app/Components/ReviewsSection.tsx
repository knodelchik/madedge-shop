'use client';

import React, { useState } from 'react';
// ✅ Імпортуємо useTranslations з next-intl
import { useTranslations } from 'next-intl';
import { Star as StarIcon } from 'lucide-react';

// Тип для рецензентів
type Reviewer = {
  name: string;
  role: string;
  text: string;
};

// Локальна SpotlightCard (залишається як є)
const SpotlightCard: React.FC<{
  image?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ image, footer, className = '', style }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
      style={style}
    >
      {image}
      {footer}
    </div>
  );
};

// Аватар (залишається як є)
const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-800">
      {initials}
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  // ✅ Використовуємо useTranslations, вказуючи простір імен 'Reviews'
  const t = useTranslations('Reviews');

  const [showAll, setShowAll] = useState(false);

  // Отримуємо масив рецензентів, використовуючи t.raw()
  const reviewers = t.raw('reviewers') as Reviewer[];

  const visibleReviews = showAll ? reviewers : reviewers.slice(0, 3);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-gray-800" />
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {/* ✅ Використовуємо t() */}
            {t('reviewsTitle')}
          </h2>
          <p className="text-gray-600 mt-2">{t('reviewsSubtitle')}</p>
        </div>

        {/* Відгуки */}
        <div className="grid gap-6 md:grid-cols-3">
          {visibleReviews.map((r, idx) => (
            <SpotlightCard
              key={idx}
              className="transition hover:shadow-lg"
              style={{ background: 'white' }}
              image={
                <div className="w-full h-24 bg-gray-100 flex items-end p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {r.name}
                      </div>
                      <div className="text-sm text-gray-500">{r.role}</div>
                    </div>
                  </div>
                </div>
              }
              footer={
                <div className="px-6 pb-6">
                  <p className="text-gray-700">“{r.text}”</p>
                </div>
              }
            />
          ))}
        </div>

        {/* Кнопка показати/приховати */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            {/* ✅ Використовуємо t() з умовою */}
            {showAll ? t('showLessReviews') : t('showMoreReviews')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
