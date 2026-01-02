'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Send, Users, Mail, CheckCircle2, Globe2, MapPin } from 'lucide-react';
import {
  getSubscribers,
  deleteSubscriber,
  sendBulkEmail,
  type Subscriber,
} from '@/app/actions/admin-newsletter';
// 1. Імпортуємо наш редактор
import RichTextEditor from '@/app/Components/RichTextEditor';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // --- НОВИЙ СТАН: Цільова аудиторія ---
  const [targetAudience, setTargetAudience] = useState<'all' | 'uk' | 'en'>('all');
  
  // Стан активної вкладки редактора (синхронізується з аудиторією)
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'uk'>('en');

  const [formData, setFormData] = useState({
    en: { subject: '', message: '' },
    uk: { subject: '', message: '' },
  });

  useEffect(() => {
    loadData();
  }, []);

  // Коли змінюється аудиторія, автоматично перемикаємо вкладку редактора
  useEffect(() => {
    if (targetAudience === 'uk') setActiveLangTab('uk');
    if (targetAudience === 'en') setActiveLangTab('en');
    // Якщо 'all', залишаємо поточну вкладку або скидаємо на 'en'
  }, [targetAudience]);

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

  // 2. Оновлений обробник. Тепер він універсальний для input (e.target.value) і для Editor (value string)
  const handleInputChange = (field: 'subject' | 'message', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeLangTab]: {
        ...prev[activeLangTab],
        [field]: value,
      },
    }));
  };

  // Фільтруємо підписників для відображення
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      if (targetAudience === 'all') return true;
      if (targetAudience === 'uk') return sub.lang === 'uk';
      if (targetAudience === 'en') return sub.lang !== 'uk';
      return true;
    });
  }, [subscribers, targetAudience]);

  // Генератор HTML: тепер він просто обгортає контент з редактора
  const generateHtml = (text: string, title: string, lang: 'en' | 'uk') => {
    const footerText =
      lang === 'en'
        ? 'You received this email because you subscribed to MadEdge news.'
        : 'Ви отримали цей лист, бо підписалися на новини MadEdge.';

    const buttonText = lang === 'en' ? 'Visit Website' : 'Перейти на сайт';
    
    // Посилання на сайт (якщо змінна оточення не задана, використовуємо домен за замовчуванням)
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://madedge.net';

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 0;">${title}</h2>
        
        <div style="font-size: 16px; line-height: 1.6; padding: 20px 0;">
          ${text}
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}" target="_blank" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif;">
              ${buttonText}
            </a>
        </div>

        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
        
        <p style="font-size: 12px; color: #888; text-align: center;">
          ${footerText}
        </p>
      </div>
    `;
  };

  async function handleSend() {
    // Валідація залежно від аудиторії
    const checkEn = targetAudience === 'all' || targetAudience === 'en';
    const checkUk = targetAudience === 'all' || targetAudience === 'uk';

    // Перевіряємо на пустоту, але враховуємо що пустий редактор може давати "<p><br></p>"
    const isEditorEmpty = (html: string) => !html || html === '<p><br></p>' || html.trim() === '';

    if (checkEn && (!formData.en.subject.trim() || isEditorEmpty(formData.en.message))) {
      toast.warning('Заповніть англійську версію!');
      setActiveLangTab('en');
      return;
    }
    if (checkUk && (!formData.uk.subject.trim() || isEditorEmpty(formData.uk.message))) {
      toast.warning('Заповніть українську версію!');
      setActiveLangTab('uk');
      return;
    }

    const confirmMsg = `Відправити розсилку ${filteredSubscribers.length} підписникам? (${targetAudience.toUpperCase()})`;
    if (!confirm(confirmMsg)) return;

    setSending(true);
    try {
      const contentEn = {
        subject: formData.en.subject,
        htmlBody: generateHtml(formData.en.message, formData.en.subject, 'en'),
      };

      const contentUk = {
        subject: formData.uk.subject,
        htmlBody: generateHtml(formData.uk.message, formData.uk.subject, 'uk'),
      };

      // Передаємо target на сервер
      const res = await sendBulkEmail(contentEn, contentUk, targetAudience);

      if (res.success) {
        toast.success(res.message);
        // Очистка полів тільки тих, що відправляли
        setFormData((prev) => ({
            en: checkEn ? { subject: '', message: '' } : prev.en,
            uk: checkUk ? { subject: '', message: '' } : prev.uk,
        }));
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
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Mail className="w-8 h-8" /> Розсилка новин
        </h1>
      </div>

      {/* === БЛОК ВИБОРУ АУДИТОРІЇ === */}
      <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            Крок 1. Оберіть аудиторію отримувачів:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
                onClick={() => setTargetAudience('all')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    targetAudience === 'all' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-transparent bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
                <Globe2 className="w-5 h-5" />
                <div className="text-left">
                    <div className="font-bold text-sm">Всі підписники</div>
                    <div className="text-xs opacity-70">Мультимовна розсилка</div>
                </div>
                {targetAudience === 'all' && <CheckCircle2 className="w-5 h-5 ml-auto" />}
            </button>

            <button
                onClick={() => setTargetAudience('uk')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    targetAudience === 'uk' 
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' 
                    : 'border-transparent bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                    <div className="font-bold text-sm">Тільки Україна 🇺🇦</div>
                    <div className="text-xs opacity-70">Лише українська мова</div>
                </div>
                {targetAudience === 'uk' && <CheckCircle2 className="w-5 h-5 ml-auto" />}
            </button>

            <button
                onClick={() => setTargetAudience('en')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    targetAudience === 'en' 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                    : 'border-transparent bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
            >
                <Globe2 className="w-5 h-5" />
                <div className="text-left">
                    <div className="font-bold text-sm">Тільки Закордон 🌎</div>
                    <div className="text-xs opacity-70">Лише англійська мова</div>
                </div>
                {targetAudience === 'en' && <CheckCircle2 className="w-5 h-5 ml-auto" />}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === ЛІВА КОЛОНКА: ФОРМА === */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 space-y-5 shadow-sm h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Send className="w-5 h-5" /> Крок 2. Зміст листа
            </h2>

            {/* Вкладки мов */}
            {targetAudience === 'all' ? (
                <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeLangTab === 'en'
                        ? 'bg-white dark:bg-black shadow text-black dark:text-white font-medium'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                >
                    English
                </button>
                <button
                    onClick={() => setActiveLangTab('uk')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeLangTab === 'uk'
                        ? 'bg-white dark:bg-black shadow text-black dark:text-white font-medium'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                >
                    Українська
                </button>
                </div>
            ) : (
                <span className="px-3 py-1 text-sm font-bold bg-gray-100 dark:bg-neutral-800 rounded-md">
                    {activeLangTab === 'en' ? 'English Version' : 'Українська версія'}
                </span>
            )}
          </div>

          {/* Поля вводу */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Тема листа ({activeLangTab === 'en' ? 'EN' : 'UA'})
              </label>
              <input
                type="text"
                className={inputClassName}
                placeholder={
                    activeLangTab === 'en'
                    ? 'Subject line...'
                    : 'Тема листа...'
                }
                value={formData[activeLangTab].subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Текст повідомлення ({activeLangTab === 'en' ? 'EN' : 'UA'})
              </label>
              {/* 3. Заміна textarea на RichTextEditor */}
              <div className="prose-editor-wrapper">
                <RichTextEditor
                    value={formData[activeLangTab].message}
                    onChange={(value) => handleInputChange('message', value)}
                    placeholder={
                        activeLangTab === 'en'
                        ? 'Write your email content here...'
                        : 'Напишіть текст листа тут...'
                    }
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={sending || filteredSubscribers.length === 0}
            className="w-full h-12 text-base font-bold"
          >
            {sending 
                ? 'Відправка...' 
                : `Відправити ${filteredSubscribers.length} отримувачам`
            }
          </Button>
        </div>

        {/* === ПРАВА КОЛОНКА: СПИСОК ОТРИМУВАЧІВ === */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 flex flex-col h-[600px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
              <Users className="w-5 h-5" /> Отримувачі ({filteredSubscribers.length})
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
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-dashed border-gray-200 dark:border-neutral-800">
                Жодного підписника для обраної категорії.
              </div>
            ) : (
              filteredSubscribers.map((sub) => (
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
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
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