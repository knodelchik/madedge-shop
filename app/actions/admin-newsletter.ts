'use server';

import { createClient } from '@/lib/supabase-server';
import { Resend } from 'resend';

// Ініціалізація Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Тип для підписника
export type Subscriber = {
  id: number; // Ваша таблиця використовує bigint, тому тут number (або string, якщо число велике)
  email: string;
  created_at: string;
};

// 1. Отримання всіх підписників
export async function getSubscribers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subscribers') // ✅ Ваша назва таблиці
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Не вдалося завантажити підписників');
  }
  
  return data as Subscriber[];
}

// 2. Видалення підписника
export async function deleteSubscriber(id: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

// 3. Масова розсилка
export async function sendBulkEmail(subject: string, htmlContent: string) {
  const subscribers = await getSubscribers();
  
  if (!subscribers || subscribers.length === 0) {
    return { success: false, message: 'Немає підписників для розсилки' };
  }

  // Примітка: Безкоштовний тариф Resend має ліміт 100 листів на день.
  // Для великих баз краще використовувати resend.batch.send (платний) або черги.
  // Тут ми робимо просту паралельну відправку.

  let sentCount = 0;
  let errorCount = 0;

  // Використовуємо Promise.allSettled, щоб помилка в одному листі не зупинила інші
  const results = await Promise.allSettled(
    subscribers.map((sub) =>
      resend.emails.send({
        from: 'MadEdge <onboarding@resend.dev>', // ⚠️ ЗАМІНІТЬ на ваш верифікований домен, коли він буде
        to: sub.email,
        subject: subject,
        html: htmlContent,
      })
    )
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled' && !result.value.error) {
      sentCount++;
    } else {
      errorCount++;
      console.error('Email send error:', result.status === 'rejected' ? result.reason : result.value.error);
    }
  });

  return { 
    success: true, 
    message: `Відправлено: ${sentCount}, Помилок: ${errorCount}` 
  };
}