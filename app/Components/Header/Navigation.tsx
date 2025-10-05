'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

export default function Navigation() {
  const { language } = useLanguage();

  return (
    <nav className="flex items-center gap-10 text-gray-700 font-medium">
      <Link href="/" className="hover:text-gray-900 transition-colors">
        {language === 'ua' ? 'Головна' : 'Home'}
      </Link>
      <Link href="/shop" className="hover:text-gray-900 transition-colors">
        {language === 'ua' ? 'Магазин' : 'Shop'}
      </Link>
      <div className="w-14 h-14 relative">
        <Image
          src="/logo.jpg"
          alt="Логотип"
          fill
          className="object-contain rounded-full"
        />
      </div>
      <Link href="/about" className="hover:text-gray-900 transition-colors">
        {language === 'ua' ? 'Про нас' : 'About'}
      </Link>
      <Link href="/contact" className="hover:text-gray-900 transition-colors">
        {language === 'ua' ? 'Контакти' : 'Contact'}
      </Link>
    </nav>
  );
}