'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
<<<<<<< HEAD
=======
import { translations } from '../translation/translations';
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b

type Language = 'ua' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
<<<<<<< HEAD
=======
  t: (typeof translations)['ua']; // переклади для поточної мови
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const [language, setLanguage] = useState<Language>('ua');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
=======
  const [language, setLanguage] = useState<Language>('en');

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
