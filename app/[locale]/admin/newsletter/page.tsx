'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Ваша кнопка (або звичайна HTML)
import { toast } from 'sonner';
import { Trash2, Send, Users, Mail, Globe } from 'lucide-react';
import {
  getSubscribers,
  deleteSubscriber,
  sendBulkEmail,
  type Subscriber,
} from '@/app/actions/admin-newsletter';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Стан активної вкладки
  const [activeTab, setActiveTab] = useState<'en' | 'uk'>('en');

  // Дані форми для ДВОХ мов
  const [formData, setFormData] = useState({
    en: { subject: '', message: '' },
    uk: { subject: '', message: '' },
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (e) {
      toast.error('Не вдалося завантажити список');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Видалити підписника?')) return;
    try {
      await deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success('Видалено');
    } catch (e) {
      toast.error('Помилка видалення');
    }
  }

  // Зміна полів форми
  const handleInputChange = (field: 'subject' | 'message', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  // Генератор HTML для листа (щоб було красиво)
  const generateHtml = (text: string, title: string, lang: 'en' | 'uk') => {
    const footerText =
      lang === 'en'
        ? 'You received this email because you subscribed to MadEdge news.'
        : 'Ви отримали цей лист, бо підписалися на новини MadEdge.';

    return `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">${title}</h2>
        <div style="font-size: 16px; line-height: 1.6; padding: 20px 0;">
          ${text.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888; text-align: center;">
          ${footerText}
        </p>
      </div>
    `;
  };

  async function handleSend() {
    // Валідація
    if (!formData.en.subject.trim() || !formData.en.message.trim()) {
      toast.warning('Заповніть англійську версію!');
      setActiveTab('en');
      return;
    }
    if (!formData.uk.subject.trim() || !formData.uk.message.trim()) {
      toast.warning('Заповніть українську версію!');
      setActiveTab('uk');
      return;
    }

    const confirmMsg = `Відправити розсилку ${subscribers.length} підписникам?`;
    if (!confirm(confirmMsg)) return;

    setSending(true);
    try {
      // Готуємо контент
      const contentEn = {
        subject: formData.en.subject,
        htmlBody: generateHtml(formData.en.message, formData.en.subject, 'en'),
      };

      const contentUk = {
        subject: formData.uk.subject,
        htmlBody: generateHtml(formData.uk.message, formData.uk.subject, 'uk'),
      };

      // Відправляємо на сервер
      const res = await sendBulkEmail(contentEn, contentUk);

      if (res.success) {
        toast.success(res.message);
        // Очистка
        setFormData({
          en: { subject: '', message: '' },
          uk: { subject: '', message: '' },
        });
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error('Критична помилка при відправці');
    } finally {
      setSending(false);
    }
  }

  const inputClassName =
    'w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all';

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Mail className="w-8 h-8" /> Розсилка новин
        </h1>
        <div className="text-sm text-gray-500">
          В базі:{' '}
          <span className="font-bold text-black dark:text-white">
            {subscribers.length}
          </span>{' '}
          підписників
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === ЛІВА КОЛОНКА: ФОРМА === */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Send className="w-5 h-5" /> Створити лист
            </h2>

            {/* Вкладки мов */}
            <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  activeTab === 'en'
                    ? 'bg-white dark:bg-black shadow text-black dark:text-white font-medium'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                English 🇺🇸
              </button>
              <button
                onClick={() => setActiveTab('uk')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  activeTab === 'uk'
                    ? 'bg-white dark:bg-black shadow text-black dark:text-white font-medium'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                Українська 🇺🇦
              </button>
            </div>
          </div>

          {/* Поля вводу (динамічні для активної мови) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Тема листа ({activeTab === 'en' ? 'EN' : 'UA'})
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder={
                  activeTab === 'en'
                    ? 'Example: New Arrivals...'
                    : 'Наприклад: Нове надходження...'
                }
                value={formData[activeTab].subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Текст повідомлення ({activeTab === 'en' ? 'EN' : 'UA'})
              </label>
              <textarea
                className={`${inputClassName} min-h-[250px] resize-y`}
                placeholder={
                  activeTab === 'en'
                    ? 'Email content here...'
                    : 'Текст листа тут...'
                }
                value={formData[activeTab].message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={sending || subscribers.length === 0}
            className="w-full h-12 text-base"
          >
            {sending ? 'Відправка...' : 'Відправити всім (Multi-Language)'}
          </Button>
        </div>

        {/* === ПРАВА КОЛОНКА: СПИСОК === */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 flex flex-col h-[600px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Users className="w-5 h-5" /> Підписники
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              Оновити
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Завантаження...
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 dark:bg-neutral-900 rounded-lg">
                Список порожній
              </div>
            ) : (
              subscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {sub.email}
                      </span>
                      {/* Бейдж мови */}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                          sub.lang === 'uk'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-gray-400'
                        }`}
                      >
                        {sub.lang || 'en'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(sub.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
