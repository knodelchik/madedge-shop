import { productsService } from '../../services/productService';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

// 1. Генеруємо SEO динамічно (Заголовок сторінки буде назвою товару)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const products = await productsService.getAllProducts();
  const product = products.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === params.slug
  );

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | MadEdge`,
    description:
      product.description?.slice(0, 160) || 'Buy best sharpening systems',
  };
}

// 2. Серверний компонент завантажує дані
export default async function ProductPage({ params }: Props) {
  const products = await productsService.getAllProducts();

  // Шукаємо продукт на сервері
  const product = products.find(
    (p) => p.title.replace(/\s+/g, '-').toLowerCase() === params.slug
  );

  // Якщо не знайшли - віддаємо 404
  if (!product) {
    notFound();
  }

  // Передаємо готовий продукт клієнту
  return <ProductClient product={product} />;
}
