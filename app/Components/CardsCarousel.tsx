// CardsCarousel.tsx
import React from "react";
import Carousel from "../../components/Carousel";
import { Button } from "@/components/ui/button";

export default function CardsCarousel() {
  return (
    <div className="w-full flex flex-col items-center gap-8 px-4">
      <div className="flex justify-center gap-8 w-full">
        {/* Перша карусель */}
        <Carousel
          baseWidth={400}
          autoplay
          autoplayDelay={4000}
          pauseOnHover
          loop
        />

        {/* Друга карусель */}
        <Carousel
          baseWidth={400}
          autoplay
          autoplayDelay={5000}
          pauseOnHover
          loop={false}
        />

        {/* Третя карусель */}
        <Carousel
          baseWidth={400}
          autoplay
          autoplayDelay={6000}
          pauseOnHover
          loop
        />
      </div>

      {/* Кнопка знизу */}
      <Button size="lg" className="px-8 py-4 rounded-2xl shadow-md cursor-pointer">
        Go to Shop
      </Button>
    </div>
  );
}
