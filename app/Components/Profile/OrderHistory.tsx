'use client';

import { useState, useEffect } from 'react';
import { orderService, Order } from '@/app/[locale]/services/orderService';
import { Package, ChevronDown, Calendar, MapPin, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/app/context/CurrencyContext'; // 1. Імпорт

export default function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // 2. Отримуємо функцію форматування
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await orderService.getOrders(userId);
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, [userId]);

  const toggleOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failure': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Оплачено';
      case 'pending': return 'Очікує оплати';
      case 'failure': return 'Скасовано';
      default: return status;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Завантаження історії...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Package size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Історія порожня</h3>
        <p className="text-gray-500 dark:text-neutral-400">Ви ще не зробили жодного замовлення.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 px-2">
        Історія замовлень
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* HEADER */}
            <div 
              onClick={() => toggleOrder(order.id)}
              className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${getStatusColor(order.status)}`}>
                  <Package size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">
                      № {order.id.split('_')[1] || order.id.substring(0, 8)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> 
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-gray-900 dark:text-neutral-200">
                      {/* 3. Використовуємо formatPrice */}
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                {/* Мініатюри */}
                <div className="flex -space-x-3">
                  {order.order_items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="relative w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                      {item.image_url ? (
                        <Image src={item.image_url} alt="product" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-500">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>
                
                <ChevronDown 
                  className={`text-gray-400 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>

            {/* ДЕТАЛІ */}
            <AnimatePresence>
              {expandedOrderId === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 dark:border-neutral-800"
                >
                  <div className="p-5 space-y-6">
                    
                    {/* Список товарів */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                        Товари ({order.order_items.length})
                      </h4>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-2">
                          <div className="relative w-16 h-16 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-gray-200 dark:border-neutral-700">
                            {item.image_url && (
                              <Image src={item.image_url} alt={item.product_title} fill className="object-contain p-1" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.product_title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} шт. x {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.quantity * item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Інфо про доставку */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Адреса доставки</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                            {order.shipping_address?.country_name}, {order.shipping_address?.city}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.shipping_address?.address_line1}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Оплата</p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 capitalize">
                            {order.shipping_type} Delivery • {order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'Безкоштовно'}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}