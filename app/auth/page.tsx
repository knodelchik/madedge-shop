'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../Components/AuthForm';

export default function AuthPage() {
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/profile');
  };

  const toggleAuthType = () => {
    setAuthType(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <AuthForm
          type={authType}
          onSuccess={handleSuccess}
          onToggleType={toggleAuthType}
        />
      </div>
    </div>
  );
}