'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, Factory, Target, Info, Scissors } from 'lucide-react';
import {
  CryingIcon,
  SadIcon,
  HappyIcon,
  StarEyesIcon,
} from '../Components/icons/SocialIcons';
import { motion } from 'framer-motion';

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
      icon: <Scissors className="w-5 h-5" />,
      id: 'sharpeners',
      href: '/about/sharpeners',
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
  };

  const currentSections = pageSections[pathname] || [];

  const handleSubmit = () => {
    console.log('Feedback:', { rating: selectedRating, feedback });
    setFeedback('');
    setSelectedRating(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar left */}
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
                <span className="flex items-center gap-2 font-semibold">
                  {menu.icon}
                  {menu.title}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-black" />
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-12 py-20" style={{ paddingBottom: '200px' }}>
          {children}
        </main>

        {/* Sidebar right */}
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

      {/* Навігація Previous/Next */}
      <div className="border-t border-gray-200 py-6 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link
            href="/about/contribution-guide"
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
              <div className="font-semibold">Contribution Guide</div>
            </div>
          </Link>

          <Link
            href="/about/sharpeners"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500">Next</div>
              <div className="font-semibold">Sharpeners</div>
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
        </div>
      </div>

      {/* Форма відгуку */}
      <div className="border-gray-200 px-2 pb-12">
        <div className="flex justify-center">
          <motion.div
            className="bg-white border border-gray-200 shadow-sm"
            animate={{
              borderRadius: selectedRating !== null ? '0.5rem' : '3rem',
              paddingTop: selectedRating !== null ? '2rem' : '1rem',
              paddingBottom: selectedRating !== null ? '2rem' : '1rem',
              paddingLeft: selectedRating !== null ? '2rem' : '2rem',
              paddingRight: selectedRating !== null ? '2rem' : '2rem',
              width: selectedRating !== null ? '42rem' : 'auto',
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Смайлики */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Was this helpful?
              </span>

              <button
                onClick={() => setSelectedRating(1)}
                className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                  selectedRating === 1
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-blue-500'
                }`}
              >
                <CryingIcon className="h-7 w-7" />
              </button>

              <button
                onClick={() => setSelectedRating(2)}
                className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                  selectedRating === 2
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-400 hover:text-orange-500'
                }`}
              >
                <SadIcon className="h-7 w-7" />
              </button>

              <button
                onClick={() => setSelectedRating(3)}
                className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                  selectedRating === 3
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <HappyIcon className="h-7 w-7" />
              </button>

              <button
                onClick={() => setSelectedRating(4)}
                className={`rounded-full transition flex-shrink-0 cursor-pointer ${
                  selectedRating === 4
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-400 hover:text-green-500'
                }`}
              >
                <StarEyesIcon className="h-7 w-7" />
              </button>
            </div>

            {/* Поле фідбеку */}
            {selectedRating !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={5}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
