'use client';

import { motion } from 'framer-motion';
import { Zap, ClipboardList, Target, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function VideoSection() {
  const t = useTranslations('Assembly');
  const router = useRouter();

  const assemblySteps = t.raw('assemblySteps') as {
    title: string;
    desc: string;
  }[];

  const icons = [Zap, ClipboardList, Target, Wrench];
  const colors = [
    'text-yellow-500',
    'text-blue-500',
    'text-red-500',
    'text-gray-600',
  ];

  const handleButtonClick = () => {
    router.push('/about#madedge-services');
  };

  const handlePdfDownload = () => {
    const pdfUrl = '/pdf/MADEDGE INSTRUCTIONS.pdf';

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'MADEDGE INSTRUCTIONS.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="video-section"
      className="w-full bg-white dark:bg-black py-20 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">
        {/* Left side – Video */}
        <motion.div
          className="w-full aspect-video rounded-xl overflow-hidden shadow-lg dark:shadow-neutral-800"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.youtube.com/embed/WXdFfbQfzBs"
            title={t('assemblyTitle')}
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
            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              {t('assemblyTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-[#888888] leading-relaxed">
              {t('assemblyText')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {assemblySteps.map((step, idx) => {
              const Icon = icons[idx];
              return (
                <motion.div
                  key={idx}
                  className="bg-gray-50 dark:bg-[#111111] rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors border border-gray-100 dark:border-neutral-800 flex items-start gap-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`w-5 h-5 ${colors[idx]}`} />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-[#888888]">
                      {step.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleButtonClick}
              className="flex-1 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-300 transition font-semibold cursor-pointer"
            >
              {t('assemblyButtonText')}
            </button>
            <button
              onClick={handlePdfDownload}
              className="px-5 py-3 border border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 text-gray-700 dark:text-white rounded-lg hover:border-gray-500 dark:hover:border-neutral-700 transition font-semibold cursor-pointer"
            >
              {t('assemblyPdfText')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
