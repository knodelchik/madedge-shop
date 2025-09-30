'use client';

import { useParams } from 'next/navigation';
import { products } from '../../data/products';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';

export default function ProductPage() {
  const { slug } = useParams();
  if (!slug) return null;

  const product = products.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === slug
  );
  if (!product)
    return <p className="text-center mt-10 text-gray-500">Товар не знайдено</p>;

  const [currentImage, setCurrentImage] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart({ ...product, quantity: 1 });
    toast.success('Товар додано в кошик', {
      description: product.title,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link href="/shop" className="text-blue-500 underline">
        ← Повернутися до магазину
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-6 p-6">
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

        {/* Інфо */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-yellow-500 font-semibold text-2xl mt-2">
              {product.price} $
            </p>
            <div className="text-gray-600 mt-4">
              {(product.description ?? '').split('<br />').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

          </div>

          <button
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
            onClick={handleAdd}
          >
            Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
}
