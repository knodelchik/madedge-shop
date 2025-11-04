'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function SharpenersPage() {
  const t = useTranslations('SharpenersPage');

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>

          <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* --- Model 1 --- */}
        <section id="model-1" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left: Description */}
            <div className="lg:w-3/5 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('model1.title')}
              </h2>
              <p className="text-gray-700 text-lg dark:text-neutral-300">
                {t('model1.description')}
              </p>
            </div>

            {/* Right: Image + Price + List */}
            <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
              <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800">
                <img
                  src="/images/madedgemodel1-1.jpg"
                  alt={t('model1.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model1.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model1.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model1.feature3')}
                  </span>
                </li>
              </ul>

              <div className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {t('model1.price')}
              </div>
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Digital model --- */}
        <section id="digital-angle" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            {/* Left: Description */}
            <div className="lg:w-3/5 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3 dark:text-neutral-100 dark:border-blue-400">
                {t('digital.title')}
              </h2>
              <p
                className="text-gray-700 text-lg dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('digital.description'),
                }}
              />
            </div>

            {/* Right: Image + Price + List */}
            <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
              <div className="bg-blue-50 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-[linear-gradient(135deg,rgba(10,40,80,0.4),rgba(6,20,40,0.4))]">
                <img
                  src="/images/madedgemodel3-1.jpg"
                  alt={t('digital.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 dark:bg-blue-300"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('digital.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 dark:bg-blue-300"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('digital.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 dark:bg-blue-300"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('digital.feature3')}
                  </span>
                </li>
              </ul>

              <div className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {t('digital.price')}
              </div>
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Model 2 --- */}
        <section id="model-2" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            <div className="lg:w-3/5 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('model2.title')}
              </h2>
              <p className="text-gray-700 text-lg dark:text-neutral-300">
                {t('model2.description')}
              </p>
            </div>

            <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
              <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800">
                <img
                  src="/images/madedgemodel2-1.jpg"
                  alt={t('model2.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model2.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model2.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('model2.feature3')}
                  </span>
                </li>
              </ul>

              <div className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {t('model2.price')}
              </div>
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Convex --- */}
        <section id="convex" className="mb-20 scroll-mt-24">
          <div className="lg:flex lg:space-x-12">
            <div className="lg:w-3/5 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
                {t('convex.title')}
              </h2>
              <p className="text-gray-700 text-lg dark:text-neutral-300">
                {t('convex.description')}
              </p>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6 dark:bg-gray-900 dark:border-blue-900/40">
                <p className="text-gray-700 dark:text-neutral-300">
                  <strong className="text-blue-600 dark:text-blue-400">
                    {t('convex.proTipStrong')}
                  </strong>
                  {t('convex.proTipText')}
                </p>
              </div>
            </div>

            <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
              <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4 dark:bg-neutral-800">
                <img
                  src="/images/madedgemodel4-1.jpg"
                  alt={t('convex.imageAlt')}
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('convex.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('convex.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 dark:bg-neutral-200"></div>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('convex.feature3')}
                  </span>
                </li>
              </ul>

              <div className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {t('convex.price')}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
