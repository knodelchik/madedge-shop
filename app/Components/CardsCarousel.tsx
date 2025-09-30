'use client';

import React from 'react';
import Carousel from '../../components/Carousel';
import { Button } from '@/components/ui/button';
import { products } from '../data/products';
import Link from 'next/link';

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function CardsCarousel() {
  const isLarge = useMediaQuery('(min-width: 1280px)');
  const isMediumPlus = useMediaQuery(
    '(min-width: 1100px) and (max-width: 1280px)'
  );
  const isMedium = useMediaQuery('(min-width: 950px) and (max-width: 1100px)');
  const isSmallPlus = useMediaQuery(
    '(max-width: 950px) and (min-width: 800px)'
  );
  const isSmall = useMediaQuery('(max-width: 800px)');

  const baseWidth = isLarge
    ? 400
    : isMediumPlus
    ? 350
    : isMedium
    ? 300
    : isSmallPlus
    ? 250
    : 500;

  // Розділяємо продукти по категоріях
  const sharpeners = products
    .filter((p) => p.category === 'sharpeners')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  const stones = products
    .filter((p) => p.category === 'stones')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  const accessories = products
    .filter((p) => p.category === 'accessories')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4 py-20">
      {isSmall ? (
        // Для маленьких екранів один об'єднаний слайдер
        <Carousel
          items={[...sharpeners, ...stones, ...accessories]}
          autoplay
          autoplayDelay={4000}
          pauseOnHover
          baseWidth={baseWidth}
          loop={false}
        />
      ) : (
        // Для більших екранів три окремі каруселі
        <div className="flex justify-center gap-8 w-full flex-wrap">
          <Carousel
            items={[...sharpeners]}
            autoplay
            autoplayDelay={10000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
          <Carousel
            items={stones}
            autoplay
            autoplayDelay={5000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
          <Carousel
            items={accessories}
            autoplay
            autoplayDelay={15000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
        </div>
      )}

      <Button
        size="lg"
        className="px-8 py-4 rounded-2xl shadow-md cursor-pointer"
      >
        <Link href="/shop">Shop</Link>
      </Button>
    </div>
  );
}
