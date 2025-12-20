'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../[locale]/store/cartStore';
import QuantityCounter from './QuantityCounter';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCurrency } from '@/app/context/CurrencyContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity: number;
}

export default function CartSheet() {
  const t = useTranslations('CartSheet');
  // 1. ДОДАНО: Отримуємо переклади для помилок кошика (там де ключі 'maxStockReached' тощо)
  const tCart = useTranslations('CartSheet');

  const { cartItems, increaseQuantity, decreaseQuantity } = useCartStore();
  const [open, setOpen] = useState(false);

  const { formatPrice } = useCurrency();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeholderAlt = t('placeholderAlt');

  const getSafeImage = (item: CartItem) => {
    if (!item.images || item.images.length === 0) {
      return '/images/placeholder.jpg';
    }
    return item.images[0];
  };

  const handleCheckout = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg dark:hover:bg-white dark:hover:text-black cursor-pointer">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full 
                   bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100 "
      >
        <SheetHeader className="p-6 border-b border-gray-200 dark:border-neutral-700 shrink-0 ">
          <SheetTitle className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            {t('title')}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <p className="text-gray-500 dark:text-neutral-400 text-center mb-4">
              {t('emptyMessage')}
            </p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-neutral-200 
                         text-white dark:text-black py-2 px-6 rounded-lg font-medium transition"
            >
              {t('goToShop')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg shadow-sm 
                             bg-white dark:bg-neutral-800 
                             border border-gray-200 dark:border-neutral-700 transition-colors"
                >
                  <Image
                    src={getSafeImage(item)}
                    alt={item.title || placeholderAlt}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <p className="font-medium text-gray-800 dark:text-neutral-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <QuantityCounter
                    value={item.quantity}
                    // 2. ВИПРАВЛЕНО: Передаємо tCart другим аргументом
                    onIncrease={() => increaseQuantity(item.id, tCart)}
                    onDecrease={() => decreaseQuantity(item.id)}
                  />
                </div>
              ))}
            </div>

            <div
              className="border-t border-gray-200 dark:border-neutral-700 p-6 
                            bg-white dark:bg-neutral-900 shrink-0"
            >
              <div
                className="flex justify-between items-center font-semibold text-lg 
                              text-gray-800 dark:text-neutral-100 mb-4"
              >
                <span>{t('totalLabel')}</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <Link
                href="/order"
                onClick={handleCheckout}
                className="w-full text-center bg-black hover:bg-neutral-800 
                           dark:bg-white dark:hover:bg-neutral-200 
                           text-white dark:text-black py-3 rounded-lg font-medium transition block"
              >
                {t('checkoutButton')}
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
