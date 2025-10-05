'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
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
        <div className="flex flex-wrap justify-between text-base">
          {/* Логотип */}
          <div className="w-full md:w-auto mb-6 mt-5 md:mb-0">
            <h2 className="text-2xl font-bold">MadEdge</h2>
          </div>

          {/* Головна */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white">{t.footerHome}</h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerOurProducts}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerInformation}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerComparison}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerAssembly}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerReviews}</a></li>
            </ul>
          </div>

          {/* Магазин */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white">{t.footerShop}</h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerKnifeSharpeners}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerWhetstones}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerAccessories}</a></li>
            </ul>
          </div>

          {/* Про нас */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white">{t.footerAboutUs}</h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerOurBackground}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerOurValues}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerManufacturing}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerMadEdgeServices}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerUpcomingEvents}</a></li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white">{t.footerContacts}</h3>
            <ul className="space-y-3 text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerWriteUs}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">{t.footerSocialNetworks}</a></li>
            </ul>
          </div>

          {/* Підписка */}
          <div className="w-full md:w-80 md:mt-0">
            <h3 className="font-medium mb-3 mt-6 text-gray-900 dark:text-white">{t.footerNewsletterTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t.footerNewsletterDesc}</p>

            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                id="ft-email"
                type="email"
                placeholder="you@domain.com"
                className="w-full pl-4 pr-24 py-3 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 text-sm bg-white dark:bg-black border text-gray-600 dark:text-white rounded hover:opacity-90 transition-opacity"
              >
                {t.footerSubscribeButton}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Авторські права + Тема */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} MadEdge, Inc.
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <a href="#" aria-label="Telegram"><TelegramIcon className="h-5 w-5" /></a>
          <a href="#" aria-label="YouTube"><YouTubeIcon className="h-5 w-5" /></a>
          <a href="#" aria-label="Instagram"><InstagramIcon className="h-5 w-5" /></a>
        </div>

        <div className="flex items-center border rounded-full mt-4 sm:mt-0">
          <button onClick={() => setTheme('light')} className="p-3"><Sun className="h-4 w-4" /></button>
          <button onClick={() => setTheme('system')} className="p-3"><Monitor className="h-4 w-4" /></button>
          <button onClick={() => setTheme('dark')} className="p-3"><Moon className="h-4 w-4" /></button>
        </div>
      </div>
    </footer>
  );
}
