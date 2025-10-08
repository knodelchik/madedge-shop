'use client';
import { useState } from 'react';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  TelegramIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from './icons/SocialIcons';
import { translations } from '../translation/translations';

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(t.formSubmit);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.contactTitle}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#475fd8] to-[#35297e] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-8 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-3 mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {t.connectTitle}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">{t.connectDesc}</p>

              <div className="space-y-6 mb-6">
                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300">
                    <Phone className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      {t.phoneTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">{t.phoneValue}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300">
                    <Mail className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      {t.emailTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">{t.emailValue}</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300">
                    <Clock className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      {t.hoursTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">{t.hoursMonFri}</p>
                    <p className="text-gray-600 text-sm">{t.hoursSat}</p>
                    <p className="text-gray-600 text-sm">{t.hoursSun}</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {t.followUsTitle}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{t.followUsDesc}</p>
                <div className="grid grid-cols-4 gap-2">
                  {[TelegramIcon, YouTubeIcon, FacebookIcon, InstagramIcon].map(
                    (Icon, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#475fd8] to-[#35297e] hover:scale-110 transition-all duration-300 group"
                      >
                        <Icon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-2">
                {t.formTitle}
              </h2>
              <p className="text-gray-600 mb-8">{t.formSubtitle}</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      {t.formNameLabel}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t.formNamePlaceholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-black mb-2"
                    >
                      {t.formEmailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t.formEmailPlaceholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    {t.formSubjectLabel}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.formSubjectPlaceholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    {t.formMessageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.formMessagePlaceholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>{t.formSubmit}</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
