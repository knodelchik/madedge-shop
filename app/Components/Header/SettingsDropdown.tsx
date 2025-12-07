// SettingsDropdown.tsx
'use client';

import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useCurrency } from '../../context/CurrencyContext';
import { translations } from '@/lib/translations';
import { useLocale } from 'next-intl';

export default function SettingsDropdown() {
  const { setTheme, theme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const currentLocale = useLocale();

  const tSettings = translations[currentLocale as 'uk' | 'en'].Settings;

  // Видаляємо масив locales та handleLocaleChange, вони тут більше не потрібні

  const currencies = [
    { code: 'UAH' as const, label: tSettings.currencyUAH },
    { code: 'USD' as const, label: tSettings.currencyUSD },
    { code: 'EUR' as const, label: tSettings.currencyEUR },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={tSettings.ariaLabelSettings}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
        >
          <Settings className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Секцію з мовою (LanguageTitle) повністю видаляємо звідси */}

        {/* === Валюта === */}
        <DropdownMenuLabel>{tSettings.currencyTitle}</DropdownMenuLabel>
        {currencies.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code)}
            className="cursor-pointer"
          >
            <span className="flex-1">{label}</span>
            {currency === code && <span className="ml-2">✓</span>}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* === Тема === */}
        <DropdownMenuLabel>{tSettings.themeTitle}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer"
        >
          <Sun className="mr-2 w-4 h-4" />
          <span className="flex-1">{tSettings.themeLight}</span>
          {theme === 'light' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer"
        >
          <Moon className="mr-2 w-4 h-4" />
          <span className="flex-1">{tSettings.themeDark}</span>
          {theme === 'dark' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <Monitor className="mr-2 w-4 h-4" />
          <span className="flex-1">{tSettings.themeSystem}</span>
          {theme === 'system' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
