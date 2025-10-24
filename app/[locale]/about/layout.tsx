'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Factory,
  Target,
  Info,
  Tangent,
  Gem,
  Blocks,
  Truck,
} from 'lucide-react';
import {
  CryingIcon,
  SadIcon,
  HappyIcon,
  StarEyesIcon,
} from '../../Components/icons/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

// ... (Інтерфейси MenuItem та SectionMap залишаються без змін)

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  id: string;
  href: string;
}

interface SectionMap {
  [key: string]: { title: string; id: string }[];
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const menuData: MenuItem[] = [
    {
      title: 'About us',
      icon: <Info className="w-5 h-5" />,
      id: 'about-us',
      href: '/about',
    },
    {
      title: 'Sharpeners',
      icon: <Tangent className="w-5 h-5" />,
      id: 'sharpeners',
      href: '/about/sharpeners',
    },
    {
      title: 'Grinding Stones',
      icon: <Gem className="w-5 h-5" />,
      id: 'grindingstones',
      href: '/about/grindingstones',
    },

    {
      title: 'Accessories',
      icon: <Blocks className="w-5 h-5" />,
      id: 'accessories',
      href: '/about/accessories',
    },
    {
      title: 'Delivery',
      icon: <Truck className="w-5 h-5" />,
      id: 'delivery',
      href: '/about/delivery',
    },
  ];

  const pageSections: SectionMap = {
    '/about': [
      { title: 'Our Background', id: 'our-background' },
      { title: 'Our Values', id: 'our-values' },
      { title: 'Manufacturing', id: 'manufacturing' },
      { title: 'MadEdge Services', id: 'madedge-services' },
      { title: 'Upcoming Events', id: 'upcoming-events' },
    ],
    '/about/sharpeners': [
      { title: 'MadEdge Model 1', id: 'model-1' },
      { title: 'Digital Angle Measurement', id: 'digital-angle' },
      { title: 'MadEdge Model 2', id: 'model-2' },
      { title: 'MadEdge for Convex Blades', id: 'convex' },
    ],
    '/about/grindingstones': [
      { title: 'Diamond Stones', id: 'professional-stone' },
      { title: 'Aluminum Oxide Stones', id: 'premium-stone' },
      { title: 'Stone Comparison', id: 'comparison' },
      { title: 'How to Use', id: 'usage-guide' },
      { title: 'Care & Maintenance', id: 'care-instructions' },
    ],

    '/about/accessories': [
      { title: 'Rotary Mechanism', id: 'rotary-mechanism' },
      { title: 'Table Mount', id: 'table-mount' },
      { title: 'Hinge with Rest Hook', id: 'hinge-rest-hook' },
      { title: 'Clamp for Full Flat', id: 'clamp-full-flat' },
      { title: 'Adapter for Chisels', id: 'adapter-flat-chisels' },
      { title: 'Adapter for Clamps', id: 'adapter-for-clamps' },
      { title: 'Hinge for Convex', id: 'hinge-convex' },
      { title: 'Fine-Tuning Adapter', id: 'fine-turning-adapter' },
    ],
    '/about/delivery': [
      { title: 'Delivery Policy', id: 'policy' },
      { title: 'Cost Calculator', id: 'calculator' },
      { title: 'Returns, Exchanges, and Warranty', id: 'returns-warranty' },
    ],
  };

  const currentSections = pageSections[pathname] || [];

  // Динамічна навігація між сторінками
  const navigationPages = [
    { href: '/about/contribution-guide', title: 'Contribution Guide' }, // Index 0
    { href: '/about', title: 'About Us' }, // Index 1 <-- Loop Start
    { href: '/about/sharpeners', title: 'Sharpeners' },
    { href: '/about/grindingstones', title: 'Grinding Stones' },
    { href: '/about/accessories', title: 'Accessories' },
    { href: '/about/delivery', title: 'Delivery' }, // Index 5 <-- Loop End
  ];

  const currentPageIndex = navigationPages.findIndex(
    (page) => page.href === pathname
  );

  // --- ЛОГІКА ЦИКЛІЧНОЇ НАВІГАЦІЇ ---
  const loopStartIndex = 1; // '/about'
  const loopEndIndex = navigationPages.length - 1; // '/about/delivery'

  let previousPage = null;
  let nextPage = null;

  // Визначення PREVIOUS page
  if (currentPageIndex === loopStartIndex) {
    // На About Us (1), попередня - Delivery (5)
    previousPage = navigationPages[loopEndIndex];
  } else if (currentPageIndex > loopStartIndex) {
    // Для сторінок 2, 3, 4, 5 - звичайна попередня сторінка
    previousPage = navigationPages[currentPageIndex - 1];
  } else if (currentPageIndex === 0) {
    // На Contribution Guide (0) - попередня відсутня
    previousPage = null;
  }

  // Визначення NEXT page
  if (currentPageIndex === loopEndIndex) {
    // На Delivery (5), наступна - About Us (1)
    nextPage = navigationPages[loopStartIndex];
  } else if (currentPageIndex < loopEndIndex) {
    // Для сторінок 0, 1, 2, 3, 4 - звичайна наступна сторінка
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

  return (
    <div className="min-h-screen bg-white flex flex-col ">
      <div className="flex flex-1">
        {/* Sidebar left (БЕЗ ЗМІН) */}
        <aside className="w-64 border-gray-200 p-6 sticky top-[80px] self-start h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 p-3 rounded-lg mb-4">
              <Factory className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  MadEdge
                </div>
                <div className="text-xs text-gray-600">Premium Sharpeners</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3  rounded-lg">
              <Target className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  Latest Product
                </div>
                <div className="text-xs text-gray-600">ProEdge X1</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuData.map((menu) => (
              <Link
                key={menu.id}
                href={menu.href}
                className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
                  pathname === menu.href
                    ? ' text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
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

        {/* Main Content (БЕЗ ЗМІН) */}
        <main className="flex-1 px-12 py-20">{children}</main>

        {/* Sidebar right (БЕЗ ЗМІН) */}
        <aside className="w-64 p-6 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto hidden xl:block self-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            On this page
          </h3>
          <nav className="space-y-2">
            {currentSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-gray-600 hover:text-blue-600"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      {/* Навігація Previous/Next (ВИКОРИСТАННЯ НОВОЇ ЛОГІКИ) */}
      <div className="border-t border-gray-200 py-6 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {previousPage ? (
            <Link
              href={previousPage.href}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <svg
                className="w-5 h-5"
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
                <div className="text-sm text-gray-500">Previous</div>
                <div className="font-semibold">{previousPage.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPage ? (
            <Link
              href={nextPage.href}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <div className="text-right">
                <div className="text-sm text-gray-500">Next</div>
                <div className="font-semibold">{nextPage.title}</div>
              </div>
              <svg
                className="w-5 h-5"
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
            <div />
          )}
        </div>
      </div>

      {/* Форма відгуку (ОПТИМІЗОВАНО ВІДСТУПИ ТА АНІМАЦІЯ) */}
      <div className="border-gray-200 px-2 py-2">
        <div className="flex justify-center">
          <motion.div
            layout
            className="bg-white border border-gray-200 shadow-sm"
            // Змінено: Використовуємо фіксовану ширину для відкритого стану, динаміку для закритого
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
              {' '}
              {/* Фіксований padding для смайликів */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Was this helpful?
                </span>

                <button
                  onClick={() => handleRatingClick(1)}
                  className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                    selectedRating === 1
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-blue-500'
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

            {/* Поле фідбеку - використовуємо AnimatePresence */}
            <AnimatePresence>
              {selectedRating !== null && (
                <motion.div
                  key="feedback-form"
                  // Використовуємо max-height та анімуємо padding для плавного згортання
                  initial={{ opacity: 0, maxHeight: 0, padding: 0 }}
                  animate={{
                    opacity: 1,
                    maxHeight: '300px',
                    padding: '1rem 2rem 1.5rem', // Відступи, коли форма відкрита
                  }}
                  exit={{ opacity: 0, maxHeight: 0, padding: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your feedback..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-400">
                      <span className="font-mono">M↓</span> supported
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      Send
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
