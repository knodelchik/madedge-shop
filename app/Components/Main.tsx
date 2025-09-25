"use client";

import Threads from "../../components/Threads";
import { Button } from "@/components/ui/button";

export default function Main() {
  return (
    <main className="w-full relative">
      {/* Hero секція з анімованим фоном */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Фон Threads тільки тут */}
        <div className="absolute inset-0 -z-10">
          <Threads
            amplitude={0.4}
            distance={0}
            enableMouseInteraction={true}
            color={[1, 1, 1]}
          />
        </div>

        {/* Текст поверх */}
        <h1 className="text-6xl font-extrabold text-black mb-6">
          Welcome to MadEdge Shop
        </h1>
        <p className="text-2xl text-black max-w-2xl mb-10">
          Discover the best sharpeners for your knives. Shop now and enjoy
          exclusive deals with premium quality guaranteed!
        </p>
        
        <div className="flex justify-center gap-6 py-16">
        <Button size="lg" className="px-8 py-4 rounded-2xl shadow-md cursor-pointer">
          Магазин
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="px-8 py-4 rounded-2xl shadow-md cursor-pointer"
        >
          Про нас
        </Button>
      </div>

      </section>
    </main>
  );
}
