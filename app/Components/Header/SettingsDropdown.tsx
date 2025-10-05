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
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function SettingsDropdown() {
  const { setTheme, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Налаштування">
          <Settings className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {language === 'ua' ? 'Мова' : 'Language'}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLanguage('ua')}>
          🇺🇦 Українська {language === 'ua' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          🇬🇧 English {language === 'en' && '✓'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          {language === 'ua' ? 'Валюта' : 'Currency'}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setCurrency('uah')}>
          ₴ {currency === 'uah' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('usd')}>
          $ {currency === 'usd' && '✓'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          {language === 'ua' ? 'Тема' : 'Theme'}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 w-4 h-4" />{' '}
          {language === 'ua' ? 'Світла' : 'Light'} {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 w-4 h-4" />{' '}
          {language === 'ua' ? 'Темна' : 'Dark'} {theme === 'dark' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 w-4 h-4" />{' '}
          {language === 'ua' ? 'Системна' : 'System'} {theme === 'system' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}