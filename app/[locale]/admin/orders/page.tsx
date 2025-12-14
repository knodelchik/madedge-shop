'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { format } from 'date-fns';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import Image from 'next/image';
import { 
  Package, 
  User, 
  CreditCard, 
  Calendar, 
  Truck, 
  Save, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Стан для трекінгу
  const [trackingInput, setTrackingInput] = useState('');
  const [serviceInput, setServiceInput] = useState(''); // <--- НОВЕ ПОЛЕ
  const [isSavingTracking, setIsSavingTracking] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        users (email, full_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      toast.error('Помилка завантаження замовлень');
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
      
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
      toast.success('Статус оновлено');
    } else {
      toast.error('Помилка оновлення статусу');
    }
  };

  // Збереження даних доставки (Трек + Сервіс)
  const saveTrackingInfo = async () => {
    if (!selectedOrder) return;
    setIsSavingTracking(true);

    const { error } = await supabase
        .from('orders')
        .update({ 
            tracking_number: trackingInput,
            shipping_service: serviceInput // <--- Зберігаємо сервіс
        })
        .eq('id', selectedOrder.id);

    if (!error) {
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { 
            ...o, 
            tracking_number: trackingInput,
            shipping_service: serviceInput
        } : o));
        
        setSelectedOrder((prev: any) => ({ 
            ...prev, 
            tracking_number: trackingInput,
            shipping_service: serviceInput
        }));
        
        toast.success('Дані доставки збережено');
        
        if (selectedOrder.status !== 'shipped' && selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled') {
            await updateStatus(selectedOrder.id, 'shipped');
        }
    } else {
        toast.error('Помилка збереження');
    }
    setIsSavingTracking(false);
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setTrackingInput(order.tracking_number || '');
    setServiceInput(order.shipping_service || ''); // <--- Завантажуємо існуючий сервіс
    setIsDetailsOpen(true);
  };

  if (loading) return <div className="p-8">Завантаження замовлень...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Замовлення</h1>
      
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow overflow-x-auto border border-gray-100 dark:border-neutral-800">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">ID / Дата</th>
              <th className="p-4">Клієнт</th>
              <th className="p-4">Сума</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-gray-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-mono text-sm font-bold text-black dark:text-white">
                    ...{order.id.replace('order_', '').substring(0, 8)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.created_at ? format(new Date(order.created_at), 'dd.MM.yyyy HH:mm') : '-'}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-black dark:text-white">
                    {order.shipping_address?.full_name || order.users?.full_name || 'Гість'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.users?.email}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-black dark:text-white">
                    {order.total_amount} $
                  </div>
                  <div className="text-xs text-gray-500 uppercase">{order.payment_method}</div>
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`bg-transparent border rounded px-2 py-1 text-sm outline-none cursor-pointer font-medium ${
                        order.status === 'success' ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20' : 
                        order.status === 'pending' ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' : 
                        order.status === 'shipped' ? 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20' :
                        'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <option value="pending">Очікує</option>
                    <option value="success">Оплачено</option>
                    <option value="shipped">Відправлено</option>
                    <option value="completed">Виконано</option>
                    <option value="cancelled">Скасовано</option>
                    <option value="failure">Помилка</option>
                  </select>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleOpenDetails(order)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline"
                  >
                    Деталі
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white dark:bg-neutral-950 text-black dark:text-white">
          <SheetHeader className="border-b dark:border-neutral-800 pb-4 mb-6">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Деталі замовлення
            </SheetTitle>
            <div className="text-sm text-gray-500 font-mono">
              ID: {selectedOrder?.id}
            </div>
          </SheetHeader>

          {selectedOrder && (
            <div className="space-y-8">
              
              {/* === БЛОК УПРАВЛІННЯ ДОСТАВКОЮ === */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 space-y-4">
                 <h3 className="text-sm font-bold uppercase text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <Truck size={16} /> Доставка & Трекінг
                 </h3>
                 
                 <div className="grid gap-3">
                    {/* Поле 1: Назва сервісу */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Сервіс доставки (для 17TRACK)</label>
                        <input 
                            type="text" 
                            placeholder="Наприклад: Nova Poshta, DHL, Ukrposhta"
                            value={serviceInput}
                            onChange={(e) => setServiceInput(e.target.value)}
                            list="carriers"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <datalist id="carriers">
                            <option value="Nova Poshta" />
                            <option value="Ukrposhta" />
                            <option value="DHL" />
                            <option value="UPS" />
                            <option value="FedEx" />
                            <option value="USPS" />
                        </datalist>
                    </div>

                    {/* Поле 2: Трек-номер */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Трек-номер посилки (ТТН)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Введіть номер..."
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <button 
                                onClick={saveTrackingInfo}
                                disabled={isSavingTracking}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isSavingTracking ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Зберегти
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
              
              {/* Інші блоки (Інфо, Клієнт, Товари) без змін... */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} /> Дата</div>
                  <div className="font-medium">{format(new Date(selectedOrder.created_at), 'dd.MM.yyyy HH:mm')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><CreditCard size={12} /> Статус</div>
                  <div className={`font-bold uppercase ${selectedOrder.status === 'success' ? 'text-green-600' : selectedOrder.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{selectedOrder.status}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Сума</div>
                  <div className="font-bold text-lg">{selectedOrder.total_amount} $</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Метод</div>
                  <div className="uppercase font-medium">{selectedOrder.payment_method}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b dark:border-neutral-800 pb-2">
                  <User className="w-5 h-5 text-gray-500" /> Клієнт
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ім'я:</span>
                    <span className="font-medium text-right">{selectedOrder.shipping_address?.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-right">{selectedOrder.users?.email || selectedOrder.shipping_address?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Країна:</span>
                    <span className="font-medium text-right">{selectedOrder.shipping_address?.country_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Адреса:</span>
                    <span className="font-medium text-right">{selectedOrder.shipping_address?.address_line1}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b dark:border-neutral-800 pb-2">
                  <Package className="w-5 h-5 text-gray-500" /> Товари
                </h3>
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-3 rounded-xl">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image_url && <Image src={item.image_url} alt="" fill className="object-contain" />}
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{item.product_title}</div>
                        <div className="text-gray-500">{item.quantity} шт. x {item.price} $</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}