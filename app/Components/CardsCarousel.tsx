'use client';

import React, { useEffect, useState } from 'react';
import Carousel from '../../components/Carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { productsService } from '../services/productService';
import { Product } from '../types/products';

export default function CardsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Завантаження товарів з Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsService.getAllProducts();
        setProducts(data);
        if (data.length === 0) {
          setError('No products found');
        }
      } catch (error) {
        console.error('Failed to load products for carousel:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Розділяємо продукти по категоріях
  const sharpeners = products
    .filter((p) => p.category === 'sharpeners')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  const stones = products
    .filter((p) => p.category === 'stones')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  const accessories = products
    .filter((p) => p.category === 'accessories')
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: `$${p.price.toFixed(2)}`,
      image: p.images[0],
    }));

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center gap-8 px-4 py-20">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center gap-8 px-4 py-20">
        <div className="text-xl text-red-600">{error}</div>
        <div className="text-sm text-gray-500">
          Check browser console for details
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-8 px-4 py-20">
        <div className="text-xl">No products available</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4 py-20">
      {/* Mobile - один карусель */}
      <div className="block md:hidden w-full max-w-md mx-auto">
        <Carousel
          items={[...sharpeners, ...stones, ...accessories]}
          autoplay
          autoplayDelay={4000}
          pauseOnHover
          className="w-full"
          loop={false}
        />
      </div>

      {/* Desktop - три каруселі */}
      <div className="hidden md:flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
        {sharpeners.length > 0 && (
          <div className="w-full lg:w-1/3 max-w-sm">
            <Carousel
              items={sharpeners}
              autoplay
              autoplayDelay={10000}
              pauseOnHover
              className="w-full"
              loop={false}
            />
          </div>
        )}
        {stones.length > 0 && (
          <div className="w-full lg:w-1/3 max-w-sm">
            <Carousel
              items={stones}
              autoplay
              autoplayDelay={5000}
              pauseOnHover
              className="w-full"
              loop={false}
            />
          </div>
        )}
        {accessories.length > 0 && (
          <div className="w-full lg:w-1/3 max-w-sm">
            <Carousel
              items={accessories}
              autoplay
              autoplayDelay={15000}
              pauseOnHover
              className="w-full"
              loop={false}
            />
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="px-8 py-4 rounded-2xl shadow-md cursor-pointer mt-8"
      >
        <Link href="/shop">Shop</Link>
      </Button>
    </div>
  );
}