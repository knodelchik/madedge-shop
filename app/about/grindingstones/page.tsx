import React from 'react';

export default function GrindingStonesPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative mb-16 ">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sharpening Stones
        </h1>

        <p className="text-gray-700 text-xl leading-relaxed max-w-3xl">
          Professional sharpening stones for precision edge restoration. Choose
          between diamond-embedded bars for extreme durability or aluminum oxide
          stones for traditional sharpening excellence.
        </p>
      </div>

      {/* Diamond Stones */}
      <section id="diamond-stones" className="mb-20 scroll-mt-32 border-t">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-12">
          <div>
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded mb-3">
              PREMIUM DIAMOND
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Diamond Stones
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Set of four precision-engineered diamond stones with monolayer
              metal bond. Diamonds evenly distributed throughout the volume
              ensure consistent sharpening performance and exceptional
              longevity.
            </p>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">
                Technical Specifications:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Type:</strong> Monolayer metal bond bar with
                    diamonds evenly distributed throughout the volume
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>View:</strong> Rectangular, plane-parallel solid
                    diamond
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Working Layer Size:</strong> 150mm × 25mm × 3mm
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Dimensional Tolerance:</strong> ±0.1 mm
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Material:</strong> Copper-tin bond
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Diamond Concentration:</strong> 100%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg mb-6">
              <p className="text-gray-700 text-sm">
                <strong className="text-blue-600">Best For:</strong>{' '}
                Professional tool makers, industrial applications, carbide
                tools, and situations requiring maximum durability and cutting
                speed
              </p>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-3xl font-bold text-gray-900">$84.99</div>
            </div>
            <div className="text-sm text-gray-600">
              Set of 4 stones included
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src="/images/diamondstones.jpg"
              alt="MadEdge Diamond Stones Set"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Aluminum Oxide Stones */}
      <section id="aluminum-oxide-stones" className="mb-20 scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src="/images/sharpstones-1.jpg"
              alt="MadEdge Aluminum Oxide Sharpening Stones"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded mb-3">
              TRADITIONAL QUALITY
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Aluminum Oxide Sharpening Stones
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Premium aluminum oxide stones designed for versatile sharpening
              applications. Four different grit levels provide everything from
              initial shaping to fine polishing.
            </p>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">
                Technical Specifications:
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Size:</strong> 160mm × 25mm × 6mm
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Material:</strong> Aluminum oxide
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Grit Options:</strong> 200 / 400 / 800 / 1500
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Shape:</strong> Rectangular bar
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-5 rounded-lg mb-6">
              <h4 className="font-bold mb-3">Grit Guide:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">200 Grit:</span>
                  <span className="text-white">
                    Coarse - Repair & Reshaping
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">400 Grit:</span>
                  <span className="text-white">
                    Medium - General Sharpening
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">800 Grit:</span>
                  <span className="text-white">Fine - Edge Refinement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">1500 Grit:</span>
                  <span className="text-white">Very Fine - Polishing</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-1 border-gray-800 p-5 rounded-lg mb-6">
              <p className="text-gray-700 text-sm">
                <strong className="text-gray-900">Best For:</strong> Kitchen
                knives, woodworking tools, scissors, general maintenance, and
                everyday sharpening tasks
              </p>
            </div>

            <div className="text-4xl font-bold text-gray-900">$36.99</div>
            <div className="text-sm text-gray-600 mt-3">
              Set of 4 stones included
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-20 border-t">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center mt-12">
          Stone Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-gray-700">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">Diamond Stones</th>
                <th className="p-4 text-center">Aluminum Oxide</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b-2 border-gray-700">
                <td className="p-4 font-semibold">Material</td>
                <td className="p-4 text-center">Diamond + Copper-tin bond</td>
                <td className="p-4 text-center">Aluminum oxide</td>
              </tr>
              <tr className="border-b-2 border-gray-700">
                <td className="p-4 font-semibold">Size (mm)</td>
                <td className="p-4 text-center">150 × 25 × 3</td>
                <td className="p-4 text-center">160 × 25 × 6</td>
              </tr>
              <tr className="border-b-2 border-gray-700">
                <td className="p-4 font-semibold">Grit Range</td>
                <td className="p-4 text-center">Various (4 stones)</td>
                <td className="p-4 text-center">200/400/800/1500</td>
              </tr>
              <tr className="border-b-2 border-gray-600">
                <td className="p-4 font-semibold">Durability</td>
                <td className="p-4 text-center text-blue-600 font-bold">
                  Extreme
                </td>
                <td className="p-4 text-center">High</td>
              </tr>
              <tr className="border-b-2 border-gray-200">
                <td className="p-4 font-semibold">Best For</td>
                <td className="p-4 text-center">Industrial, carbide</td>
                <td className="p-4 text-center">General purpose</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Price</td>
                <td className="p-4 text-center font-bold">$84.99</td>
                <td className="p-4 text-center font-bold">$36.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="mb-20 bg-gradient-to-br from-blue-50 to-white rounded-lg p-8 boder-t">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 ">
          How to Use Sharpening Stones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Prepare the Stone
                </h3>
                <p className="text-gray-700 text-sm">
                  For aluminum oxide stones, soak in water for 10 minutes.
                  Diamond stones can be used dry or with light oil
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Set the Angle</h3>
                <p className="text-gray-700 text-sm">
                  Maintain consistent angle: 15-20° for knives, 25-30° for tools
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Start with Coarse Grit
                </h3>
                <p className="text-gray-700 text-sm">
                  Begin with 200-400 grit to establish the edge
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Progress Through Grits
                </h3>
                <p className="text-gray-700 text-sm">
                  Move to finer grits: 400 → 800 → 1500 for polished edge
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Use Smooth Strokes
                </h3>
                <p className="text-gray-700 text-sm">
                  Apply even pressure along the entire blade length
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Clean & Store</h3>
                <p className="text-gray-700 text-sm">
                  Rinse aluminum oxide stones, wipe diamond stones clean
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="mb-20 border-t">
        <div className="bg-white border-2 border-gray-700 p-8 rounded-lg mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Stone Care & Maintenance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">◆</span> Diamond Stones
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Can be used dry or with light oil
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Clean with soft brush and water
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Do not require flattening
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Store in protective case when not in use
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-gray-900">◆</span> Aluminum Oxide Stones
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-1">•</span>
                  Soak in water before use (10 minutes)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-1">•</span>
                  Clean with water only, no soap
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-1">•</span>
                  Flatten surface periodically with flattening stone
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 mt-1">•</span>
                  Dry completely before storing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
