'use client';

import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

export default function OrderPage() {
  const t = useTranslations('Order'); // 👈 Ініціалізуємо переклади

  const { cartItems } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'fondy' | 'paypal'>(
    'fondy'
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const priceUnit = t('priceUnit'); // Отримуємо одиницю валюти

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
      // 🚀 Використовуємо переклад для помилки
      alert(t('paymentError'));
    }
  };

  if (cartItems.length === 0)
    return (
      // 🚀 Використовуємо переклад для порожнього кошика
      <p className="text-center mt-10 text-gray-500">{t('emptyCart')}</p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* 🚀 Використовуємо переклад для заголовка */}
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>

      {/* Список товарів */}
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-lg shadow-sm bg-white border border-gray-200"
          >
            <Image
              src={item.images[0]}
              alt={item.title}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              {/* 🚀 Використовуємо priceUnit */}
              <p className="text-gray-500">
                {item.quantity} × {item.price.toFixed(2)} {priceUnit}
              </p>
            </div>
            {/* 🚀 Використовуємо priceUnit */}
            <p className="font-semibold">
              {(item.price * item.quantity).toFixed(2)} {priceUnit}
            </p>
          </div>
        ))}
      </div>

      {/* Загальна сума */}
      <div className="flex justify-between items-center font-semibold text-lg mt-4 border-t pt-4">
        {/* 🚀 Використовуємо переклад */}
        <span>{t('totalLabel')}</span>
        {/* 🚀 Використовуємо priceUnit */}
        <span>
          {totalPrice.toFixed(2)} {priceUnit}
        </span>
      </div>

      {/* Вибір способу оплати */}
      <div className="mt-6 flex flex-col gap-2">
        {/* 🚀 Використовуємо переклад */}
        <span className="font-medium">{t('paymentMethodLabel')}</span>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border ${
              paymentMethod === 'fondy'
                ? 'bg-yellow-400 text-white'
                : 'bg-white'
            }`}
            onClick={() => setPaymentMethod('fondy')}
          >
            Fondy
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${
              paymentMethod === 'paypal' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
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
        {/* 🚀 Використовуємо переклад та priceUnit */}
        {t('payButton')} {totalPrice.toFixed(2)} {priceUnit}
      </button>
    </div>
  );
}
