'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../Components/AuthForm';

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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-lg dark:shadow-xl p-8 transition-colors duration-300">
          <AuthForm
            type={authType}
            onSuccess={handleSuccess}
            onToggleType={toggleAuthType}
          />
        </div>
      </div>
    </div>
  );
}
