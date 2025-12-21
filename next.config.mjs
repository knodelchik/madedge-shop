import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/c',
        destination: '/contact',
        permanent: true, // Це каже Гуглу, що сторінка переїхала назавжди
      },
      {
        source: '/product-page/madedge-model-1',
        destination: '/shop/madedge-model-1',
        permanent: true, // Це каже Гуглу, що сторінка переїхала назавжди
      },
      {
        source: '/blog',
        destination: '/about',
        permanent: true, // Це каже Гуглу, що сторінка переїхала назавжди
      },
      {
        source: '/product-page/madedge-rotary-mechanism-model-1',
        destination: '/shop/product-page/madedge-rotary-mechanism-model-1',
        permanent: true, // Це каже Гуглу, що сторінка переїхала назавжди
      },
    ];
  },
};

export default withNextIntl(nextConfig);
