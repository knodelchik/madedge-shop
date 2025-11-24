'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, RefreshCw, Plus, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Створюємо клієнт
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDeliveryPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Стейт для нової країни
  const [newCountry, setNewCountry] = useState({
    country_code: '',
    country_name: '',
    standard_price: 0,
    express_price: 0
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('delivery_settings')
      .select('*')
      .order('country_code', { ascending: true });

    if (error) {
      toast.error('Помилка завантаження: ' + error.message);
    } else {
      // Ставимо UA першою, ROW останньою, решту за алфавітом
      const sorted = (data || []).sort((a, b) => {
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

  // Редагування існуючих
  const handleInputChange = (id: number, field: string, value: string) => {
    setSettings(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: field.includes('price') ? (parseFloat(value) || 0) : value } : item
    ));
  };

  // Збереження змін
  const handleSave = async () => {
    setSaving(true);
    const updates = settings.map(item => 
      supabase
        .from('delivery_settings')
        .update({ 
          standard_price: item.standard_price,
          express_price: item.express_price 
        })
        .eq('id', item.id)
    );

    await Promise.all(updates);
    toast.success('Зміни збережено!');
    setSaving(false);
  };

  // Додавання нової країни
  const handleAddCountry = async () => {
    if (!newCountry.country_code || !newCountry.country_name) {
      toast.error('Заповніть код та назву країни');
      return;
    }

    const { error } = await supabase
      .from('delivery_settings')
      .insert([{
        country_code: newCountry.country_code.toUpperCase(),
        country_name: newCountry.country_name,
        standard_price: newCountry.standard_price,
        express_price: newCountry.express_price
      }]);

    if (error) {
      toast.error('Помилка: ' + error.message);
    } else {
      toast.success('Країну додано!');
      setNewCountry({ country_code: '', country_name: '', standard_price: 0, express_price: 0 });
      loadSettings(); // Перезавантажуємо список
    }
  };

  // Видалення країни
  const handleDelete = async (id: number) => {
    if(!confirm('Видалити цю країну зі списку доставки?')) return;
    
    const { error } = await supabase.from('delivery_settings').delete().eq('id', id);
    if (error) {
      toast.error('Помилка видалення');
    } else {
      setSettings(prev => prev.filter(item => item.id !== id));
      toast.success('Видалено');
    }
  };

  if (loading) return <div className="p-8">Завантаження...</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Налаштування доставки</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
        >
          {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
          Зберегти ціни
        </button>
      </div>

      {/* ФОРМА ДОДАВАННЯ */}
      <div className="bg-gray-50 dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800 p-6 rounded-xl mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Plus className="w-5 h-5" /> Додати нову країну
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Код (напр. PL)</label>
            <input
              type="text"
              placeholder="PL"
              maxLength={3}
              value={newCountry.country_code}
              onChange={(e) => setNewCountry({...newCountry, country_code: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 uppercase"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Назва (напр. Poland)</label>
            <input
              type="text"
              placeholder="Poland"
              value={newCountry.country_name}
              onChange={(e) => setNewCountry({...newCountry, country_name: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Standard ($)</label>
            <input
              type="number"
              value={newCountry.standard_price}
              onChange={(e) => setNewCountry({...newCountry, standard_price: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Express ($)</label>
            <input
              type="number"
              value={newCountry.express_price}
              onChange={(e) => setNewCountry({...newCountry, express_price: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
          </div>
        </div>
        <button 
          onClick={handleAddCountry}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Додати країну
        </button>
      </div>

      {/* ТАБЛИЦЯ */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow border border-gray-100 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="p-5">Код</th>
              <th className="p-5">Країна</th>
              <th className="p-5">Standard</th>
              <th className="p-5">Express</th>
              <th className="p-5 text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {settings.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{item.country_code}</span>
                  </div>
                </td>
                <td className="p-5 font-medium text-gray-900 dark:text-white">
                  {item.country_name}
                </td>
                <td className="p-5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={item.standard_price}
                      onChange={(e) => handleInputChange(item.id, 'standard_price', e.target.value)}
                      className="w-24 pl-6 pr-2 py-1.5 border border-gray-200 dark:border-neutral-700 rounded-md bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </td>
                <td className="p-5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={item.express_price}
                      onChange={(e) => handleInputChange(item.id, 'express_price', e.target.value)}
                      className="w-24 pl-6 pr-2 py-1.5 border border-gray-200 dark:border-neutral-700 rounded-md bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {settings.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-500">
            Список порожній. Додайте першу країну.
          </div>
        )}
      </div>
    </div>
  );
}