'use server';

import { createClient } from '@/lib/supabase-server';
import sgMail from '@sendgrid/mail';

// Ініціалізація SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export type Subscriber = {
  id: number;
  email: string;
  lang: string; // ✅ Важливо: поле мови з бази
  created_at: string;
};

// Тип даних для однієї мовної версії листа
export type EmailContent = {
  subject: string;
  htmlBody: string;
};

// 1. Отримання всіх підписників
export async function getSubscribers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscribers')
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
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// 3. Масова розсилка (Мультимовна)
export async function sendBulkEmail(
  contentEn: EmailContent,
  contentUk: EmailContent
) {
  const subscribers = await getSubscribers();

  if (!subscribers || subscribers.length === 0) {
    return { success: false, message: 'Немає підписників для розсилки' };
  }

  let sentCount = 0;
  let errorCount = 0;

  // Promise.allSettled дозволяє відправити всім, навіть якщо один впаде з помилкою
  const results = await Promise.allSettled(
    subscribers.map((sub) => {
      // === ГОЛОВНА ЛОГІКА МОВИ ===
      // Якщо в базі 'uk' -> беремо контент UK, інакше -> EN
      const isUk = sub.lang === 'uk';
      const emailData = isUk ? contentUk : contentEn;
      const fromName = isUk ? 'MadEdge Україна' : 'MadEdge Global';

      const msg = {
        to: sub.email,
        from: {
          email: 'info@madedge.net', // Ваш верифікований email
          name: fromName,
        },
        subject: emailData.subject,
        html: emailData.htmlBody,
      };

      return sgMail.send(msg);
    })
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      sentCount++;
    } else {
      errorCount++;
      console.error('Email send error:', result.reason);
    }
  });

  return {
    success: true,
    message: `Відправлено: ${sentCount}, Помилок: ${errorCount}`,
  };
}
