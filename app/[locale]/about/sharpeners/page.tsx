'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

export default function SharpenersPage() {
  const t = useTranslations('SharpenersPage'); // 👈 Ініціалізуємо переклади

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        {/* 🚀 Hero Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t('hero.title')}
        </h1>

        {/* 🚀 Hero Subtitle */}
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* --- Model 1 --- */}
      <section id="model-1" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            {/* 🚀 Model Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              {t('model1.title')}
            </h2>
            {/* 🚀 Model Description */}
            <p className="text-gray-700 text-lg">{t('model1.description')}</p>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel1-1.jpg"
                alt={t('model1.imageAlt')} // 🚀 Image Alt
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model1.feature1')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model1.feature2')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model1.feature3')}</span>
              </li>
            </ul>

            {/* 🚀 Price - Залишаємо фіксовану ціну, але використовуємо t() для перекладу валюти, якщо потрібно */}
            <div className="text-3xl font-bold text-gray-900">
              {t('model1.price')}
            </div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Digital model --- */}
      <section id="digital-angle" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            {/* 🚀 Model Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
              {t('digital.title')}
            </h2>
            {/* 🚀 Model Description (Використовуємо t.raw через використання Markdown) */}
            <p
              className="text-gray-700 text-lg"
              dangerouslySetInnerHTML={{ __html: t.raw('digital.description') }}
            />
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-blue-50 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel3-1.jpg"
                alt={t('digital.imageAlt')} // 🚀 Image Alt
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('digital.feature1')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('digital.feature2')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('digital.feature3')}</span>
              </li>
            </ul>

            {/* 🚀 Price */}
            <div className="text-3xl font-bold text-gray-900">
              {t('digital.price')}
            </div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Model 2 --- */}
      <section id="model-2" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            {/* 🚀 Model Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              {t('model2.title')}
            </h2>
            {/* 🚀 Model Description */}
            <p className="text-gray-700 text-lg">{t('model2.description')}</p>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel2-1.jpg"
                alt={t('model2.imageAlt')} // 🚀 Image Alt
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model2.feature1')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model2.feature2')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('model2.feature3')}</span>
              </li>
            </ul>

            {/* 🚀 Price */}
            <div className="text-3xl font-bold text-gray-900">
              {t('model2.price')}
            </div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Convex --- */}
      <section id="convex" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            {/* 🚀 Model Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              {t('convex.title')}
            </h2>
            {/* 🚀 Model Description */}
            <p className="text-gray-700 text-lg">{t('convex.description')}</p>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6">
              <p className="text-gray-700">
                <strong className="text-blue-600">
                  {t('convex.proTipStrong')}
                </strong>
                {t('convex.proTipText')}
              </p>
            </div>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel4-1.jpg"
                alt={t('convex.imageAlt')} // 🚀 Image Alt
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('convex.feature1')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('convex.feature2')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{t('convex.feature3')}</span>
              </li>
            </ul>

            {/* 🚀 Price */}
            <div className="text-3xl font-bold text-gray-900">
              {t('convex.price')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
