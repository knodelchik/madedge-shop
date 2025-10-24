import React from 'react';

export default function SharpenersPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          MadEdge Sharpeners
        </h1>

        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          Discover our full lineup of professional sharpening tools designed for
          precision, durability, and comfort. Each model is crafted to serve a
          specific purpose — from artists to industrial craftsmen.
        </p>
      </div>

      {/* --- Model 1 --- */}
      <section id="model-1" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              MadEdge Model 1
            </h2>
            <p className="text-gray-700 text-lg">
              Modular sharpener with a rotary mechanism based on cutting-edge
              rotating clamp technology. - Clamps are made of steel (not
              aluminum). - All parts of the rotary mechanism are steel; rubbing
              surfaces hardened to 900HV. - MadEdge system includes a spherical
              nut to compensate for screw skew on thin knives. - Wear
              compensation is possible only in the MadEdge system. -
              Antifriction bronze bushing in the hinge ensures smooth stone
              movement. - Stone holder handle made of stained oak. - Minimum
              grinding angle: 10° per side. - Compatible with knives, scissors,
              and chisels. - Sharpening angles from 10° to 40° per side. -
              Stones fixed from 12 mm width and up to 220 mm length. -
              Compatible with both blank and standard stones. - Rotary mechanism
              accuracy: 0.2°.
            </p>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel1-1.jpg"
                alt="MadEdge Model 1 - Classic pencil sharpener"
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Ideal for graphite and charcoal pencils
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Non-slip base with magnetic dust cover
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Manual rotary system with precision gear
                </span>
              </li>
            </ul>

            <div className="text-3xl font-bold text-gray-900">$149.99</div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Digital model --- */}
      <section id="digital-angle" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-3">
              MadEdge with Digital Sharpening Angle Measurement
            </h2>
            <p className="text-gray-700 text-lg">
              Only we have! MadEdge with integrated Digital Sharpening Angle
              Measurement. This configuration avoids the installation of
              additional mass on the clamping frame and avoids additional
              pressure on the grinding stone. Combining modern technology with
              traditional engineering, this model includes a **built-in digital
              angle display** for precise sharpening every time. Perfect for
              professionals who demand accuracy.
            </p>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-blue-50 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel3-1.jpg"
                alt="MadEdge Model with Digital angle measurement"
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Digital LCD angle indicator (accuracy ±0.1°)
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  USB-C rechargeable power system
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Smart auto-stop for consistent results
                </span>
              </li>
            </ul>

            <div className="text-3xl font-bold text-gray-900">$89.99</div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Model 2 --- */}
      <section id="model-2" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              MadEdge Model 2
            </h2>
            <p className="text-gray-700 text-lg">
              Unlike Model1, it has an additional pair of clamps fixed in the
              center. All parts are made of steel, no aluminum. Friction
              surfaces are hardened to a hardness of 900HV. The clamps are
              equipped with a spherical nut to compensate for the misalignment
              of the screw when securing thin knives. Moreover, in the case of
              thread wear in the clamps, it is necessary to replace only the nut
              and screw, and not the entire expensive clamp. Parts are coated
              with a polymer wear-resistant coating that covers car wheels.
              There is a mechanism for adjusting the wear of the seats of the
              rotary mechanism. The guide is heat-treated to a hardness of
              60HRC; for smoothness of movement, sliding is carried out along
              the bearing. The hinge has extended turning angles, which provides
              a comfortable sharpening of long knives. The stone holder has a
              substrate, which allows you to use stones with blank and without
              blank. The base is supported on 3 points, which ensures the
              stability of the sharpener on any surface.
            </p>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel2-1.jpg"
                alt="MadEdge Model 2 - Professional sharpener"
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Reinforced ceramic sharpening wheel
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Adjustable sharpening resistance
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Silent operation mode</span>
              </li>
            </ul>

            <div className="text-3xl font-bold text-gray-900">$69.99</div>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Convex --- */}
      <section id="convex" className="mb-20 scroll-mt-24">
        <div className="lg:flex lg:space-x-12">
          {/* Left: Description */}
          <div className="lg:w-3/5 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
              MadEdge for Convex Blades
            </h2>
            <p className="text-gray-700 text-lg">
              1. Clamps are made of steel, not aluminum. 2. All parts of the
              rotary mechanism are also made of steel, and not of bronze and
              aluminum. Rubbing surfaces are hardened to hardness 740HV. 3. Only
              in the MadEdge system, the clamps have a spherical nut to
              compensate for the screw skew when attaching thin knives. 4. Only
              in the MadEdge system is it possible to compensate for the wear of
              the turning mechanism. 5. An antifriction bronze bushing is
              pressed into the hinge of the sliding assembly, which ensures an
              increased smoothness of the movement of the stone. 6. The handle
              of the stone holder is made of stained oak. 7. The minimum angle
              of grinding is 12 degrees per side.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6">
              <p className="text-gray-700">
                <strong className="text-blue-600">Pro Tip:</strong> For best
                convex sharpening, rotate the blade gently while maintaining
                even pressure throughout the stroke.
              </p>
            </div>
          </div>

          {/* Right: Image + Price + List */}
          <div className="lg:w-2/5 order-1 lg:order-2 flex flex-col items-start">
            <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden w-full rounded-lg mb-4">
              <img
                src="/images/madedgemodel4-1.jpg"
                alt="MadEdge Convex - Specialist sharpener for convex blades"
                className="w-full h-full object-cover"
              />
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Dual-bevel correction system
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Supports edge angles 15°–45°
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">
                  Anti-glare surface with adjustable grip
                </span>
              </li>
            </ul>

            <div className="text-3xl font-bold text-gray-900">$79.99</div>
          </div>
        </div>
      </section>
    </div>
  );
}
