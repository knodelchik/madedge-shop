'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Loader2, Upload, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProductFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: product?.title || '',
    title_uk: product?.title_uk || '', // Додано
    price: product?.price || '',
    stock: product?.stock || 0,
    category: product?.category || 'sharpeners',
    description: product?.description || '',
    description_uk: product?.description_uk || '', // Додано
  });

  const [images, setImages] = useState<string[]>(
    Array.isArray(product?.images) ? product.images : []
  );
  const [uploading, setUploading] = useState(false);

  // --- ЛОГІКА РОБОТИ З ФОТО ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // Створюємо масив промісів для паралельного завантаження
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      // Чекаємо завершення всіх завантажень
      const uploadedUrls = await Promise.all(uploadPromises);

      // Оновлюємо стан всіма новими посиланнями одразу
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`Успішно завантажено фото: ${uploadedUrls.length}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Помилка завантаження фото. Спробуйте менші файли.');
    } finally {
      setUploading(false);
      // Очищуємо input, щоб можна було завантажити ті самі файли повторно, якщо треба
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const makeMain = (indexToMain: number) => {
    const newImages = [...images];
    const [selectedImage] = newImages.splice(indexToMain, 1);
    newImages.unshift(selectedImage);
    setImages(newImages);
    toast.success('Головне фото змінено');
  };

  // --- ЗБЕРЕЖЕННЯ ФОРМИ ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Сесія закінчилась. Перезавантажте сторінку.');
      }

      const productData = {
        title: formData.title,
        title_uk: formData.title_uk, // Додано до відправки
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock.toString()),
        category: formData.category,
        description: formData.description,
        description_uk: formData.description_uk, // Додано до відправки
        images: images,
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let error: any;

      if (product?.id) {
        // Оновлення
        const result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        error = result.error;
      } else {
        // Створення
        const result = await supabase.from('products').insert([productData]);
        error = result.error;
      }

      if (error) throw error;

      toast.success(product ? 'Товар оновлено!' : 'Товар створено!');
      onSaved();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(
        'Помилка збереження: ' + (error.message || 'Невідома помилка')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* === БЛОК ФОТОГРАФІЙ === */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl border border-gray-200 dark:border-neutral-800">
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
          Фотографії ({images.length})
        </label>

        {/* Адаптивна сітка */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-neutral-700 group bg-white"
            >
              <Image
                src={url}
                alt={`Product ${index}`}
                fill
                className="object-cover"
                sizes="100px"
              />

              {index === 0 && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                  Лицьова
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(index)}
                    className="p-1.5 bg-white text-yellow-500 rounded-full hover:scale-110 transition shadow-lg"
                    title="Зробити головним"
                  >
                    <Star size={14} fill="currentColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-white text-red-500 rounded-full hover:scale-110 transition shadow-lg"
                  title="Видалити"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
            {uploading ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <>
                <Upload
                  className="text-gray-400 group-hover:text-blue-500 mb-1 transition-colors"
                  size={24}
                />
                <span className="text-[10px] text-gray-500 group-hover:text-blue-500 font-bold uppercase transition-colors">
                  Додати
                </span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* === ПОЛЯ ВВОДУ === */}
      <div className="space-y-4">
        {/* Назва (Multilingual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Назва товару (EN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Stone Holder PRO"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Назва товару (UK)
            </label>
            <input
              type="text"
              placeholder="Тримач каменів PRO"
              value={formData.title_uk}
              onChange={(e) =>
                setFormData({ ...formData, title_uk: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Ціна, Сток, Категорія */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Ціна ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full pl-7 pr-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Сток (шт)
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="0"
              value={formData.stock === 0 ? '' : formData.stock}
              onChange={(e) => {
                const val = e.target.value;

                setFormData({
                  ...formData,
                  stock: val === '' ? 0 : parseInt(val),
                });
              }}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Категорія
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none appearance-none transition-all cursor-pointer"
              >
                <option value="sharpeners">Sharpeners</option>
                <option value="stones">Stones</option>
                <option value="accessories">Accessories</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Опис (Multilingual) */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Опис (EN)
            </label>
            <textarea
              rows={4}
              placeholder="Product description in English..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Опис (UK)
            </label>
            <textarea
              rows={4}
              placeholder="Опис товару українською..."
              value={formData.description_uk}
              onChange={(e) =>
                setFormData({ ...formData, description_uk: e.target.value })
              }
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-y"
            />
          </div>
        </div>
      </div>

      {/* === КНОПКИ ДІЙ === */}
      <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
        >
          <X size={18} />
          Скасувати
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95 shadow-lg"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          {product ? 'Оновити' : 'Створити'}
        </button>
      </div>
    </form>
  );
}
