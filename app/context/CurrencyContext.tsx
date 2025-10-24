'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'UAH' | 'USD' | 'EUR';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (val: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('UAH');
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
};
