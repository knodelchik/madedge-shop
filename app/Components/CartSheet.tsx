'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartSheet() {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCartStore();

  // ✅ загальна кількість товарів
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ загальна сума
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Ваш кошик</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 mt-6">Кошик порожній</p>
        ) : (
          <div className="flex flex-col gap-6 mt-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.price} $</p>
                </div>

                {/* Кнопки +/- */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between font-semibold text-lg">
              <span>Разом:</span>
              <span>{totalPrice.toFixed(2)} $</span>
            </div>

            <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
              Оформити замовлення
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
