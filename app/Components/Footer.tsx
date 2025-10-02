'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Youtube, Moon, Sun, Monitor } from 'lucide-react';
import { InstagramIcon, TelegramIcon, YouTubeIcon } from './icons/SocialIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translation/translations';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-18">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* Основний контент футера */}
        <div className="flex flex-wrap justify-between text-base">
          {/* Логотип */}
          <div className="w-full md:w-auto mb-6 mt-5 md:mb-0">
            <h2 className="text-2xl font-bold">MadEdge</h2>
          </div>

          {/* Головна */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {t.footerHome}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerOurProducts}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerInformation}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerComparison}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerAssembly}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerReviews}
                </a>
              </li>
            </ul>
          </div>

          {/* Магазин */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {t.footerShop}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerKnifeSharpeners}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerWhetstones}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerAccessories}
                </a>
              </li>
            </ul>
          </div>

          {/* Про нас */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {t.footerAboutUs}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerOurBackground}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerOurValues}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerManufacturing}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerMadEdgeServices}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerUpcomingEvents}
                </a>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {t.footerContacts}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerWriteUs}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {t.footerSocialNetworks}
                </a>
              </li>
            </ul>
          </div>

          {/* Підписка на розсилку */}
          <div className="w-full md:w-80 md:mt-0">
            <h3 className="font-medium mb-3 mt-6 text-gray-900 dark:text-white text-base">
              {t.footerNewsletterTitle}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {t.footerNewsletterDesc}
            </p>

            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="ft-email" className="sr-only">
                {t.footerEmailLabel}
              </label>
              <input
                id="ft-email"
                type="email"
                placeholder="you@domain.com"
                className="w-full pl-4 pr-24 py-3 text-sm rounded-md bg-gray-100 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 text-sm bg-white border dark:bg-black text-gray-600 dark:text-white rounded hover:opacity-90 cursor-pointer transition-opacity"
              >
                {t.footerSubscribeButton}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Авторські права + перемикач теми */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} MadEdge, Inc.
              </div>

              {/* Соцмережі */}
              <div className="flex items-center space-x-3 mt-4">
                <a
                  href="#"
                  aria-label="Telegram"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <TelegramIcon className="h-4 w-4 mb-5 ml-1" />
                </a>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mb-5"></div>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <YouTubeIcon className="h-4 w-4 mb-5 ml-1" />
                </a>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mb-5"></div>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <InstagramIcon className="h-4 w-4 mb-5 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Кнопки теми */}
          <div className="flex items-center border rounded-full mt-4 sm:mt-0 ">
            <button
              aria-label={t.themeLight}
              onClick={() => setTheme('light')}
              className={`p-3 rounded-full transition-colors ${
                theme === 'light'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Sun className="h-4 w-4" />
            </button>

            <button
              aria-label={t.themeSystem}
              onClick={() => setTheme('system')}
              className={`p-3 rounded-full transition-colors ${
                theme === 'system'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>

            <button
              aria-label={t.themeDark}
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
