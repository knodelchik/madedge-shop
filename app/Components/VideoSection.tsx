'use client';

import { motion } from 'framer-motion';
import { Zap, ClipboardList, Target, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translation/translations';

export default function VideoSection() {
  const { language } = useLanguage();
  const t = translations[language];

  const icons = [Zap, ClipboardList, Target, Wrench];
  const colors = [
    'text-yellow-500',
    'text-blue-500',
    'text-red-500',
    'text-gray-600',
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">
        {/* Left side – Video */}
        <motion.div
          className="w-full aspect-video rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.youtube.com/embed/WXdFfbQfzBs"
            title={t.assemblyTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full"
            allowFullScreen
          />
        </motion.div>

        {/* Right side – Text + Cards + Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              {t.assemblyTitle}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.assemblyText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {t.assemblySteps.map((step, idx) => {
              const Icon = icons[idx];
              return (
                <motion.div
                  key={idx}
                  className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-100 flex items-start gap-3`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`w-5 h-5 ${colors[idx]}`} />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => alert(t.assemblyButtonText)}
              className="flex-1 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              {t.assemblyButtonText}
            </button>
            <button
              onClick={() => alert(t.assemblyPdfText)}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
            >
              {t.assemblyPdfText}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
