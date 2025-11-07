'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  Truck,
  Skull,
  Smile,
  Frown,
  DollarSign,
  Loader,
  Globe,
} from 'lucide-react';
import { Country, State } from 'country-state-city';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

// --- Types ---
interface SelectOption {
  value: string;
  label: string;
}

interface DeliveryOption {
  service: string;
  price: number | 'Free' | 'N/A';
  time: string;
  emoji: React.ReactNode;
  serviceKey?: string;
  timeKey?: string;
}

interface DeliveryCost {
  [key: string]: DeliveryOption[];
}

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
  const dropdownIndicatorColor = isDark ? '#a1a1aa' : '#6b7280';
  const menuBorder = isDark ? '#262626' : '#e5e7eb';

  return {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '48px',
      background: controlBg,
      borderColor: state.isFocused ? controlBorderFocus : controlBorder,
      boxShadow: state.isFocused ? `0 0 0 4px ${controlBorderFocus}22` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? controlBorderFocus : controlBorder,
      },
      color: textColor,
      outline: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent', // key for mobile tap highlight
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 8px',
      color: textColor,
      userSelect: 'none',
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: textColor,
      userSelect: 'none',
    }),

    input: (provided: any) => ({
      ...provided,
      color: textColor,
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: placeholderColor,
    }),

    indicatorsContainer: (provided: any) => ({
      ...provided,
      color: dropdownIndicatorColor,
    }),

    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: dropdownIndicatorColor,
      '&:hover': { color: dropdownIndicatorColor },
    }),

    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      background: menuBg,
      border: `1px solid ${menuBorder}`,
      boxShadow: isDark
        ? '0 8px 24px rgba(0,0,0,0.6)'
        : '0 8px 24px rgba(15,23,42,0.08)',
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
    }),

    menuList: (provided: any) => ({
      ...provided,
      padding: 0,
      color: textColor,
      maxHeight: '320px',
      WebkitTapHighlightColor: 'transparent',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      background: state.isSelected
        ? optionActiveBg
        : state.isFocused
        ? optionHoverBg
        : 'transparent',
      color: textColor,
      padding: '10px 12px',
      cursor: 'pointer',
      userSelect: 'none',
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
      // Вбудований псевдоклас для активного натискання (перекриває синій default)
      ':active': {
        background: state.isSelected ? optionActiveBg : optionHoverBg,
      },
    }),

    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: placeholderColor,
      padding: '8px 12px',
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      color: dropdownIndicatorColor,
      '&:hover': { color: dropdownIndicatorColor },
    }),

    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
}

// Delivery data (unchanged, small RU message kept)
const DELIVERY_DATA: DeliveryCost = {
  UA: [
    {
      service: 'Standard (UkrPoshta)',
      serviceKey: 'options.uaStandard.name',
      price: 'Free',
      time: '3-5 days',
      timeKey: 'options.uaStandard.time',
      emoji: '🇺🇦',
    },
    {
      service: 'Express (Nova Poshta)',
      serviceKey: 'options.uaExpress.name',
      price: 'Free',
      time: '1-2 days',
      timeKey: 'options.uaExpress.time',
      emoji: '🚀',
    },
  ],
  DE: [
    {
      service: 'Standard (DHL/DPD)',
      serviceKey: 'options.deStandard.name',
      price: 15,
      time: '7-14 days',
      timeKey: 'options.deStandard.time',
      emoji: '💶',
    },
    {
      service: 'Express (FedEx)',
      serviceKey: 'options.deExpress.name',
      price: 35,
      time: '3-5 days',
      timeKey: 'options.deExpress.time',
      emoji: '🚀',
    },
  ],
  FR: [
    {
      service: 'Standard (La Poste)',
      serviceKey: 'options.frStandard.name',
      price: 18,
      time: '8-15 days',
      timeKey: 'options.frStandard.time',
      emoji: '🇫🇷',
    },
    {
      service: 'Express (DHL)',
      serviceKey: 'options.frExpress.name',
      price: 40,
      time: '3-5 days',
      timeKey: 'options.frExpress.time',
      emoji: '🚀',
    },
  ],
  US: [
    {
      service: 'Standard (USPS)',
      serviceKey: 'options.uspsStandard.name',
      price: 20,
      time: '7-14 days',
      timeKey: 'options.uspsStandard.time',
      emoji: '💵',
    },
    {
      service: 'Express (UPS)',
      serviceKey: 'options.usExpress.name',
      price: 45,
      time: '3-5 days',
      timeKey: 'options.usExpress.time',
      emoji: '🚀',
    },
  ],
  CA: [
    {
      service: 'Standard (Canada Post)',
      serviceKey: 'options.caStandard.name',
      price: 25,
      time: '10-18 days',
      timeKey: 'options.caStandard.time',
      emoji: '🇨🇦',
    },
    {
      service: 'Express (FedEx)',
      serviceKey: 'options.caExpress.name',
      price: 50,
      time: '4-7 days',
      timeKey: 'options.caExpress.time',
      emoji: '🚀',
    },
  ],
  JP: [
    {
      service: 'International Standard',
      serviceKey: 'options.jpStandard.name',
      price: 30,
      time: '10-20 days',
      timeKey: 'options.jpStandard.time',
      emoji: '🇯🇵',
    },
    {
      service: 'International Express',
      serviceKey: 'options.jpExpress.name',
      price: 60,
      time: '5-8 days',
      timeKey: 'options.jpExpress.time',
      emoji: '✈️',
    },
  ],
  BR: [
    {
      service: 'International Standard',
      serviceKey: 'options.brStandard.name',
      price: 35,
      time: '15-30 days',
      timeKey: 'options.brStandard.time',
      emoji: '🇧🇷',
    },
    {
      service: 'International Express',
      serviceKey: 'options.brExpress.name',
      price: 75,
      time: '7-12 days',
      timeKey: 'options.brExpress.time',
      emoji: '✈️',
    },
  ],
  NZ: [
    {
      service: 'International Standard',
      serviceKey: 'options.nzStandard.name',
      price: 65,
      time: '14-25 days',
      timeKey: 'options.nzStandard.time',
      emoji: '🇳🇿',
    },
    {
      service: 'International Express',
      serviceKey: 'options.nzExpress.name',
      price: 90,
      time: '7-10 days',
      timeKey: 'options.nzExpress.time',
      emoji: '✈️',
    },
  ],
  AU: [
    {
      service: 'International Standard',
      serviceKey: 'options.auStandard.name',
      price: 70,
      time: '14-25 days',
      timeKey: 'options.auStandard.time',
      emoji: '🇦🇺',
    },
    {
      service: 'International Express',
      serviceKey: 'options.auExpress.name',
      price: 100,
      time: '7-10 days',
      timeKey: 'options.auExpress.time',
      emoji: '✈️',
    },
  ],
  ROW: [
    {
      service: 'Global Standard',
      serviceKey: 'options.globalStandard.name',
      price: 40,
      time: '10-30 days',
      timeKey: 'options.globalStandard.time',
      emoji: <Globe className="w-5 h-5 text-gray-500" />,
    },
    {
      service: 'Global Express',
      serviceKey: 'options.globalExpress.name',
      price: 85,
      time: '5-15 days',
      timeKey: 'options.globalExpress.time',
      emoji: '✈️',
    },
  ],
  RU: [
    {
      service: 'Unavailable',
      serviceKey: 'options.ruUnavailable.name',
      price: 'N/A',
      time: 'N/A',
      timeKey: 'options.ruUnavailable.time',
      emoji: <Skull className="w-5 h-5" />,
    },
  ],
};

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
    (c) => ({
      value: c.isoCode,
      label: c.name,
    })
  );

  const initialCountryOption =
    allCountriesOptions.find((c) => c.value === 'US') || allCountriesOptions[0];
  const initialServiceOption = SERVICE_OPTIONS[0];

  // state
  const [selectedCountryOption, setSelectedCountryOption] =
    useState<SelectOption>(initialCountryOption);
  const [selectedServiceOption, setSelectedServiceOption] =
    useState<SelectOption>(initialServiceOption);
  const [selectedStateOption, setSelectedStateOption] =
    useState<SelectOption | null>(null);

  const [shippingOptions, setShippingOptions] = useState<DeliveryOption[]>(
    DELIVERY_DATA[initialCountryOption.value] || DELIVERY_DATA['ROW']
  );
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
    const states = State.getStatesOfCountry(selectedCountryCode).map((s) => ({
      value: s.name,
      label: s.name,
    }));
    setAvailableStatesOptions(states);
    setSelectedStateOption(null);

    handleCalculate(selectedCountryCode, selectedServiceName, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryCode, selectedServiceName]);
  useEffect(() => {
    setMounted(true); // після mount ми знаємо реальну тему
  }, []);

  const getEmoji = (
    price: number | 'Free' | 'N/A',
    countryCode: string,
    isServiceAvailable: boolean
  ) => {
    if (countryCode === 'RU') return <Skull className="w-6 h-6 text-red-600" />;
    if (countryCode === 'UA' && price === 'Free')
      return <Smile className="w-6 h-6 text-green-600" />;
    if (!isServiceAvailable || price === 'N/A')
      return <Frown className="w-6 h-6 text-orange-500" />;
    if (price === 'Free') return <Smile className="w-6 h-6 text-green-600" />;

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
      const deliveryKey = DELIVERY_DATA[countryCode] ? countryCode : 'ROW';
      const countryData = DELIVERY_DATA[deliveryKey];

      let filteredOptions: DeliveryOption[] = [];
      if (countryCode === 'RU') {
        filteredOptions = countryData;
      } else {
        filteredOptions = countryData.filter((opt) =>
          opt.service.includes(service)
        );
      }

      let finalSurcharge = false;

      const finalOptions = filteredOptions.map((opt) => {
        let finalPrice = opt.price;
        let finalService = opt.service;

        if (countryCode === 'UA') {
          finalPrice = opt.service.includes('Standard')
            ? 'Free'
            : (opt.price as number);
          finalService = opt.service;
          return { ...opt, price: finalPrice, service: finalService };
        }

        // remote detection
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
          isRemote;
        if (canApplySurcharge) {
          finalPrice = (finalPrice as number) + 20;
          finalService = `${opt.service} (+ Remote Surcharge)`;
          finalSurcharge = true;
        }

        return { ...opt, price: finalPrice, service: finalService };
      });

      setSurchargeApplied(finalSurcharge);
      setShippingOptions(
        finalOptions.length > 0 ? finalOptions : DELIVERY_DATA['ROW']
      );
      setIsCalculating(false);
    }, 800);
  };

  const handleCountryChange = (option: SelectOption | null) => {
    if (option) {
      setSelectedCountryOption(option);
      setSelectedStateOption(null);
      handleCalculate(option.value, selectedServiceName, '');
    }
  };

  const handleStateChange = (option: SelectOption | null) => {
    setSelectedStateOption(option);
    const stateValue = option ? option.value : '';
    handleCalculate(selectedCountryCode, selectedServiceName, stateValue);
  };

  const handleServiceChange = (option: SelectOption | null) => {
    if (option) {
      setSelectedServiceOption(option);
      handleCalculate(selectedCountryCode, option.value, selectedStateName);
    }
  };

  // react-select styles — singleValue uses 'inherit' so color is taken from container (.text-... dark:text-...)
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '48px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      background: 'transparent',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      },
    }),
    valueContainer: (provided: any) => ({ ...provided, padding: '0 8px' }),
    singleValue: (provided: any) => ({ ...provided, color: 'inherit' }),
    menu: (provided: any) => ({ ...provided, zIndex: 50 }),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 dark:text-neutral-100">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200 dark:text-neutral-300 dark:border-neutral-800">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Policy */}
        <section id="policy" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t('policy.title')}
          </h2>
          <p className="text-gray-700 mb-6 text-lg dark:text-neutral-300">
            {t('policy.intro')}
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 dark:bg-neutral-900 dark:border-neutral-800">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center dark:text-neutral-100">
              <Truck className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-300" />{' '}
              {t('policy.keyTitle')}
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4 dark:text-neutral-300">
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
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* Calculator */}
        <section
          id="calculator"
          className="mb-20 scroll-mt-24 bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg dark:bg-neutral-900 dark:border-neutral-800"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-neutral-100">
            {t_calc('title')}
          </h2>
          <p className="text-gray-700 mb-6 dark:text-neutral-300">
            {t_calc('intro')}
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-neutral-200">
                {t_calc('labelCountry')}
              </label>
              <div className="text-gray-900 dark:text-neutral-100">
                <Select
                  options={allCountriesOptions}
                  value={selectedCountryOption}
                  onChange={handleCountryChange}
                  placeholder={t_calc('placeholderCountry')}
                  styles={getCustomStyles(themeMode)}
                  menuPortalTarget={
                    typeof document !== 'undefined' ? document.body : undefined
                  }
                  menuPosition="fixed"
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
                  menuPosition="fixed"
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
                  menuPosition="fixed"
                />
              </div>
            </div>
          </div>

          {surchargeApplied && (
            <div className="mb-4 p-3 text-sm font-medium text-orange-800 bg-orange-100 rounded-lg border border-orange-300 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-700">
              <span className="font-bold">
                {t_calc('surchargeNoteStrong')}:
              </span>{' '}
              {t_calc('surchargeNoteText')}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-neutral-800">
            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-neutral-100">
              {t_calc('resultsTitle', { country: selectedCountryName })}
            </h3>

            {isCalculating ? (
              <div className="flex items-center justify-center p-8 bg-white rounded-lg dark:bg-neutral-800">
                <Loader className="w-6 h-6 animate-spin mr-3 text-blue-600 dark:text-blue-300" />
                <span className="text-lg text-blue-600 dark:text-neutral-300">
                  {t_calc('resultsLoading')}
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {shippingOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-5 rounded-xl transition shadow-md border
                      ${
                        selectedCountryCode === 'RU'
                          ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                          : option.price === 'Free'
                          ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                          : 'bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700'
                      }`}
                  >
                    <div className="flex-shrink-0 mr-4">
                      {getEmoji(
                        option.price,
                        selectedCountryCode,
                        option.price !== 'N/A'
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-neutral-100">
                        {option.serviceKey
                          ? t(option.serviceKey)
                          : option.service}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-neutral-300">
                        {t_calc('resultsTime')}:{' '}
                        {option.timeKey ? t(option.timeKey) : option.time}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p
                        className={`text-xl font-bold ${
                          option.price === 'Free'
                            ? 'text-green-600 dark:text-green-400'
                            : option.price === 'N/A'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-neutral-100'
                        }`}
                      >
                        {option.price === 'Free'
                          ? t_calc('resultsFree')
                          : option.price === 'N/A'
                          ? t_calc('resultsNA')
                          : `$${(option.price as number).toFixed(2)}`}
                      </p>
                      {option.price !== 'N/A' && (
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {t_calc('resultsApproxPrice')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {shippingOptions.length === 0 && (
                  <div className="p-5 bg-yellow-50 rounded-lg text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                    <p>{t_calc('resultsNoOptions')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <hr className="my-16 border-gray-200 dark:border-neutral-800" />

        {/* Returns & Warranty */}
        <section id="returns-warranty" className="mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3 dark:text-neutral-100 dark:border-neutral-300">
            {t_returns('title')}
          </h2>

          <p className="text-gray-700 mb-8 text-lg dark:text-neutral-300">
            {t_returns('intro')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700">
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
                {t_returns('returnTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('returnText')}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700">
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.018A9.955 9.955 0 0112 5.053 10.038 10.038 0 003.055 7.5c-.714 2.21-1.077 4.603-1.055 7.417C2.023 18.913 5.483 22 10 22h4c4.517 0 7.977-3.087 7.977-7.03c.022-2.814-.341-5.207-1.055-7.417z"
                  ></path>
                </svg>
                {t_returns('warrantyTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('warrantyText')}
              </p>
            </div>

            <div className="bg-orange-50 p-5 rounded-xl border border-orange-200 shadow-md dark:bg-orange-900/10 dark:border-neutral-700">
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center dark:text-neutral-100">
                <svg
                  className="w-5 h-5 mr-2 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                {t_returns('lostTitle')}
              </h3>
              <p className="text-gray-700 text-sm dark:text-neutral-300">
                {t_returns('lostText')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
