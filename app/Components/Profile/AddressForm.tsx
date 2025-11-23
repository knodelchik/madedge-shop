'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import { useTranslations } from 'next-intl';
import { AddressFormData } from '../../types/address';
import { motion } from 'framer-motion';

// Стилі для react-select (темна/світла тема)
const customStyles = (isDark: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    background: isDark ? '#171717' : '#ffffff',
    borderColor: isDark ? '#404040' : '#e5e7eb',
    color: isDark ? '#ffffff' : '#000000',
    padding: '4px',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
    '&:hover': {
      borderColor: isDark ? '#525252' : '#d1d5db',
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: isDark ? '#171717' : '#ffffff',
    border: isDark ? '1px solid #404040' : '1px solid #e5e7eb',
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused
      ? isDark
        ? '#262626'
        : '#f3f4f6'
      : 'transparent',
    color: isDark ? '#ffffff' : '#000000',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDark ? '#ffffff' : '#000000',
  }),
  input: (base: any) => ({
    ...base,
    color: isDark ? '#ffffff' : '#000000',
  }),
});

interface AddressFormProps {
  onSave: (data: AddressFormData) => void;
  onCancel: () => void;
  defaultPhone?: string; // <--- 1. Додали проп
}

export default function AddressForm({ onSave, onCancel, defaultPhone = '' }: AddressFormProps) {
  const t = useTranslations('Profile');
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    city: '',
    address_line1: '',
    address_line2: '',
    postal_code: '',
    phone: defaultPhone || '',
    is_default: false,
  });

  const countries = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.value).map(
        (s) => ({ label: s.name, value: s.isoCode })
      );
      setStates(countryStates);
      setSelectedState(null);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) return;

    onSave({
      country_code: selectedCountry.value,
      country_name: selectedCountry.label,
      state_code: selectedState?.value || '',
      state_name: selectedState?.label || '',
      ...formData,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700 mt-6"
    >
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
        Додати нову адресу
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Країна *
          </label>
          <Select
            options={countries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Оберіть країну"
            styles={customStyles(isDark)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Область / Штат
          </label>
          <Select
            options={states}
            value={selectedState}
            onChange={setSelectedState}
            placeholder={states.length > 0 ? "Оберіть регіон" : "Немає регіонів"}
            isDisabled={states.length === 0}
            styles={customStyles(isDark)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Місто *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Поштовий індекс *
          </label>
          <input
            type="text"
            required
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
          Вулиця, будинок *
        </label>
        <input
          type="text"
          required
          placeholder="Вул. Шевченка 1, кв. 10"
          value={formData.address_line1}
          onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
          Додаткова інформація (опціонально)
        </label>
        <input
          type="text"
          placeholder="Під'їзд, код домофону тощо"
          value={formData.address_line2}
          onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
          Телефон *
        </label>
        <input
          type="tel"
          required
          placeholder="+380..."
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <p className="text-xs text-gray-500 mt-1 ml-1">
          Ми використали ваш номер з профілю. Ви можете змінити його для цієї адреси.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_default"
          checked={formData.is_default}
          onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-neutral-300 cursor-pointer">
          Зробити основною адресою
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Зберегти
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          Скасувати
        </button>
      </div>
    </motion.form>
  );
}