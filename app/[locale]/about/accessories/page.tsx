import React from 'react';
import { ShieldCheck } from 'lucide-react';

// Data for all accessories, including a documentation-style description.
const accessoriesData = [
  {
    id: 'rotary-mechanism',
    name: 'MadEdge Rotary Mechanism Model 1',
    price: 80,
    imageSrc: '/images/rotarymechanism-1.jpg',
    features: [
      'Dual symmetrical fixed rotary positions for consistent setup.',
      'Easy rotation despite a powerful spring, eliminating the need to pull the mechanism.',
      'Adjusting nut to modify spring compression force.',
      'All rubbing parts are **hardened steel** for maximum service life.',
      'Wear-resistant polymer coating (similar to car wheels).',
    ],
    details: [
      'Rotary frame length: 200 mm.',
      'Clamping jaws are **heat-treated steel** with an 8-degree slant per side.',
      'Supports sharpening angles up to 12 degrees per side.',
      'Spherical nut in clamps compensates for screw misalignment with thin knives.',
      'Minimum blade length for two clamps: ~80 mm.',
    ],
  },
  {
    id: 'table-mount',
    name: 'Table Mount',
    price: 16,
    imageSrc: '/images/tablemount-1.jpg',
    features: [
      'Provides a **stable and secure** base for the sharpening system.',
      'Designed to firmly clamp the MadEdge system to any horizontal surface.',
    ],
    details: [
      'Ensures maximum rigidity and minimizes vibration during operation.',
    ],
  },
  {
    id: 'hinge-rest-hook',
    name: 'Hinge with Rest Hook',
    price: 10,
    imageSrc: '/images/hinge-1.jpg',
    features: [
      'Hole diameter: 8 mm.',
      'Features a **pressed-in sleeve** made of anti-friction bronze.',
    ],
    details: [
      'The bronze sleeve guarantees **increased smoothness** of movement, crucial for angle consistency.',
    ],
  },
  {
    id: 'clamp-full-flat',
    name: 'MadEdge Clamp for Full Flat',
    price: 23, // Price per piece
    imageSrc: '/images/adapterclamps-1.jpg',
    features: [
      'Made of **heat-treated spring steel** for optimal strength and retention.',
      'Specifically designed for securely fixing knives with a **full flat grind**.',
    ],
    details: [
      'Ensures even pressure and prevents blade damage.',
      'Price listed is for 1 pc. A pair of clamps costs $46.',
    ],
  },
  {
    id: 'adapter-flat-chisels',
    name: 'Adapter for Sharpening Flat Chisels',
    price: 13,
    imageSrc: '/images/adaptersharp-1.jpg',
    features: [
      'Expands the MadEdge system capability to include flat chisels.',
      'Provides the necessary **rigid and straight fixation** for chiseled edges.',
    ],
    details: ['Allows non-knife tools to be sharpened with high precision.'],
  },
  {
    id: 'adapter-for-clamps',
    name: 'Center Clamp Adapter',
    price: 10,
    imageSrc: '/images/clamp-2.jpg',
    features: [
      'Enables closer positioning of clamps for **sharpening short blades**.',
      'Ensures a rigid fixing position even at minimal clamp spacing.',
    ],
    details: ['Note: Adapter is sold without clamps.'],
  },
  {
    id: 'hinge-convex',
    name: 'Hinge for Convex',
    price: 9,
    imageSrc: '/images/hingeconvex-1.jpg',
    features: [
      'Specialized hinge for sharpening knives with a **convex (lenticular) edge**.',
      'Allows for the controlled movement necessary to achieve a perfect convex profile.',
    ],
    details: ['All parts are constructed from durable steel.'],
  },
  {
    id: 'fine-turning-adapter',
    name: 'Fine-Tuning Adapter',
    price: 4,
    imageSrc: '/images/fineadapter-1.jpg',
    features: [
      'Simple tool for **precisely adjusting and maintaining** the sharpening angle.',
      'Hole diameter: 8 mm.',
    ],
    details: [
      'A crucial element for achieving micro-bevels and final sharpening accuracy.',
    ],
  },
];

interface AccessoryItemProps {
  accessory: (typeof accessoriesData)[0];
}

const AccessoryItem: React.FC<AccessoryItemProps> = ({ accessory }) => (
  <div id={accessory.id} className="scroll-mt-24">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
      {accessory.name}
    </h2>

    <div className="lg:flex lg:space-x-12">
      {/* Image and Price/Specs block (left) */}
      <div className="lg:w-1/3 flex flex-col items-start mb-6 lg:mb-0">
        <div className="w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
          <img
            src={accessory.imageSrc}
            alt={accessory.name}
            className="w-full h-auto object-contain p-6"
          />
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xl font-semibold text-gray-900 mb-1">
              Price: ${accessory.price.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Content (right) */}
      <div className="lg:w-2/3 space-y-8">
        {/* Key Features */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
            Key Features
          </h3>
          <ul className="space-y-2 text-lg text-gray-700 list-disc list-inside">
            {accessory.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Technical Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
            Technical Specifications & Notes
          </h3>
          <ul className="space-y-2 text-md text-gray-600 list-disc list-inside ml-4">
            {accessory.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AccessoriesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
        Accessories
      </h1>
      <p className="mt-4 text-xl text-gray-500 mb-16 border-b pb-6 border-gray-200">
        Explore the detailed specifications and features of our professional
        accessories, designed to extend the versatility, precision, and
        performance of your MadEdge sharpening system.
      </p>

      <div className="space-y-16">
        {accessoriesData.map((accessory, index) => (
          <React.Fragment key={accessory.id}>
            <AccessoryItem accessory={accessory} />
            {/* Horizontal line separator */}
            {index < accessoriesData.length - 1 && (
              <hr className="my-16 border-gray-200" />
            )}
          </React.Fragment>
        ))}
      </div>

      <hr className="my-16" />
      <div
        id="authenticity"
        className="scroll-mt-24 bg-blue-50 p-8 rounded-xl border border-blue-200 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <ShieldCheck className="w-8 h-8 mr-3" />
          Commitment to Authenticity
        </h2>
        <p className="text-lg text-gray-900">
          At <strong>MadEdge</strong>, we guarantee that all products and
          accessories listed here are{' '}
          <strong>100% original, proprietary designs</strong>. We are committed
          to manufacturing tools of the highest quality using our exclusive
          materials and engineering processes. When you choose MadEdge, you are
          investing in an{' '}
          <strong>authentic, precision sharpening system</strong> built for
          reliability and performance. We do not sell copies or third-party
          imitations.
        </p>
      </div>
    </div>
  );
};

export default AccessoriesPage;
