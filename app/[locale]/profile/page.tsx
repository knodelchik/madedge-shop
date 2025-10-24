'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User } from '../../types/users';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { profile } = await authService.getUserProfile(user.id);
      setUser(profile);
      setLoading(false);
    };

    checkAuth();

    // Слухач змін автентифікації
    const {
      data: { subscription },
    } = authService.supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email:
              </label>
              <p className="text-gray-800">{user?.email}</p>
            </div>

            {user?.full_name && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name:
                </label>
                <p className="text-gray-800">{user.full_name}</p>
              </div>
            )}

            {user?.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone:
                </label>
                <p className="text-gray-800">{user.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
