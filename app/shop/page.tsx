'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MagnetLines from '../../components/MagnetLines';
import { productsService } from '../services/productService';
import { Product } from '../types/products';

type Category = 'all' | 'sharpeners' | 'stones' | 'accessories';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all' as Category, name: 'All Products' },
    { id: 'sharpeners' as Category, name: 'Knife Sharpeners' },
    { id: 'stones' as Category, name: 'Grinding Stones' },
    { id: 'accessories' as Category, name: 'Accessories' },
  ];

  // Завантаження товарів
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productsService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Фільтрація товарів
  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const sharpeners = products.filter((p) => p.category === 'sharpeners');
  const stones = products.filter((p) => p.category === 'stones');
  const accessories = products.filter((p) => p.category === 'accessories');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 🎯 HERO секція */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <MagnetLines
          rows={15}
          columns={15}
          containerSize="160vmin"
          lineColor="#c0c0c0"
          lineWidth="0.4vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{ margin: '2rem auto' }}
          className="absolute inset-0 -z-10 opacity-30"
        />

        <div className="relative z-10 text-center text-black">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            MadEdge Shop
          </h1>
          <p className="text-lg mb-8 text-black-600">
            Choose your ideal sharpener, stone or accessory
          </p>
        </div>
      </section>

      {/* 🎛️ Кнопки фільтрації */}
      <section className="flex justify-center -mt-8 mb-12">
        <div className="flex flex-wrap justify-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* 🛒 Секція товарів */}
      <div className="p-6 max-w-7xl mx-auto">
        {activeCategory === 'all' ? (
          /* 📦 Всі товари */
          <div className="space-y-16">
            {/* 🪒 Точилки */}
            {sharpeners.length > 0 && (
              <section id="sharpeners">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Knife Sharpeners
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {sharpeners.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* 🪨 Камені */}
            {stones.length > 0 && (
              <section id="stones">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Grinding Stones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {stones.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* ⚙️ Аксесуари */}
            {accessories.length > 0 && (
              <section id="accessories">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Accessories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                  {accessories.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* 🎯 Фільтровані товари */
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Компонент карточки товару
// В функції ProductCard додайте перевірку images:
function ProductCard({ product }: { product: Product }) {
  // Переконайтеся, що images - масив і має принаймні один елемент
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/placeholder.jpg';

  return (
    <Link href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="cursor-pointer group flex flex-col items-center hover:scale-105 transition-transform duration-300">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-64 rounded-2xl shadow-lg object-contain group-hover:opacity-90 transition"
        />
        <div className="flex justify-between items-center mt-3 w-full px-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-gray-600 whitespace-nowrap ml-2">
            {product.price} $
          </p>
        </div>
      </div>
    </Link>
  );
}
