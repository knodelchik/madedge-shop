'use server';

import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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

export async function deleteSubscriber(id: number) {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// --- ОНОВЛЕНА ФУНКЦІЯ МАСОВОЇ РОЗСИЛКИ ---
export async function sendBulkEmail(
  contentEn: EmailContent,
  contentUk: EmailContent,
  target: 'all' | 'uk' | 'en' // Новий параметр
) {
  const subscribers = await getSubscribers();

  if (!subscribers || subscribers.length === 0) {
    return { success: false, message: 'Немає підписників' };
  }

  // 1. Фільтруємо аудиторію на сервері
  const recipients = subscribers.filter((sub) => {
    if (target === 'all') return true;
    if (target === 'uk') return sub.lang === 'uk';
    if (target === 'en') return sub.lang !== 'uk'; // Всі, хто не 'uk', вважаються міжнародними
    return false;
  });

  if (recipients.length === 0) {
    return { success: false, message: 'Немає підписників для обраної аудиторії' };
  }

  let sentCount = 0;
  let errorCount = 0;

  const promises = recipients.map((sub) => {
    const isUk = sub.lang === 'uk';
    
    // 2. Вибираємо контент.
    // Якщо ми шлемо тільки на EN, то contentUk може бути пустим, і це ок.
    let emailData;
    
    if (target === 'all') {
       emailData = isUk ? contentUk : contentEn;
    } else if (target === 'uk') {
       emailData = contentUk;
    } else {
       emailData = contentEn;
    }

    // Фоллбек, якщо щось пішло не так з контентом
    const finalSubject = emailData.subject || 'MadEdge News';
    const finalHtml = emailData.htmlBody || '<p>News from MadEdge</p>';

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
    message: `Відправлено: ${sentCount}, Помилок: ${errorCount}`,
  };
}