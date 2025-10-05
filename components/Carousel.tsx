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
      <div 
        className={`overflow-hidden p-4 ${
          round ? 'rounded-full border border-white' : 'rounded-[24px] border-[#222]'
        }`}
      >
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {items.map((item) => (
              <div
                key={item.id}
                className="embla__slide flex-shrink-0 flex-grow-0 min-w-0 pl-4 first:pl-0"
              >
                <div
                  className={`relative flex flex-col ${
                    round
                      ? 'items-center justify-center text-center bg-[#060010] border-0 w-64 h-64'
                      : 'items-start justify-between bg-[#222] shadow-lg w-60 h-auto'
                  } overflow-hidden cursor-pointer rounded-xl`}
                  onClick={() => {
                    if (!isDragging) {
                      window.location.href = `/shop/${item.title.replace(/\s+/g, '-').toLowerCase()}`;
                    }
                  }}
                >
                  <div className="w-full h-48 overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
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

        {/* Індикатори */}
        <div className={`flex w-full justify-center ${
          round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''
        }`}>
          <div className="mt-4 flex justify-center gap-3">
            {items.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-150 ${
                  selectedIndex === index
                    ? round
                      ? 'bg-white scale-125'
                      : 'bg-[#333333] scale-125'
                    : round
                    ? 'bg-[#555]'
                    : 'bg-[rgba(51,51,51,0.4)]'
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