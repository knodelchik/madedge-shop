'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
// Використовуємо ваш існуючий клієнт
import { supabase } from '@/app/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Базовий URL для картинок (про всяк випадок, якщо в базі відносні шляхи)
const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`;

interface ProductFeature {
  name: string;
  value: string;
}

interface ComparisonProduct {
  id: number;
  name: string; // Це поле має співпадати з 'title' в базі даних
  features: ProductFeature[];
}

const ProductComparison: React.FC = () => {
  const t = useTranslations('Product');
  
  // 1. ДАНІ ПОРІВНЯННЯ БЕРЕМО ТІЛЬКИ З ПЕРЕКЛАДІВ
  const products = t.raw('products') as ComparisonProduct[];

  // 2. СТАН ДЛЯ КАРТИНОК (Словник: "Назва" -> "URL Картинки")
  const [imagesMap, setImagesMap] = useState<Record<string, string>>({});

  // Стейт для вибраних ID
  const [firstId, setFirstId] = useState<string>(
    products.length > 0 ? products[0].id.toString() : ''
  );
  const [secondId, setSecondId] = useState<string>(
    products.length > 1 ? products[1].id.toString() : ''
  );

  // 3. ФЕТЧИМО ТІЛЬКИ КАРТИНКИ З БАЗИ
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Беремо всі продукти (або фільтруємо за категорією, якщо треба)
        const { data, error } = await supabase
          .from('products')
          .select('title, images');

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        const map: Record<string, string> = {};

        if (data) {
          data.forEach((item: any) => {
            // Перевірка: чи є масив картинок і чи він не пустий
            if (Array.isArray(item.images) && item.images.length > 0) {
               // Ключ = Назва з бази (має співпадати з перекладом)
               // Значення = Перше фото
               map[item.title] = item.images[0];
            }
          });
        }
        setImagesMap(map);
      } catch (e) {
        console.error(e);
      }
    };

    fetchImages();
  }, []);

  // Знаходимо вибрані продукти (з перекладів)
  const product1 = products.find((p) => p.id.toString() === firstId);
  const product2 = products.find((p) => p.id.toString() === secondId);

  // 4. ФУНКЦІЯ ОТРИМАННЯ КАРТИНКИ ПО НАЗВІ
  const getImageUrl = (productName: string) => {
    const imagePath = imagesMap[productName];

    if (!imagePath) return '/images/notfound.png';

    // Якщо в базі повний URL - повертаємо його
    if (imagePath.startsWith('http')) return imagePath;
    
    // Якщо відносний шлях - додаємо домен стореджа
    return `${STORAGE_URL}/${imagePath}`;
  };

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/images/notfound.png';
  };

  // Характеристики другого товару
  const getFeatureValue = (product: ComparisonProduct, featureName: string) => {
    const f = product.features.find((item) => item.name === featureName);
    return f ? f.value : '-';
  };

  // Анімації
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const productVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };
  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: custom * 0.1 },
    }),
  };

  if (!product1 || !product2) return null;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-black transition-colors duration-500">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-gray-900 dark:text-white">
          {t('productComparison')}
        </h2>

        {/* SELECTS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10 max-w-2xl mx-auto">
          <div className="w-full">
            <Select value={firstId} onValueChange={setFirstId}>
              <SelectTrigger className="w-full h-12 bg-white dark:bg-[#111111] border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-xl">
                <SelectValue placeholder="Select product 1" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem 
                    key={p.id} 
                    value={p.id.toString()} 
                    disabled={p.id.toString() === secondId}
                    className="cursor-pointer"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select value={secondId} onValueChange={setSecondId}>
              <SelectTrigger className="w-full h-12 bg-white dark:bg-[#111111] border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-xl">
                <SelectValue placeholder="Select product 2" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem 
                    key={p.id} 
                    value={p.id.toString()}
                    disabled={p.id.toString() === firstId}
                    className="cursor-pointer"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* DESKTOP COMPARISON */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-10 items-start text-center">
          
          {/* Product 1 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`p1-${product1.name}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-square mx-auto">
                <Image
                  src={getImageUrl(product1.name)} // Пошук фото по назві з перекладу
                  alt={product1.name}
                  fill
                  onError={onImgError}
                  className="rounded-xl shadow-lg object-contain bg-white dark:bg-[#111] border border-gray-200 dark:border-neutral-800 p-2"
                />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900 dark:text-white">
                {product1.name}
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* Features List */}
          <div className="flex flex-col pt-4">
            {product1.features.map((f, idx) => (
              <motion.div 
                key={idx} 
                custom={idx}
                variants={featureVariants}
                className="flex items-center py-3 text-center"
              >
                {/* Val 1 */}
                <div className="w-1/3 text-sm px-2 text-gray-700 dark:text-gray-400">
                  {f.value}
                </div>
                {/* Name */}
                <div className="w-1/3 flex flex-col items-center">
                   <span className="bg-gray-100 dark:bg-[#111111] px-2 py-1 rounded text-xs font-medium border dark:border-neutral-800 text-gray-800 dark:text-white whitespace-nowrap">
                     {f.name}
                   </span>
                   {idx !== product1.features.length - 1 && (
                      <div className="h-4 border-l border-gray-200 dark:border-neutral-800 mt-2"></div>
                   )}
                </div>
                {/* Val 2 */}
                <div className="w-1/3 text-sm px-2 text-gray-700 dark:text-gray-400">
                  {getFeatureValue(product2, f.name)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Product 2 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`p2-${product2.name}`}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-square mx-auto">
                <Image
                  src={getImageUrl(product2.name)} // Пошук фото по назві з перекладу
                  alt={product2.name}
                  fill
                  onError={onImgError}
                  className="rounded-xl shadow-lg object-contain bg-white dark:bg-[#111] border border-gray-200 dark:border-neutral-800 p-2"
                />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-900 dark:text-white">
                {product2.name}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MOBILE VERSION */}
        <div className="md:hidden space-y-8">
           {/* Render Product 1 */}
           <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
              <div className="relative w-[200px] h-[200px] mx-auto mb-4">
                 <Image 
                   src={getImageUrl(product1.name)} 
                   alt={product1.name} 
                   fill 
                   onError={onImgError}
                   className="object-contain rounded-xl"
                 />
              </div>
              <h3 className="text-center font-bold mb-4 text-gray-900 dark:text-white">{product1.name}</h3>
              {product1.features.map((f, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-neutral-800 text-sm last:border-0">
                  <span className="text-gray-500">{f.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{f.value}</span>
                </div>
              ))}
           </div>

           {/* Render Product 2 */}
           <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-4 border border-gray-200 dark:border-neutral-800">
              <div className="relative w-[200px] h-[200px] mx-auto mb-4">
                 <Image 
                   src={getImageUrl(product2.name)} 
                   alt={product2.name} 
                   fill 
                   onError={onImgError}
                   className="object-contain rounded-xl" 
                 />
              </div>
              <h3 className="text-center font-bold mb-4 text-gray-900 dark:text-white">{product2.name}</h3>
              {product2.features.map((f, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-neutral-800 text-sm last:border-0">
                   <span className="text-gray-500">{f.name}</span>
                   <span className="font-medium text-gray-900 dark:text-white">{getFeatureValue(product2, f.name)}</span>
                </div>
              ))}
           </div>
        </div>

      </motion.div>
    </section>
  );
};

export default ProductComparison;