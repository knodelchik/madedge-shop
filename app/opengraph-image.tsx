import { ImageResponse } from 'next/og';

// Налаштування
export const runtime = 'edge';
export const alt = 'MadEdge Shop';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // ВАЖЛИВО: Замініть це посилання на реальну адресу вашого сайту, коли задеплоїте.
  // Поки розробляєте локально, картинка може не відображатись, це нормально.
  // Краще взяти посилання на логотип, який вже десь лежить в інтернеті, або вказати ваш домен.
  const logoUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? 'https://umnwnrvuonyiwylxqoiq.supabase.co/storage/v1/object/sign/product%20images/madedgemodel3-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtlZXl9mYTY2MjExZi1lZmNjLTQ0ZmMtOWY2Ni0xZDM5N2NhNGE3NzYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0IGltYWdlcy9tYWRlZGdlbW9kZWwzLTEuanBnIiwiaWF0IjoxNzYxMzMzODEyLCJleHAiOjIwNzY2OTM4MTJ9.1cJxG-WOnzr5euvyHAdSww-GPHqGwcvlaVGcuBo8hww'
    : 'https://umnwnrvuonyiwylxqoiq.supabase.co/storage/v1/object/sign/product%20images/madedgemodel3-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtlZXl9mYTY2MjExZi1lZmNjLTQ0ZmMtOWY2Ni0xZDM5N2NhNGE3NzYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0IGltYWdlcy9tYWRlZGdlbW9kZWwzLTEuanBnIiwiaWF0IjoxNzYxMzMzODEyLCJleHAiOjIwNzY2OTM4MTJ9.1cJxG-WOnzr5euvyHAdSww-GPHqGwcvlaVGcuBo8hww'; 

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Логотип */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt="MadEdge Logo"
          width="250"
          height="250"
          style={{
            objectFit: 'contain',
            marginBottom: 40,
          }}
        />

        {/* Текст */}
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20, letterSpacing: '-0.02em' }}>
          MADEDGE
        </div>
        <div style={{ fontSize: 36, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Professional Sharpening Systems
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}