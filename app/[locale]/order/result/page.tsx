'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function OrderResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  // const orderId = searchParams.get('order_id'); // Можна використати для відображення ID замовлення

  // Підключаємо переклади
  const t = useTranslations('OrderResult');

  const isSuccess = status === 'success';

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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400"
            >
              <CheckCircle size={40} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400"
            >
              <XCircle size={40} />
            </motion.div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          {isSuccess ? t('successTitle') : t('errorTitle')}
        </h1>

        <p className="text-gray-600 dark:text-neutral-400 mb-8">
          {isSuccess ? t('successMessage') : t('errorMessage')}
        </p>

        <div className="space-y-3">
          <Link
            href="/profile?tab=orders"
            className="flex items-center justify-center gap-2 w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <ShoppingBag size={18} />
            {t('goToOrders')}
          </Link>

          {!isSuccess && (
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {t('tryAgain')}
            </Link>
          )}

          {isSuccess && (
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 w-full text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white py-2 transition-colors text-sm"
            >
              {t('continueShopping')} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
