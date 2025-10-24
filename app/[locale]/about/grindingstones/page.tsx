import React from 'react';

// Компонент ціни (залишаємо без змін)
const PriceBlock = ({ price, note }: { price: string; note: string }) => (
  <div className="mt-2">
    <p className="text-3xl font-bold text-gray-900">{price}</p>
    <p className="text-sm text-gray-500">{note}</p>
  </div>
);

export default function GrindingStonesPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Grinding Stones
        </h1>
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          Professional sharpening stones for precision edge restoration. Choose
          between diamond-embedded bars for extreme durability or aluminum oxide
          stones for traditional sharpening excellence.
        </p>
      </div>
      {/* --- Diamond Stones --- */}
      <section id="diamond-stone" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left Content */}
          <div className="lg:w-3/5 space-y-8 order-2 lg:order-1">
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3">
              PREMIUM
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6  border-l-4 border-blue-600 pl-2">
              Diamond Stones
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              Set of four precision-engineered diamond stones with monolayer
              metal bond. Diamonds evenly distributed throughout the volume
              ensure consistent sharpening performance and exceptional
              longevity.
            </p>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 ">
                Technical Specifications
              </h3>
              <p className="space-y-2 text-md text-gray-600 list-disc list-inside ">
                <ol>
                  <strong>Type:</strong> Monolayer metal bond with diamonds
                </ol>
                <ol>
                  <strong>Size:</strong> 150 × 25 × 3 mm
                </ol>
                <ol>
                  <strong>Material:</strong> Copper-tin bond
                </ol>
                <ol>
                  <strong>Diamond Concentration:</strong> 100%
                </ol>
                <ol>
                  <strong>Tolerance:</strong> ±0.1 mm
                </ol>
              </p>
              <div className="mt-10">
                <PriceBlock price="$84.99" note="Set of 4 stones included" />
              </div>
            </div>
          </div>

          {/* Right Block (Image + Details + Price) */}
          <div className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2">
            {/* --- Лише фото в рамці --- */}
            <div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm">
              <img
                src="/images/diamondstones.jpg"
                alt="MadEdge Diamond Stones Set"
                className="w-full h-full object-cover"
              />
            </div>

            {/* --- Текст під фото, без рамки --- */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Ultra-durable diamond coating
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Suitable for carbide and hardened steel
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Ideal for industrial and precision use
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" />
      {/* --- Aluminum Oxide Stones --- */}
      <section id="aluminum-stone" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left Content */}
          <div className="lg:w-3/5 space-y-8 order-2 lg:order-1">
            <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3">
              TRADITIONAL
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-3">
              Aluminum Oxide Sharpening Stones
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              Premium aluminum oxide stones designed for versatile sharpening
              applications. Four different grit levels provide everything from
              initial shaping to fine polishing.
            </p>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Technical Specifications
              </h3>
              <p className="space-y-2 text-md text-gray-600 list-disc list-inside ">
                <ol>
                  <strong>Size:</strong> 160mm × 25mm × 6mm
                </ol>
                <ol>
                  <strong>Material:</strong> Aluminum oxide
                </ol>
                <ol>
                  <strong>Grit Options:</strong> 200 / 400 / 800 / 1500
                </ol>
                <ol>
                  <strong>Shape:</strong> Rectangular bar
                </ol>
              </p>
              <div className="mt-10">
                <PriceBlock price="$36.99" note="Set of 4 stones included" />
              </div>
            </div>
          </div>

          {/* Right Block (Image + Details + Price) */}
          <div className="lg:w-2/5 flex flex-col items-start mb-6 lg:mb-0 order-1 lg:order-2">
            {/* --- Лише фото в рамці --- */}
            <div className="bg-white aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg border border-gray-200 shadow-sm">
              <img
                src="/images/sharpstones-1.jpg"
                alt="MadEdge Aluminum Oxide Sharpening Stones"
                className="w-full h-full object-cover"
              />
            </div>

            {/* --- Текст під фото --- */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Four grit levels: 200 / 400 / 800 / 1500
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Water-based sharpening (soak before use)
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Ideal for kitchen knives and woodworking tools
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" />
      {/* --- Comparison Table (залишаємо без змін) --- */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center mt-12">
          Stone Comparison
        </h2>
        <div className="flex justify-center">
          <div className="overflow-x-auto">
            <table className="min-w-[800px] border-1 border-gray-500 mx-auto text-center">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4 text-left w-1/3">Feature</th>
                  <th className="p-4 text-center w-1/3">Diamond Stones</th>
                  <th className="p-4 text-center w-1/3">Aluminum Oxide</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">Material</td>
                  <td className="p-4 text-center">Diamond + Copper-tin bond</td>
                  <td className="p-4 text-center">Aluminum oxide</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">Size (mm)</td>
                  <td className="p-4 text-center">150 × 25 × 3</td>
                  <td className="p-4 text-center">160 × 25 × 6</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">Grit Range</td>
                  <td className="p-4 text-center">Various (4 stones)</td>
                  <td className="p-4 text-center">200 / 400 / 800 / 1500</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">Durability</td>
                  <td className="p-4 text-center text-blue-600 font-bold">
                    Extreme
                  </td>
                  <td className="p-4 text-center">High</td>
                </tr>
                <tr className="border-b-1 border-gray-500">
                  <td className="p-4 font-semibold text-left">Best For</td>
                  <td className="p-4 text-center">Industrial, carbide</td>
                  <td className="p-4 text-center">General purpose</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-left">Price</td>
                  <td className="p-4 text-center font-bold">$84.99</td>
                  <td className="p-4 text-center font-bold">$36.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <hr className="my-16 border-gray-200" />
      {/* --- Usage Guide (БЕЗ ЗМІН) --- */}
      <section
        id="usage-guide"
        className="mb-20 scroll-mt-24 bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-blue-100 shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 ">
          How to Use Sharpening Stones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1-3 */}
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3">
                {step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {step === 1
                  ? 'Prepare the Stone'
                  : step === 2
                  ? 'Set the Angle'
                  : 'Start with Coarse Grit'}
              </h3>
              <p className="text-gray-700 text-sm">
                {step === 1
                  ? 'For aluminum oxide stones, soak in water for 10 minutes. Diamond stones can be used dry or with light oil.'
                  : step === 2
                  ? 'Maintain consistent angle: 15-20° for knives, 25-30° for tools.'
                  : 'Begin with 200-400 grit to establish the edge.'}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Step 4-6 */}
          {[4, 5, 6].map((step) => (
            <div
              key={step}
              className="flex flex-col items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl mb-3">
                {step}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {step === 4
                  ? 'Progress Through Grits'
                  : step === 5
                  ? 'Use Smooth Strokes'
                  : 'Clean & Store'}
              </h3>
              <p className="text-gray-700 text-sm">
                {step === 4
                  ? 'Move to finer grits: 400 → 800 → 1500 for polished edge.'
                  : step === 5
                  ? 'Apply even pressure along the entire blade length.'
                  : 'Rinse aluminum oxide stones, wipe diamond stones clean.'}
              </p>
            </div>
          ))}
        </div>
      </section>
      <hr className="my-16 border-gray-200" /> {/* --- Care Instructions --- */}
      <section id="care-instructions" className="mb-20 scroll-mt-24">
        <div className="bg-white border border-gray-300 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Stone Care & Maintenance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-x divide-gray-200">
            {/* Diamond Stones Care */}
            <div className="pr-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">◇</span> Diamond Stones
              </h3>
              <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4">
                <li>Can be used dry or with light oil</li>
                <li>Clean with soft brush and water</li>
                <li>Do not require flattening</li>
                <li>Store in protective case when not in use</li>
              </ul>
            </div>
            {/* Aluminum Oxide Stones Care */}
            <div className="pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-gray-900">◇</span> Aluminum Oxide Stones
              </h3>
              <ul className="space-y-3 text-gray-700 list-disc list-inside ml-4">
                <li>Soak in water before use (10 minutes)</li>
                <li>Clean with water only, no soap</li>
                <li>Flatten surface periodically with flattening stone</li>
                <li>Dry completely before storing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
