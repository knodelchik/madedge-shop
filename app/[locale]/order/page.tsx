'use client';

import { useCartStore } from '../store/cartStore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { authService } from '../services/authService';
import { addressService } from '../services/adressService';
import { Address } from '../../types/address';
import { toast } from 'sonner';
import { Truck, ChevronDown, Plus, MapPin, Clock, Plane } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'; // Імпортуємо клієнт для завантаження налаштувань

// Створюємо клієнт тут (або імпортуємо з lib/supabase)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const createSlug = (str: string) =>
  str.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

export default function OrderPage() {
  const t = useTranslations('Order');
  const { cartItems } = useCartStore();
  
  // Стейт
  const [paymentMethod, setPaymentMethod] = useState<'fondy' | 'paypal'>('fondy');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Адреси
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);

  // Доставка (Дані з БД)
  const [deliverySettings, setDeliverySettings] = useState<any[]>([]); // Масив налаштувань
  const [shippingType, setShippingType] = useState<'Standard' | 'Express'>('Standard');
  const [shippingCost, setShippingCost] = useState(0);

  const priceUnit = t('priceUnit');

  // 1. Завантаження даних (Юзер, Адреси, Налаштування доставки)
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      // А. Юзер
      const { user } = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        
        // Б. Адреси
        const userAddresses = await addressService.getAddresses(user.id);
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          const defaultAddr = userAddresses.find(a => a.is_default) || userAddresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      }

      // В. Налаштування доставки (З бази даних!)
      const { data: settingsData } = await supabase.from('delivery_settings').select('*');
      setDeliverySettings(settingsData || []);

      setLoading(false);
    };
    initData();
  }, []);

  // Хелпер для розрахунку ціни (шукає в deliverySettings)
  const calculateShippingPrice = (countryCode: string, type: 'Standard' | 'Express') => {
    if (!deliverySettings.length) return 0;

    // 1. Шукаємо налаштування для конкретної країни
    let setting = deliverySettings.find(s => s.country_code === countryCode);

    // 2. Якщо немає, шукаємо ROW (Rest of World)
    if (!setting) {
      setting = deliverySettings.find(s => s.country_code === 'ROW');
    }

    // 3. Якщо навіть ROW немає (або країна в чорному списку, якщо ви так зробите)
    if (!setting) return null; // Доставка недоступна

    // 4. Повертаємо ціну залежно від типу
    if (type === 'Standard') return Number(setting.standard_price);
    if (type === 'Express') return Number(setting.express_price);
    
    return 0;
  };

  // 2. Ефект для оновлення вартості доставки
  useEffect(() => {
    if (!selectedAddressId) {
      setShippingCost(0);
      return;
    }

    const address = addresses.find(a => a.id === selectedAddressId);
    if (!address) return;

    // Використовуємо нову функцію
    const cost = calculateShippingPrice(address.country_code, shippingType);
    
    if (cost === null) {
      toast.error('Доставка цього типу недоступна в ваш регіон');
      if (shippingType === 'Express') {
         setShippingType('Standard');
      } else {
         setShippingCost(0);
      }
    } else {
      setShippingCost(cost);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, addresses, shippingType, deliverySettings]); 

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  // Отримуємо ціни для UI кнопок
  const getCostForUI = (type: 'Standard' | 'Express') => {
    if (!selectedAddress) return 0;
    return calculateShippingPrice(selectedAddress.country_code, type);
  };

  const standardCost = getCostForUI('Standard');
  const expressCost = getCostForUI('Express');

  const handlePayment = async () => {
    setProcessing(true);

    try {
      if (!user) {
        toast.error('Ви не авторизовані. Будь ласка, увійдіть.');
        return;
      }

      if (!user.email_confirmed_at) {
        toast.error('Для оформлення замовлення необхідно підтвердити електронну пошту.', {
          action: {
            label: 'Перейти в профіль',
            onClick: () => window.location.href = '/profile'
          },
          duration: 5000,
        });
        return;
      }

      if (!selectedAddressId) {
        toast.error('Оберіть адресу доставки');
        return;
      }

      const currentAddress = addresses.find(a => a.id === selectedAddressId);
      
      if (!currentAddress) {
        toast.error('Помилка: обрану адресу не знайдено');
        return;
      }

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems, 
          method: paymentMethod,
          shippingAddress: currentAddress,
          shippingCost,
          shippingType, 
          totalAmount: total 
        }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Помилка при створенні платежу');
      }

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error('Не вдалося отримати посилання на оплату');
      }

    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.message || 'Помилка з\'єднання з сервером');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) return <EmptyCartState t={t} />;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 transition-colors">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ЛІВА ЧАСТИНА: Товари */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ваше замовлення</h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <CartItem key={item.id} item={item} index={index} priceUnit={priceUnit} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА: Сайдбар */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-neutral-800 sticky top-6">
              
              {/* === 1. ВИБІР АДРЕСИ === */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Адреса доставки
                </label>
                
                {addresses.length === 0 ? (
                  <Link 
                    href="/profile?tab=addresses" 
                    className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl text-yellow-700 dark:text-yellow-500 hover:bg-yellow-100 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> Додати адресу
                  </Link>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={() => setIsAddressMenuOpen(!isAddressMenuOpen)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-gray-400 transition-colors text-left"
                    >
                      {selectedAddress ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                          <MapPin size={18} className="text-gray-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-gray-900 dark:text-white block truncate">
                              {selectedAddress.city}, {selectedAddress.country_name}
                            </span>
                            <span className="text-xs text-gray-500 block truncate">
                              {selectedAddress.address_line1}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Оберіть адресу</span>
                      )}
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isAddressMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isAddressMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          <div className="max-h-60 overflow-y-auto py-1">
                            {addresses.map((addr) => (
                              <button
                                key={addr.id}
                                onClick={() => {
                                  setSelectedAddressId(addr.id);
                                  setIsAddressMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex flex-col ${selectedAddressId === addr.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              >
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {addr.country_code} - {addr.city}
                                </span>
                                <span className="text-xs text-gray-500 truncate w-full">
                                  {addr.address_line1}
                                </span>
                              </button>
                            ))}
                            <div className="border-t border-gray-100 dark:border-neutral-700 mt-1 pt-1">
                              <Link 
                                href="/profile?tab=addresses" 
                                className="flex items-center gap-2 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
                              >
                                <Plus size={14} /> Додати нову адресу
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* === 2. СПОСІБ ДОСТАВКИ === */}
              {selectedAddressId && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Спосіб доставки
                  </label>
                  <div className="space-y-2">
                    {/* STANDARD */}
                    <button
                      onClick={() => setShippingType('Standard')}
                      disabled={standardCost === null}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        shippingType === 'Standard'
                          ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800'
                          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      } ${standardCost === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${shippingType === 'Standard' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                          <Clock size={18} className="text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className="text-left">
                          <span className="block font-semibold text-sm text-gray-900 dark:text-white">Standard</span>
                          <span className="text-xs text-gray-500">Звичайна доставка</span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {standardCost === 0 ? 'Безкоштовно' : standardCost === null ? 'Н/Д' : `${standardCost} ${priceUnit}`}
                      </span>
                    </button>

                    {/* EXPRESS */}
                    <button
                      onClick={() => setShippingType('Express')}
                      disabled={expressCost === null}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        shippingType === 'Express'
                          ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800'
                          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      } ${expressCost === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${shippingType === 'Express' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                          <Plane size={18} className="text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className="text-left">
                          <span className="block font-semibold text-sm text-gray-900 dark:text-white">Express</span>
                          <span className="text-xs text-gray-500">Швидка доставка</span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {expressCost === 0 ? 'Безкоштовно' : expressCost === null ? 'Н/Д' : `${expressCost} ${priceUnit}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* === 3. SUMMARY === */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-6 border-t border-gray-100 dark:border-neutral-800 pt-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
                <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {subtotal.toFixed(2)} {priceUnit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-neutral-400 flex items-center gap-1">
                    {t('shipping')} <Truck size={14} />
                  </span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {shippingCost === 0 ? t('freeShipping') : `${shippingCost.toFixed(2)} ${priceUnit}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-2xl mb-8">
                <span className="text-gray-900 dark:text-white">{t('totalLabel')}</span>
                <span>{total.toFixed(2)} {priceUnit}</span>
              </div>

              <div className="mb-6">
                <span className="block font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  {t('paymentMethodLabel')}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      paymentMethod === 'fondy'
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-neutral-700 dark:text-neutral-400'
                    }`}
                    onClick={() => setPaymentMethod('fondy')}
                  >
                    Fondy
                  </button>
                  <button
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-neutral-700 dark:text-neutral-400'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || !selectedAddressId}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {processing ? 'Обробка...' : `${t('payButton')} ${total.toFixed(2)} ${priceUnit}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, index, priceUnit }: any) {
  const slug = createSlug(item.title);
  return (
    <Link href={`/shop/${slug}?from=checkout`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:shadow-md transition-all"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-neutral-800">
          <Image src={item.images[0]} alt={item.title} fill className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-lg text-gray-900 dark:text-neutral-100 truncate">{item.title}</p>
          <p className="text-gray-500 dark:text-neutral-400 mt-1">{item.quantity} шт.</p>
        </div>
        <div className="text-right font-bold text-lg text-gray-900 dark:text-white">
          {(item.price * item.quantity).toFixed(2)} {priceUnit}
        </div>
      </motion.div>
    </Link>
  );
}

function EmptyCartState({ t }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-white dark:bg-black">
      <div className="text-center">
        <p className="text-xl text-gray-500 dark:text-neutral-400">{t('emptyCart')}</p>
      </div>
    </div>
  );
}