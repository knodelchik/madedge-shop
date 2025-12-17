'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, RefreshCw, Plus, Trash2, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

// Ініціалізація клієнта
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDeliveryPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Стейт для нової країни
  const [newCountry, setNewCountry] = useState({
    country_code: '',
    country_name: '',
    standard_price: 0,
    express_price: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('delivery_settings')
      .select('*');

    if (error) {
      toast.error('Помилка завантаження: ' + error.message);
    } else {
      // Сортування: UA перша, ROW остання, решта за алфавітом
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sorted = (data || []).sort((a: any, b: any) => {
        if (a.country_code === 'UA') return -1;
        if (b.country_code === 'UA') return 1;
        if (a.country_code === 'ROW') return 1;
        if (b.country_code === 'ROW') return -1;
        return a.country_name.localeCompare(b.country_name);
      });
      setSettings(sorted);
    }
    setLoading(false);
  };

  // Редагування існуючих значень в стейті
  const handleInputChange = (id: number, field: string, value: string) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field.includes('price') ? parseFloat(value) || 0 : value,
            }
          : item
      )
    );
  };

  // Збереження всіх змін (Bulk Update)
  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = settings.map((item) =>
        supabase
          .from('delivery_settings')
          .update({
            standard_price: item.standard_price,
            express_price: item.express_price,
          })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      toast.success('Ціни оновлено успішно!');
    } catch (error) {
      console.error(error);
      toast.error('Помилка при збереженні');
    } finally {
      setSaving(false);
    }
  };

  // Додавання нової країни
  const handleAddCountry = async () => {
    if (!newCountry.country_code || !newCountry.country_name) {
      toast.error('Заповніть код (ISO) та назву країни');
      return;
    }

    const { error } = await supabase.from('delivery_settings').insert([
      {
        country_code: newCountry.country_code.toUpperCase(),
        country_name: newCountry.country_name,
        standard_price: newCountry.standard_price,
        express_price: newCountry.express_price,
      },
    ]);

    if (error) {
      toast.error('Помилка: ' + error.message);
    } else {
      toast.success('Країну додано!');
      setNewCountry({
        country_code: '',
        country_name: '',
        standard_price: 0,
        express_price: 0,
      });
      loadSettings(); // Перезавантаження списку
    }
  };

  // Видалення країни
  const handleDelete = async (id: number) => {
    if (!confirm('Видалити цю країну зі списку доставки?')) return;

    const { error } = await supabase
      .from('delivery_settings')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Помилка видалення');
    } else {
      setSettings((prev) => prev.filter((item) => item.id !== id));
      toast.success('Видалено');
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Завантаження налаштувань...
      </div>
    );

  return (
    <div className="max-w-6xl pb-10">
      {/* ЗАГОЛОВОК + КНОПКА ЗБЕРЕЖЕННЯ (Адаптив: колонка на моб, рядок на десктоп) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Доставка
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Налаштування вартості доставки по країнах
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg active:scale-95"
        >
          {saving ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          Зберегти ціни
        </button>
      </div>

      {/* ФОРМА ДОДАВАННЯ (Адаптивна сітка) */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800 p-6 rounded-xl mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Plus className="w-5 h-5 text-blue-500" /> Додати нову країну
        </h3>

        {/* Grid: 1 колонка (моб) -> 2 колонки (планшет) -> 5 колонок (десктоп) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Код */}
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block uppercase">
              Код (ISO)
            </label>
            <input
              type="text"
              placeholder="PL"
              maxLength={3}
              value={newCountry.country_code}
              onChange={(e) =>
                setNewCountry({ ...newCountry, country_code: e.target.value })
              }
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Назва (займає 2 колонки на великих екранах якщо треба, тут 1 або 2) */}
          <div className="lg:col-span-2">
            <label className="text-xs text-gray-500 font-bold mb-1.5 block uppercase">
              Назва країни
            </label>
            <input
              type="text"
              placeholder="Poland"
              value={newCountry.country_name}
              onChange={(e) =>
                setNewCountry({ ...newCountry, country_name: e.target.value })
              }
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Standard */}
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block uppercase">
              Standard ($)
            </label>
            <input
              type="number"
              value={newCountry.standard_price}
              onChange={(e) =>
                setNewCountry({
                  ...newCountry,
                  standard_price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Express */}
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block uppercase">
              Express ($)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newCountry.express_price}
                onChange={(e) =>
                  setNewCountry({
                    ...newCountry,
                    express_price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAddCountry}
          className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-md active:scale-95"
        >
          Додати країну
        </button>
      </div>

      {/* ТАБЛИЦЯ (З горизонтальним скролом для мобільних) */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow border border-gray-100 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          {/* <--- Дозволяє скрол на мобільному */}
          <table className="w-full text-left min-w-[650px]">
            {/* min-w фіксує ширину контенту */}
            <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-5 w-24">Код</th>
                <th className="p-5">Країна</th>
                <th className="p-5 w-32">Standard</th>
                <th className="p-5 w-32">Express</th>
                <th className="p-5 text-right w-20">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {settings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="text-gray-400 group-hover:text-blue-500 transition-colors"
                      />
                      <span className="font-mono font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        {item.country_code}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-gray-900 dark:text-white text-sm">
                    {item.country_name}
                  </td>
                  <td className="p-5">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        $
                      </span>
                      <input
                        type="number"
                        value={item.standard_price}
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            'standard_price',
                            e.target.value
                          )
                        }
                        className="w-24 pl-6 pr-2 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-center"
                      />
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        $
                      </span>
                      <input
                        type="number"
                        value={item.express_price}
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            'express_price',
                            e.target.value
                          )
                        }
                        className="w-24 pl-6 pr-2 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-center"
                      />
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Видалити"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {settings.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Search className="w-10 h-10 mb-2 opacity-20" />
              <p>Список країн порожній.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
