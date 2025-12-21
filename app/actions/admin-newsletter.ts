'use server';

import { createClient } from '@supabase/supabase-js'; // Використовуємо admin client напряму тут для надійності
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Створюємо клієнт з Service Role Key для обходу RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type Subscriber = {
  id: number;
  email: string;
  lang: string;
  created_at: string;
};

export type EmailContent = {
  subject: string;
  htmlBody: string;
};

// 1. Отримання підписників
export async function getSubscribers() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
  return data as Subscriber[];
}

// 2. Видалення
export async function deleteSubscriber(id: number) {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// 3. МАСОВА РОЗСИЛКА (Виправлена логіка)
export async function sendBulkEmail(
  contentEn: EmailContent,
  contentUk: EmailContent
) {
  const subscribers = await getSubscribers();

  if (!subscribers || subscribers.length === 0) {
    return { success: false, message: 'Немає підписників' };
  }

  let sentCount = 0;
  let errorCount = 0;

  // Використовуємо map для створення масиву промісів
  const promises = subscribers.map((sub) => {
    // ⚠️ ГОЛОВНА ЛОГІКА:
    // Перевіряємо, чи є lang = 'uk'. Якщо ні — вважаємо 'en'.
    const isUk = sub.lang === 'uk';

    // Вибираємо правильний контент
    const emailData = isUk ? contentUk : contentEn;

    // Якщо раптом для вибраної мови тема порожня, беремо англійську як запасну
    const finalSubject = emailData.subject || contentEn.subject;
    const finalHtml = emailData.htmlBody || contentEn.htmlBody;

    const msg = {
      to: sub.email,
      from: {
        email: 'info@madedge.net',
        name: isUk ? 'MadEdge Україна' : 'MadEdge Global',
      },
      subject: finalSubject,
      html: finalHtml,
    };

    return sgMail
      .send(msg)
      .then(() => ({ status: 'fulfilled', email: sub.email }))
      .catch((err) => ({ status: 'rejected', email: sub.email, reason: err }));
  });

  const results = await Promise.all(promises);

  results.forEach((res: any) => {
    if (res.status === 'fulfilled') {
      sentCount++;
    } else {
      errorCount++;
      console.error(`Failed to send to ${res.email}:`, res.reason);
    }
  });

  return {
    success: true,
    message: `Успішно: ${sentCount}, Помилок: ${errorCount}`,
  };
}
