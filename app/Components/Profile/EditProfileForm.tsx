'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User } from '@/app/types/users';
import { authService } from '@/app/[locale]/services/authService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, User as UserIcon, Phone, Mail, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditProfileFormProps {
  user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const t = useTranslations('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  
  // Стан форми
  const [fullName, setFullName] = useState(user.full_name || '');
  const [phone, setPhone] = useState(user.phone || '');

  // Перевірка статусу пошти
  const isEmailConfirmed = !!user.email_confirmed_at;

  const handleResendEmail = async () => {
    setResendingEmail(true);
    // Припускаємо, що ви додали цей метод в authService на попередньому кроці
    const { error } = await authService.resendVerificationEmail(user.email);
    
    if (error) {
      toast.error(error);
    } else {
      toast.success(`Лист підтвердження надіслано на ${user.email}`);
    }
    setResendingEmail(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authService.updateProfile(user.id, {
        full_name: fullName,
        phone: phone,
        email: user.email, 
      });

      if (error) {
        console.error("Supabase Error:", error);
        toast.error(`Помилка: ${error}`);
      } else {
        toast.success(t('saveSuccess') || 'Профіль оновлено!');
        setIsEditing(false);
        window.location.reload(); 
      }
    } catch (err) {
      console.error("System Error:", err);
      toast.error('Сталася непередбачувана помилка');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.full_name || '');
    setPhone(user.phone || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">
          {t('title')}
        </h2>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Pencil size={16} />
            Редагувати
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          // ==================== РЕЖИМ ПЕРЕГЛЯДУ ====================
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Блок Пошти зі статусом */}
            <div className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border ${
              isEmailConfirmed 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' 
                : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30'
            }`}>
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-full ${
                  isEmailConfirmed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                }`}>
                  <Mail size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wide font-semibold">
                      {t('emailLabel')}
                    </p>
                    {isEmailConfirmed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-full shadow-sm">
                        <CheckCircle2 size={10} /> ПІДТВЕРДЖЕНО
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-full shadow-sm">
                        <AlertCircle size={10} /> НЕ ПІДТВЕРДЖЕНО
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium text-lg">
                    {user.email}
                  </p>
                  {!isEmailConfirmed && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      Неможливо оформити замовлення без підтвердженої пошти.
                    </p>
                  )}
                </div>
              </div>
              
              {!isEmailConfirmed && (
                <button
                  onClick={handleResendEmail}
                  disabled={resendingEmail}
                  className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  {resendingEmail ? 'Надсилання...' : 'Підтвердити пошту'}
                </button>
              )}
            </div>

            {/* Ім'я */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
              <div className="p-3 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-full">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wide font-semibold">
                  {t('fullNameLabel')}
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-lg">
                  {user.full_name || <span className="text-gray-400 italic">Не вказано</span>}
                </p>
              </div>
            </div>

            {/* Телефон */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
              <div className="p-3 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-full">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wide font-semibold">
                  {t('phoneLabel')}
                </p>
                <p className="text-gray-900 dark:text-white font-medium text-lg">
                  {user.phone || <span className="text-gray-400 italic">Не вказано</span>}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // ==================== РЕЖИМ РЕДАГУВАННЯ ====================
          <motion.form
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Пошта (ReadOnly) */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-neutral-500 mb-1.5">
                {t('emailLabel')} (не можна змінити)
              </label>
              <div className="px-4 py-3 bg-gray-100 dark:bg-neutral-800/50 rounded-xl text-gray-500 dark:text-gray-400 border border-transparent flex justify-between items-center">
                <span>{user.email}</span>
                {!isEmailConfirmed && (
                   <span className="text-xs text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                     Не підтверджено
                   </span>
                )}
              </div>
            </div>

            {/* Поле Ім'я */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                {t('fullNameLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ваше повне ім'я"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Поле Телефон */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                {t('phoneLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Цей номер буде автоматично пропонуватися при додаванні нових адрес.
              </p>
            </div>

            {/* Кнопки Дії */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  'Збереження...'
                ) : (
                  <>
                    <Save size={18} />
                    {t('saveButton') || 'Зберегти'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Скасувати
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}