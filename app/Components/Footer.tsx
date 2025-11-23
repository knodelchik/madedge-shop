'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InstagramIcon, TelegramIcon, YouTubeIcon } from './icons/SocialIcons';
import { Link } from '@/navigation'; // Використовуємо Link з налаштувань навігації

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
    <footer className="border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* Основний контент футера */}
        <div className="flex flex-wrap justify-between text-base">
          {/* Логотип і соціальні мережі (мобільна версія) */}
          <div className="w-full flex justify-between items-start mb-6 mt-5 md:hidden">
            <h2 className="text-2xl font-bold">MadEdge</h2>

            {/* Social links з розділювачами - тільки на мобільних */}
            <div className="flex items-center space-x-3 mt-2">
              <a
                href="#"
                aria-label="Telegram"
                className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
              <div className="w-px h-5 bg-gray-300 dark:bg-neutral-700"></div>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
              >
                <YouTubeIcon className="h-5 w-5" />
              </a>
              <div className="w-px h-5 bg-gray-300 dark:bg-neutral-700"></div>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Логотип (десктопна версія) */}
          <div className="hidden md:block w-full md:w-auto mb-6 mt-5 md:mb-0">
            <h2 className="text-2xl font-bold">MadEdge</h2>
          </div>

          {/* Головна */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base transition-colors duration-300">
              {tFooter('footerHome')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-neutral-400/80 transition-colors duration-300">
              <li>
                <Link
                  href="/#our-products"
                  className="hover:text-neutral-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerOurProducts')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#info-section"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tInfo('infoTitle')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#product-comparison"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerComparison')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#video-section"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAssembly')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#reviews-section"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerReviews')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Магазин */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerShop')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-neutral-400/80 ">
              <li>
                <Link
                  href="/shop?category=sharpeners"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerKnifeSharpeners')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=stones"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerWhetstones')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=accessories"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAccessories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Про нас */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerAboutUs')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-neutral-400/80 ">
              <li>
                <Link
                  href="/about#our-background"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerOurBackground')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about#manufacturing"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerManufacturing')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/sharpeners"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerSharperensKnowledge')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/grindingstones"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerStonesKnowledge')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/accessories"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerAccessoriessKnowledge')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/delivery#calculator"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerDeliveryCostCalculator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about/delivery#returns-warranty"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerDeliveryPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="w-1/2 md:w-auto mb-6 mt-6 md:mb-0">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-white text-base">
              {tFooter('footerContacts')}
            </h3>
            <ul className="space-y-3 text-gray-500 dark:text-neutral-400/80 ">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerWriteUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  {tFooter('footerSocialNetworks')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-80 md:mt-0">
            <h3 className="font-medium mb-3 mt-6 text-gray-900 dark:text-white text-base transition-colors duration-300">
              {tFooter('footerNewsletterTitle')}
            </h3>
            <p className="text-gray-500 dark:text-neutral-400/80  mb-4 text-sm transition-colors duration-300">
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
                className="w-full pl-4 pr-24 py-3 text-sm rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-neutral-400/80 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-neutral-600 transition-colors duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 text-sm bg-white border border-gray-300 dark:bg-neutral-900 dark:border-neutral-700 text-gray-600 dark:text-neutral-400/80 rounded hover:bg-gray-50 dark:hover:bg-black dark:hover:text-white cursor-pointer transition-colors duration-200"
              >
                {tFooter('footerSubscribeButton')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright + Theme controls */}
      <div className="dark:border-neutral-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Мобільна версія - копірайт і тема в один рядок */}
          <div className="flex sm:hidden items-center justify-between">
            <div className="text-gray-500 dark:text-neutral-400/80 text-sm transition-colors duration-300">
              © {new Date().getFullYear()} MadEdge, Inc.
            </div>

            {/* Theme controls - мобільна версія */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full w-fit">
              <button
                aria-label={tTheme('themeLight')}
                onClick={() => setTheme('light')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>

              <button
                aria-label={tTheme('themeSystem')}
                onClick={() => setTheme('system')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'system'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>

              <button
                aria-label={tTheme('themeDark')}
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Десктопна версія */}
          <div className="hidden sm:flex items-start justify-between">
            {/* Копірайт і соціальні мережі */}
            <div className="flex flex-col">
              <div className="text-gray-500 dark:text-neutral-400/80 text-sm transition-colors duration-300">
                © {new Date().getFullYear()} MadEdge, Inc.
              </div>

              {/* Social links */}
              <div className="flex items-center space-x-3 mt-4">
                <a
                  href="#"
                  aria-label="Telegram"
                  className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>
                <div className="w-px h-5 bg-gray-300 dark:bg-neutral-700"></div>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
                >
                  <YouTubeIcon className="h-5 w-5" />
                </a>
                <div className="w-px h-5 bg-gray-300 dark:bg-neutral-700"></div>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-gray-500 hover:text-gray-900 dark:text-neutral-400/80 dark:hover:text-white transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Theme controls - десктопна версія */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-full w-fit">
              <button
                aria-label={tTheme('themeLight')}
                onClick={() => setTheme('light')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>

              <button
                aria-label={tTheme('themeSystem')}
                onClick={() => setTheme('system')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'system'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>

              <button
                aria-label={tTheme('themeDark')}
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-200 dark:bg-neutral-800'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}