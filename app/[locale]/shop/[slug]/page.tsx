import { productsService } from '../../services/productService';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Змінюємо тип Props - params тепер Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. Виправляємо generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // <--- Очікуємо params

  const products = await productsService.getAllProducts();
  const product = products.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === slug
  );

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | MadEdge`,
    description:
      product.description?.slice(0, 160) || 'Buy best sharpening systems',
  };
}

// 3. Виправляємо компонент сторінки
export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // <--- Очікуємо params

  const products = await productsService.getAllProducts();

  // Шукаємо продукт на сервері
  const product = products.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === slug
  );

  // Якщо не знайшли - віддаємо 404
  if (!product) {
    notFound();
  }

  // Передаємо готовий продукт клієнту
  return <ProductClient product={product} />;
}