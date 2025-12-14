'use client';

import { X, Heart, Trash2, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useWishlistStore } from '@/app/[locale]/store/wishlistStore';
import { useCartStore } from '@/app/[locale]/store/cartStore';
import { authService } from '@/app/[locale]/services/authService';
import { wishlistService } from '@/app/[locale]/services/wishlistService'; // Імпорт сервісу
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface MobileWishlistSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileWishlistSheet({
  isOpen,
  onClose,
}: MobileWishlistSheetProps) {
  const t = useTranslations('WishlistSheet');

  const {
    wishlistItems,
    localWishlist,
    removeFromWishlist,
    removeFromLocalWishlist,
  } = useWishlistStore();

  const { addToCart } = useCartStore();
  const [userId, setUserId] = useState<string | null>(null);

  // Стан для завантажених даних локальних товарів (картинки, назви)
  const [hydratedLocalItems, setHydratedLocalItems] = useState<any[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const [processingId, setProcessingId] = useState<number | string | null>(
    null
  );
  const [successId, setSuccessId] = useState<number | string | null>(null);

  const priceUnit = t('priceUnit');
  const placeholderAlt = t('placeholderAlt');

  // 1. Отримуємо User ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        setUserId(user?.id || null);
      } catch (error) {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  // 2. Гідратуємо локальний вішліст (завантажуємо деталі, якщо юзер не залогінений)
  useEffect(() => {
    const fetchLocalProducts = async () => {
      // Якщо юзер залогінений (має серверний вішліст) або локальний список пустий - виходимо
      if (userId || localWishlist.length === 0) {
        if (localWishlist.length === 0) setHydratedLocalItems([]);
        return;
      }

      setIsLoadingLocal(true);
      try {
        // Отримуємо повні дані товарів по їх ID
        const products = await wishlistService.getProductsByIds(localWishlist);
        setHydratedLocalItems(products);
      } catch (error) {
        console.error('Error loading local wishlist details:', error);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchLocalProducts();
  }, [localWishlist, userId]);

  // Логіка вибору списку:
  // Якщо є userId -> показуємо wishlistItems (з бази)
  // Якщо немає userId -> показуємо hydratedLocalItems (локальні завантажені)
  // Якщо hydratedLocalItems ще пустий, але localWishlist має ID -> показуємо localWishlist (будуть скелетони)
  const displayItems = userId
    ? wishlistItems
    : hydratedLocalItems.length > 0
    ? hydratedLocalItems
    : localWishlist;

  const totalItems = Array.isArray(displayItems) ? displayItems.length : 0;

  const getSafeImage = (item: any) => {
    // Обробка: якщо це JOIN з таблицею products або прямий об'єкт
    const images = item.products?.images || item.images;
    if (!images || images.length === 0) {
      return '/images/placeholder.jpg';
    }
    return images[0];
  };

  const handleAddToCart = async (item: any) => {
    const productId =
      typeof item === 'number' ? item : item.product_id || item.id;
    // Якщо item має вкладений products (з бази) - беремо його, інакше item (локальний)
    const productData = item.products || item;

    setProcessingId(productId);

    try {
      addToCart({
        id: productId,
        title: productData.title || '',
        price: productData.price || 0,
        images: productData.images || [],
        category: productData.category || 'accessories',
        description: productData.description || '',
        created_at: productData.created_at || new Date().toISOString(),
        quantity: 1,
        stock: productData.stock || 0,
      });

      setProcessingId(null);
      setSuccessId(productId);

      setTimeout(async () => {
        if (userId) {
          await removeFromWishlist(userId, productId);
        } else {
          removeFromLocalWishlist(productId);
          // Миттєво прибираємо з екрану локальний товар
          setHydratedLocalItems((prev) =>
            prev.filter((p) => p.id !== productId)
          );
        }
        setSuccessId(null);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart', error);
      setProcessingId(null);
    }
  };

  const handleRemove = async (item: any) => {
    const productId =
      typeof item === 'number' ? item : item.product_id || item.id;
    if (userId) {
      await removeFromWishlist(userId, productId);
    } else {
      removeFromLocalWishlist(productId);
      setHydratedLocalItems((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-300 ease-out">
        <div className="bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('title')}
              </h2>
              {totalItems > 0 && (
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors active:scale-95"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {/* Показуємо пустий екран ТІЛЬКИ якщо немає товарів І не йде завантаження */}
            {totalItems === 0 && !isLoadingLocal ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Heart className="h-16 w-16 text-gray-300 dark:text-neutral-600 mb-4" />
                <p className="text-gray-500 dark:text-neutral-400 text-center mb-4">
                  {t('emptyMessage')}
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg font-medium transition active:scale-95"
                >
                  {t('goToShop')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayItems.map((item: any) => {
                  const isLocalItem = typeof item === 'number'; // Якщо true - це ще не завантажений ID
                  const currentId = isLocalItem
                    ? item
                    : item.product_id || item.id;

                  const isSuccess = successId === currentId;
                  const isProcessing = processingId === currentId;

                  return (
                    <div
                      key={currentId}
                      className="flex gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 border border-gray-200 dark:border-neutral-700"
                    >
                      {!isLocalItem ? (
                        <>
                          {/* Товар завантажено - показуємо контент */}
                          <Image
                            src={getSafeImage(item)}
                            alt={
                              item.products?.title ||
                              item.title ||
                              placeholderAlt
                            }
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1">
                              {item.products?.title || item.title || 'Product'}
                            </h3>
                            <p className="text-sm font-bold text-gray-700 dark:text-neutral-300 mb-2">
                              {(
                                item.products?.price ||
                                item.price ||
                                0
                              ).toFixed(2)}{' '}
                              {priceUnit}
                            </p>

                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={isProcessing || isSuccess}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all active:scale-95 ${
                                isSuccess
                                  ? 'bg-green-600 text-white'
                                  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                              }`}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : isSuccess ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <ShoppingCart className="h-3.5 w-3.5" />
                              )}
                              {isSuccess ? t('added') : t('addToCart')}
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </>
                      ) : (
                        /* Скелетон (Loading State) - поки дані вантажаться */
                        <>
                          <div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-lg flex-shrink-0 flex items-center justify-center animate-pulse">
                            <Heart className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse"></div>
                            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                              {t('loading') || 'Loading...'}
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {totalItems > 0 && (
            <div className="border-t border-gray-200 dark:border-neutral-700 p-5 space-y-3">
              <button
                onClick={onClose}
                className="block w-full text-center bg-neutral-700 dark:bg-neutral-800 text-white dark:text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
