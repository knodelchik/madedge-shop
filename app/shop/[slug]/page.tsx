'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cartStore';
import QuantityCounter from '../../Components/QuantityCounter';
import { products as allProducts } from '../../data/products';

// Тип продукту
type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
};

export default function ProductPage() {
  const { slug } = useParams();
  if (!slug) return null;

  // Знаходимо продукт за slug
  const product: Product | undefined = allProducts.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === slug
  );
  if (!product) {
    return <p className="text-center mt-10 text-gray-500">Товар не знайдено</p>;
  }

  const { addToCart, increaseQuantity, decreaseQuantity, cartItems } = useCartStore();
  const itemInCart = cartItems.find((i) => i.id === product.id);

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(itemInCart ? itemInCart.quantity : 1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success('Товар додано в кошик', { description: product.title });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link href="/shop" className="text-blue-500 underline">
        ← Повернутися до магазину
      </Link>

      <div className="bg-white overflow-hidden flex flex-col md:flex-row gap-6 p-6 rounded-lg shadow-md">
        {/* Слайдер фото */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center">
          <motion.img
            key={product.images[currentImage]}
            src={product.images[currentImage]}
            alt={product.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
            initial={{ opacity: 0.5, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
          >
            ›
          </button>
        </div>

        {/* Інформація */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-black font-semibold text-2xl mt-2">
              {product.price.toFixed(2)} $
            </p>
            <div className="text-gray-600 mt-4 space-y-2">
              {(product.description ?? '').split('<br />').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* Кількість + кнопка */}
          <div className="mt-6 flex items-center gap-4">
            <QuantityCounter
              value={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            />

            <button
              className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-2 rounded transition"
              onClick={handleAddToCart}
            >
              Додати в кошик
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
