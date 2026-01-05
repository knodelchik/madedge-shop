import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeSlug(text: string) {
  return text.replace(/\s+/g, '-').toLowerCase();
}

export default async function Icon({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const { data: products } = await supabase
    .from('products')
    .select('title, images');

  const product = products?.find(
    (p) => normalizeSlug(p.title) === decodedSlug
  );

  const imagesArray = Array.isArray(product?.images) ? product.images : [];
  const imageUrl = imagesArray.length > 0 ? imagesArray[0] : null;

  if (imageUrl) {
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="icon"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30%' }}
        />
      ),
      { ...size }
    );
  }

  // Фоллбек (перша літера бренду або стандартна іконка)
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '30%',
          fontWeight: 'bold'
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}