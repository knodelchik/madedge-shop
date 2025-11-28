'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 1. Імпортуємо Image
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
        spaceBetween={0} // Краще 0 для слайдера на весь екран
        slidesPerView={1}
        className="w-full h-full" // h-full замість фіксованого h-[60vh]
      >
        {slides.map((slide, index) => {
          const titleKey = `title${slide.translationKey}` as const;
          const descKey = `desc${slide.translationKey}` as const;

          const title = t(titleKey);
          const desc = t(descKey);

          return (
            <SwiperSlide key={index} className="relative w-full h-full">
               {/* 2. Використовуємо Next.js Image замість background-image */}
               {/* Це дозволить браузеру завантажити оптимізовану, легку версію картинки */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.img}
                  alt={title}
                  fill
                  className="object-cover"
                  // 3. Пріоритет для першого слайду (КРИТИЧНО для LCP)
                  priority={index === 0}
                  // 4. Sizes допомагає браузеру вибрати правильний розмір
                  sizes="100vw"
                  // placeholder="blur" // Можна додати, якщо згенеруєте blurDataURL
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gray-900/10 dark:bg-black/30 md:bg-gray-900/10 md:dark:bg-black/30 z-10" />
              </div>

              {/* Контент поверх картинки */}
              <div className="relative z-20 w-full h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }} // Змінив на whileInView для лінивої анімації наступних слайдів
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="
                    text-center mx-4
                    bg-gray-100/75 dark:bg-neutral-900/65
                    backdrop-blur-[2px] md:backdrop-blur-md
                    p-4 sm:p-6 md:p-8
                    rounded-xl sm:rounded-2xl
                    shadow-lg
                    max-w-xl flex flex-col items-center justify-center
                    border border-gray-200/40 dark:border-neutral-700/40
                  "
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black/90 dark:text-white">
                    {title}
                  </h1>

                  <p className="text-black/80 dark:text-neutral-300/70 text-sm sm:text-base md:text-lg mb-4 text-center max-w-md">
                    {desc}
                  </p>

                  <Link
                    href={`/shop?category=${slide.category}`}
                    className="
                      px-5 py-2
                      rounded-full font-semibold transition
                      bg-gray-200/50 dark:bg-neutral-800
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