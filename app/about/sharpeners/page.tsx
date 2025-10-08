import React from 'react';

export default function SharpenersPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          MadEdge Sharpeners
        </h1>

        <p className="text-gray-700 text-xl leading-relaxed max-w-3xl">
          Discover our full lineup of professional sharpening tools designed for
          precision, durability, and comfort. Each model is crafted to serve a
          specific purpose — from artists to industrial craftsmen.
        </p>
      </div>

      {/* Model 1 */}
      <section id="model-1" className="mb-20 scroll-mt-32 border-t">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              MadEdge Model 1
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              The original MadEdge design that started it all. Compact,
              ergonomic, and built for daily use. Model 1 features dual-blade
              tungsten inserts for balanced sharpening and a 10-year warranty.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Ideal for graphite and charcoal pencils
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Non-slip base with magnetic dust cover
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Manual rotary system with precision gear
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">$149.99</div>
          </div>
          <div className="bg-gray-100 aspect-square flex items-center justify-center  overflow-hidden">
            <img
              src="/images/madedgemodel1-1.jpg"
              alt="MadEdge Model 1 - Classic pencil sharpener"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Digital model */}
      <section id="digital-angle" className="mb-20 scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-blue-50 aspect-square flex items-center justify-center  overflow-hidden">
            <img
              src="/images/madedgemodel3-1.jpg"
              alt="MadEdge Model 1 with Digital angle measurement"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              MadEdge with Digital Sharpening Angle Measurement
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              Combining modern technology with traditional engineering, this
              model includes a built-in digital angle display for precise
              sharpening every time. Perfect for professionals who demand
              accuracy.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Digital LCD angle indicator (accuracy ±0.1°)
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  USB-C rechargeable power system
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Smart auto-stop for consistent results
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">$89.99</div>
          </div>
        </div>
      </section>

      {/* Model 2 */}
      <section id="model-2" className="mb-20 scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              MadEdge Model 2
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              The evolution of Model 1 — featuring refined mechanics, smoother
              motion, and advanced material durability. Designed for studios and
              schools.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Reinforced ceramic sharpening wheel
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Adjustable sharpening resistance
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Silent operation mode</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">$69.99</div>
          </div>
          <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src="/images/madedgemodel2-1.jpg"
              alt="MadEdge Model 2 - Professional sharpener for studios"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Convex */}
      <section id="convex" className="mb-20 scroll-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src="/images/madedgemodel4-1.jpg"
              alt="MadEdge Convex - Specialist sharpener for convex blades"
              className="w-150 h-105 object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              MadEdge for Convex Blades
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              Specifically engineered for convex or curved blades such as
              scissors, woodworking tools, and specialty cutters.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Dual-bevel correction system
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Supports edge angles 15°–45°
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Anti-glare surface with adjustable grip
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-6">$79.99</div>

            <div className="bg-blue-50 p-6 rounded-lg ">
              <p className="text-gray-700">
                <strong className="text-blue-600">Pro Tip:</strong> For best
                convex sharpening, rotate the blade gently while maintaining
                even pressure throughout the stroke.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
