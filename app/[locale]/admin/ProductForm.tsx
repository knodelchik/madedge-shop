'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase'; // <--- ВАЖЛИВО: Імпортуємо спільний клієнт
import { Loader2, Upload, X, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProductFormProps {
  product?: any | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSaved, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || '',
    category: product?.category || 'sharpeners', // Значення за замовчуванням
    description: product?.description || '',
  });

  // Якщо у продукта images це не масив (наприклад null), робимо пустим масивом
  const [images, setImages] = useState<string[]>(
    Array.isArray(product?.images) ? product.images : []
  );
  const [uploading, setUploading] = useState(false);

  // Завантаження фото
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Генеруємо унікальне ім'я, щоб уникнути конфліктів
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Завантажуємо
        const { error: uploadError } = await supabase.storage
          .from('products') // Переконайтеся, що бакет називається саме 'products'
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Отримуємо публічне посилання
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }

      setImages((prev) => [...prev, ...newImages]);
      toast.success('Фото успішно завантажено');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Помилка завантаження фото: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Видалення фото зі списку
  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Зробити головним
  const makeMain = (indexToMain: number) => {
    const newImages = [...images];
    const [selectedImage] = newImages.splice(indexToMain, 1);
    newImages.unshift(selectedImage);
    setImages(newImages);
  };

  // Збереження товару
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Перевіряємо сесію перед записом (для дебагу)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Ви не авторизовані. Перезавантажте сторінку і увійдіть знову.');
      }

      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        images: images, // JSONB масив
        updated_at: new Date().toISOString(),
      };

      let error;

      if (product?.id) {
        // Оновлення
        const result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        error = result.error;
      } else {
        // Створення
        const result = await supabase
          .from('products')
          .insert([productData]);
        error = result.error;
      }

      if (error) throw error;

      toast.success(product ? 'Товар оновлено!' : 'Товар створено!');
      onSaved();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Помилка збереження: ' + (error.message || error.details || 'Невідома помилка'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Блок фотографій */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl border border-gray-200 dark:border-neutral-800">
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
          Фотографії
        </label>
        
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-neutral-700 group bg-white">
              <Image src={url} alt={`Product ${index}`} fill className="object-cover" />
              
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                  ГОЛОВНЕ
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(index)}
                    className="p-1.5 bg-white text-yellow-500 rounded-full hover:scale-110 transition"
                    title="Зробити головним"
                  >
                    <Star size={14} fill="currentColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-white text-red-500 rounded-full hover:scale-110 transition"
                  title="Видалити"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            {uploading ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <>
                <Upload className="text-gray-400 mb-1" size={20} />
                <span className="text-[10px] text-gray-500 uppercase font-bold">Додати</span>
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

      {/* Поля вводу */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Назва товару</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ціна ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Категорія</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="sharpeners">Sharpeners</option>
              <option value="stones">Stones</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Опис</label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium"
        >
          Скасувати
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Зберегти
        </button>
      </div>
    </form>
  );
}