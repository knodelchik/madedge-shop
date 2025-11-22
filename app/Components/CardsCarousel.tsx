'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { JSX } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Slide {
  translationKey: 'GrindingStones' | 'Sharpeners' | 'Accessories';
  img: string;
  category: 'sharpeners' | 'stones' | 'accessories';
}

const slides: Slide[] = [
  {
    translationKey: 'GrindingStones',
    img: '/images/grindingstones.jpg',
    category: 'stones',
  },
  {
    translationKey: 'Sharpeners',
    img: '/images/sharpeners.jpg',
    category: 'sharpeners',
  },
  {
    translationKey: 'Accessories',
    img: '/images/accseroies.jpg',
    category: 'accessories',
  },
];

export default function CardCarousel(): JSX.Element {
  const t = useTranslations('CardCarousel');

  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        loop
        spaceBetween={40}
        slidesPerView={1}
        className="w-full h-[60vh] flex items-center justify-center"
      >
        {slides.map((slide, index) => {
          const titleKey = `title${slide.translationKey}` as const;
          const descKey = `desc${slide.translationKey}` as const;

          const title = t(titleKey);
          const desc = t(descKey);

          return (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[60vh] flex items-center justify-center"
                style={{
                  backgroundImage: `url(${slide.img})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                {/* Adaptive overlay - lighter on mobile */}
                <div className="absolute inset-0 bg-gray-900/10 dark:bg-black/30 md:bg-gray-900/10 md:dark:bg-black/30" />

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="
                    relative z-10 text-center 
                    mx-4
                    
                    bg-gray-100/75 dark:bg-neutral-900/65
                    sm:bg-gray-100/70 sm:dark:bg-neutral-900/60
                    md:bg-gray-100/60 md:dark:bg-neutral-900/50
                    
                    backdrop-blur-[2px]
                    sm:backdrop-blur-[4px]
                    md:backdrop-blur-md
                    
                    p-4 sm:p-6 md:p-8
                    rounded-xl sm:rounded-2xl md:rounded-2xl
                    
                    shadow-[0_4px_30px_-4px_rgba(0,0,0,0.4)] 
                    max-w-xl flex flex-col items-center justify-center
                    border border-gray-200/40 dark:border-neutral-700/40
                  "
                >
                  <h1
                    className="
                    text-2xl sm:text-3xl md:text-4xl
                    font-bold mb-2 sm:mb-3 md:mb-3
                    tracking-tight text-black/90 dark:text-white
                  "
                  >
                    {title}
                  </h1>

                  <p
                    className="
                    text-black/80 dark:text-neutral-300/70 
                    text-sm sm:text-base md:text-lg
                    mb-3 sm:mb-4 md:mb-4
                    text-center max-w-md
                    px-2 sm:px-0
                  "
                  >
                    {desc}
                  </p>

                  <Link
                    href={`/shop?category=${slide.category}`}
                    className="
                      px-4 sm:px-5 md:px-5
                      py-1.5 sm:py-2 md:py-2
                      text-sm sm:text-base md:text-base
                      rounded-full font-semibold transition
                      bg-gray-200/50 dark:bg-neutral-800
                      sm:bg-gray-200/40 sm:dark:bg-neutral-800
                      md:bg-gray-200/40 md:dark:bg-neutral-800
                      text-black dark:text-white
                      border border-gray-400/10 
                      hover:bg-gray-300/60 dark:hover:bg-neutral-700
                      active:scale-95
                    "
                  >
                    {t('viewCategory', { title: title })}
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
