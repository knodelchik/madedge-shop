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
import { createClient } from '@supabase/supabase-js';
import { useCurrency } from '@/app/context/CurrencyContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const createSlug = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

export default function OrderPage() {
  const t = useTranslations('Order');
  const { cartItems } = useCartStore();
  const { formatPrice, rates } = useCurrency();

  const [paymentMethod, setPaymentMethod] = useState<'fondy' | 'paypal'>(
    'fondy'
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);

  const [deliverySettings, setDeliverySettings] = useState<any[]>([]);
  const [shippingType, setShippingType] = useState<'Standard' | 'Express'>(
    'Standard'
  );
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const { user } = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        const userAddresses = await addressService.getAddresses(user.id);
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          const defaultAddr =
            userAddresses.find((a) => a.is_default) || userAddresses[0];
          setSelectedAddressId(defaultAddr.id);
        }
      }
      const { data: settingsData } = await supabase
        .from('delivery_settings')
        .select('*');
      setDeliverySettings(settingsData || []);
      setLoading(false);
    };
    initData();
  }, []);

  const calculateShippingPrice = (
    countryCode: string,
    type: 'Standard' | 'Express'
  ) => {
    if (!deliverySettings.length) return 0;
    let setting = deliverySettings.find((s) => s.country_code === countryCode);
    if (!setting) {
      setting = deliverySettings.find((s) => s.country_code === 'ROW');
    }
    if (!setting) return null;
    if (type === 'Standard') return Number(setting.standard_price);
    if (type === 'Express') return Number(setting.express_price);
    return 0;
  };

  useEffect(() => {
    if (!selectedAddressId) {
      setShippingCost(0);
      return;
    }
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) return;

    const cost = calculateShippingPrice(address.country_code, shippingType);
    if (cost === null) {
      toast.error(t('errorDeliveryUnavailable'));
      if (shippingType === 'Express') {
        setShippingType('Standard');
      } else {
        setShippingCost(0);
      }
    } else {
      setShippingCost(cost);
    }
  }, [selectedAddressId, addresses, shippingType, deliverySettings]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

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
        toast.error(t('errorAuth'));
        return;
      }
      if (!user.email_confirmed_at) {
        toast.error(t('errorEmail'));
        return;
      }
      if (!selectedAddressId || !selectedAddress) {
        toast.error(t('errorSelectAddress'));
        return;
      }
const subtotalUSD = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalUSD = subtotalUSD + shippingCost;
      const totalUAH = totalUSD * rates['UAH'];

    const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems, 
          method: paymentMethod,
          shippingAddress: selectedAddress,
          shippingCost: shippingCost, 
          shippingType, 
          
          // ПЕРЕДАЄМО ДВІ СУМИ:
          amountUSD: totalUSD, // Для бази (напр. 100)
          amountUAH: totalUAH  // Для Fondy (напр. 4150)
        }),
    });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('paymentError'));

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error(t('errorPaymentLink'));
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.message || t('errorServer'));
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) return <EmptyCartState t={t} />;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        {t('processing')}
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full py-4 lg:py-12 transition-colors">
      <div className="px-3 md:px-6 lg:p-6 max-w-6xl mx-auto space-y-4 lg:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 lg:mb-8"
        >
          {/* Адаптивний заголовок */}
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ЛІВА ЧАСТИНА: Товари */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">
              {t('yourOrder')}
            </h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    index={index}
                    formatPrice={formatPrice}
                    t={t}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ПРАВА ЧАСТИНА: Сайдбар */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-4 lg:p-6 border border-gray-100 dark:border-neutral-800 lg:sticky lg:top-6">
              {/* ВИБІР АДРЕСИ */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('deliveryAddress')}
                </label>
                {addresses.length === 0 ? (
                  <Link
                    href="/profile?tab=addresses"
                    className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl text-yellow-700 dark:text-yellow-500 hover:bg-yellow-100 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> {t('addAddress')}
                  </Link>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setIsAddressMenuOpen(!isAddressMenuOpen)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:border-gray-400 transition-colors text-left"
                    >
                      {selectedAddress ? (
                        <div className="flex items-center gap-2 overflow-hidden w-full">
                          <MapPin
                            size={18}
                            className="text-gray-500 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-gray-900 dark:text-white block text-sm lg:text-base truncate">
                              {selectedAddress.city},{' '}
                              {selectedAddress.country_name}
                            </span>
                            <span className="text-xs text-gray-500 block truncate">
                              {selectedAddress.address_line1}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {t('selectAddress')}
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 shrink-0 ml-2 transition-transform ${
                          isAddressMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
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
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex flex-col ${
                                  selectedAddressId === addr.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : ''
                                }`}
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
                                <Plus size={14} /> {t('addNewAddress')}
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* СПОСІБ ДОСТАВКИ */}
              {selectedAddressId && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('shippingMethod')}
                  </label>
                  <div className="space-y-2">
                    {/* Standard Shipping */}
                    <button
                      onClick={() => setShippingType('Standard')}
                      disabled={standardCost === null}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        shippingType === 'Standard'
                          ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800'
                          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      } ${
                        standardCost === null
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            shippingType === 'Standard'
                              ? 'bg-white dark:bg-neutral-700 shadow-sm'
                              : 'bg-gray-100 dark:bg-neutral-800'
                          }`}
                        >
                          <Clock
                            size={18}
                            className="text-gray-700 dark:text-gray-300"
                          />
                        </div>
                        <div className="text-left overflow-hidden">
                          <span className="block font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {t('standard')}
                          </span>
                          <span className="text-xs text-gray-500 truncate block">
                            {t('standardDesc')}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap ml-2">
                        {standardCost === 0
                          ? t('freeShipping')
                          : standardCost === null
                          ? t('na')
                          : formatPrice(standardCost)}
                      </span>
                    </button>

                    {/* Express Shipping */}
                    <button
                      onClick={() => setShippingType('Express')}
                      disabled={expressCost === null}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        shippingType === 'Express'
                          ? 'border-black bg-gray-50 dark:border-white dark:bg-neutral-800'
                          : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      } ${
                        expressCost === null
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            shippingType === 'Express'
                              ? 'bg-white dark:bg-neutral-700 shadow-sm'
                              : 'bg-gray-100 dark:bg-neutral-800'
                          }`}
                        >
                          <Plane
                            size={18}
                            className="text-gray-700 dark:text-gray-300"
                          />
                        </div>
                        <div className="text-left overflow-hidden">
                          <span className="block font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {t('express')}
                          </span>
                          <span className="text-xs text-gray-500 truncate block">
                            {t('expressDesc')}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap ml-2">
                        {expressCost === 0
                          ? t('freeShipping')
                          : expressCost === null
                          ? t('na')
                          : formatPrice(expressCost)}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ПІДСУМОК */}
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4 border-t border-gray-100 dark:border-neutral-800 pt-4">
                {t('orderSummary')}
              </h2>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-neutral-800 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-neutral-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-neutral-400 flex items-center gap-1">
                    {t('shipping')} <Truck size={14} />
                  </span>
                  <span
                    className={`font-medium ${
                      shippingCost === 0
                        ? 'text-green-600'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {shippingCost === 0
                      ? t('freeShipping')
                      : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-xl lg:text-2xl mb-6">
                <span className="text-gray-900 dark:text-white">
                  {t('totalLabel')}
                </span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="mb-6">
                <span className="block font-semibold text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t('paymentMethodLabel')}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`px-2 py-3 lg:px-4 rounded-xl border-2 font-medium transition-all text-sm ${
                      paymentMethod === 'fondy'
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-neutral-700 dark:text-neutral-400'
                    }`}
                    onClick={() => setPaymentMethod('fondy')}
                  >
                    Fondy
                  </button>
                  <button
                    className={`px-2 py-3 lg:px-4 rounded-xl border-2 font-medium transition-all text-sm ${
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
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 lg:py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                {processing
                  ? t('processing')
                  : `${t('payButton')} ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Оновлений компонент картки ===
function CartItem({ item, index, formatPrice, t }: any) {
  const slug = createSlug(item.title);
  return (
    <Link href={`/shop/${slug}?from=checkout`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        // items-start на моб (щоб текст не сповзав), items-center на ПК
        className="flex items-start lg:items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl hover:shadow-md transition-all"
      >
        {/* Картинка менша на моб (w-16) і більша на ПК (w-24) */}
        <div className="relative w-16 h-16 lg:w-24 lg:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-neutral-800">
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
          {/* line-clamp-2 дозволяє перенос тексту на 2 рядки замість обрізання одним */}
          <p className="font-semibold text-sm lg:text-lg text-gray-900 dark:text-neutral-100 line-clamp-2 leading-tight">
            {item.title}
          </p>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 text-xs lg:text-base">
            {t('quantityLabel')}: {item.quantity}
          </p>
        </div>

        <div className="text-right font-bold text-sm lg:text-lg text-gray-900 dark:text-white whitespace-nowrap">
          {formatPrice(item.price * item.quantity)}
        </div>
      </motion.div>
    </Link>
  );
}

function EmptyCartState({ t }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-white dark:bg-black">
      <div className="text-center px-4">
        <p className="text-lg lg:text-xl text-gray-500 dark:text-neutral-400">
          {t('emptyCart')}
        </p>
      </div>
    </div>
  );
}
