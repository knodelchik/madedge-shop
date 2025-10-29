'use client';

import React, { useState, useEffect } from 'react';
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
import { Country, ICountry, State, IState } from 'country-state-city';
import { useTranslations } from 'next-intl'; // 👈 Додаємо імпорт

// --- Types and Constants (unchanged) ---

interface SelectOption {
  value: string;
  label: string;
}

interface DeliveryOption {
  service: string;
  price: number | 'Free' | 'N/A';
  time: string;
  emoji: React.ReactNode;
}

interface DeliveryCost {
  [key: string]: DeliveryOption[];
}

// Дані про доставку (Використовуємо ISO-коди як ключі)
const DELIVERY_DATA: DeliveryCost = {
  UA: [
    {
      service: 'Standard (UkrPoshta)',
      price: 'Free',
      time: '3-5 days',
      emoji: '🇺🇦',
    },
    {
      service: 'Express (Nova Poshta)',
      price: 'Free',
      time: '1-2 days',
      emoji: '🚀',
    },
  ],
  DE: [
    {
      service: 'Standard (DHL/DPD)',
      price: 15,
      time: '7-14 days',
      emoji: '💶',
    },
    { service: 'Express (FedEx)', price: 35, time: '3-5 days', emoji: '🚀' },
  ],
  FR: [
    {
      service: 'Standard (La Poste)',
      price: 18,
      time: '8-15 days',
      emoji: '🇫🇷',
    },
    { service: 'Express (DHL)', price: 40, time: '3-5 days', emoji: '🚀' },
  ],
  US: [
    { service: 'Standard (USPS)', price: 20, time: '7-14 days', emoji: '💵' },
    { service: 'Express (UPS)', price: 45, time: '3-5 days', emoji: '🚀' },
  ],
  CA: [
    {
      service: 'Standard (Canada Post)',
      price: 25,
      time: '10-18 days',
      emoji: '🇨🇦',
    },
    { service: 'Express (FedEx)', price: 50, time: '4-7 days', emoji: '🚀' },
  ],
  JP: [
    {
      service: 'International Standard',
      price: 30,
      time: '10-20 days',
      emoji: '🇯🇵',
    },
    {
      service: 'International Express',
      price: 60,
      time: '5-8 days',
      emoji: '✈️',
    },
  ],
  BR: [
    {
      service: 'International Standard',
      price: 35,
      time: '15-30 days',
      emoji: '🇧🇷',
    },
    {
      service: 'International Express',
      price: 75,
      time: '7-12 days',
      emoji: '✈️',
    },
  ],
  NZ: [
    {
      service: 'International Standard',
      price: 65,
      time: '14-25 days',
      emoji: '🇳🇿',
    },
    {
      service: 'International Express',
      price: 90,
      time: '7-10 days',
      emoji: '✈️',
    },
  ],
  AU: [
    {
      service: 'International Standard',
      price: 70,
      time: '14-25 days',
      emoji: '🇦🇺',
    },
    {
      service: 'International Express',
      price: 100,
      time: '7-10 days',
      emoji: '✈️',
    },
  ],
  ROW: [
    {
      service: 'Global Standard',
      price: 40,
      time: '10-30 days',
      emoji: <Globe className="w-5 h-5 text-gray-500" />,
    },
    { service: 'Global Express', price: 85, time: '5-15 days', emoji: '✈️' },
  ],
  RU: [
    {
      service: 'We are sorry. Putin is not dead yet',
      price: 'N/A',
      time: 'N/A',
      emoji: <Skull className="w-5 h-5" />,
    },
  ],
};

// Перекладемо ці значення в messages
const SERVICE_OPTIONS: SelectOption[] = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Express', value: 'Express' },
];

export default function DeliveryPage() {
  const t = useTranslations('DeliveryPage');
  const t_calc = useTranslations('DeliveryPage.calculator');
  const t_returns = useTranslations('DeliveryPage.returns');

  const allCountriesOptions: SelectOption[] = Country.getAllCountries().map(
    (c) => ({
      value: c.isoCode,
      label: c.name,
    })
  );

  const initialCountryOption =
    allCountriesOptions.find((c) => c.value === 'US') || allCountriesOptions[0];
  const initialServiceOption = SERVICE_OPTIONS[0];

  // --- State Hooks ---
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

  // --- Derived Values ---
  const selectedCountryCode = selectedCountryOption.value;
  const selectedCountryName = selectedCountryOption.label;
  const selectedServiceName = selectedServiceOption.value;
  const selectedStateName = selectedStateOption
    ? selectedStateOption.label
    : '';

  // --- Effects ---
  useEffect(() => {
    // Оновлення доступних штатів при зміні країни
    const states = State.getStatesOfCountry(selectedCountryCode).map((s) => ({
      value: s.name,
      label: s.name,
    }));
    setAvailableStatesOptions(states);
    setSelectedStateOption(null); // Скидаємо вибраний штат

    // Запускаємо початковий розрахунок
    handleCalculate(
      selectedCountryCode,
      selectedServiceName,
      selectedStateName
    );
  }, [selectedCountryCode, selectedServiceName]);

  // --- Handlers ---

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

      let filteredOptions: DeliveryOption[];

      if (countryCode === 'RU') {
        filteredOptions = countryData;
      } else {
        filteredOptions = countryData.filter((opt) =>
          opt.service.includes(service)
        );
      }

      let finalSurcharge = false;

      let finalOptions: DeliveryOption[] = filteredOptions.map((opt) => {
        let finalPrice = opt.price;
        let finalService = opt.service;

        // ЛОГІКА БЕЗКОШТОВНОЇ ДОСТАВКИ ДЛЯ УКРАЇНИ
        if (countryCode === 'UA') {
          finalPrice = opt.service.includes('Standard')
            ? 'Free'
            : (opt.price as number);
          finalService = opt.service;
          return { ...opt, price: finalPrice, service: finalService };
        }

        // Перевірка на віддалену зону
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
          // Тут використовуємо статичний текст, оскільки він має бути доданий до service
          finalService = `${opt.service} (+ Remote Surcharge)`;
          finalSurcharge = true;
        }

        return {
          ...opt,
          price: finalPrice,
          service: finalService,
        };
      });

      setSurchargeApplied(finalSurcharge);
      setShippingOptions(
        finalOptions.length > 0 ? finalOptions : DELIVERY_DATA['ROW']
      );
      setIsCalculating(false);
    }, 800);
  };

  // Обробник зміни країни (react-select)
  const handleCountryChange = (option: SelectOption | null) => {
    if (option) {
      setSelectedCountryOption(option);
      setSelectedStateOption(null);
      handleCalculate(option.value, selectedServiceName, '');
    }
  };

  // Обробник зміни штату/міста (react-select)
  const handleStateChange = (option: SelectOption | null) => {
    setSelectedStateOption(option);
    const stateValue = option ? option.value : '';
    // Перераховуємо одразу після вибору
    handleCalculate(selectedCountryCode, selectedServiceName, stateValue);
  };

  // Обробник зміни служби доставки (react-select)
  const handleServiceChange = (option: SelectOption | null) => {
    if (option) {
      setSelectedServiceOption(option);
      handleCalculate(selectedCountryCode, option.value, selectedStateName);
    }
  };

  // Кастомізація стилів для react-select, щоб виглядати як Tailwind-input
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '48px', // Відповідає py-3
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 8px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#1f2937',
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 10,
    }),
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* --- Delivery Policy --- */}
      <section id="policy" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t('policy.title')}
        </h2>
        <p className="text-gray-700 mb-6 text-lg">{t('policy.intro')}</p>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Truck className="w-5 h-5 mr-3 text-blue-600" />{' '}
            {t('policy.keyTitle')}
          </h3>
          <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
            <li>
              <strong>{t('policy.key1Strong')}:</strong> {t('policy.key1Text')}
            </li>
            <li>
              <strong>{t('policy.key2Strong')}:</strong> {t('policy.key2Text')}
            </li>
            <li>
              <strong>{t('policy.key3Strong')}:</strong> {t('policy.key3Text')}
            </li>
          </ul>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Shipping Calculator --- */}
      <section
        id="calculator"
        className="mb-20 scroll-mt-24 bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 ">
          {t_calc('title')}
        </h2>
        <p className="text-gray-700 mb-6">{t_calc('intro')}</p>

        {/* --- Form / Inputs --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Country Selection (REACT-SELECT) */}
          <div className="flex-1">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t_calc('labelCountry')}
            </label>
            <Select
              id="country"
              options={allCountriesOptions}
              value={selectedCountryOption}
              onChange={handleCountryChange}
              placeholder={t_calc('placeholderCountry')}
              styles={customStyles}
            />
          </div>

          {/* State/Province (REACT-SELECT) */}
          <div className="flex-1">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t_calc('labelState')}
            </label>
            <Select
              id="state"
              options={availableStatesOptions}
              value={selectedStateOption}
              onChange={handleStateChange}
              placeholder={
                selectedCountryCode === 'UA'
                  ? t_calc('placeholderStateUA')
                  : t_calc('placeholderStateDefault')
              }
              isDisabled={selectedCountryCode === 'UA'}
              styles={customStyles}
            />
          </div>

          {/* Service Selection (REACT-SELECT) */}
          <div className="flex-1">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t_calc('labelService')}
            </label>
            <Select
              id="service"
              options={SERVICE_OPTIONS}
              value={selectedServiceOption}
              onChange={handleServiceChange}
              styles={customStyles}
            />
          </div>
        </div>

        {/* --- Remote Surcharge Message --- */}
        {surchargeApplied && (
          <div className="mb-4 p-3 text-sm font-medium text-orange-800 bg-orange-100 rounded-lg border border-orange-300">
            <span className="font-bold">{t_calc('surchargeNoteStrong')}:</span>{' '}
            {t_calc('surchargeNoteText')}
          </div>
        )}

        {/* --- Results --- */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t_calc('resultsTitle', { country: selectedCountryName })}
          </h3>

          {isCalculating ? (
            <div className="flex items-center justify-center p-8 bg-white rounded-lg">
              <Loader className="w-6 h-6 animate-spin mr-3 text-blue-600" />
              <span className="text-lg text-blue-600">
                {t_calc('resultsLoading')}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {shippingOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-5 rounded-xl transition shadow-md 
                    ${
                      selectedCountryCode === 'RU'
                        ? 'bg-red-50 border-red-300'
                        : option.price === 'Free'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-gray-200'
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
                    <p className="font-semibold text-gray-900">
                      {option.service}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t_calc('resultsTime')}: {option.time}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-xl font-bold 
                      ${
                        option.price === 'Free'
                          ? 'text-green-600'
                          : option.price === 'N/A'
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {option.price === 'Free'
                        ? t_calc('resultsFree')
                        : option.price === 'N/A'
                        ? t_calc('resultsNA')
                        : `$${(option.price as number).toFixed(2)}`}
                    </p>
                    {option.price !== 'N/A' && (
                      <p className="text-xs text-gray-500">
                        {t_calc('resultsApproxPrice')}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {shippingOptions.length === 0 && (
                <div className="p-5 bg-yellow-50 rounded-lg text-yellow-800">
                  <p>{t_calc('resultsNoOptions')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Returns & Warranty Policy --- */}
      <section id="returns-warranty" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          {t_returns('title')}
        </h2>

        <p className="text-gray-700 mb-8 text-lg">{t_returns('intro')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Returns */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
            <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
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
            <p className="text-gray-700 text-sm">{t_returns('returnText')}</p>
          </div>

          {/* Column 2: Warranty */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
            <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
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
            <p className="text-gray-700 text-sm">{t_returns('warrantyText')}</p>
          </div>

          {/* Column 3: Lost Shipments */}
          <div className="bg-orange-50 p-5 rounded-xl border border-orange-200 shadow-md">
            <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
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
            <p className="text-gray-700 text-sm">{t_returns('lostText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
