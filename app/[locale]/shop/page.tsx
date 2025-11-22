'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MagnetLines from '../../../components/MagnetLines';
import { productsService } from '../services/productService';
import { Product } from '../../types/products';
import WishlistButton from '../../Components/WishlistButton';

type Category = 'all' | 'sharpeners' | 'stones' | 'accessories';

export default function ShopPage() {
  const t = useTranslations('Shop');

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') as Category | null;

  const [activeCategory, setActiveCategory] = useState<Category>(
    urlCategory && ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
      ? urlCategory
      : 'all'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      urlCategory &&
      ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
    ) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

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

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <LogoLoadingAnimation />
      </div>
    );
  }

  return (
    <div>
      {/* HERO секція */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center overflow-hidden px-4">
        <MagnetLines
          rows={15}
          columns={15}
          containerSize="160vmin"
          lineColor="#c0c0c0"
          lineWidth="0.4vmin"
          lineHeight="4vmin"
          baseAngle={0}
          style={{ margin: '2rem auto' }}
          className="absolute inset-0 -z-10 opacity-10 sm:opacity-20 md:opacity-30"
        />

        <div className="relative z-10 text-center text-black w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-5 md:mb-6 drop-shadow-lg dark:text-white px-2">
            {t('heroTitle')}
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-7 md:mb-8 text-black-600 dark:text-neutral-300 px-4">
            {t('heroSubtitle')}
          </p>

          {/* Кнопки фільтрації - сітка 2x2 на мобільних */}
          <div className="relative w-full flex flex-col items-center gap-3 sm:gap-4">
            {/* Мобільна версія - сітка 2x2 */}
            <div className="md:hidden w-full max-w-md px-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveCategory('sharpeners')}
                  className={`px-4 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer text-sm ${
                    activeCategory === 'sharpeners'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700'
                  }`}
                >
                  {t('knifeSharpeners')}
                </button>

                <button
                  onClick={() => setActiveCategory('stones')}
                  className={`px-4 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer text-sm ${
                    activeCategory === 'stones'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700'
                  }`}
                >
                  {t('grindingStones')}
                </button>

                <button
                  onClick={() => setActiveCategory('accessories')}
                  className={`px-4 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer text-sm ${
                    activeCategory === 'accessories'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700'
                  }`}
                >
                  {t('accessories')}
                </button>

                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer text-sm ${
                    activeCategory === 'all'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700'
                  }`}
                >
                  {t('allProducts')}
                </button>
              </div>
            </div>

            {/* Desktop версія - оригінальний layout */}
            <div className="hidden md:block relative w-full">
              <div className="relative w-full flex justify-center">
                <button
                  onClick={() => setActiveCategory('stones')}
                  className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'stones'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                  }`}
                >
                  {t('grindingStones')}
                </button>

                <button
                  onClick={() => setActiveCategory('sharpeners')}
                  className={`absolute left-1/2 -translate-x-[calc(50%+200px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'sharpeners'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                  }`}
                >
                  {t('knifeSharpeners')}
                </button>

                <button
                  onClick={() => setActiveCategory('accessories')}
                  className={`absolute right-1/2 translate-x-[calc(50%+180px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'accessories'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                  }`}
                >
                  {t('accessories')}
                </button>
              </div>

              <button
                onClick={() => setActiveCategory('all')}
                className={`mt-4 px-4 py-2 rounded-lg font-medium transition text-sm cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                }`}
              >
                {t('allProducts')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Секція товарів */}
      <div className="p-4 sm:p-5 md:p-6 max-w-7xl mx-auto">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg px-4">
                {t('noProductsFound')}
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-4 px-5 sm:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-95 transition text-sm sm:text-base"
              >
                {t('viewAllProducts')}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function LogoLoadingAnimation() {
  const t = useTranslations('Shop');

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
      <div className="relative">
        <motion.div
          className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 -m-3 sm:-m-4"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full border-3 sm:border-4 border-black/20 dark:border-white/20 rounded-full" />
        </motion.div>

        <motion.div
          className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Image
            src="/logo2.png"
            alt="MadEdge Logo"
            width={128}
            height={128}
            className="w-full h-full object-contain rounded-full"
            priority
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              backgroundSize: '200% 100%',
            }}
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32"
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="w-full h-full border-2 border-transparent border-t-black dark:border-t-white rounded-full" />
        </motion.div>
      </div>

      <motion.div
        className="text-center"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
          {t('loadingProducts')}
        </p>
      </motion.div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black dark:bg-white rounded-full"
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('Shop');

  const [isHovered, setIsHovered] = useState(false);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/images/placeholder.jpg';

  return (
    <div
      className="group flex flex-col items-center hover:scale-105 active:scale-100 transition-transform duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button - завжди видима на мобільних, з'являється при hover на desktop */}
      <div
        className={`absolute top-1 right-2 sm:right-3.5 z-20 transition-all duration-300 
          opacity-100 scale-100 
          md:opacity-0 md:scale-90 
          ${isHovered ? 'md:opacity-100 md:scale-100' : ''}`}
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

      <Link
        href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="w-full"
      >
        <div className="flex flex-col items-center w-full">
          <Image
            src={mainImage}
            alt={product.title}
            width={300}
            height={256}
            className="w-full h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl shadow-lg object-contain group-hover:opacity-90 transition cursor-pointer"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg';
            }}
          />
          <div className="flex justify-between items-center mt-2 sm:mt-3 w-full px-1 sm:px-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 dark:text-neutral-200">
              {product.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap ml-2 dark:text-neutral-400">
              {product.price} {t('priceUnit')}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
