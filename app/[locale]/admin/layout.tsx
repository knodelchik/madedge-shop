import { redirect } from '@/navigation';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server'; 

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  
  console.log("--- ADMIN LAYOUT CHECK ---");

  // 1. Створюємо клієнт
  const supabase = await createClient();

  // 2. Перевіряємо юзера
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.log("❌ ADMIN CHECK FAIL: No User found (Cookie missing or invalid)");
    if (userError) console.error("Error:", userError.message);
    redirect({ href: '/auth', locale });
    return null;
  }

  console.log("✅ User found:", user.id);

  // 3. Перевіряємо роль у базі
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.log("❌ ADMIN CHECK FAIL: DB Error when fetching role");
    console.error("DB Error:", profileError.message);
    // Це може статися через RLS. Спробуй додати політику SELECT для users.
    redirect({ href: '/', locale });
    return null;
  }

  console.log("ℹ️ User Role in DB:", profile?.role);

  // 4. Фінальна перевірка
  if (profile?.role !== 'admin') {
    console.log("❌ ADMIN CHECK FAIL: Role is not admin. Redirecting home.");
    redirect({ href: '/', locale });
    return null;
  }

  console.log("✅ ACCESS GRANTED to Admin Panel");

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-neutral-950">
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r dark:border-neutral-800 p-6 fixed h-full overflow-y-auto z-10">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Admin Panel</h2>
        <nav className="space-y-2">
          <AdminLink href="/admin" label="Дашборд" />
          <AdminLink href="/admin/orders" label="Замовлення" />
          <AdminLink href="/admin/products" label="Товари" />
          <AdminLink href="/admin/delivery" label="Доставка" />
          <div className="pt-4 border-t dark:border-neutral-800 mt-4">
             <Link href="/" className="text-sm text-gray-500 hover:text-black dark:hover:text-white">← На сайт</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 ml-64 overflow-y-auto text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-200"
    >
      {label}
    </Link>
  );
}