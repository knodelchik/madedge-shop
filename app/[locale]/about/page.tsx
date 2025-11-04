'use client';

import React from 'react';
import { Calendar, Wrench, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('title')}
          </h1>
          <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800">
            {t('subtitle')}
          </p>
        </div>

        {/* --- Our Background --- */}
        <section id="our-background" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-100">
            {t('backgroundTitle')}
          </h2>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p
              className="text-gray-700 mb-4 text-lg dark:text-neutral-100"
              dangerouslySetInnerHTML={{ __html: t.raw('backgroundText1') }}
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 dark:text-neutral-200 dark:border-neutral-800 pb-2">
              {t('journeySubtitle')}
            </h3>

            <p
              className="text-gray-700 mb-4 dark:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: t.raw('journeyText') }}
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800">
              {t('milestonesSubtitle')}
            </h3>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100">
                    2010:
                  </span>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('milestone2010')}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100">
                    2013:
                  </span>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('milestone2013')}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100">
                    2017:
                  </span>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('milestone2017')}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100">
                    2021:
                  </span>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('milestone2021')}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-3 dark:text-neutral-100">
                    2024:
                  </span>
                  <span className="text-gray-700 dark:text-neutral-300">
                    {t('milestone2024')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Our Values --- */}
        <section id="our-values" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('valuesTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition dark:bg-[linear-gradient(135deg,rgba(10,25,47,0.6),rgba(8,18,35,0.6))] dark:border-blue-800/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <ChevronRight className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
                {t('valuePrecisionTitle')}
              </h3>
              <p
                className="text-gray-700 dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('valuePrecisionText'),
                }}
              />
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition dark:bg-[linear-gradient(135deg,rgba(6,50,30,0.55),rgba(6,35,22,0.55))] dark:border-green-800/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <ChevronRight className="w-5 h-5 mr-2 text-green-600 dark:text-green-300" />
                {t('valueSustainabilityTitle')}
              </h3>
              <p
                className="text-gray-700 dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('valueSustainabilityText'),
                }}
              />
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition dark:bg-[linear-gradient(135deg,rgba(35,10,43,0.55),rgba(20,8,25,0.55))] dark:border-purple-800/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <ChevronRight className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-300" />
                {t('valueInnovationTitle')}
              </h3>
              <p
                className="text-gray-700 dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('valueInnovationText'),
                }}
              />
            </div>

            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition dark:bg-[linear-gradient(135deg,rgba(60,30,6,0.45),rgba(40,20,4,0.45))] dark:border-orange-800/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <ChevronRight className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-300" />
                {t('valueCustomerFocusTitle')}
              </h3>
              <p
                className="text-gray-700 dark:text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: t.raw('valueCustomerFocusText'),
                }}
              />
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Manufacturing --- */}
        <section id="manufacturing" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('manufacturingTitle')}
          </h2>

          <p
            className="text-gray-700 mb-6 text-lg dark:text-neutral-300"
            dangerouslySetInnerHTML={{ __html: t.raw('manufacturingText') }}
          />

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2 dark:text-neutral-100 dark:border-neutral-800">
            {t('productionProcessSubtitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600">
              <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100">
                {t('step1Title')}
              </h4>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t('step1Text')}
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600">
              <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100">
                {t('step2Title')}
              </h4>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t('step2Text')}
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600">
              <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100">
                {t('step3Title')}
              </h4>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t('step3Text')}
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600">
              <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100">
                {t('step4Title')}
              </h4>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t('step4Text')}
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4 py-2 dark:border-blue-600">
              <h4 className="font-bold text-gray-900 mb-1 dark:text-neutral-100">
                {t('step5Title')}
              </h4>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t('step5Text')}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 pb-2 dark:text-neutral-200 dark:border-neutral-800">
            {t('sustainabilitySubtitle')}
          </h3>
          <p
            className="text-gray-700 mb-4 dark:text-neutral-300"
            dangerouslySetInnerHTML={{ __html: t.raw('sustainabilityText') }}
          />
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- MadEdge Services --- */}
        <section id="madedge-services" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('servicesTitle')}
          </h2>

          <p className="text-gray-700 mb-6 text-lg dark:text-neutral-300">
            {t('servicesText')}
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800">
            {t('howToUseSubtitle')}
          </h3>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl mb-8 border border-blue-200 shadow-lg dark:from-blue-900/30 dark:to-blue-800/20 dark:border-blue-800/40 dark:bg-gradient-to-r">
            <h4 className="font-bold text-gray-900 mb-4 text-xl dark:text-neutral-100">
              {t('instructionsTitle')}
            </h4>

            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-neutral-100">
                    {t('inst1Title')}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-neutral-300">
                    {t('inst1Text')}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-neutral-100">
                    {t('inst2Title')}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-neutral-300">
                    {t('inst2Text')}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-neutral-100">
                    {t('inst3Title')}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-neutral-300">
                    {t('inst3Text')}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-neutral-100">
                    {t('inst4Title')}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-neutral-300">
                    {t('inst4Text')}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  5
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-neutral-100">
                    {t('inst5Title')}
                  </p>
                  <p className="text-gray-700 text-sm dark:text-neutral-300">
                    {t('inst5Text')}
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-white rounded-lg  dark:bg-gray-900 dark:border-blue-800/40">
              <p className="text-sm text-gray-700 dark:text-neutral-300">
                <strong className="text-blue-600 dark:text-blue-400">
                  {t('proTipStrong')}
                </strong>
                {t('proTipText')}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2 dark:text-neutral-200 dark:border-neutral-800">
            {t('additionalServicesSubtitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow dark:border-neutral-800 dark:bg-gray-900">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center dark:text-neutral-100">
                <Wrench className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-300" />
                {t('serviceMaintenanceTitle')}
              </h4>
              <p className="text-gray-700 dark:text-neutral-300">
                {t('serviceMaintenanceText')}
              </p>
            </div>

            <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow dark:border-neutral-800 dark:bg-gray-900">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center dark:text-neutral-100">
                <span className="text-blue-600 mr-2 dark:text-blue-300">◆</span>
                {t('serviceEngravingTitle')}
              </h4>
              <p className="text-gray-700 dark:text-neutral-300">
                {t('serviceEngravingText')}
              </p>
            </div>

            <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow dark:border-neutral-800 dark:bg-gray-900">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center dark:text-neutral-100">
                <span className="text-blue-600 mr-2 dark:text-blue-300">◆</span>
                {t('serviceWorkshopsTitle')}
              </h4>
              <p className="text-gray-700 dark:text-neutral-300">
                {t('serviceWorkshopsText')}
              </p>
            </div>

            <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow dark:border-neutral-800 dark:bg-gray-900">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center dark:text-neutral-100">
                <span className="text-blue-600 mr-2 dark:text-blue-300">◆</span>
                {t('serviceBulkOrdersTitle')}
              </h4>
              <p className="text-gray-700 dark:text-neutral-300">
                {t('serviceBulkOrdersText')}
              </p>
            </div>
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* --- Upcoming Events --- */}
        <section id="upcoming-events" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('eventsTitle')}
          </h2>

          <p className="text-gray-700 mb-6 text-lg dark:text-neutral-300">
            {t('eventsText')}
          </p>

          <div className="space-y-6">
            {/* Event cards */}
            {[
              {
                title: t('expoTitle'),
                location: t('expoLocation'),
                desc: t('expoDesc'),
                date: t('expoDate'),
                venue: t('expoVenue'),
              },
              {
                title: t('factoryTourTitle'),
                location: t('factoryTourLocation'),
                desc: t('factoryTourDesc'),
                date: t('factoryTourDate'),
                venue: t('factoryTourVenue'),
              },
              {
                title: t('artistWorkshopTitle'),
                location: t('artistWorkshopLocation'),
                desc: t('artistWorkshopDesc'),
                date: t('artistWorkshopDate'),
                venue: t('artistWorkshopVenue'),
              },
              {
                title: t('newProductTitle'),
                location: t('newProductLocation'),
                desc: t('newProductDesc'),
                date: t('newProductDate'),
                venue: t('newProductVenue') || '',
              },
            ].map((ev, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 dark:border-neutral-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
                      {ev.title}
                    </h3>
                    <p className="text-gray-600 mt-1 dark:text-neutral-300">
                      {ev.location}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 dark:text-blue-300" />
                </div>
                <p className="text-gray-700 mb-3 dark:text-neutral-300">
                  {ev.desc}
                </p>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100 dark:border-neutral-800">
                  <span className="font-bold text-blue-600 dark:text-blue-300">
                    {ev.date}
                  </span>
                  <span className="text-gray-500 dark:text-neutral-400">
                    {ev.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md dark:bg-neutral-900 dark:border-neutral-900">
            <h3 className="font-bold text-gray-900 mb-3 dark:text-neutral-100">
              {t('stayUpdatedTitle')}
            </h3>
            <p className="text-gray-700 mb-4 dark:text-neutral-300">
              {t('stayUpdatedText')}
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 dark:bg-neutral-600 dark:hover:bg-neutral-700  transition-colors">
              {t('subscribeButton')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
