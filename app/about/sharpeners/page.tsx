import React from 'react';

export default function SharpenersPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        MadEdge Sharpeners
      </h1>
      <p className="text-gray-700 mb-10 text-lg">
        Discover our full lineup of professional sharpening tools designed for
        precision, durability, and comfort. Each model is crafted to serve a
        specific purpose — from artists to industrial craftsmen.
      </p>

      {/* Model 1 */}
      <section id="model-1" className="mb-16 scroll-mt-32">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          MadEdge Model 1
        </h2>
        <p className="text-gray-700 mb-4">
          The original MadEdge design that started it all. Compact, ergonomic,
          and built for daily use. Model 1 features dual-blade tungsten inserts
          for balanced sharpening and a 10-year warranty.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Ideal for graphite and charcoal pencils</li>
          <li>Non-slip base with magnetic dust cover</li>
          <li>Manual rotary system with precision gear</li>
        </ul>
      </section>

      {/* Digital model */}
      <section id="digital-angle" className="mb-16 scroll-mt-32">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          MadEdge with Digital Sharpening Angle Measurement
        </h2>
        <p className="text-gray-700 mb-4">
          Combining modern technology with traditional engineering, this model
          includes a built-in digital angle display for precise sharpening every
          time. Perfect for professionals who demand accuracy.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Digital LCD angle indicator (accuracy ±0.1°)</li>
          <li>USB-C rechargeable power system</li>
          <li>Smart auto-stop for consistent results</li>
        </ul>
      </section>

      {/* Model 2 */}
      <section id="model-2" className="mb-16 scroll-mt-32">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          MadEdge Model 2
        </h2>
        <p className="text-gray-700 mb-4">
          The evolution of Model 1 — featuring refined mechanics, smoother
          motion, and advanced material durability. Designed for studios and
          schools.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Reinforced ceramic sharpening wheel</li>
          <li>Adjustable sharpening resistance</li>
          <li>Silent operation mode</li>
        </ul>
      </section>

      {/* Convex */}
      <section id="convex" className="mb-16 scroll-mt-32">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          MadEdge for Convex Blades
        </h2>
        <p className="text-gray-700 mb-4">
          Specifically engineered for convex or curved blades such as scissors,
          woodworking tools, and specialty cutters.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Dual-bevel correction system</li>
          <li>Supports edge angles 15°–45°</li>
          <li>Anti-glare surface with adjustable grip</li>
        </ul>

        <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-gray-700">
            <strong className="text-blue-600">Pro Tip:</strong> For best convex
            sharpening, rotate the blade gently while maintaining even pressure
            throughout the stroke.
          </p>
        </div>
      </section>
    </>
  );
}
