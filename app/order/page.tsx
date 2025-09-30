'use client';

import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

export default function OrderPage() {
  const { cartItems, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'fondy' | 'paypal'>('fondy');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    const res = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, method: paymentMethod }),
    });
    const data = await res.json();
    if (data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      alert('Помилка при створенні платежу');
    }
  };

  if (cartItems.length === 0)
    return <p className="text-center mt-10 text-gray-500">Ваш кошик порожній</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Оформлення замовлення</h1>

      {/* Список товарів */}
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white border border-gray-200"
          >
            <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500">{item.quantity} × {item.price.toFixed(2)} $</p>
            </div>
            <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} $</p>
          </div>
        ))}
      </div>

      {/* Загальна сума */}
      <div className="flex justify-between items-center font-semibold text-lg mt-4 border-t pt-4">
        <span>Разом:</span>
        <span>{totalPrice.toFixed(2)} $</span>
      </div>

      {/* Вибір способу оплати */}
      <div className="mt-6 flex flex-col gap-2">
        <span className="font-medium">Спосіб оплати:</span>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border ${paymentMethod === 'fondy' ? 'bg-yellow-400 text-white' : 'bg-white'}`}
            onClick={() => setPaymentMethod('fondy')}
          >
            Fondy
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${paymentMethod === 'paypal' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setPaymentMethod('paypal')}
          >
            PayPal
          </button>
        </div>
      </div>

      {/* Кнопка оплати */}
      <button
        onClick={handlePayment}
        className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition"
      >
        Оплатити {totalPrice.toFixed(2)} $
      </button>
    </div>
  );
}
