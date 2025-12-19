'use client';

import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../[locale]/store/cartStore';
import QuantityCounter from './QuantityCounter';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface MobileCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Додали helper createSlug
const createSlug = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

export default function MobileCartSheet({
  isOpen,
  onClose,
}: MobileCartSheetProps) {
  const t = useTranslations('CartSheet');
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCartStore();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const priceUnit = t('priceUnit');
  const placeholderAlt = t('placeholderAlt');

  const getSafeImage = (item: any) => {
    if (!item.images || item.images.length === 0) {
      return '/images/placeholder.jpg';
    }
    return item.images[0];
  };

  const handleCheckout = () => {
    onClose();
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 lg:hidden h-auto outline-none"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing touch-none">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-white" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('title')}
                  </h2>
                  {totalItems > 0 && (
                    <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors active:scale-95"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-neutral-600 mb-4" />
                    <p className="text-gray-500 dark:text-neutral-400 text-center mb-4">
                      {t('emptyMessage')}
                    </p>
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg font-medium transition active:scale-95"
                    >
                      {t('goToShop')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const slug = createSlug(item.title || '');

                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 border border-gray-200 dark:border-neutral-700"
                        >
                          {/* ОБГОРНУЛИ КАРТИНКУ В LINK */}
                          <Link
                            href={`/shop/${slug}`}
                            onClick={onClose}
                            className="flex-shrink-0 active:scale-95 transition-transform"
                          >
                            <Image
                              src={getSafeImage(item)}
                              alt={item.title || placeholderAlt}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            {/* Також можна обгорнути заголовок */}
                            <Link href={`/shop/${slug}`} onClick={onClose}>
                              <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-sm font-bold text-gray-700 dark:text-neutral-300">
                              {item.price.toFixed(2)} {priceUnit}
                            </p>

                            <div className="mt-2">
                              <QuantityCounter
                                value={item.quantity}
                                onIncrease={() => increaseQuantity(item.id)}
                                onDecrease={() => decreaseQuantity(item.id)}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 dark:border-neutral-700 p-5 space-y-3 flex-shrink-0 pb-safe">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      {t('totalLabel')}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalPrice.toFixed(2)} {priceUnit}
                    </span>
                  </div>

                  <Link
                    href="/order"
                    onClick={handleCheckout}
                    className="block w-full text-center bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
                  >
                    {t('checkoutButton')}
                  </Link>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
