'use client';

import { useState, useEffect } from 'react';
import { authService } from '../[locale]/services/authService';
import { User } from '../types/users';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { user } = await authService.getCurrentUser();
      if (user) {
        const { profile } = await authService.getUserProfile(user.id);
        setUser(profile);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Profile</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        {user.full_name && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name:
            </label>
            <p className="text-gray-800">{user.full_name}</p>
          </div>
        )}

        {user.phone && (
          <div>
            <label className="text-sm font-medium text-gray-600">Phone:</label>
            <p className="text-gray-800">{user.phone}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
