'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Heart,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Globe,
  DollarSign,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import { useCurrency } from '@/app/context/CurrencyContext';
import { User as UserType } from '../../types/users';

interface BurgerMenuProps {
  user: UserType | null;
  onSignOut: () => void;
}

export default function BurgerMenu({ user, onSignOut }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('BurgerMenu');
  const { currency, setCurrency } = useCurrency();

  const navigationItems = [
    { label: t('navigation.home'), path: `/${locale}` },
    { label: t('navigation.shop'), path: `/${locale}/shop` },
    { label: t('navigation.about'), path: `/${locale}/about` },
    { label: t('navigation.contact'), path: `/${locale}/contact` },
  ];

  useEffect(() => setMounted(true), []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  const handleCartClick = () => {
    // Інтеграція з кошиком
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
        aria-label={t('openMenu')}
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
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  MadEdge
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('closeMenu')}
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
                          {user.full_name || t('user.defaultName')}
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
                    {t('sections.navigation')}
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
                    {t('sections.quickAccess')}
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation(`/${locale}/wishlist`)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      {t('quickAccess.wishlist')}
                    </button>
                    <button
                      onClick={handleCartClick}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      {t('quickAccess.cart')}
                    </button>
                  </div>
                </div>

                {/* Налаштування */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide flex items-center">
                    <Settings className="h-3 w-3 mr-2" />
                    {t('sections.settings')}
                  </h3>

                  {/* Тема */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.theme.label')}
                    </p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {[
                        {
                          icon: <Sun className="h-3 w-3" />,
                          key: 'light',
                          label: t('settings.theme.light'),
                        },
                        {
                          icon: <Monitor className="h-3 w-3" />,
                          key: 'system',
                          label: t('settings.theme.system'),
                        },
                        {
                          icon: <Moon className="h-3 w-3" />,
                          key: 'dark',
                          label: t('settings.theme.dark'),
                        },
                      ].map((themeOption) => (
                        <button
                          key={themeOption.key}
                          onClick={() => setTheme(themeOption.key)}
                          className={`flex-1 p-2 text-xs transition-colors flex items-center justify-center space-x-1 ${
                            theme === themeOption.key
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                          title={themeOption.label}
                        >
                          {themeOption.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Мова */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {t('settings.language.label')}
                    </p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {[
                        { label: 'УКР', value: 'ua' },
                        { label: 'ENG', value: 'en' },
                      ].map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => handleLanguageChange(lang.value)}
                          className={`flex-1 p-2 text-xs font-medium transition-colors ${
                            locale === lang.value
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
                      {t('settings.currency.label')}
                    </p>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
                      {['UAH', 'USD', 'EUR'].map((cur) => (
                        <button
                          key={cur}
                          onClick={() =>
                            setCurrency(cur as 'UAH' | 'USD' | 'EUR')
                          }
                          className={`flex-1 p-2 text-xs font-medium transition-colors ${
                            currency === cur
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Акаунт */}
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide">
                    {t('sections.account')}
                  </h3>
                  {user ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation(`/${locale}/profile`)}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                      >
                        <User className="h-4 w-4 mr-3" />
                        {t('account.profile')}
                      </button>
                      <button
                        onClick={onSignOut}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 text-sm"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {t('account.signOut')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        onClick={() =>
                          handleNavigation(`/${locale}/auth/signin`)
                        }
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 text-sm"
                      >
                        <User className="h-4 w-4 mr-3" />
                        {t('account.signIn')}
                      </button>
                      <button
                        onClick={() =>
                          handleNavigation(`/${locale}/auth/signup`)
                        }
                        className="w-full flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all text-sm font-medium"
                      >
                        {t('account.signUp')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Футер */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {t('footer.copyright')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
