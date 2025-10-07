'use client';

import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

export type CarouselItem = {
  id: number;
  title: string;
  description?: string;
  price: string;
  image: string;
};

type CarouselProps = {
  items: CarouselItem[];
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
};

export default function Carousel({
  items = [],
  className = '',
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const autoplayPlugin = autoplay ? Autoplay({ 
    delay: autoplayDelay, 
    stopOnInteraction: false,
    stopOnMouseEnter: pauseOnHover 
  }) : undefined;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop,
      align: 'center',
      skipSnaps: false,
      dragFree: false
    },
    autoplayPlugin ? [autoplayPlugin] : []
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('pointerDown', onDragStart);
    emblaApi.on('pointerUp', onDragEnd);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('pointerDown', onDragStart);
      emblaApi.off('pointerUp', onDragEnd);
    };
  }, [emblaApi, onSelect, onDragStart, onDragEnd]);

  return (
    <div className={`relative ${className}`}>
      {/* Основний контейнер - трохи більший за слайд */}
      <div 
        className={`overflow-hidden mx-auto ${
          round 
            ? 'w-[330px] h-[380px]' // +20px для точок
            : 'w-[330px] h-[380px]' // +20px для точок
        }`}
      >
        <div 
          className="embla overflow-hidden h-full"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full">
            {items.map((item) => (
              <div
                key={item.id}
                className="embla__slide flex-shrink-0 flex-grow-0 w-full h-full mx-2"
                style={{ 
                  flex: '0 0 calc(100% - 22px)' // 100% мінус відступи
                }}
              >
                <div
                  className={`relative flex flex-col w-full h-full ${
                    round
                      ? 'items-center justify-center text-center bg-[#060010] rounded-full shadow-lg'
                      : 'items-start justify-between bg-[#222] shadow-lg rounded-[20px]'
                  } overflow-hidden cursor-pointer`}
                  onClick={() => {
                    if (!isDragging) {
                      window.location.href = `/shop/${item.title.replace(/\s+/g, '-').toLowerCase()}`;
                    }
                  }}
                >
                  <div className={`w-full overflow-hidden relative ${
                    round ? 'h-48 mt-8' : 'h-48'
                  }`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className={`flex flex-col gap-2 flex-1 ${
                    round ? 'p-6 text-center' : 'p-5'
                  }`}>
                    <div className="font-bold text-lg text-white line-clamp-2">
                      {item.title}
                    </div>
                    <div className="text-md font-semibold text-gray-300">
                      {item.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Точки навігації - прості і видно */}
        <div className={`flex w-full justify-center ${
          round ? 'absolute bottom-12 left-1/2 -translate-x-1/2' : 'absolute bottom-8 left-1/2 -translate-x-1/2'
        }`}>
          <div className="flex justify-center gap-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-3 border border-white/10">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
                  selectedIndex === index
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}