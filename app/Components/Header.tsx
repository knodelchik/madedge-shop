'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Settings, Moon, Sun, Monitor, User } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User as UserType } from '../types/users';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { user } = await authService.getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    // Перевірка при завантаженні компоненту
    checkAuth();

    // Слухач змін автентифікації
    const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user as UserType);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full shadow-md bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-800">MadEdge</div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

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
        {/* Settings Dropdown */}
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

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
              <User className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user ? (
              <>
                <DropdownMenuLabel>
                  {language === 'ua' ? 'Мій акаунт' : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    {language === 'ua' ? 'Профіль' : 'Profile'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-red-600 cursor-pointer"
                >
                  {language === 'ua' ? 'Вийти' : 'Sign Out'}
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel>
                  {language === 'ua' ? 'Акаунт' : 'Account'}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="cursor-pointer">
                    {language === 'ua' ? 'Увійти' : 'Sign In'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="cursor-pointer">
                    {language === 'ua' ? 'Зареєструватися' : 'Sign Up'}
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <CartSheet />
      </div>
    </header>
  );
}