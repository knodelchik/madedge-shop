'use client';

import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderPage() {
  const t = useTranslations('Order');

  const { cartItems } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'fondy' | 'paypal'>(
    'fondy'
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const priceUnit = t('priceUnit');

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
      alert(t('paymentError'));
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-neutral-900 dark:to-black flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <svg
              className="w-12 h-12 text-gray-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-500 dark:text-neutral-400"
          >
            {t('emptyCart')}
          </motion.p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 transition-colors">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-2">
            {t('title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Список товарів */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl shadow-lg bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Gradient overlay на hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700/10 dark:to-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />

                  <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="font-semibold text-gray-900 dark:text-neutral-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                      {item.quantity} × {item.price.toFixed(2)} {priceUnit}
                    </p>
                  </div>
                  <motion.p className="font-bold text-lg text-gray-900 dark:text-neutral-100 relative z-10">
                    {(item.price * item.quantity).toFixed(2)} {priceUnit}
                  </motion.p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar з підсумком та оплатою */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-neutral-800 sticky top-6 overflow-hidden relative">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-full blur-3xl" />

              {/* Підсумок замовлення */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4 relative z-10">
                {t('orderSummary') || 'Order Summary'}
              </h2>

              {/* Деталі */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-neutral-800 relative z-10"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    {t('subtotal') || 'Subtotal'}
                  </span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="font-medium text-gray-900 dark:text-neutral-100"
                  >
                    {totalPrice.toFixed(2)} {priceUnit}
                  </motion.span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    {t('shipping') || 'Shipping'}
                  </span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="font-medium text-green-600 dark:text-green-400"
                  >
                    {t('freeShipping') || 'Free'}
                  </motion.span>
                </div>
              </motion.div>

              {/* Загальна сума */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="flex justify-between items-center font-bold text-xl mb-6 relative z-10"
              >
                <span className="text-gray-900 dark:text-neutral-100">
                  {t('totalLabel')}
                </span>
                <span className="text-transparent bg-clip-text bg-black dark:bg-white">
                  {totalPrice.toFixed(2)} {priceUnit}
                </span>
              </motion.div>

              {/* Вибір способу оплати */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-6 relative z-10"
              >
                <span className="block font-semibold text-gray-900 dark:text-neutral-100 mb-3">
                  {t('paymentMethodLabel')}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer ${
                      paymentMethod === 'fondy'
                        ? 'bg-gradient-to-r from-neutral-400 to-neutral-500 border-neutral-400 dark:bg-gradient-to-r dark:from-neutral-400 dark:to-neutral-600 dark:border-neutral-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 '
                    }`}
                    onClick={() => setPaymentMethod('fondy')}
                  >
                    Fondy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'bg-gradient-to-r from-neutral-400 to-neutral-500 border-neutral-400 dark:bg-gradient-to-r dark:from-neutral-500 dark:to-neutral-700 dark:border-neutral-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </motion.button>
                </div>
              </motion.div>

              {/* Кнопка оплати */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 text-white dark:text-black py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-200 shadow-lg relative z-10 overflow-hidden group cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neutral-400 to-neutral-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={false}
                />
                <span className="relative z-10">
                  {t('payButton')} {totalPrice.toFixed(2)} {priceUnit}
                </span>
              </motion.button>

              {/* Безпека */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-neutral-400 relative z-10"
              >
                <motion.svg
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </motion.svg>
                <span>{t('securePayment') || 'Secure payment'}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
