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
        destination: '/contacts',
        permanent: true, // Це каже Гуглу, що сторінка переїхала назавжди
      },
    ];
  },
};

export default withNextIntl(nextConfig);
