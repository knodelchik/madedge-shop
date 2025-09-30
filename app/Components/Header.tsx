'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import CartSheet from './CartSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Header() {
  const { setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
      {/* Left logo */}
      <div className="text-2xl font-bold text-gray-800">MadEdge</div>

      {/* Navigation */}
      <nav className="flex items-center gap-10 text-gray-700 font-medium">
        <Link href="/">{language === 'ua' ? 'Головна' : 'Home'}</Link>
        <Link href="/shop">{language === 'ua' ? 'Магазин' : 'Shop'}</Link>
        <div className="w-14 h-14 relative">
          <Image
            src="/logo.jpg"
            alt="Логотип"
            fill
            className="object-contain rounded-full"
          />
        </div>
        <Link href="/about">{language === 'ua' ? 'Про нас' : 'About'}</Link>
        <Link href="/contact">
          {language === 'ua' ? 'Контакти' : 'Contact'}
        </Link>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-4 text-gray-700">
        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Налаштування">
              <Settings className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Language */}
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

            {/* Currency */}
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

            {/* Theme */}
            <DropdownMenuLabel>
              {' '}
              {language === 'ua' ? 'Тема' : 'Theme'}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 w-4 h-4" />{' '}
              {language === 'ua' ? 'Світла' : 'Light'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 w-4 h-4" />{' '}
              {language === 'ua' ? 'Темна' : 'Dark'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 w-4 h-4" />{' '}
              {language === 'ua' ? 'Системна' : 'System'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button aria-label="Акаунт">
          <User className="w-6 h-6" />
        </button>

        <CartSheet />
      </div>
    </header>
  );
}
