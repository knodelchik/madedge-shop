'use client';

import { products } from '../data/products';
import Link from 'next/link';
import MagnetLines from '../../components/MagnetLines';

export default function ShopPage() {
  const sharpeners = products.filter((p) => p.category === 'sharpeners');
  const stones = products.filter((p) => p.category === 'stones');
  const accessories = products.filter((p) => p.category === 'accessories');

  return (
    <div>
      {/* 🎯 HERO секція */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* 🔮 MagnetLines фон */}
        <MagnetLines
          rows={15}
          columns={15}
          containerSize="160vmin"
          lineColor="#c0c0c0"
          lineWidth="0.4vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{ margin: "2rem auto" }}
          className='absolute inset-0 -z-10 opacity-30'
        />

        {/* 📝 Контент */}
        <div className="relative z-10 text-center text-black">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Магазин MadEdge
          </h1>
          <p className="text-lg mb-8 text-black-600">
            Обери свою ідеальну точилку, камінь або аксесуар
          </p>

          {/* Кнопки-якорі */}
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <a
              href="#sharpeners"
              className="px-6 py-3 bg-black hover:bg-gray-800 rounded-xl font-semibold transition shadow-lg"
            >
              Точилки для ножів
            </a>
            <a
              href="#stones"
              className="px-6 py-3 bg-black hover:bg-gray-800 rounded-xl font-semibold transition shadow-lg"
            >
              Точильні камені
            </a>
            <a
              href="#accessories"
              className="px-6 py-3 bg-black hover:bg-gray-800 rounded-xl font-semibold transition shadow-lg"
            >
              Комплектуючі
            </a>
          </div>
        </div>
      </section>

      {/* 🛒 Секції товарів */}
      <div className="p-6 space-y-16 max-w-7xl mx-auto">
        {/* 🪒 Точилки */}
        <section id="sharpeners">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Точилки для ножів</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sharpeners.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="cursor-pointer group flex flex-col items-center">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-64 rounded-2xl shadow-lg object-contain group-hover:opacity-90 transition"
                  />
                  <div className="flex justify-between items-center mt-3 w-full px-2">
                    <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.price} $</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* 🪨 Камені */}
        <section id="stones">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Точильні камені</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {stones.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="cursor-pointer group">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-2xl group-hover:opacity-90 transition"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.price} $</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ⚙️ Аксесуари */}
        <section id="accessories">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Комплектуючі</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {accessories.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="cursor-pointer group">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-2xl group-hover:opacity-90 transition"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.price} $</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
