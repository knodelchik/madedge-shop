'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '../../store/cartStore';

export default function OrderResultPage() {
  const searchParams = useSearchParams();
  const t = useTranslations('OrderResult');
  const { clearCart } = useCartStore();

  const source = searchParams.get('source'); // 'paypal' або 'monobank'
  const orderId = searchParams.get('orderId'); // Наш внутрішній ID
  
  // Стан завантаження потрібен тільки якщо ми щось перевіряємо.
  // Але якщо ми прийшли від PayPalButtons, то все вже добре.
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failure'>('loading');

  useEffect(() => {
    // Функція ініціалізації
    const initResult = async () => {
      if (!orderId) {
        setPaymentStatus('failure');
        return;
      }

      // 1. PAYPAL
      if (source === 'paypal') {
        // Якщо ми прийшли сюди, значить компонент PayPalCheckout вже виконав Capture і отримав 'COMPLETED'.
        // Нам не потрібно робити це знову. Просто показуємо успіх.
        setPaymentStatus('success');
        clearCart();
      } 
      // 2. MONOBANK
      else if (source === 'monobank') {
        // Для Монобанку, оскільки це редірект, ми теж показуємо успіх авансом (для UX).
        // Реальний статус прийде на вебхук.
        setPaymentStatus('success');
        clearCart();
      } 
      // 3. НЕВІДОМЕ ДЖЕРЕЛО
      else {
        setPaymentStatus('failure');
      }
    };

    initResult();
  }, [source, orderId, clearCart]);

  // --- UI ---
  
  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('processingPayment')} 
          </h2>
        </div>
      </div>
    );
  }

  const isSuccess = paymentStatus === 'success';

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 text-center"
      >
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle size={40} />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
              <XCircle size={40} />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {isSuccess ? t('successTitle') : t('errorTitle')}
        </h1>
        
        {/* Додаткове повідомлення з номером замовлення */}
        {isSuccess && orderId && (
           <p className="text-sm text-gray-500 mb-2">Order #{orderId}</p>
        )}

        <p className="text-gray-600 dark:text-neutral-400 mb-8">
          {isSuccess ? t('successMessage') : t('errorMessage')}
        </p>

        <div className="space-y-3">
          <Link href="/profile?tab=orders" className="flex items-center justify-center gap-2 w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
            <ShoppingBag size={18} /> {t('goToOrders')}
          </Link>
          <Link href="/shop" className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-black dark:hover:text-white py-2 text-sm">
            {t('continueShopping')} <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}