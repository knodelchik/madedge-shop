'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Plus, Search, Edit } from 'lucide-react';
import Image from 'next/image';
import {
    Sheet, SheetContent, SheetHeader, // <--- Додати
    SheetTitle
} from '@/components/ui/sheet'; // Імпортуємо ваш Sheet компонент
import ProductForm from '@/app/[locale]/admin/ProductForm'; // Імпортуємо створену форму

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Стан для редагування
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data || []);
        setLoading(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Щоб не відкривалось редагування при кліку на видалення
        if (!confirm('Видалити цей товар?')) return;

        await supabase.from('products').delete().eq('id', id);
        setProducts(products.filter(p => p.id !== id));
    };

    // Відкриття форми для СТВОРЕННЯ
    const handleAddNew = () => {
        setEditingProduct(null);
        setIsSheetOpen(true);
    };

    // Відкриття форми для РЕДАГУВАННЯ
    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsSheetOpen(true);
    };

    const handleFormSaved = () => {
        setIsSheetOpen(false);
        loadProducts(); // Перезавантажуємо список
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Завантаження...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Товари</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} /> Додати товар
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Пошук..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-neutral-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="p-4">Фото</th>
                            <th className="p-4">Назва</th>
                            <th className="p-4">Ціна</th>
                            <th className="p-4">Категорія</th>
                            <th className="p-4 text-right">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                        {filteredProducts.map((product) => (
                            <tr
                                key={product.id}
                                onClick={() => handleEdit(product)} // Клік по рядку відкриває редагування
                                className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                            >
                                <td className="p-4">
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                                        {product.images && product.images[0] ? (
                                            <Image src={product.images[0]} alt={product.title} fill className="object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">
                                    {product.title}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                    {product.price} $
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={(e) => handleDelete(e, product.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Видалити"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* БОКОВА ПАНЕЛЬ РЕДАГУВАННЯ */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {editingProduct ? 'Редагування товару' : 'Створення товару'}
                        </SheetTitle>
                    </SheetHeader>
                    <ProductForm
                        product={editingProduct}
                        onSaved={handleFormSaved}
                        onCancel={() => setIsSheetOpen(false)}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}