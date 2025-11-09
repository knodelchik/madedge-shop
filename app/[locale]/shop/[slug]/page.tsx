'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cartStore';
import QuantityCounter from '@/app/Components/QuantityCounter';
import WishlistButton from '@/app/Components/WishlistButton';
import { productsService } from '../../services/productService';
import { Product } from '@/app/types/products';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function ProductPage() {
  const { slug } = useParams();
  const t = useTranslations('ProductPage');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart, cartItems } = useCartStore();
  const itemInCart = cartItems.find((i) => i.id === product?.id);
  const [quantity, setQuantity] = useState(
    itemInCart ? itemInCart.quantity : 1
  );

  // Завантаження продукту
  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        const products = await productsService.getAllProducts();
        const foundProduct = products.find(
          (p) => p.title.replace(/\s+/g, '-').toLowerCase() === slug
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, t]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({ ...product, quantity });
    toast.success(t('addToCartSuccess'), {
      description: product.title,
    });
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // 🎨 Анімація завантаження з логотипом
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <LogoLoadingAnimation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-center">
          <p>{t('notFound')}</p>
          <Link
            href="/shop"
            className="text-blue-500 underline mt-4 inline-block"
          >
            {t('backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Кнопка назад */}
        <Link
          href="/shop"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
        >
          {t('backToShopButton')}
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 dark:bg-neutral-800 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {/* Слайдер фото */}
            <div className="space-y-4">
              <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-2xl p-4 dark:bg-white">
                <motion.img
                  key={product.images[currentImage]}
                  src={product.images[currentImage]}
                  alt={`${t('imageAltPrefix')} ${currentImage + 1}`}
                  className="w-full h-80 object-contain rounded-lg "
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Кнопки навігації */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:text-neutral-800 dark:bg-neutral-400/70 dark:hover:text-white dark:hover:bg-neutral-400  rounded-full p-3 shadow-lg transition-all cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white dark:text-neutral-800 dark:bg-neutral-400/70 dark:hover:text-white dark:hover:bg-neutral-400 rounded-full p-3 shadow-lg transition-all cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Мініатюри */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                        currentImage === index
                          ? 'border-black dark:border-black'
                          : 'border-neutral-200 hover:border-neutral-500 dark:border-neutral-400 dark:hover:border-neutral-900'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${t('imageAltPrefix')} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Інформація про товар */}
            <div className="space-y-6 dark:bg-neutral-800 ">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">
                  {product.title}
                </h1>
                <p className="text-2xl font-semibold text-gray-700 dark:text-neutral-200">
                  {product.price} $
                </p>
              </div>

              {product.description && (
                <div className="prose max-w-none">
                  <div
                    className="text-gray-600 leading-relaxed dark:text-neutral-400"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Кількість та кнопки додавання */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                      {t('quantityLabel')}
                    </span>
                    <QuantityCounter
                      value={quantity}
                      onIncrease={() => setQuantity((q) => q + 1)}
                      onDecrease={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-neutral-800 dark:text-white dark:bg-neutral-500 dark:hover:text-black dark:hover:bg-neutral-100  transition-colors cursor-pointer"
                  >
                    {t('addToCart')}
                  </button>

                  {/* Додаткова кнопка Wishlist для мобільних пристроїв */}
                  <div className="md:hidden ">
                    <WishlistButton
                      productId={product.id}
                      size="md"
                      className="border-2 border-gray-300 hover:border-red-300 "
                    />
                  </div>
                </div>

                {/* Альтернативний варіант Wishlist кнопки для десктопу */}
                <div className="hidden md:flex items-center gap-2 pt-2 ">
                  <WishlistButton
                    productId={product.id}
                    size="sm"
                    className=" dark:text-neutral-200 dark:border-neutral-200 dark:bg-neutral-900  dark:hover:border-red-500 dark:hover:text-red-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-neutral-300">
                    {t('addToWishlist')}
                  </span>
                </div>
              </div>

              {/* Категорія */}
              {product.category && (
                <div className="pt-4 border-t border-gray-200 dark:border-neutral-500 ">
                  <span className="text-sm text-gray-500 dark:text-neutral-200">
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

// 🎨 Компонент анімації логотипу при завантаженні
function LogoLoadingAnimation() {
  const t = useTranslations('ProductPage');

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Контейнер з анімацією */}
      <div className="relative">
        {/* Зовнішнє пульсуюче кільце */}
        <motion.div
          className="absolute inset-0 w-40 h-40 -m-4"
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
          <div className="w-full h-full border-4 border-black/20 dark:border-white/20 rounded-full" />
        </motion.div>

        {/* Логотип з обертанням та shimmer */}
        <motion.div
          className="relative w-32 h-32 overflow-hidden rounded-full"
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
            className="w-full h-full object-contain"
            priority
          />

          {/* Shimmer effect поверх логотипу */}
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

        {/* Додаткове обертове кільце */}
        <motion.div
          className="absolute inset-0 w-32 h-32"
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

      {/* Текст з пульсацією */}
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
        <p className="text-xl font-bold text-gray-800 dark:text-white">
          {t('loading')}
        </p>
      </motion.div>

      {/* Анімовані точки */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-black dark:bg-white rounded-full"
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
