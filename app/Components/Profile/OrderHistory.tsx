// app/Components/Profile/OrderHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/app/[locale]/services/orderService';
import { History } from 'lucide-react';

type Order = any; // TODO: Використовуйте згенеровані типи

export default function OrderHistory({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await orderService.getOrders(userId);
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, [userId]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">
        Історія замовлень
      </h2>

       {loading ? (
        <p>Завантаження замовлень...</p>
      ) : orders.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30 text-gray-500" />
          <p className="text-gray-500 dark:text-neutral-400">Ви ще не зробили жодного замовлення.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-lg border bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-neutral-100">Замовлення #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                   <p className="font-semibold text-lg text-gray-800 dark:text-neutral-100">${order.total_amount}</p>
                   <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {order.status}
                   </span>
                </div>
              </div>
               {/* TODO: Додати кнопку/модалку для перегляду деталей (order.items) */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}