import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

// Налаштування для Next.js
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'MadEdge Product';

// Типізація параметрів (Next.js 15+ вимагає Promise)
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Ініціалізація Supabase (використовуємо прямий клієнт для Edge Runtime)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. Функція нормалізації (ТОЧНА КОПІЯ з вашого page.tsx)
function normalizeSlug(text: string) {
  return text.replace(/\s+/g, '-').toLowerCase();
}

export default async function Image({ params }: Props) {
  // Отримуємо slug з параметрів
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 3. Отримуємо товари. 
  // Ми вибираємо тільки потрібні поля (title, price, images) для швидкодії.
  const { data: products } = await supabase
    .from('products')
    .select('title, price, images');

  // 4. Шукаємо продукт (ТОЧНА КОПІЯ логіки з вашого page.tsx)
  const product = products?.find(
    (p) => normalizeSlug(p.title) === decodedSlug
  );

  // Дані для відображення
  const title = product?.title || 'MadEdge Shop';
  const price = product ? `${product.price} $` : '';
  
  // Обробка картинки (Supabase повертає JSON, тому кастуємо як масив)
  const imagesArray = Array.isArray(product?.images) ? product.images : [];
  const imageUrl = imagesArray.length > 0 ? imagesArray[0] : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px',
          fontFamily: 'sans-serif', // Можна замінити на шрифт сайту, якщо підвантажити його
        }}
      >
        {/* ЛІВА ЧАСТИНА - КАРТИНКА */}
        <div style={{ 
          display: 'flex', 
          width: '50%', 
          height: '100%', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '20px',
          padding: '20px'
        }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={imageUrl} 
                alt={title}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }} 
              />
            ) : (
              <div style={{ fontSize: 80 }}>📦</div>
            )}
        </div>

        {/* ПРАВА ЧАСТИНА - ТЕКСТ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            height: '100%',
            paddingLeft: '40px',
            justifyContent: 'center',
          }}
        >
          {/* Бренд */}
          <div style={{ fontSize: 24, color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            MadEdge Shop
          </div>

          {/* Назва товару */}
          <div style={{ fontSize: 52, fontWeight: 'bold', color: 'black', marginBottom: '20px', lineHeight: 1.1 }}>
            {title}
          </div>

          {/* Ціна */}
          {price && (
            <div style={{ 
              fontSize: 48, 
              color: 'white', 
              background: 'black',
              padding: '10px 24px',
              borderRadius: '50px',
              alignSelf: 'flex-start',
              fontWeight: 'bold',
              marginTop: '10px'
            }}>
              {price}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}