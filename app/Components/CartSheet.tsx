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
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity: number;
}

export default function CartSheet() {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCartStore();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Функція для отримання безпечного зображення
  const getSafeImage = (item: CartItem) => {
    if (!item.images || item.images.length === 0) {
      return '/images/placeholder.jpg';
    }
    return item.images[0];
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full"
      >
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle className="text-xl font-bold">Ваш кошик</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6">
            <p className="text-gray-500 text-center mb-4">Кошик порожній</p>
            <Link
              href="/shop"
              className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-lg font-medium transition"
            >
              Перейти до покупок
            </Link>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Контейнер для товарів з прокруткою */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white border border-gray-200"
                >
                  <Image
                    src={getSafeImage(item)}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.price.toFixed(2)} $
                    </p>
                  </div>

                  <QuantityCounter
                    value={item.quantity}
                    onIncrease={() => increaseQuantity(item.id)}
                    onDecrease={() => decreaseQuantity(item.id)}
                  />
                </div>
              ))}
            </div>

            {/* Фіксований блок з підсумком і кнопкою */}
            <div className="border-t p-6 bg-white shrink-0">
              <div className="flex justify-between items-center font-semibold text-lg text-gray-800 mb-4">
                <span>Разом:</span>
                <span>{totalPrice.toFixed(2)} $</span>
              </div>

              {/* Кнопка переходу на сторінку оформлення */}
              <Link
                href="/order"
                className="w-full text-center bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition block"
              >
                Оформити замовлення
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
