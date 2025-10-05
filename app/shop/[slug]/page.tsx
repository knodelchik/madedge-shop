'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Видалено useRouter
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '../../store/cartStore';
import QuantityCounter from '../../Components/QuantityCounter';
import { productsService } from '../../services/productService';
import { Product } from '../../types/products';
import Image from 'next/image';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart, cartItems } = useCartStore();
  const itemInCart = cartItems.find((i) => i.id === product?.id);
  const [quantity, setQuantity] = useState(itemInCart ? itemInCart.quantity : 1);

  // Завантаження продукту
  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        const products = await productsService.getAllProducts();
        const foundProduct = products.find(p => 
          p.title.replace(/\s+/g, '-').toLowerCase() === slug
        );
        
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Помилка завантаження товару');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({ ...product, quantity });
    toast.success('Товар додано в кошик', { 
      description: product.title 
    });
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImage(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImage(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-center">
          <p>Товар не знайдено</p>
          <Link href="/shop" className="text-blue-500 underline mt-4 inline-block">
            Повернутися до магазину
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Кнопка назад */}
        <Link 
          href="/shop" 
          className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
        >
          ← Повернутися до магазину
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Слайдер фото */}
            <div className="space-y-4">
              <div className="relative w-full flex items-center justify-center bg-gray-100 rounded-2xl p-4">
                <motion.img
                  key={product.images[currentImage]}
                  src={product.images[currentImage]}
                  alt={product.title}
                  className="w-full h-80 object-contain rounded-lg"
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Кнопки навігації */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Мініатюри */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${
                        currentImage === index 
                          ? 'border-black ring-2 ring-black' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Інформація про товар */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.title}
                </h1>
                <p className="text-2xl font-semibold text-gray-700">
                  {product.price} $
                </p>
              </div>

              {product.description && (
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Кількість та кнопка додавання */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Кількість:
                  </span>
                  <QuantityCounter
                    value={quantity}
                    onIncrease={() => setQuantity(q => q + 1)}
                    onDecrease={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Додати в кошик
                </button>
              </div>

              {/* Категорія */}
              {product.category && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Категорія: {product.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}