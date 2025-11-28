'use client';

import { useEffect, useState, useCallback } from 'react';
// 1. ВИПРАВЛЕННЯ: Імпортуємо правильний клієнт, який має доступ до сесії
import { supabase } from '@/app/lib/supabase';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';
import Link from 'next/link';

// Видаляємо ручну ініціалізацію createClient

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      // 1. Загальна статистика
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, created_at');

      if (ordersError) throw ordersError;

      // 2. Кількість користувачів
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Обчислення для карток
      const successOrders = allOrders?.filter(o => o.status === 'success') || [];
      // pending - це нові замовлення
      const pending = allOrders?.filter(o => o.status === 'pending').length || 0;
      
      // Дохід рахуємо тільки з успішних
      const revenue = successOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({
        totalRevenue: revenue,
        totalOrders: allOrders?.length || 0,
        pendingOrders: pending,
        totalUsers: usersCount || 0
      });

      // 3. Графік (тільки success orders)
      const chartMap = new Map();
      // Ініціалізуємо останні 30 днів нулями
      for (let i = 29; i >= 0; i--) {
        const dateKey = format(subDays(new Date(), i), 'dd.MM');
        chartMap.set(dateKey, 0);
      }

      successOrders.forEach(order => {
        const dateKey = format(new Date(order.created_at), 'dd.MM');
        if (chartMap.has(dateKey)) {
          chartMap.set(dateKey, chartMap.get(dateKey) + Number(order.total_amount));
        }
      });

      const formattedChartData = Array.from(chartMap, ([name, value]) => ({ name, value }));
      setChartData(formattedChartData);

      // 4. Останні 5 замовлень (всі статуси)
      const { data: lastOrders, error: recentError } = await supabase
        .from('orders')
        .select(`
          id, 
          total_amount, 
          status, 
          created_at,
          users (email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setRecentOrders(lastOrders || []);
    } catch (error: any) {
      console.error('Dashboard Error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Первинне завантаження + Підписка на зміни (Realtime)
  useEffect(() => {
    loadDashboardData();

    // Підписка на нові замовлення в реальному часі
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          console.log('New order or update detected, refreshing stats...');
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) return <div className="p-8 text-center">Завантаження аналітики...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h1>
        <div className="flex gap-3">
            <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Оновити
            </button>
            <div className="text-sm text-gray-500 bg-white dark:bg-neutral-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 flex items-center gap-2">
                <Calendar size={16} />
                Останні 30 днів
            </div>
        </div>
      </div>
      
      {/* 1. КАРТКИ СТАТИСТИКИ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Загальний дохід" 
          value={`${stats.totalRevenue.toLocaleString()} $`} 
          icon={<DollarSign size={24} />} 
          color="green" 
        />
        <StatCard 
          title="Всього замовлень" 
          value={stats.totalOrders} 
          icon={<ShoppingBag size={24} />} 
          color="blue" 
        />
        <StatCard 
          title="Очікують оплати" 
          value={stats.pendingOrders} 
          icon={<Package size={24} />} 
          color="yellow" 
        />
        <StatCard 
          title="Клієнти" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          color="purple" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 2. ГРАФІК ПРОДАЖІВ */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
          <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Динаміка продажів (оплачені)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  tickFormatter={(value) => `${value}$`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }}
                  formatter={(value: number) => [`${value} $`, 'Дохід']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. ОСТАННІ ЗАМОВЛЕННЯ */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Останні замовлення</h3>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              Всі
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
               <p className="text-gray-500 text-sm">Замовлень ще немає</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {order.users?.full_name || 'Гість'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.created_at), 'dd MMM, HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {order.total_amount} $
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                       order.status === 'success' ? 'bg-green-100 text-green-700' : 
                       order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                       'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Допоміжний компонент картки
function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}