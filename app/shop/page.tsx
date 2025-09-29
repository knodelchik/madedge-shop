'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { products } from '../data/products'; // ✅ імпорт з файлу products.ts
import Link from 'next/link';

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort] = useState('price-asc');

  // 🔎 Фільтрація + сортування
  const filteredProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="p-6 space-y-6">
      {/* 🔝 Верхня панель */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Слайдер ціни */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Ціна</h2>
          <Slider
            defaultValue={[0, 1000]}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{priceRange[0]} $</span>
            <span>{priceRange[1]} $</span>
          </div>
        </div>

        {/* Сортування */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Сортувати за</h2>
          <Select onValueChange={setSort} defaultValue={sort}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Ціна: зростаюча</SelectItem>
              <SelectItem value="price-desc">Ціна: спадаюча</SelectItem>
              <SelectItem value="title-asc">Назва: A-Z</SelectItem>
              <SelectItem value="title-desc">Назва: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🛍️ Товари */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link key={product.id} href={`/shop/${product.title.replace(/\s+/g, '-').toLowerCase()}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer">
              <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-gray-800 font-bold text-lg">{product.title}</h3>
                <p className="text-yellow-500 font-semibold">{product.price} $</p>
                {product.description && <p className="text-gray-500 text-sm mt-1">{product.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
