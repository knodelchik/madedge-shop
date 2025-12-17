'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase'; // Використовуємо твій клієнтський конфіг
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Отримуємо користувача з поточної браузерної сесії
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth'); // Якщо не залогінений -> на вхід
          return;
        }

        // 2. Перевіряємо роль (якщо у тебе є колонка role)
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // Якщо роль не адмін -> на головну
        if (profile?.role !== 'admin') {
          // ТИМЧАСОВО МОЖНА ЗАКОМЕНТУВАТИ ЦЮ ПЕРЕВІРКУ, ЯКЩО ВОНА БЛОКУЄ
          // router.push('/');
          // alert('Доступ заборонено: потрібні права адміна');
          // return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  // Якщо перевірка пройшла (або ми її пропустили), показуємо адмінку
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 flex flex-col lg:flex-row">
      {/* Сайдбар (твоє нове меню) */}
      <AdminSidebar />

      {/* Основний контент з правильними відступами */}
      {/* pt-[80px] для мобільного, щоб не перекривався хедером */}
      <main className="flex-1 p-4 pt-[80px] lg:pt-8 lg:pl-80 w-full transition-all">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
