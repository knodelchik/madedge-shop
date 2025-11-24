'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'UAH' | 'USD' | 'EUR';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (val: Currency) => void;
  rates: Record<Currency, number>;
  formatPrice: (priceInUsd: number) => string;
  convertPrice: (priceInUsd: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('UAH');
  
  // Початкові курси (фолбек), поки не завантажаться свіжі
  const [rates, setRates] = useState<Record<Currency, number>>({
    USD: 1,
    UAH: 41.5,
    EUR: 0.92,
  });

  // Завантажуємо актуальні курси при першому рендері
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency');
        if (res.ok) {
          const data = await res.json();
          setRates(data);
        }
      } catch (e) {
        console.error('Failed to load rates', e);
      }
    };

    fetchRates();
  }, []);

  // Конвертація (число)
  const convertPrice = (priceInUsd: number) => {
    const rate = rates[currency];
    return priceInUsd * rate;
  };

  // Конвертація + Форматування (рядок "1 200 ₴")
const formatPrice = (priceInUsd: number) => {
    let value = convertPrice(priceInUsd);
    
    // === ЛОГІКА ОКРУГЛЕННЯ ===
    // Якщо валюта UAH, округлюємо до найближчих 10
    if (currency === 'UAH') {
      value = Math.round(value / 10) * 10;
    }

    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol', // Показує символ (₴, $, €)
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
};