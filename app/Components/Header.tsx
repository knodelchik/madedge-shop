"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, User, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between">
      {/* Лівий логотип/назва */}
      <div className="text-2xl font-bold text-gray-800">MadEdge</div>

      {/* Навігація */}
      <nav className="flex items-center gap-10 text-gray-700 font-medium">
        <Link href="/">Головна</Link>
        <Link href="/shop">Магазин</Link>

        {/* Лого між Магазин та Про нас */}
        <div className="w-14 h-14 relative">
          <Image
            src="/logo.jpg"
            alt="Логотип"
            fill
            className="object-contain rounded-full"
          />
        </div>

        <Link href="/about">Про нас</Link>
        <Link href="/contact">Контакти</Link>
      </nav>

      {/* Правий блок з іконками */}
      <div className="flex items-center gap-4 text-gray-700">
        <button aria-label="Змінити мову">
          <Globe className="w-6 h-6" />
        </button>
        <button aria-label="Акаунт">
          <User className="w-6 h-6" />
        </button>
        <button aria-label="Корзина">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
