// CardsCarousel.tsx
'use client';

import React, { use } from "react";
import Carousel from "../../components/Carousel";
import { Button } from "@/components/ui/button";

const DEFAULT_ITEMS1 = [
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    price: '$12.99',
    image: '/item1.jpg',
    id: 1,
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    price: '$8.50',
    image: '/item2.jpg',
    id: 2,
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    price: '$15.00',
    image: '/item3.jpg',
    id: 3,
  },
];
const DEFAULT_ITEMS2 = [
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    price: '$12.99',
    image: '/item1.jpg',
    id: 1,
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    price: '$8.50',
    image: '/item2.jpg',
    id: 2,
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    price: '$15.00',
    image: '/item3.jpg',
    id: 3,
  },
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    price: '$12.99',
    image: '/item1.jpg',
    id: 4,
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    price: '$8.50',
    image: '/item2.jpg',
    id: 5,
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    price: '$15.00',
    image: '/item3.jpg',
    id: 6,
  },
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    price: '$12.99',
    image: '/item1.jpg',
    id: 1,
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    price: '$8.50',
    image: '/item2.jpg',
    id: 2,
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    price: '$15.00',
    image: '/item3.jpg',
    id: 3,
  },
];
const DEFAULT_ITEMS3 = [
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    price: '$12.99',
    image: '/item1.jpg',
    id: 1,
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    price: '$8.50',
    image: '/item2.jpg',
    id: 2,
  },
];
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function CardsCarousel() {
  const isLarge = useMediaQuery("(min-width: 1280px)"); // великі екрани
  const isMedium = useMediaQuery("(min-width: 950px) and (max-width: 1100px)"); // середні екрани
  const isMediumPlus = useMediaQuery("(min-width: 1100px) and (max-width: 1280px)"); // середні екрани і більше
  const isSmall = useMediaQuery("(max-width: 800px)");  // зовсім маленькі

  const baseWidth = isLarge ? 400 : isMediumPlus ? 350 : isMedium ? 300 : 500;
  const allItems = [...DEFAULT_ITEMS1, ...DEFAULT_ITEMS2, ...DEFAULT_ITEMS3];

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4">
      {isSmall ? (
        // Один слайдер з усіма товарами
        <Carousel
          items={allItems}
          autoplay
          autoplayDelay={4000}
          pauseOnHover
          baseWidth={baseWidth}
          loop={false}
        />
      ) : (
        // Три окремі слайдери
        <div className="flex justify-center gap-8 w-full">
          <Carousel
            items={DEFAULT_ITEMS1}
            autoplay
            autoplayDelay={4000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
          <Carousel
            items={DEFAULT_ITEMS2}
            autoplay
            autoplayDelay={5000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
          <Carousel
            items={DEFAULT_ITEMS3}
            autoplay
            autoplayDelay={5000}
            pauseOnHover
            baseWidth={baseWidth}
            loop={false}
          />
        </div>
      )}

      {/* Кнопка знизу */}
      <Button size="lg" className="px-8 py-4 rounded-2xl shadow-md cursor-pointer">
        Go to Shop
      </Button>
    </div>
  );
}
