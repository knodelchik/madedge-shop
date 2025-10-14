'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, X, Sun, Moon, Monitor, Heart, ShoppingCart, 
  User, Settings, LogOut, Globe, DollarSign 
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { User as UserType } from '../../types/users';

interface BurgerMenuProps {
  user: UserType | null;
  onSignOut: () => void;
}

export default function BurgerMenu({ user, onSignOut }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'uk' | 'en'>('uk');
  const [currency, setCurrency] = useState<'UAH' | 'USD' | 'EUR'>('UAH');
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const navigationItems = [
    { label: 'Головна', path: '/' },
    { label: 'Магазин', path: '/shop' },
    { label: 'Про нас', path: '/about' },
    { label: 'Контакти', path: '/contact' },
  ];

  useEffect(() => setMounted(true), []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleCartClick = () => {
    // Можна додати відкриття кошика через стор
    // useCartStore.getState().openCart();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="lg:hidden">
      {/* Кнопка бургер-меню */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Відкрити меню"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <>
          {/* Бекдроп з блюром */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Бічна панель меню на 70% ширини */}
          <div className="fixed top-0 right-0 min-h-full min-w-[70vw] max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700">
            
            {/* Заголовок з аватаром */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">ME</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">MadEdge</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Закрити меню"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Контент з прокруткою */}
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                
                {/* Інформація про користувача */}
                {user && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {user.full_name || 'Користувач'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Навігація */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide">
                    Навігація
                  </h3>
                  <nav className="space-y-1">
                    {navigationItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium text-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Швидкий доступ */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide">
                    Швидкий доступ
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation('/wishlist')}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      Список бажань
                    </button>
                    <button
                      onClick={handleCartClick}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Кошик
                    </button>
                  </div>
                </div>

                {/* Налаштування */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide flex items-center">
                    <Settings className="h-3 w-3 mr-2" />
                    Налаштування
                  </h3>

                  {/* Тема */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Тема</p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {[
                        { icon: <Sun className="h-3 w-3" />, key: 'light', label: 'Світла' },
                        { icon: <Monitor className="h-3 w-3" />, key: 'system', label: 'Система' },
                        { icon: <Moon className="h-3 w-3" />, key: 'dark', label: 'Темна' },
                      ].map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setTheme(t.key)}
                          className={`flex-1 p-2 text-xs transition-colors flex items-center justify-center space-x-1 ${
                            theme === t.key
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                          title={t.label}
                        >
                          {t.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Мова */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      Мова
                    </p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {[
                        { label: 'УКР', value: 'uk' },
                        { label: 'ENG', value: 'en' },
                      ].map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => setLanguage(lang.value as 'uk' | 'en')}
                          className={`flex-1 p-2 text-xs font-medium transition-colors ${
                            language === lang.value
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Валюта */}
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Валюта
                    </p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {[
                        { label: 'UAH', value: 'UAH' },
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' },
                      ].map((cur) => (
                        <button
                          key={cur.value}
                          onClick={() => setCurrency(cur.value as 'UAH' | 'USD' | 'EUR')}
                          className={`flex-1 p-2 text-xs font-medium transition-colors ${
                            currency === cur.value
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {cur.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Акаунт */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide">
                    Акаунт
                  </h3>
                  {user ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Мій профіль
                      </button>
                      <button
                        onClick={onSignOut}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 text-sm"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Вийти
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation('/auth/signin')}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Увійти
                      </button>
                      <button
                        onClick={() => handleNavigation('/auth/signup')}
                        className="w-full flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all text-sm font-medium"
                      >
                        Зареєструватися
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Футер */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  © 2024 MadEdge. Всі права захищено.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}