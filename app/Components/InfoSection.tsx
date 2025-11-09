'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb, Info, Plane, Headphones } from 'lucide-react';
import Link from 'next/link'; // 1. Додано імпорт

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  isWhite?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  delay = 0,
  isWhite = false,
  ...props
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const baseBg = isWhite
    ? 'bg-white dark:bg-gray-200'
    : 'bg-black dark:bg-[#111111]';
  const baseText = isWhite
    ? 'text-gray-800 dark:text-white'
    : 'text-white dark:text-white';
  const border = 'border border-gray-800 dark:border-neutral-600';
  const hoverBorder = 'hover:border-gray-600 dark:border-neutral-700';

  return (
    <div
      className={`relative group cursor-context-menu overflow-hidden ${baseBg} ${border} ${hoverBorder} rounded-xl transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Світлова пляма при наведенні */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-[35px]"
        style={{
          background: isHovered
            ? `radial-gradient(280px circle at ${mousePosition.x}px ${
                mousePosition.y
              }px, ${
                isWhite
                  ? // Для білих карток — легка тінь
                    'rgba(0,0,0,0.18)'
                  : // Для темних — "об’ємне" світіння з теплим відтінком
                    'rgba(255,255,255,0.18)'
              }, ${
                isWhite ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'
              } 50%, transparent 90%)`
            : 'none',
        }}
      />

      <div className="relative z-10 text-center p-8">{children}</div>
    </div>
  );
};

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSpecial?: boolean;
  href: string; // 2. Додано поле href
};

const InfoSection = () => {
  const t = useTranslations('Info');

  const features: Feature[] = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t('refundPolicyTitle'),
      description: t('refundPolicyText'),

      href: '/about/delivery#returns-warranty',
    },
    {
      icon: <Info className="w-8 h-8" />,
      title: t('buyerProtectionTitle'),
      description: t('buyerProtectionText'),

      href: '/about/delivery#returns-warranty',
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: t('shippingTitle'),
      description: t('shippingText'),

      href: '/about/delivery#policy',
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: t('needHelpTitle'),
      description: t('needHelpText'),
      isSpecial: true,

      href: '/contact',
    },
  ];

  return (
    <section
      id="info-section"
      className="w-full bg-white dark:bg-black py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('infoTitle')}{' '}
            <span className="text-gray-600 dark:text-[#888888] font-normal lg:text-2xl">
              {t('sectionWhatIs')}
            </span>
          </h1>
        </div>

        {/* Картки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            // 3. Кожна картка огорнута в Link,
            //    key перенесено на Link як на батьківський елемент
            <Link href={feature.href} key={idx}>
              <SpotlightCard
                delay={idx * 100}
                isWhite={feature.isSpecial}
                className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-800/40"
              >
                <div className="flex flex-col items-center justify-start h-full min-h-[320px]">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors duration-300 ${
                      feature.isSpecial
                        ? 'bg-black text-white dark:bg-neutral-800 dark:text-[#fafafa]'
                        : 'bg-white text-black dark:bg-[#fafafa] dark:text-[#111111]'
                    }`}
                  >
                    {feature.icon}
                  </div>

                  <h3
                    className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                      feature.isSpecial
                        ? 'text-black dark:text-black'
                        : 'text-white dark:text-white'
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-base leading-relaxed transition-colors duration-300 flex-grow flex items-center ${
                      feature.isSpecial
                        ? 'text-gray-700 dark:text-gray-700'
                        : 'text-gray-300 dark:text-[#888888]'
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
