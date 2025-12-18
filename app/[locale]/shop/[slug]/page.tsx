import { productsService } from '../../services/productService';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// Функція для нормалізації рядків при порівнянні
function normalizeSlug(text: string) {
  return text.replace(/\s+/g, '-').toLowerCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Декодуємо URL (hinge-360%C2%B0 -> hinge-360°)
  const decodedSlug = decodeURIComponent(slug);

  const products = await productsService.getAllProducts();
  const product = products.find(
    (p) => normalizeSlug(p.title) === decodedSlug
  );

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | MadEdge`,
    description:
      product.description?.slice(0, 160) || 'Buy best sharpening systems',
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // 1. Декодуємо URL
  const decodedSlug = decodeURIComponent(slug);

  const products = await productsService.getAllProducts();

  // 2. Шукаємо продукт за декодованим слагом
  const product = products.find(
    (p) => normalizeSlug(p.title) === decodedSlug
  );

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}