'use client';

import { motion } from 'framer-motion';
import { Zap, ClipboardList, Target, Wrench } from 'lucide-react';

export default function VideoSection() {
  const steps = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'Easy Assembly',
      desc: 'Takes 5-10 minutes',
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-blue-500" />,
      title: 'Clear Instructions',
      desc: 'Step by step guidance',
    },
    {
      icon: <Target className="w-5 h-5 text-red-500" />,
      title: 'Precise Adjustment',
      desc: 'Perfect angle setup',
    },
    {
      icon: <Wrench className="w-5 h-5 text-gray-600" />,
      title: 'Complete Kit',
      desc: 'Everything included',
    },
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
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="MadEdge Assembly Video"
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
          {/* Title + Description */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              Device Assembly
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A simple assembly process shown in video that takes just a few
              minutes. All the necessary parts and tools are included in your
              MadEdge kit.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-100 flex items-start gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => alert('View detailed instructions')}
              className="flex-1 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Detailed Instructions
            </button>
            <button
              onClick={() => alert('Download PDF')}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold"
            >
              PDF ↓
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
