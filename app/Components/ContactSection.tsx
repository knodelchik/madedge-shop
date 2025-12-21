'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl'; // 1. Імпорт useLocale
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { authService } from '../[locale]/services/authService';
import {
  TelegramIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from './icons/SocialIcons';

export default function ContactSection() {
  const tContacts = useTranslations('Contacts');
  const locale = useLocale(); // 2. Отримуємо поточну мову

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // === АВТОЗАПОВНЕННЯ ===
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { user } = await authService.getCurrentUser();

        if (user) {
          const { profile } = await authService.getUserProfile(user.id);
          setFormData((prev) => ({
            ...prev,
            name: profile?.full_name || user.full_name || '',
            email: profile?.email || user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error autoloading user data:', error);
      }
    };

    loadUserData();
  }, []);
  // ======================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 3. Передаємо всі дані форми + lang
        body: JSON.stringify({
          ...formData,
          lang: locale,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          tContacts('formSubmitSuccess') ||
            "Повідомлення надіслано! Ми зв'яжемося з вами."
        );
        setFormData((prev) => ({ ...prev, subject: '', message: '' }));
      } else {
        toast.error(data.error || 'Помилка відправки. Спробуйте пізніше.');
      }
    } catch (error) {
      toast.error("Помилка з'єднання.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      Icon: TelegramIcon,
      href: 'https://t.me/+380501391539',
      label: 'Telegram',
    },
    {
      Icon: YouTubeIcon,
      href: 'https://www.youtube.com/@and-1717',
      label: 'YouTube',
    },
    {
      Icon: FacebookIcon,
      href: 'https://www.facebook.com/MadEdgeK',
      label: 'Facebook',
    },
    {
      Icon: InstagramIcon,
      href: 'https://www.instagram.com/_madedge/',
      label: 'Instagram',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const contactInfoVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8 sm:py-10 md:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-3 sm:mb-4 px-2">
            {tContacts('contactTitle')}
          </h1>
          <motion.div
            className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#475fd8] to-[#35297e] mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '5rem' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-8 gap-6 sm:gap-8 md:gap-10">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-3 lg:mt-12"
            variants={contactInfoVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <motion.div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-5 sm:p-6 border border-gray-200 dark:border-neutral-800 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-neutral-100">
                {tContacts('connectTitle')}
              </h2>
              <p className="text-gray-600 dark:text-neutral-300 mb-5 sm:mb-6 text-sm">
                {tContacts('connectDesc')}
              </p>

              <motion.div
                className="space-y-5 sm:space-y-6 mb-5 sm:mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Phone */}
                <motion.div
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Phone className="w-4 h-4 text-gray-700 dark:text-neutral-100" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1 text-sm">
                      {tContacts('phoneTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm">
                      {tContacts('phoneValue')}
                    </p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Mail className="w-4 h-4 text-gray-700 dark:text-neutral-100" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1 text-sm">
                      {tContacts('emailTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm break-all">
                      {tContacts('emailValue')}
                    </p>
                  </div>
                </motion.div>

                {/* Business Hours */}
                <motion.div
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Clock className="w-4 h-4 text-gray-700 dark:text-neutral-100" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1 text-sm">
                      {tContacts('hoursTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm">
                      {tContacts('hoursMonFri')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Social */}
              <motion.div
                className="border-t border-gray-200 dark:border-neutral-800 pt-5 sm:pt-6"
                variants={itemVariants}
              >
                <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-gray-900 dark:text-neutral-100">
                  {tContacts('followUsTitle')}
                </h3>
                <p className="text-gray-600 dark:text-neutral-300 mb-3 sm:mb-4 text-sm">
                  {tContacts('followUsDesc')}
                </p>
                <motion.div
                  className="grid grid-cols-4 gap-2"
                  variants={containerVariants}
                >
                  {socialLinks.map(({ Icon, href, label }, idx) => (
                    <motion.a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-full aspect-square bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#475fd8] to-[#35297e] transition-all duration-300 group active:scale-95"
                      variants={itemVariants}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-neutral-100 group-hover:text-white transition-colors" />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-5"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <motion.div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-neutral-800 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-neutral-100 mb-1 sm:mb-2">
                {tContacts('formTitle')}
              </h2>
              <p className="text-gray-600 dark:text-neutral-300 mb-6 sm:mb-8 text-sm sm:text-base">
                {tContacts('formSubtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <motion.div
                  className="space-y-5 sm:space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="grid md:grid-cols-2 gap-4"
                    variants={itemVariants}
                  >
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-black dark:text-neutral-100 mb-2"
                      >
                        {tContacts('formNameLabel')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={tContacts('formNamePlaceholder')}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-neutral-300 focus:border-transparent focus:bg-white dark:focus:bg-neutral-700 transition-all duration-200 text-gray-900 dark:text-neutral-100 text-sm sm:text-base"
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-black dark:text-neutral-100 mb-2"
                      >
                        {tContacts('formEmailLabel')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={tContacts('formEmailPlaceholder')}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-neutral-300 focus:border-transparent focus:bg-white dark:focus:bg-neutral-700 transition-all duration-200 text-gray-900 dark:text-neutral-100 text-sm sm:text-base"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-black dark:text-neutral-100 mb-2"
                    >
                      {tContacts('formSubjectLabel')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={tContacts('formSubjectPlaceholder')}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-neutral-300 focus:border-transparent focus:bg-white dark:focus:bg-neutral-700 transition-all duration-200 text-gray-900 dark:text-neutral-100 text-sm sm:text-base"
                    />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-black dark:text-neutral-100 mb-2"
                    >
                      {tContacts('formMessageLabel')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={tContacts('formMessagePlaceholder')}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-neutral-300 focus:border-transparent focus:bg-white dark:focus:bg-neutral-700 transition-all duration-200 resize-none text-gray-900 dark:text-neutral-100 text-sm sm:text-base"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-3 sm:py-4 px-5 sm:px-6 rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 text-sm sm:text-base"
                    variants={itemVariants}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white dark:border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        <span>{tContacts('formSubmitting')}</span>
                      </>
                    ) : (
                      <>
                        <span>{tContacts('formSubmit')}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
