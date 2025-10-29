'use client';

import React from 'react';
import { Calendar, Wrench, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

export default function AboutPage() {
  const t = useTranslations('AboutPage'); // 👈 Ініціалізуємо переклади

  // 1. Додаємо контейнер для уніфікації ширини та відступів
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        {/* 🚀 Hero Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t('title')}
        </h1>
        {/* 🚀 Hero Subtitle */}
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          {t('subtitle')}
        </p>
      </div>

      {/* --- Our Background --- */}
      <section id="our-background" className="mb-20 scroll-mt-24">
        {/* 🚀 Background Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('backgroundTitle')}
        </h2>

        <div className="prose prose-lg max-w-none">
          {/* 🚀 Background Text 1 (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
          <p
            className="text-gray-700 mb-4 text-lg"
            dangerouslySetInnerHTML={{ __html: t.raw('backgroundText1') }}
          />

          {/* 🚀 Journey Subtitle */}
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            {t('journeySubtitle')}
          </h3>
          {/* 🚀 Journey Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
          <p
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: t.raw('journeyText') }}
          />

          {/* 🚀 Milestones Subtitle */}
          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            {t('milestonesSubtitle')}
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2010:</span>
                <span className="text-gray-700">{t('milestone2010')}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2013:</span>
                <span className="text-gray-700">{t('milestone2013')}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2017:</span>
                <span className="text-gray-700">{t('milestone2017')}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2021:</span>
                <span className="text-gray-700">{t('milestone2021')}</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2024:</span>
                <span className="text-gray-700">{t('milestone2024')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Our Values --- */}
      <section id="our-values" className="mb-20 scroll-mt-24">
        {/* 🚀 Values Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('valuesTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Value 1: Precision */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-blue-600" />
              {/* 🚀 Value 1 Title */}
              {t('valuePrecisionTitle')}
            </h3>
            {/* 🚀 Value 1 Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: t.raw('valuePrecisionText') }}
            />
          </div>

          {/* Value 2: Sustainability */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
              {/* 🚀 Value 2 Title */}
              {t('valueSustainabilityTitle')}
            </h3>
            {/* 🚀 Value 2 Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: t.raw('valueSustainabilityText'),
              }}
            />
          </div>

          {/* Value 3: Innovation */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-purple-600" />
              {/* 🚀 Value 3 Title */}
              {t('valueInnovationTitle')}
            </h3>
            {/* 🚀 Value 3 Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: t.raw('valueInnovationText') }}
            />
          </div>

          {/* Value 4: Customer Focus */}
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-orange-600" />
              {/* 🚀 Value 4 Title */}
              {t('valueCustomerFocusTitle')}
            </h3>
            {/* 🚀 Value 4 Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: t.raw('valueCustomerFocusText'),
              }}
            />
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Manufacturing --- */}
      <section id="manufacturing" className="mb-20 scroll-mt-24">
        {/* 🚀 Manufacturing Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('manufacturingTitle')}
        </h2>

        {/* 🚀 Manufacturing Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
        <p
          className="text-gray-700 mb-6 text-lg"
          dangerouslySetInnerHTML={{ __html: t.raw('manufacturingText') }}
        />

        {/* 🚀 Production Process Subtitle */}
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {t('productionProcessSubtitle')}
        </h3>

        {/* Production Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">{t('step1Title')}</h4>
            <p className="text-gray-700 text-sm">{t('step1Text')}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">{t('step2Title')}</h4>
            <p className="text-gray-700 text-sm">{t('step2Text')}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">{t('step3Title')}</h4>
            <p className="text-gray-700 text-sm">{t('step3Text')}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">{t('step4Title')}</h4>
            <p className="text-gray-700 text-sm">{t('step4Text')}</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">{t('step5Title')}</h4>
            <p className="text-gray-700 text-sm">{t('step5Text')}</p>
          </div>
        </div>

        {/* 🚀 Sustainability Subtitle */}
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {t('sustainabilitySubtitle')}
        </h3>
        {/* 🚀 Sustainability Text (Використовуємо dangerouslySetInnerHTML через використання Markdown) */}
        <p
          className="text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: t.raw('sustainabilityText') }}
        />
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- MadEdge Services --- */}
      <section id="madedge-services" className="mb-20 scroll-mt-24">
        {/* 🚀 Services Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('servicesTitle')}
        </h2>

        {/* 🚀 Services Text */}
        <p className="text-gray-700 mb-6 text-lg">{t('servicesText')}</p>

        {/* 🚀 How To Use Subtitle */}
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {t('howToUseSubtitle')}
        </h3>

        {/* Instructions Block */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl mb-8 border border-blue-200 shadow-lg">
          {/* 🚀 Instructions Title */}
          <h4 className="font-bold text-gray-900 mb-4 text-xl">
            {t('instructionsTitle')}
          </h4>

          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-900">{t('inst1Title')}</p>
                <p className="text-gray-700 text-sm">{t('inst1Text')}</p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-900">{t('inst2Title')}</p>
                <p className="text-gray-700 text-sm">{t('inst2Text')}</p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </span>
              <div>
                <p className="font-semibold text-gray-900">{t('inst3Title')}</p>
                <p className="text-gray-700 text-sm">{t('inst3Text')}</p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </span>
              <div>
                <p className="font-semibold text-gray-900">{t('inst4Title')}</p>
                <p className="text-gray-700 text-sm">{t('inst4Text')}</p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                5
              </span>
              <div>
                <p className="font-semibold text-gray-900">{t('inst5Title')}</p>
                <p className="text-gray-700 text-sm">{t('inst5Text')}</p>
              </div>
            </li>
          </ol>

          {/* Pro Tip */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              {/* 🚀 Pro Tip */}
              <strong className="text-blue-600">{t('proTipStrong')}</strong>
              {t('proTipText')}
            </p>
          </div>
        </div>

        {/* 🚀 Additional Services Subtitle */}
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {t('additionalServicesSubtitle')}
        </h3>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              {t('serviceMaintenanceTitle')}
            </h4>
            <p className="text-gray-700">{t('serviceMaintenanceText')}</p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span>
              {t('serviceEngravingTitle')}
            </h4>
            <p className="text-gray-700">{t('serviceEngravingText')}</p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span>
              {t('serviceWorkshopsTitle')}
            </h4>
            <p className="text-gray-700">{t('serviceWorkshopsText')}</p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span>
              {t('serviceBulkOrdersTitle')}
            </h4>
            <p className="text-gray-700">{t('serviceBulkOrdersText')}</p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Upcoming Events --- */}
      <section id="upcoming-events" className="mb-16 scroll-mt-24">
        {/* 🚀 Events Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('eventsTitle')}
        </h2>

        {/* 🚀 Events Text */}
        <p className="text-gray-700 mb-6 text-lg">{t('eventsText')}</p>

        <div className="space-y-6">
          {/* Event 1 */}
          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('expoTitle')}
                </h3>
                <p className="text-gray-600 mt-1">{t('expoLocation')}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">{t('expoDesc')}</p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">{t('expoDate')}</span>
              <span className="text-gray-500">{t('expoVenue')}</span>
            </div>
          </div>

          {/* Event 2 */}
          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('factoryTourTitle')}
                </h3>
                <p className="text-gray-600 mt-1">{t('factoryTourLocation')}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">{t('factoryTourDesc')}</p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">
                {t('factoryTourDate')}
              </span>
              <span className="text-gray-500">{t('factoryTourVenue')}</span>
            </div>
          </div>

          {/* Event 3 */}
          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('artistWorkshopTitle')}
                </h3>
                <p className="text-gray-600 mt-1">
                  {t('artistWorkshopLocation')}
                </p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">{t('artistWorkshopDesc')}</p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">
                {t('artistWorkshopDate')}
              </span>
              <span className="text-gray-500">{t('artistWorkshopVenue')}</span>
            </div>
          </div>

          {/* Event 4 */}
          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('newProductTitle')}
                </h3>
                <p className="text-gray-600 mt-1">{t('newProductLocation')}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">{t('newProductDesc')}</p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">
                {t('newProductDate')}
              </span>
              {/* newProductVenue було пропущено в перекладі, тому залишаємо порожнім або додаємо t('newProductVenue') */}
              <span className="text-gray-500"></span>
            </div>
          </div>
        </div>

        {/* Subscribe Block */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-3">
            {t('stayUpdatedTitle')}
          </h3>
          <p className="text-gray-700 mb-4">{t('stayUpdatedText')}</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t('subscribeButton')}
          </button>
        </div>
      </section>
    </div>
  );
}
