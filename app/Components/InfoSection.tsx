'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb, Info, Plane, Headphones, ShieldCheck } from 'lucide-react';
import { Link } from '@/navigation';

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
  const border = 'border border-neutral-300 dark:border-neutral-600';
  const hoverBorder = 'hover:border-neutral-400 dark:border-neutral-700';

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
                isWhite ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'
              }, ${
                isWhite ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'
              } 50%, transparent 90%)`
            : 'none',
        }}
      />

      <div className="relative z-10 text-center p-5 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSpecial?: boolean;
  href: string;
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
      icon: <ShieldCheck className="w-8 h-8" />,
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
      className="w-full bg-white dark:bg-black py-12 sm:py-16 md:py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Заголовок */}
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            {t('infoTitle')}{' '}
            <span className="text-gray-600 dark:text-[#888888] font-normal text-lg sm:text-xl md:text-2xl block sm:inline mt-1 sm:mt-0">
              {t('sectionWhatIs')}
            </span>
          </h1>
        </div>

        {/* Картки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <Link href={feature.href} key={idx} className="block">
              <SpotlightCard
                delay={idx * 100}
                isWhite={feature.isSpecial}
                className="transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-800/40 h-full"
              >
                <div className="flex flex-col items-center justify-start h-full min-h-[200px] sm:min-h-[220px] md:min-h-[260px]">
                  <div
                    className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mb-3 sm:mb-4 md:mb-5 transition-colors duration-300 ${
                      feature.isSpecial
                        ? 'bg-black text-white dark:bg-black dark:text-[#fafafa]'
                        : 'bg-white text-black dark:bg-[#fafafa] dark:text-[#111111]'
                    }`}
                  >
                    <div className="scale-90 sm:scale-100">{feature.icon}</div>
                  </div>

                  <h3
                    className={`text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 transition-colors duration-300 px-2 ${
                      feature.isSpecial
                        ? 'text-black dark:text-black'
                        : 'text-white dark:text-white'
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`lg:text-[17px] sm:text-xl md:text-2xl leading-snug sm:leading-relaxed transition-colors duration-300 flex-grow flex items-center px-1 sm:px-2 ${
                      feature.isSpecial
                        ? 'text-gray-700 dark:text-black'
                        : 'text-neutral-300 dark:text-[#888888]'
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
