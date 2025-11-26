'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { createClient } from '@supabase/supabase-js';
import { Truck, Skull, Smile, Frown, DollarSign, Loader } from 'lucide-react';
import { Country, State } from 'country-state-city';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Налаштування Supabase ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 2. Типи ---
interface SelectOption {
  value: string;
  label: string;
}

interface DbDeliveryRule {
  country_code: string;
  standard_price: number;
  express_price: number;
}

export interface DeliveryOption {
  service: string;
  price: number | 'Free' | 'N/A';
  time: string;
  serviceKey?: string;
  timeKey?: string;
}

// --- 3. Стилі Select (без змін) ---
function getCustomStyles(themeMode: 'light' | 'dark') {
  const isDark = themeMode === 'dark';
  const controlBg = isDark ? '#111111' : '#fff';
  const controlBorder = isDark ? '#262626' : '#d1d5db';
  const controlBorderFocus = isDark ? '#737373' : '#3b82f6';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const menuBg = isDark ? '#171717' : '#fff';
  const optionHoverBg = isDark ? '#333333' : '#f3f4f6';
  const optionActiveBg = isDark ? '#111111' : '#e6eef8';
  const placeholderColor = isDark ? '#9ca3af' : '#6b7280';
  const menuBorder = isDark ? '#262626' : '#e5e7eb';

  return {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '48px',
      fontSize: '16px',
      background: controlBg,
      borderColor: state.isFocused ? controlBorderFocus : controlBorder,
      boxShadow: state.isFocused ? `0 0 0 4px ${controlBorderFocus}22` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? controlBorderFocus : controlBorder,
      },
      color: textColor,
      outline: 'none',
    }),
    singleValue: (provided: any) => ({ ...provided, color: textColor }),
    input: (provided: any) => ({ ...provided, color: textColor }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      background: menuBg,
      border: `1px solid ${menuBorder}`,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      background: state.isSelected
        ? optionActiveBg
        : state.isFocused
        ? optionHoverBg
        : 'transparent',
      color: textColor,
      cursor: 'pointer',
    }),
  };
}

export default function DeliveryPage() {
  const t = useTranslations('DeliveryPage');
  const t_calc = useTranslations('DeliveryPage.calculator');
  const t_returns = useTranslations('DeliveryPage.returns');
  const t_service = useTranslations('DeliveryPage.service');

  const SERVICE_OPTIONS: SelectOption[] = [
    { label: t_service('standard'), value: 'Standard' },
    { label: t_service('express'), value: 'Express' },
  ];

  const allCountriesOptions: SelectOption[] = Country.getAllCountries().map(
    (c) => ({ value: c.isoCode, label: c.name })
  );

  const initialCountryOption =
    allCountriesOptions.find((c) => c.value === 'US') || allCountriesOptions[0];
  const initialServiceOption = SERVICE_OPTIONS[0];

  const [selectedCountryOption, setSelectedCountryOption] =
    useState<SelectOption>(initialCountryOption);
  const [selectedServiceOption, setSelectedServiceOption] =
    useState<SelectOption>(initialServiceOption);
  const [selectedStateOption, setSelectedStateOption] =
    useState<SelectOption | null>(null);

  const [dbRules, setDbRules] = useState<Record<string, DbDeliveryRule>>({});
  const [rulesLoaded, setRulesLoaded] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<DeliveryOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [surchargeApplied, setSurchargeApplied] = useState(false);
  const [availableStatesOptions, setAvailableStatesOptions] = useState<
    SelectOption[]
  >([]);

  const selectedCountryCode = selectedCountryOption.value;
  const selectedCountryName = selectedCountryOption.label;
  const selectedServiceName = selectedServiceOption.value;
  const selectedStateName = selectedStateOption
    ? selectedStateOption.label
    : '';

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const themeMode = mounted
    ? (resolvedTheme as string) === 'dark'
      ? 'dark'
      : 'light'
    : 'dark';

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      const { data, error } = await supabase
        .from('delivery_settings')
        .select('*');
      if (!error && data) {
        const rulesMap: Record<string, DbDeliveryRule> = {};
        data.forEach((item: DbDeliveryRule) => {
          rulesMap[item.country_code] = item;
        });
        setDbRules(rulesMap);
      }
      setRulesLoaded(true);
    };
    fetchDeliverySettings();
    setMounted(true);
  }, []);

  useEffect(() => {
    const states = State.getStatesOfCountry(selectedCountryCode).map((s) => ({
      value: s.name,
      label: s.name,
    }));
    setAvailableStatesOptions(states);
    setSelectedStateOption(null);
  }, [selectedCountryCode]);

  useEffect(() => {
    handleCalculate(
      selectedCountryCode,
      selectedServiceName,
      selectedStateName
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCountryCode,
    selectedServiceName,
    selectedStateName,
    rulesLoaded,
    dbRules,
  ]);

  const getEmoji = (
    price: number | 'Free' | 'N/A',
    countryCode: string,
    isServiceAvailable: boolean
  ) => {
    if (['RU', 'BY'].includes(countryCode))
      return <Skull className="w-6 h-6 text-red-600" />;

    // Враховуємо і 'Free', і ціну 0 як безкоштовну
    if (countryCode === 'UA' && (price === 'Free' || price === 0))
      return <Smile className="w-6 h-6 text-green-600" />;

    if (!isServiceAvailable || price === 'N/A')
      return <Frown className="w-6 h-6 text-orange-500" />;

    if (price === 'Free' || price === 0)
      return <Smile className="w-6 h-6 text-green-600" />;

    if (typeof price === 'number') {
      if (price <= 20) return <Smile className="w-6 h-6 text-blue-600" />;
      if (price <= 50)
        return <DollarSign className="w-6 h-6 text-yellow-600" />;
      return <Frown className="w-6 h-6 text-red-600" />;
    }
    return <Frown className="w-6 h-6 text-red-600" />;
  };

  const handleCalculate = (
    countryCode: string,
    service: string,
    state: string
  ) => {
    setIsCalculating(true);

    setTimeout(() => {
      let baseOptions: DeliveryOption[] = [];
      let finalSurcharge = false;

      // 1. САНКЦІЇ (RU/BY)
      if (countryCode === 'RU' || countryCode === 'BY') {
        baseOptions = [
          {
            service: t('options.ruUnavailable.name'),
            price: 'N/A',
            time: t('options.ruUnavailable.time'),
          },
        ];
      }
      // 2. РЕШТА СВІТУ
      else {
        let rule = dbRules[countryCode] || dbRules['ROW'];

        if (!rule) {
          rule = { country_code: 'ROW', standard_price: 35, express_price: 55 };
        }

        baseOptions = [
          {
            service: 'Standard Shipping',
            price: Number(rule.standard_price),
            time: '8-15 business days',
            serviceKey: 'options.globalStandard.name',
            timeKey: 'options.globalStandard.time',
          },
          {
            service: 'Express Shipping',
            price: Number(rule.express_price),
            time: '3-7 business days',
            serviceKey: 'options.globalExpress.name',
            timeKey: 'options.globalExpress.time',
          },
        ];
      }

      // Фільтрація
      let filteredOptions = baseOptions;
      if (countryCode !== 'RU' && countryCode !== 'BY') {
        filteredOptions = baseOptions.filter((opt) =>
          opt.service.toLowerCase().includes(service.toLowerCase())
        );
        if (filteredOptions.length === 0) filteredOptions = baseOptions;
      }

      // Модифікатори
      const finalOptions = filteredOptions.map((opt) => {
        let finalPrice = opt.price;
        let finalService = opt.service;
        let finalServiceKey = opt.serviceKey;
        let finalTimeKey = opt.timeKey; // Додаємо змінну для ключа часу

        // 🇺🇦 UA Special Logic
        if (countryCode === 'UA') {
          const isStandard = opt.service.toLowerCase().includes('standard');

          if (isStandard) {
            finalPrice = 'Free';
            finalServiceKey = 'options.uaStandard.name';
            finalTimeKey = 'options.uaStandard.time'; // 👈 Встановлюємо правильний час для Стандарту
          } else {
            // Експрес залишаємо як є з бази (але якщо там 0, то в UI буде безкоштовно)
            finalPrice = opt.price;
            finalServiceKey = 'options.uaExpress.name';
            finalTimeKey = 'options.uaExpress.time'; // 👈 Встановлюємо правильний час для Експресу
          }

          return {
            ...opt,
            price: finalPrice,
            serviceKey: finalServiceKey,
            timeKey: finalTimeKey,
          };
        }

        // Remote surcharge
        const remoteKeywords = [
          'remote',
          'island',
          'far',
          'alaska',
          'hawaii',
          'region',
          'oblast',
          'baltic',
        ];
        const isRemote = remoteKeywords.some((keyword) =>
          state.toLowerCase().includes(keyword)
        );
        const canApplySurcharge =
          typeof finalPrice === 'number' &&
          finalPrice !== 0 &&
          countryCode !== 'RU' &&
          countryCode !== 'BY' &&
          isRemote;

        if (canApplySurcharge) {
          finalPrice = (finalPrice as number) + 20;
          finalService = `${opt.service} (+ Remote Surcharge)`;
          finalSurcharge = true;
          finalServiceKey = undefined;
        }

        return {
          ...opt,
          price: finalPrice,
          service: finalService,
          serviceKey: finalServiceKey,
          timeKey: finalTimeKey,
        };
      });

      setSurchargeApplied(finalSurcharge);
      setShippingOptions(finalOptions);
      setIsCalculating(false);
    }, 600);
  };

  const handleCountryChange = (option: SelectOption | null) => {
    if (option) {
      setSelectedCountryOption(option);
      setSelectedStateOption(null);
    }
  };
  const handleStateChange = (option: SelectOption | null) =>
    setSelectedStateOption(option);
  const handleServiceChange = (option: SelectOption | null) =>
    option && setSelectedServiceOption(option);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors overflow-x-hidden">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        {/* Policy */}
        <motion.section
          id="policy"
          className="mb-12 lg:mb-20 scroll-mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('policy.title')}
          </h2>
          <p className="text-gray-700 mb-6 text-base lg:text-lg dark:text-neutral-300">
            {t('policy.intro')}
          </p>
          <motion.div
            className="bg-blue-50 p-5 lg:p-6 rounded-xl border border-blue-200 dark:bg-neutral-900 dark:border-neutral-800"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
              <Truck className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-300" />
              {t('policy.keyTitle')}
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300 text-sm sm:text-base">
              <li>
                <strong>{t('policy.key1Strong')}:</strong>{' '}
                {t('policy.key1Text')}
              </li>
              <li>
                <strong>{t('policy.key2Strong')}:</strong>{' '}
                {t('policy.key2Text')}
              </li>
              <li>
                <strong>{t('policy.key3Strong')}:</strong>{' '}
                {t('policy.key3Text')}
              </li>
            </ul>
          </motion.div>
        </motion.section>

        <motion.hr
          className="my-12 lg:my-16 border-gray-200 dark:border-neutral-800"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        {/* Calculator */}
        <motion.section
          id="calculator"
          className="mb-12 lg:mb-20 scroll-mt-24 bg-gray-50 p-4 sm:p-8 rounded-xl border border-gray-200 shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {t_calc('title')}
            </h2>
            {!rulesLoaded && (
              <Loader className="animate-spin text-gray-400" size={16} />
            )}
          </div>

          <p className="text-gray-700 mb-6 dark:text-neutral-300 text-base lg:text-lg">
            {t_calc('intro')}
          </p>

          <motion.div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-neutral-200">
                {t_calc('labelCountry')}
              </label>
              <div className="text-gray-900 dark:text-neutral-100 ">
                <Select
                  options={allCountriesOptions}
                  value={selectedCountryOption}
                  onChange={handleCountryChange}
                  placeholder={t_calc('placeholderCountry')}
                  styles={getCustomStyles(themeMode)}
                  menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : undefined
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-neutral-200">
                {t_calc('labelState')}
              </label>
              <div className="text-gray-900 dark:text-neutral-100">
                <Select
                  options={availableStatesOptions}
                  value={selectedStateOption}
                  onChange={handleStateChange}
                  placeholder={
                    selectedCountryCode === 'UA'
                      ? t_calc('placeholderStateUA')
                      : t_calc('placeholderStateDefault')
                  }
                  isDisabled={selectedCountryCode === 'UA'}
                  styles={getCustomStyles(themeMode)}
                  menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : undefined
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-neutral-200">
                {t_calc('labelService')}
              </label>
              <div className="text-gray-900 dark:text-neutral-100">
                <Select
                  options={SERVICE_OPTIONS}
                  value={selectedServiceOption}
                  onChange={handleServiceChange}
                  styles={getCustomStyles(themeMode)}
                  menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : undefined
                  }
                />
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {surchargeApplied && (
              <motion.div
                className="mb-4 p-3 text-sm font-medium text-orange-800 bg-orange-100 rounded-lg border border-orange-300 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="font-bold">
                  {t_calc('surchargeNoteStrong')}:
                </span>{' '}
                {t_calc('surchargeNoteText')}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-neutral-100">
              {t_calc('resultsTitle', { country: selectedCountryName })}
            </h3>

            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="loading"
                  className="flex items-center justify-center p-8 bg-white rounded-lg dark:bg-neutral-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader className="w-6 h-6 animate-spin mr-3 text-blue-600 dark:text-blue-300" />
                  <span className="text-lg text-blue-600 dark:text-neutral-300">
                    {t_calc('resultsLoading')}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {shippingOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      // 🟢 ВИПРАВЛЕНА ЛОГІКА КОЛЬОРІВ: якщо 'Free' АБО 0 — то зелений
                      className={`flex flex-col sm:flex-row sm:items-center items-start p-4 sm:p-5 rounded-xl transition shadow-md border
                        ${
                          selectedCountryCode === 'RU' ||
                          selectedCountryCode === 'BY'
                            ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                            : option.price === 'Free' || option.price === 0
                            ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                            : 'bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700'
                        }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                        <motion.div
                          className="shrink-0 mr-4"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {getEmoji(
                            option.price,
                            selectedCountryCode,
                            option.price !== 'N/A'
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-neutral-100 truncate sm:whitespace-normal">
                            {option.serviceKey
                              ? t(option.serviceKey)
                              : option.service}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-neutral-300">
                            {t_calc('resultsTime')}:{' '}
                            {option.timeKey ? t(option.timeKey) : option.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-left sm:text-right w-full sm:w-auto pl-[40px] sm:pl-0 sm:ml-auto">
                        <p
                          className={`text-xl font-bold ${
                            option.price === 'Free' || option.price === 0
                              ? 'text-green-600 dark:text-green-400'
                              : option.price === 'N/A'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-900 dark:text-neutral-100'
                          }`}
                        >
                          {/* 🟢 ВІДОБРАЖЕННЯ ЦІНИ: якщо 0, пишемо БЕЗКОШТОВНО */}
                          {option.price === 'Free' || option.price === 0
                            ? t_calc('resultsFree')
                            : option.price === 'N/A'
                            ? t_calc('resultsNA')
                            : `${(option.price as number).toFixed(2)}`}
                        </p>
                        {option.price !== 'N/A' &&
                          option.price !== 'Free' &&
                          option.price !== 0 && (
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                              {t_calc('resultsApproxPrice')}
                            </p>
                          )}
                      </div>
                    </motion.div>
                  ))}

                  {shippingOptions.length === 0 && (
                    <motion.div
                      className="p-5 bg-yellow-50 rounded-lg text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p>{t_calc('resultsNoOptions')}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Returns */}
        <motion.section
          id="returns-warranty"
          className="mb-12 lg:mb-20 scroll-mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t_returns('title')}
          </h2>
          <p className="text-gray-700 mb-8 text-base lg:text-lg dark:text-neutral-300">
            {t_returns('intro')}
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <Truck className="w-6 h-6 mr-2 text-blue-600" />{' '}
                {t_returns('returnTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('returnText')}
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <Smile className="w-5 h-5 mr-2 text-blue-600" />{' '}
                {t_returns('warrantyTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('warrantyText')}
              </p>
            </motion.div>
            <motion.div
              className="bg-orange-50 p-5 rounded-xl border border-orange-200 shadow-md dark:bg-orange-900/10 dark:border-neutral-700"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <Skull className="w-7 h-7 mr-2 text-red-600" />{' '}
                {t_returns('lostTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('lostText')}
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
