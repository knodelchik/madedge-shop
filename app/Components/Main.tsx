"use client";

import Threads from "../../components/Threads";

export default function Main() {
  return (
    <div className="w-[100vw] h-[100vh] relative overflow-hidden">
      {/* Анімований фон */}
      <Threads
        amplitude={0.4}
        distance={0}
        enableMouseInteraction={true}
        color={[1, 1, 1]}
      />

      {/* Контент поверх бекграунду */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 -translate-y-16">
        <h1 className="text-6xl font-extrabold text-black mb-6">
          Welcome to MadEdge Shop
        </h1>
        <p className="text-2xl text-black max-w-2xl mb-10">
          Discover the best sharpeners for your knives. Shop now and enjoy
          exclusive deals with premium quality guaranteed!
        </p>

        {/* Кнопки */}
        <div className="flex gap-15">
          <button className="px-8 py-4 bg-black text-white text-lg rounded-2xl shadow-md hover:bg-gray-800 transition">
            Магазин
          </button>
          <button className="px-8 py-4 bg-gray-200 text-black text-lg rounded-2xl shadow-md hover:bg-gray-300 transition">
            Про нас
          </button>
        </div>
      </div>
    </div>
  );
}
