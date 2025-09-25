'use client';
import React from 'react';
import { Lightbulb, Info, Plane, Headphones } from 'lucide-react';

// Next.js-style SpotlightCard component with TypeScript
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  isWhite?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  delay = 0,
  isWhite = false,
  ...props
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const cardBg = isWhite ? 'bg-white' : 'bg-black';
  const borderColor = isWhite ? 'border-gray-800' : 'border-gray-800';
  const hoverBorderColor = isWhite
    ? 'hover:border-gray-600'
    : 'hover:border-gray-700';

  return (
    <div
      className={`relative group cursor-pointer overflow-hidden ${cardBg} border ${borderColor} rounded-xl transition-all duration-500 ${hoverBorderColor} transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Next.js-style spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${
                mousePosition.y
              }px, ${
                isWhite ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
              }, transparent 40%)`
            : 'none',
        }}
      />

      {/* Border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePosition.x}px ${
                mousePosition.y
              }px, ${
                isWhite ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'
              }, transparent 40%)`
            : 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSpecial?: boolean;
};

const features: Feature[] = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Refund Policy',
    description:
      'After receiving the item, contact the seller within 30 days. Refund will be given as money back. Return shipping: Buyer pays for return shipping.',
  },
  {
    icon: <Info className="w-8 h-8" />,
    title: 'Buyer Protection',
    description:
      'Your satisfaction is our number one priority. We gladly accept returned merchandise within 30 days if still new and unused.',
  },
  {
    icon: <Plane className="w-8 h-8" />,
    title: 'Shipping',
    description:
      'Shipping from Ukraine with insurance and tracking number. Shipped on the day of purchase (except weekends/holidays). Weekend purchases will be shipped the next business day.',
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: 'Need Help?',
    description:
      'We are available 24/7 to answer any questions you may have. Send us a message anytime and get a quick response from our support team.',
    isSpecial: true,
  },
];

const InfoSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Next.js style */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
            What's MadEdge?{' '}
            <span className="text-gray-600 font-normal lg:text-2xl ">
              Everything you need to know for a seamless shopping.
            </span>
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <SpotlightCard
              key={idx}
              delay={idx * 100}
              isWhite={feature.isSpecial}
              className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center justify-start p-8 h-full text-center min-h-[320px]">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors duration-300 ${
                    feature.isSpecial
                      ? 'bg-black group-hover:bg-gray-800'
                      : 'bg-white group-hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={feature.isSpecial ? 'text-white' : 'text-black'}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    feature.isSpecial
                      ? 'text-black group-hover:text-gray-800'
                      : 'text-white group-hover:text-gray-100'
                  }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-base leading-relaxed transition-colors duration-300 flex-grow flex items-center ${
                    feature.isSpecial
                      ? 'text-gray-700 group-hover:text-gray-600'
                      : 'text-gray-300 group-hover:text-gray-200'
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
