'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Product } from '../../types/products';
import WishlistButton from '../../Components/WishlistButton';
import Price from '@/app/Components/Price';

// ОПТИМІЗАЦІЯ 1: Динамічний імпорт MagnetLines.
const MagnetLines = dynamic(() => import('../../../components/MagnetLines'), {
  ssr: false,
});

type Category = 'all' | 'sharpeners' | 'stones' | 'accessories';

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const t = useTranslations('Shop');
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') as Category | null;

  // Ініціалізуємо стан одразу
  const [activeCategory, setActiveCategory] = useState<Category>(
    urlCategory && ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
      ? urlCategory
      : 'all'
  );

  // Синхронізація з URL
  useEffect(() => {
    if (
      urlCategory &&
      ['sharpeners', 'stones', 'accessories'].includes(urlCategory)
    ) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  const filteredProducts =
    activeCategory === 'all'
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* HERO секція */}
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center overflow-hidden px-4">
        <div className="hidden md:block absolute inset-0 -z-10 opacity-30">
          <MagnetLines
            rows={15}
            columns={15}
            containerSize="160vmin"
            lineColor="#c0c0c0"
            lineWidth="0.4vmin"
            lineHeight="4vmin"
            baseAngle={0}
            style={{ margin: '2rem auto' }}
          />
        </div>

        <div className="relative z-10 text-center text-black w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-5 md:mb-6 drop-shadow-lg dark:text-white px-2">
            {t('heroTitle')}
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-7 md:mb-8 text-black-600 dark:text-neutral-300 px-4">
            {t('heroSubtitle')}
          </p>

          {/* Кнопки фільтрації */}
          <div className="relative w-full flex flex-col items-center gap-3 sm:gap-4">
            {/* Мобільна версія */}
            <div className="md:hidden w-full max-w-md px-4">
              <div className="grid grid-cols-2 gap-3">
                {['sharpeners', 'stones', 'accessories', 'all'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as Category)}
                    className={`px-4 py-3 rounded-xl font-semibold transition shadow-md cursor-pointer text-sm ${
                      activeCategory === cat
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-gray-200 text-gray-800 active:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700'
                    }`}
                  >
                    {cat === 'all'
                      ? t('allProducts')
                      : t(
                          cat === 'sharpeners' // Виправлено ключі перекладу відповідно до типу Category
                            ? 'knifeSharpeners'
                            : cat === 'stones'
                            ? 'grindingStones'
                            : cat
                        )}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop версія */}
            <div className="hidden md:block relative w-full">
              <div className="relative w-full flex justify-center">
                <button
                  onClick={() => setActiveCategory('stones')}
                  className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'stones'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {t('grindingStones')}
                </button>
                <button
                  onClick={() => setActiveCategory('sharpeners')}
                  className={`absolute left-1/2 -translate-x-[calc(50%+200px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'sharpeners'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {t('knifeSharpeners')}
                </button>
                <button
                  onClick={() => setActiveCategory('accessories')}
                  className={`absolute right-1/2 translate-x-[calc(50%+180px)] px-6 py-3 rounded-xl font-semibold transition shadow-lg cursor-pointer ${
                    activeCategory === 'accessories'
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300'
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
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-neutral-300'
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
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
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

// Компонент картки з локалізацією
function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  // Визначаємо яку назву показувати
  const displayTitle =
    locale === 'uk' && product.title_uk ? product.title_uk : product.title;

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
      <div
        className={`absolute top-1 right-2 sm:right-3.5 z-20 transition-all duration-300 
          opacity-100 scale-100 md:opacity-0 md:scale-90 
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

      {/* ВАЖЛИВО: Для лінку ми використовуємо оригінальний product.title (зазвичай англійський),
        щоб slug URL залишався стабільним і відповідав базі даних.
        Якщо ви хочете локалізовані URL, це потребує змін у page.tsx, який шукає товар.
      */}
      <Link
        href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}
        className="w-full"
      >
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white">
            <Image
              src={mainImage}
              alt={displayTitle} // Локалізований alt
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              priority={priority}
              className="object-contain group-hover:opacity-90 transition duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 sm:mt-3 w-full px-1 sm:px-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 dark:text-neutral-200">
              {displayTitle} {/* Локалізована назва */}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap ml-2 dark:text-neutral-400">
              <Price amount={product.price} />
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}