'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Counter from '../../components/Counter';
import QuantityCounter from './QuantityCounter';

export default function CartSheet() {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCartStore();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

      <SheetContent side="right" className="w-[400px] sm:w-[500px] p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">Ваш кошик</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center mt-8 gap-4">
            <p className="text-gray-500 text-center">Кошик порожній</p>
            <a
              href="/shop"
              className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-lg font-medium transition"
            >
              Перейти до покупок
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white border border-gray-200"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.price.toFixed(2)} $</p>
                </div>

                <QuantityCounter
                  value={item.quantity}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                />

              </div>
            ))}

            <div className="mt-6 flex justify-between items-center font-semibold text-lg text-gray-800 border-t pt-4">
              <span>Разом:</span>
              <span>{totalPrice.toFixed(2)} $</span>
            </div>

            <button className="w-full mt-4 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition">
              Оформити замовлення
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
