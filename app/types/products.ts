export type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[]; // Тепер це завжди масив рядків
  category: 'sharpeners' | 'accessories' | 'stones';
  created_at?: string;
};