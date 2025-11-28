'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Send, Users, Mail } from 'lucide-react';
import { 
  getSubscribers, 
  deleteSubscriber, 
  sendBulkEmail, 
  type Subscriber 
} from '@/app/actions/admin-newsletter';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Завантаження при вході
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
      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast.success('Видалено');
    } catch (e) {
      toast.error('Помилка видалення');
    }
  }

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      toast.warning('Заповніть тему та текст');
      return;
    }

    const confirmMsg = `Ви впевнені? Лист буде відправлено ${subscribers.length} людям.`;
    if (!confirm(confirmMsg)) return;

    setSending(true);
    try {
      const htmlBody = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">${subject}</h2>
          <div style="font-size: 16px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            Ви отримали цей лист, бо підписалися на новини MadEdge.
          </p>
        </div>
      `;

      const res = await sendBulkEmail(subject, htmlBody);
      
      if (res.success) {
        toast.success(res.message);
        setSubject('');
        setMessage('');
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error('Критична помилка при відправці');
    } finally {
      setSending(false);
    }
  }

  // Загальні стилі для інпутів (взяті з ProductForm)
  const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all";

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="w-8 h-8" /> Розсилка новин
        </h1>
        <div className="text-sm text-gray-500">
          В базі: <span className="font-bold text-black dark:text-white">{subscribers.length}</span> підписників
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ФОРМА ВІДПРАВКИ */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 space-y-5 h-fit shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Send className="w-5 h-5" /> Створити лист
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Тема листа</label>
            {/* Використовуємо звичайний input замість компонента */}
            <input 
              type="text"
              className={inputClassName}
              placeholder="Наприклад: Знижки на точильні камені..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Текст повідомлення</label>
            {/* Використовуємо звичайний textarea замість компонента */}
            <textarea 
              className={`${inputClassName} min-h-[250px] resize-y`}
              placeholder="Текст вашого листа тут..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              * Переноси рядків будуть збережені.
            </p>
          </div>

          <Button 
            onClick={handleSend} 
            disabled={sending || subscribers.length === 0}
            className="w-full h-12 text-base"
          >
            {sending ? 'Відправка...' : 'Відправити всім підписникам'}
          </Button>
        </div>

        {/* СПИСОК ПІДПИСНИКІВ */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-neutral-800 flex flex-col h-[600px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Підписники
            </h2>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              Оновити
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Завантаження...</div>
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
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{sub.email}</span>
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