'use client';

import Link from 'next/link';
import Image from 'next/image';
<<<<<<< HEAD
import { Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import CartSheet from './CartSheet';
=======
import { Settings, Moon, Sun, Monitor, User } from 'lucide-react';
import CartSheet from './CartSheet';
import { useCartStore } from '../store/cartStore';
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b
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
<<<<<<< HEAD
=======
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User as UserType } from '../types/users';
import { useRouter } from 'next/navigation';
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b

export default function Header() {
  const { setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();
<<<<<<< HEAD
=======
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const handleAuthChange = async (event: string, session: any) => {
    console.log('🔐 Auth state changed:', event);
    
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        setUser(session.user);
        
        console.log('👤 User signed in:', session.user.id);
        
        // Затримка для стабілізації
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { cartItems, lastUser } = useCartStore.getState();
        console.log('🛒 Current local cart:', cartItems);
        console.log('👤 Last user:', lastUser);
        console.log('👤 Current user:', session.user.id);
        
        // ЯКЩО це той самий користувач - завантажуємо з бази
        if (lastUser === session.user.id) {
          console.log('🔄 Same user - loading from database');
          await useCartStore.getState().loadCartFromDatabase(session.user.id);
        } else {
          // ЯКЩО новий користувач - перевіряємо чи є дані в базі
          console.log('🔄 New user or different device');
          
          // Спочатку завантажуємо з бази
          await useCartStore.getState().loadCartFromDatabase(session.user.id);
          
          const { cartItems: dbCart } = useCartStore.getState();
          console.log('📊 Cart from database:', dbCart);
          
          // Якщо в базі пусто, а локально є товари - синхронізуємо
          if (dbCart.length === 0 && cartItems.length > 0) {
            console.log('🔄 Database empty but local has items - syncing');
            await useCartStore.getState().syncCartWithDatabase(session.user.id);
          }
        }
      } catch (error) {
        console.error('❌ Error during auth change:', error);
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('👤 User signed out');
      
      // Перед виходом синхронізуємо корзину
      const { cartItems, lastUser } = useCartStore.getState();
      if (lastUser && cartItems.length > 0) {
        console.log('🔄 Syncing cart before sign out');
        await useCartStore.getState().syncCartWithDatabase(lastUser);
      }
      
      setUser(null);
    }
  };

  // Слухач змін автентифікації
  const { data: { subscription } } = authService.supabase.auth.onAuthStateChange(handleAuthChange);

  // Перевірка поточного стану при завантаженні
  const checkInitialAuth = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (user) {
        console.log('🔍 Initial auth check - user found:', user.id);
        await handleAuthChange('SIGNED_IN', { user });
      } else {
        console.log('🔍 Initial auth check - no user');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error checking initial auth:', error);
      setLoading(false);
    }
  };

  checkInitialAuth();

  return () => {
    subscription.unsubscribe();
  };
}, []);

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
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b

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
<<<<<<< HEAD
              {' '}
=======
>>>>>>> 42be9e3f71fffe1b8437e5102a53e7c4d259d77b
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