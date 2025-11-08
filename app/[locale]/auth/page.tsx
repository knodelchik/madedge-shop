'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../Components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/profile');
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="max-w-md mx-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-lg dark:shadow-xl transition-colors duration-300 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={authType}
              initial={{ opacity: 0, x: authType === 'signin' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authType === 'signin' ? 20 : -20 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="p-8"
            >
              <AuthForm
                type={authType}
                onSuccess={handleSuccess}
                onToggleType={toggleAuthType}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
