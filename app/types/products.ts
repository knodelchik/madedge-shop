export type Product = {
  id: number;
  title: string;
  title_uk?: string; // Нове поле
  description?: string;
  description_uk?: string; // Нове поле
  price: number;
  images: string[];
  category: "sharpeners" | "accessories" | "stones";
  created_at?: string;
  stock: number;
};