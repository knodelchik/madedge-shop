// data/products.ts

export type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];      // два фото на продукт
  description?: string;
};

export const products: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 25.00,
    images: ['/images/product-1.jpg', '/images/product-2.jpg'],
    description: 'Description for product 1'
  },
  {
    id: 2,
    title: 'Product 2',
    price: 301.00,
    images: ['/images/product-3.jpg', '/images/product-4.jpg'],
    description: 'Description for product 2'
  },
  {
    id: 3,
    title: 'Product 3',
    price: 18.50,
    images: ['/images/product-5.jpg', '/images/product-6.jpg'],
    description: 'Description for product 3'
  },
  {
    id: 4,
    title: 'Product 4',
    price: 40.00,
    images: ['/images/product-7.jpg', '/images/product-8.jpg'],
    description: 'Description for product 4'
  },
  {
    id: 5,
    title: 'Product 5',
    price: 22.00,
    images: ['/images/product-9.jpg', '/images/product-10.jpg'],
    description: 'Description for product 5'
  },
  {
    id: 6,
    title: 'Product 6',
    price: 35.00,
    images: ['/images/product-11.jpg', '/images/product-12.jpg'],
    description: 'Description for product 6'
  },
  {
    id: 7,
    title: 'Product 7',
    price: 28.00,
    images: ['/images/product-13.jpg', '/images/product-14.jpg'],
    description: 'Description for product 7'
  },
  {
    id: 8,
    title: 'Product 8',
    price: 500.00,
    images: ['/images/product-15.jpg', '/images/product-16.jpg'],
    description: 'Description for product 8'
  },
  {
    id: 9,
    title: 'Product 9',
    price: 196.99,
    images: ['/images/product-17.jpg', '/images/product-18.jpg'],
    description: 'Description for product 9'
  },
  {
    id: 10,
    title: 'Product 10',
    price: 42.00,
    images: ['/images/product-19.jpg', '/images/product-20.jpg'],
    description: 'Description for product 10'
  },
  {
    id: 11,
    title: 'Product 11',
    price: 33.00,
    images: ['/images/product-21.jpg', '/images/product-22.jpg'],
    description: 'Description for product 11'
  },
  {
    id: 12,
    title: 'Product 12',
    price: 27.50,
    images: ['/images/product-23.jpg', '/images/product-24.jpg'],
    description: 'Description for product 12'
  },
  {
    id: 13,
    title: 'Product 13',
    price: 384.00,
    images: ['/images/product-25.jpg', '/images/product-26.jpg'],
    description: 'Description for product 13'
  },
  {
    id: 14,
    title: 'Product 14',
    price: 21.00,
    images: ['/images/product-27.jpg', '/images/product-28.jpg'],
    description: 'Description for product 14'
  },
  {
    id: 15,
    title: 'Product 15',
    price: 454.00,
    images: ['/images/product-29.jpg', '/images/product-30.jpg'],
    description: 'Description for product 15'
  }
];
