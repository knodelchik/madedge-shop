'use client';

import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../[locale]/store/cartStore';
import QuantityCounter from './QuantityCounter';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface MobileCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300 lg:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-300 ease-out">
        <div className="bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-neutral-700">
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

          {/* Content */}
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
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 border border-gray-200 dark:border-neutral-700"
                  >
                    {/* Image */}
                    <Image
                      src={getSafeImage(item)}
                      alt={item.title || placeholderAlt}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-gray-700 dark:text-neutral-300">
                        {item.price.toFixed(2)} {priceUnit}
                      </p>

                      {/* Quantity controls */}
                      <div className="mt-2">
                        <QuantityCounter
                          value={item.quantity}
                          onIncrease={() => increaseQuantity(item.id)}
                          onDecrease={() => decreaseQuantity(item.id)}
                        />
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-neutral-700 p-5 space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  {t('totalLabel')}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalPrice.toFixed(2)} {priceUnit}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href="/order"
                onClick={handleCheckout}
                className="block w-full text-center bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
              >
                {t('checkoutButton')}
              </Link>

              {/* Continue shopping */}
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
