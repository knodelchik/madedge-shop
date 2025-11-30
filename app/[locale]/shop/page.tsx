import { productsService } from '../services/productService';
import ShopClient from './ShopClient';
// 👇 1. Додайте імпорт типу Product
import { Product } from '../../types/products';

export const metadata = {
  title: 'Shop | MadEdge',
  description: 'Buy best sharpening systems and stones',
};

export default async function ShopPage() {
  // 👇 2. Вкажіть тип явно: Product[]
  let products: Product[] = [];

  try {
    products = await productsService.getAllProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <main>
      <ShopClient initialProducts={products} />
    </main>
  );
}
