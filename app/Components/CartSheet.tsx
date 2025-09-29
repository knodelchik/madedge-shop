'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartSheet() {
  const { cartItems, removeFromCart, totalPrice } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Кошик ({cartItems.length})</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Ваш кошик</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 mt-6">Кошик порожній</p>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price} $
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Видалити
                </Button>
              </div>
            ))}

            <div className="mt-4 flex justify-between font-semibold text-lg">
              <span>Разом:</span>
              <span>{totalPrice.toFixed(2)} $</span>
            </div>

            <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">
              Оформити замовлення
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
