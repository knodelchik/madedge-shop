'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Factory,
  Target,
  Info,
  Tangent,
  Gem,
  Blocks,
  Truck,
  Menu,
  X,
} from 'lucide-react';
import {
  CryingIcon,
  SadIcon,
  HappyIcon,
  StarEyesIcon,
} from '../../Components/icons/SocialIcons';
import { motion, AnimatePresence } from 'motion/react';

// --- Інтерфейси ---
interface MenuItem {
  title: string;
  icon: React.ReactNode;
  id: string;
  href: string;
}

interface SectionMap {
  [key: string]: { title: string; id: string }[];
}
// --- Кінець Інтерфейсів ---

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // Для підсвічування секцій
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observedRef = useRef<Record<string, IntersectionObserverEntry | null>>(
    {}
  );

  // 1. ВИПРАВЛЕННЯ: Видаляємо префікс локалі для коректної роботи навігації
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '');

  // 2. Ініціалізація перекладів
  const t = useTranslations('AboutLayout');

  // 3. Локалізація menuData
  const menuData: MenuItem[] = [
    {
      title: t('menu.aboutUs'),
      icon: <Info className="w-5 h-5" />,
      id: 'about-us',
      href: '/about',
    },
    {
      title: t('menu.sharpeners'),
      icon: <Tangent className="w-5 h-5" />,
      id: 'sharpeners',
      href: '/about/sharpeners',
    },
    {
      title: t('menu.grindingStones'),
      icon: <Gem className="w-5 h-5" />,
      id: 'grindingstones',
      href: '/about/grindingstones',
    },
    {
      title: t('menu.accessories'),
      icon: <Blocks className="w-5 h-5" />,
      id: 'accessories',
      href: '/about/accessories',
    },
    {
      title: t('menu.delivery'),
      icon: <Truck className="w-5 h-5" />,
      id: 'delivery',
      href: '/about/delivery',
    },
  ];

  // 4. Локалізація pageSections
  const pageSections: SectionMap = {
    '/about': [
      { title: t('sections.background'), id: 'our-background' },
      { title: t('sections.values'), id: 'our-values' },
      { title: t('sections.manufacturing'), id: 'manufacturing' },
      { title: t('sections.services'), id: 'madedge-services' },
      { title: t('sections.events'), id: 'upcoming-events' },
    ],
    '/about/sharpeners': [
      { title: t('sections.model1'), id: 'model-1' },
      { title: t('sections.digitalAngle'), id: 'digital-angle' },
      { title: t('sections.model2'), id: 'model-2' },
      { title: t('sections.convexBlades'), id: 'convex' },
    ],
    '/about/grindingstones': [
      { title: t('sections.diamondStones'), id: 'professional-stone' },
      { title: t('sections.oxideStones'), id: 'premium-stone' },
      { title: t('sections.stoneComparison'), id: 'comparison' },
      { title: t('sections.stoneUsage'), id: 'usage-guide' },
      { title: t('sections.stoneCare'), id: 'care-instructions' },
    ],

    '/about/accessories': [
      { title: t('sections.rotaryMechanism'), id: 'rotary-mechanism' },
      { title: t('sections.tableMount'), id: 'table-mount' },
      { title: t('sections.hingeRestHook'), id: 'hinge-rest-hook' },
      { title: t('sections.clampFullFlat'), id: 'clamp-full-flat' },
      { title: t('sections.adapterChisels'), id: 'adapter-flat-chisels' },
      { title: t('sections.adapterClamps'), id: 'adapter-for-clamps' },
      { title: t('sections.hingeConvex'), id: 'hinge-convex' },
      { title: t('sections.fineTuning'), id: 'fine-turning-adapter' },
    ],
    '/about/delivery': [
      { title: t('sections.policy'), id: 'policy' },
      { title: t('sections.calculator'), id: 'calculator' },
      { title: t('sections.returnsWarranty'), id: 'returns-warranty' },
    ],
  };

  // Використовуємо cleanPathname для коректного відображення розділів
  const currentSections = pageSections[cleanPathname] || [];

  // 5. Локалізація navigationPages
  const navigationPages = [
    { href: '/about/contribution-guide', title: t('nav.guide') },
    { href: '/about', title: t('nav.aboutUs') },
    { href: '/about/sharpeners', title: t('nav.sharpeners') },
    { href: '/about/grindingstones', title: t('nav.grindingStones') },
    { href: '/about/accessories', title: t('nav.accessories') },
    { href: '/about/delivery', title: t('nav.delivery') },
  ];

  // Використовуємо cleanPathname для пошуку індексу
  const currentPageIndex = navigationPages.findIndex(
    (page) => page.href === cleanPathname
  );

  // --- ЛОГІКА ЦИКЛІЧНОЇ НАВІГАЦІЇ ---
  const loopStartIndex = 1;
  const loopEndIndex = navigationPages.length - 1;

  let previousPage = null;
  let nextPage = null;

  // Визначення PREVIOUS page
  if (currentPageIndex === loopStartIndex) {
    previousPage = navigationPages[loopEndIndex];
  } else if (currentPageIndex > loopStartIndex) {
    previousPage = navigationPages[currentPageIndex - 1];
  } else if (currentPageIndex === 0) {
    previousPage = null;
  }

  // Визначення NEXT page
  if (currentPageIndex === loopEndIndex) {
    nextPage = navigationPages[loopStartIndex];
  } else if (currentPageIndex < loopEndIndex) {
    nextPage = navigationPages[currentPageIndex + 1];
  }
  // --- КІНЕЦЬ ЛОГІКИ ЦИКЛІЧНОЇ НАВІГАЦІЇ ---

  // Логіка перемикання та закриття форми
  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
      setFeedback('');
    } else {
      setSelectedRating(rating);
    }
  };

  const handleSubmit = () => {
    console.log('Feedback:', { rating: selectedRating, feedback });
    setFeedback('');
    setSelectedRating(null);
  };

  // ----- EFFECT: спостерігач за прокруткою для підсвічування розділів -----
  useEffect(() => {
    if (!currentSections || currentSections.length === 0) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0, 0.15, 0.35, 0.6],
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveSection(visible[0].target.id);
        observedRef.current[visible[0].target.id] = visible[0];
      }
    }, options);

    const elements: HTMLElement[] = currentSections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [cleanPathname, JSON.stringify(currentSections)]);

  // Скрол до секції зі зсувом для sticky header
  const handleOnPageLinkClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -72;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col dark:bg-black">
      {/* Мобільна кнопка меню + акордеон (як на скріншоті) */}
      <div className="md:hidden border-b border-gray-200 dark:border-neutral-500 sticky top-[72px] z-30 bg-white dark:bg-neutral-900">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-gray-800 dark:text-white dark:bg-black transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-lg"> {t('sidebar.menu')}</span>
          </div>
          <motion.div
            animate={{ scaleY: isMobileMenuOpen ? -1 : 1 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          >
            <svg
              className="w-5 h-5 mr-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </button>

        {/* Акордеон-вміст */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden "
            >
              <div className="px-4 py-4 space-y-1 bg-white dark:bg-black">
                {/* Копіюємо той самий вміст, що й у десктопному сайдбарі */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg">
                    <Target className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-sm">
                        {t('sidebar.latestProduct')}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-neutral-500">
                        MadEdge for convex
                      </div>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuData.map((menu) => (
                    <Link
                      key={menu.id}
                      href={menu.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                        cleanPathname === menu.href
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {menu.icon}
                      <span className="text-base">{menu.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-1">
        {/* Sidebar left - hidden on mobile, visible on md+ */}
        <aside className="hidden md:block w-64 border-gray-200 p-6 sticky top-[80px] self-start h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 p-3 rounded-lg mb-4">
              <Factory className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-neutral-100">
                  MadEdge
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-500">
                  {t('sidebar.premiumSharpeners')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg">
              <Target className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-neutral-100">
                  {t('sidebar.latestProduct')}
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-500">
                  MadEdge for convex
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuData.map((menu) => (
              <Link
                key={menu.id}
                href={menu.href}
                className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
                  cleanPathname === menu.href
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-900'
                }`}
              >
                <span className="flex items-center gap-2 font-normal">
                  {menu.icon}
                  {menu.title}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content - адаптивні відступи */}
        <main className="flex-1 px-4 md:px-8 xl:px-12 py-8 md:py-12 xl:py-20">
          {children}
        </main>

        {/* Sidebar right - hidden on md, visible on xl+ */}
        <aside className="w-64 p-6 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto hidden xl:block self-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 dark:text-neutral-100">
            {t('sidebar.onThisPage')}
          </h3>

          <nav className="relative">
            <div className="space-y-2">
              {currentSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleOnPageLinkClick(section.id)}
                    className={`relative w-full text-left text-sm px-3 py-1 rounded-md transition-all flex items-center gap-3 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 hover:text-black dark:text-neutral-500 dark:hover:text-neutral-200'
                    }`}
                  >
                    <AnimatePresence>
                      {isActive ? (
                        <motion.span
                          layoutId="onpage-indicator"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="h-6 w-1 rounded-full bg-blue-500 flex-shrink-0"
                        />
                      ) : (
                        <span className="h-6 w-1 flex-shrink-0" aria-hidden />
                      )}
                    </AnimatePresence>

                    <span className="flex-1 overflow-hidden text-ellipsis">
                      {section.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>
      </div>

      {/* Навігація Previous/Next - ВИПРАВЛЕНО */}
      <div className="py-4 md:py-6 px-4 md:px-6 xl:px-12">
        <div className="max-w-4xl mx-auto flex flex-row justify-between items-center gap-4">
          {previousPage ? (
            <Link
              href={previousPage.href}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-neutral-100 dark:hover:text-neutral-400 transition"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {t('nav.previous')}
                </div>
                <div className="font-semibold leading-tight">
                  {previousPage.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-10" /> /* Порожній блок для збереження структури */
          )}

          {nextPage ? (
            <Link
              href={nextPage.href}
              /* Видалено sm:ml-auto, додано ml-auto, щоб завжди притискалося вправо */
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-neutral-100 dark:hover:text-neutral-400 transition ml-auto"
            >
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {t('nav.next')}
                </div>
                <div className="font-semibold leading-tight">
                  {nextPage.title}
                </div>
              </div>
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      {/* Форма відгуку */}
      <div className="border-gray-200 px-2 py-2 mb-10 mt-10">
        <div className="flex justify-center">
          <motion.div
            layout
            className="bg-white border border-gray-200 shadow-sm dark:bg-black dark:border-neutral-800"
            animate={{
              borderRadius: selectedRating !== null ? '0.5rem' : '1.5rem',
              width: selectedRating !== null ? '42rem' : 'auto',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
          >
            {/* Смайлики та початкові відступи */}
            <div className="px-8 py-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-700 font-sm whitespace-nowrap dark:text-neutral-400">
                  {t('feedback.title')} {/* 🚀 Переклад */}
                </span>

                <button
                  onClick={() => handleRatingClick(1)}
                  className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                    selectedRating === 1
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-blue-500 dark:text-neutral-400 dark:hover:text-blue-500'
                  }`}
                >
                  <CryingIcon className="h-7 w-7" />
                </button>

                <button
                  onClick={() => handleRatingClick(2)}
                  className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                    selectedRating === 2
                      ? 'bg-orange-100 text-orange-600'
                      : 'text-gray-400 hover:text-orange-500'
                  }`}
                >
                  <SadIcon className="h-7 w-7" />
                </button>

                <button
                  onClick={() => handleRatingClick(3)}
                  className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                    selectedRating === 3
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <HappyIcon className="h-7 w-7" />
                </button>

                <button
                  onClick={() => handleRatingClick(4)}
                  className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                    selectedRating === 4
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-400 hover:text-green-500'
                  }`}
                >
                  <StarEyesIcon className="h-7 w-7" />
                </button>
              </div>
            </div>

            {/* Поле фідбеку */}
            <AnimatePresence>
              {selectedRating !== null && (
                <motion.div
                  key="feedback-form"
                  initial={{ opacity: 0, maxHeight: 0, padding: 0 }}
                  animate={{
                    opacity: 1,
                    maxHeight: '300px',
                    padding: '1rem 2rem 1.5rem',
                  }}
                  exit={{ opacity: 0, maxHeight: 0, padding: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t('feedback.placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-neutral-400">
                      <span className="font-mono">M↓</span>{' '}
                      {t('feedback.supported')} {/* 🚀 Переклад */}
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 dark:bg-neutral-800 transition cursor-pointer"
                    >
                      {t('feedback.send')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
