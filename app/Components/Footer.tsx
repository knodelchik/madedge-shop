'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InstagramIcon, TelegramIcon, YouTubeIcon } from './icons/SocialIcons';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Отримання перекладів через next-intl
  const tFooter = useTranslations('Footer');
  const tInfo = useTranslations('Info');
  const tContacts = useTranslations('Contacts');
  const tTheme = useTranslations('Theme');

  useEffect(() => setMounted(true), []);

  // Рендеринг лише після монтування для коректної роботи теми
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
              {tFooter('footerHome')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerOurProducts')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tInfo('infoTitle')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerComparison')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAssembly')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerReviews')}
                </a>
              </li>
            </ul>
          </div>

          {/* Магазин */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerShop')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerKnifeSharpeners')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerWhetstones')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAccessories')}
                </a>
              </li>
            </ul>
          </div>

          {/* Про нас */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerAboutUs')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerOurBackground')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerManufacturing')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerSharperensKnowledge')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerStonesKnowledge')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAccessoriessKnowledge')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerDeliveryCostCalculator')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerDeliveryPolicy')}
                </a>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerContacts')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerWriteUs')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerSocialNetworks')}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-80 md:mt-0">
            <h3 className="font-medium mb-3 mt-6 text-gray-900 dark:text-white text-base">
              {tFooter('footerNewsletterTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              {tFooter('footerNewsletterDesc')}
            </p>

            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="ft-email" className="sr-only">
                {tFooter('footerEmailLabel')}
              </label>
              <input
                id="ft-email"
                type="email"
                placeholder={tContacts('formEmailPlaceholder')}
                className="w-full pl-4 pr-24 py-3 text-sm rounded-md bg-gray-100 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 text-sm bg-white border dark:bg-black text-gray-600 dark:text-white rounded hover:opacity-90 cursor-pointer transition-opacity"
              >
                {tFooter('footerSubscribeButton')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright + Theme controls */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} MadEdge, Inc.
              </div>

              {/* Social links with dividers */}
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

          {/* Theme controls */}
          <div className="flex items-center border rounded-full mt-4 sm:mt-0">
            <button
              aria-label={tTheme('themeLight')}
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
              aria-label={tTheme('themeSystem')}
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
              aria-label={tTheme('themeDark')}
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
