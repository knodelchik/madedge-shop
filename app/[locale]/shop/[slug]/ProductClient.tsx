'use client';

import { useState } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '../../store/cartStore';
import QuantityCounter from '@/app/Components/QuantityCounter';
import WishlistButton from '@/app/Components/WishlistButton';
import Price from '@/app/Components/Price';
import { Product } from '@/app/types/products';

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const t = useTranslations('ProductPage');
  const tCart = useTranslations('CartSheet');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart, cartItems } = useCartStore();
  const itemInCart = cartItems.find((i) => i.id === product.id);

  const maxAvailable = product.stock;

  const [quantity, setQuantity] = useState(
    itemInCart ? itemInCart.quantity : 1
  );

  // --- ЛОКАЛІЗАЦІЯ ДАНИХ ---
  const displayTitle =
    locale === 'uk' && product.title_uk ? product.title_uk : product.title;

  const displayDescription =
    locale === 'uk' && product.description_uk
      ? product.description_uk
      : product.description;

  const handleAddToCart = () => {
    if (quantity > maxAvailable) {
      toast.error(t('stockLimitError', { max: maxAvailable }));
      return;
    }

    // Ми модифікуємо об'єкт product, щоб в кошику відображалась
    // правильна назва поточною мовою.
    const localizedProduct = {
      ...product,
      title: displayTitle, // Підміняємо title на локалізований для кошика
    };

    addToCart({ ...localizedProduct, quantity }, tCart);

    toast.success(t('addToCartSuccess'), {
      description: displayTitle,
    });
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href={from === 'checkout' ? '/checkout' : '/shop'}
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          {from === 'checkout' ? t('backToCheckout') : t('backToShopButton')}
        </Link>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 dark:bg-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* ГАЛЕРЕЯ ЗОБРАЖЕНЬ */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 dark:bg-white overflow-hidden h-64 sm:h-72 md:h-80">
                <Image
                  src={
                    product.images[currentImage] || '/images/placeholder.jpg'
                  }
                  alt={displayTitle}
                  fill
                  className={`object-contain p-2 ${
                    isOutOfStock ? 'grayscale opacity-70' : ''
                  }`}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="bg-black/70 text-white px-4 py-2 rounded-lg font-bold text-lg uppercase">
                      {t('outOfStockLabel')}
                    </span>
                  </div>
                )}

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:text-neutral-800 dark:bg-neutral-400/80 dark:hover:text-white dark:hover:bg-neutral-400 rounded-full p-2 sm:p-3 shadow-lg transition-all cursor-pointer active:scale-95 text-xl sm:text-2xl font-bold z-10"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:text-neutral-800 dark:bg-neutral-400/80 dark:hover:text-white dark:hover:bg-neutral-400 rounded-full p-2 sm:p-3 shadow-lg transition-all cursor-pointer active:scale-95 text-xl sm:text-2xl font-bold z-10"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative aspect-square border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                        currentImage === index
                          ? 'border-black dark:border-black'
                          : 'border-neutral-200 hover:border-neutral-500 dark:border-neutral-400 dark:hover:border-neutral-900'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${t('thumbnailAlt')} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ІНФОРМАЦІЯ ПРО ТОВАР */}
            <div className="space-y-4 sm:space-y-6 dark:bg-neutral-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 dark:text-white">
                  {displayTitle}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-neutral-200">
                    <Price amount={product.price} />
                  </p>

                  {isOutOfStock ? (
                    <span className="text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm">
                      {t('statusOutOfStock')}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm">
                      {t('statusInStock', { count: product.stock })}
                    </span>
                  )}
                </div>
              </div>

              {displayDescription && (
                <div className="prose max-w-none">
                  <div
                    className="text-sm sm:text-base text-gray-600 leading-relaxed dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: displayDescription }}
                  />
                </div>
              )}

              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                      {t('quantityLabel')}
                    </span>
                    <QuantityCounter
                      value={quantity}
                      max={isOutOfStock ? 1 : maxAvailable}
                      onIncrease={() => {
                        if (quantity < maxAvailable) setQuantity((q) => q + 1);
                        else
                          toast.error(
                            t('maxQuantityError', { max: maxAvailable })
                          );
                      }}
                      onDecrease={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-colors cursor-pointer text-sm sm:text-base
                        ${
                          isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-500'
                            : 'bg-black text-white hover:bg-neutral-800 dark:text-white dark:bg-neutral-500 dark:hover:text-black dark:hover:bg-neutral-100 active:scale-95'
                        }`}
                  >
                    {isOutOfStock ? t('soldOut') : t('addToCart')}
                  </button>

                  <div className="md:hidden">
                    <WishlistButton
                      productId={product.id}
                      size="md"
                      className="border-2 border-gray-300 hover:border-red-300"
                    />
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 pt-2">
                  <WishlistButton
                    productId={product.id}
                    size="sm"
                    className="dark:text-neutral-200 dark:border-neutral-200 dark:bg-neutral-900 dark:hover:border-red-500 dark:hover:text-red-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-neutral-300">
                    {t('addToWishlist')}
                  </span>
                </div>
              </div>

              {product.category && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-neutral-500">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-neutral-200">
                    {t('categoryLabel')} {product.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
