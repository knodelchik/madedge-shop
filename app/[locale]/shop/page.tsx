'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MagnetLines from '../../../components/MagnetLines';
import { productsService } from '../services/productService';
import { Product } from '../../types/products';
import WishlistButton from '../../Components/WishlistButton';
import Image from 'next/image';

type Category = 'all' | 'sharpeners' | 'stones' | 'accessories';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') as Category | null;

  const [activeCategory, setActiveCategory] = useState<Category>(
    urlCategory && ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
      ? urlCategory
      : 'all'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Оновлюємо активну категорію при зміні URL параметра
  useEffect(() => {
    if (
      urlCategory &&
      ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
    ) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 🎯 HERO секція з кнопками одразу після тексту */}
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

          {/* 🎛️ Кнопки фільтрації */}
          <div className="relative w-full flex flex-col items-center gap-4">
            <div className="relative w-full flex justify-center">
              {/* Центральна кнопка — завжди по центру */}
              <button
                onClick={() => setActiveCategory('stones')}
                className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                  activeCategory === 'stones'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Grinding Stones
              </button>

              {/* Ліва кнопка — фіксований gap 200px вліво від центру */}
              <button
                onClick={() => setActiveCategory('sharpeners')}
                className={`absolute left-1/2 -translate-x-[calc(50%+200px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                  activeCategory === 'sharpeners'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Knife Sharpeners
              </button>

              {/* Права кнопка — фіксований gap 200px вправо від центру */}
              <button
                onClick={() => setActiveCategory('accessories')}
                className={`absolute right-1/2 translate-x-[calc(50%+180px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                  activeCategory === 'accessories'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Accessories
              </button>
            </div>

            {/* Кнопка "All Products" під центром */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                activeCategory === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
          </div>
        </div>
      </section>

      {/* 🛒 Секція товарів - всі товари підряд без розділення по категоріям */}
      <div className="p-6 max-w-7xl mx-auto">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found in this category
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                View All Products
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Компонент карточки товару з плавною анімацією
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/placeholder.jpg';

  return (
    <div
      className="group flex flex-col items-center hover:scale-105 transition-transform duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Кнопка Wishlist - з плавною появою */}
      <div
        className={`absolute top-2 right-2 z-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <WishlistButton
          productId={product.id}
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>

      {/* Основна частина картки - обгорнута в Link */}
      <Link
        href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="w-full"
      >
        <div className="cursor-pointer flex flex-col items-center w-full">
          <Image
            src={mainImage}
            alt={product.title}
            width={300}
            height={256}
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
    </div>
  );
}
