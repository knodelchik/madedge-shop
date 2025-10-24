import React from 'react';
import { Calendar, Wrench, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    // 1. Додаємо контейнер для уніфікації ширини та відступів
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          About Us
        </h1>
        <p className="mt-4 text-xl text-gray-500 border-b pb-6 border-gray-200">
          Welcome to MadEdge — where precision meets innovation in the world of
          sharpening solutions.
        </p>
      </div>

      {/* --- Our Background --- */}
      <section id="our-background" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          Our Background
        </h2>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4 text-lg">
            Founded in **2010**, MadEdge emerged from a simple observation:
            artists, craftsmen, and professionals deserved better tools to
            maintain their instruments. What started as a small workshop in
            Portland has grown into a leading manufacturer of premium sharpening
            solutions used by professionals worldwide.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            The Journey
          </h3>
          <p className="text-gray-700 mb-4">
            Our founder, **Marcus Davidson**, a former industrial designer,
            noticed the frustration artists faced with conventional sharpeners.
            He spent three years researching metallurgy, blade geometry, and
            ergonomics to create the first MadEdge prototype. That prototype
            evolved into our flagship ProEdge series, now trusted by over
            **100,000 professionals** globally.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Milestones
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2010:</span>
                <span className="text-gray-700">
                  Company founded in Portland, Oregon
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2013:</span>
                <span className="text-gray-700">
                  First ProEdge model launched
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2017:</span>
                <span className="text-gray-700">
                  Expanded to international markets
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2021:</span>
                <span className="text-gray-700">
                  Introduced sustainable manufacturing practices
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-3">2024:</span>
                <span className="text-gray-700">
                  Reached 100,000+ customers worldwide
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Our Values --- */}
      <section id="our-values" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Value 1: Precision */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-blue-600" />
              Precision
            </h3>
            <p className="text-gray-700">
              Every MadEdge product is engineered to **micron-level accuracy**.
              We believe that true craftsmanship begins with the right tools,
              maintained to perfection.
            </p>
          </div>

          {/* Value 2: Sustainability */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-green-600" />
              Sustainability
            </h3>
            <p className="text-gray-700">
              Our commitment to the environment drives us to use **recycled
              materials** and minimize waste in every stage of production.
            </p>
          </div>

          {/* Value 3: Innovation */}
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-purple-600" />
              Innovation
            </h3>
            <p className="text-gray-700">
              We continuously invest in R&amp;D to develop **cutting-edge
              sharpening** technologies that make maintenance easier and more
              effective.
            </p>
          </div>

          {/* Value 4: Customer Focus */}
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <ChevronRight className="w-5 h-5 mr-2 text-orange-600" />
              Customer Focus
            </h3>
            <p className="text-gray-700">
              Your satisfaction is our priority. We offer **lifetime support**
              and a 10-year warranty on all our products.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Manufacturing --- */}
      <section id="manufacturing" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          Manufacturing
        </h2>

        <p className="text-gray-700 mb-6 text-lg">
          Our state-of-the-art facility in Portland combines **traditional
          craftsmanship with modern automation**. Every sharpener goes through
          rigorous quality control before reaching your hands.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          Production Process
        </h3>
        {/* Production Process (Змінено на сильніший стиль) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">
              1. Material Selection
            </h4>
            <p className="text-gray-700 text-sm">
              We source premium tungsten carbide and ceramic materials from
              certified suppliers.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">
              2. Precision Machining
            </h4>
            <p className="text-gray-700 text-sm">
              CNC machines craft each component to exact specifications with
              **0.001mm tolerance**.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">3. Assembly</h4>
            <p className="text-gray-700 text-sm">
              Skilled technicians hand-assemble each unit, ensuring perfect
              alignment and functionality.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">4. Quality Testing</h4>
            <p className="text-gray-700 text-sm">
              Every sharpener undergoes **50+ quality checks** including blade
              angle verification and durability testing.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h4 className="font-bold text-gray-900 mb-1">5. Packaging</h4>
            <p className="text-gray-700 text-sm">
              Products are packaged in **eco-friendly materials** with
              comprehensive user guides.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          Sustainability Initiatives
        </h3>
        <p className="text-gray-700 mb-4">
          Our manufacturing facility runs on **100% renewable energy** and
          we&apos;ve achieved **zero waste to landfill** status since 2022. We
          use recycled aluminum for our casings and biodegradable packaging
          materials.
        </p>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- MadEdge Services --- */}
      <section id="madedge-services" className="mb-20 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          MadEdge Services
        </h2>

        <p className="text-gray-700 mb-6 text-lg">
          Beyond manufacturing exceptional products, we offer comprehensive
          services to ensure you get the most from your MadEdge sharpener.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          How to Use Your MadEdge Sharpener
        </h3>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-xl mb-8 border border-blue-200 shadow-lg">
          <h4 className="font-bold text-gray-900 mb-4 text-xl">
            Step-by-Step Instructions:
          </h4>

          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-900">Preparation</p>
                <p className="text-gray-700 text-sm">
                  Place the sharpener on a flat, stable surface. Ensure the
                  blade slot is clean and free of debris.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-900">Insert the Pencil</p>
                <p className="text-gray-700 text-sm">
                  Hold the pencil at a 23-degree angle (the sharpener&apos;s
                  guide will help) and insert it gently into the opening.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </span>
              <div>
                <p className="font-semibold text-gray-900">Rotate Smoothly</p>
                <p className="text-gray-700 text-sm">
                  Turn the pencil clockwise 3-5 times with gentle, consistent
                  pressure. The sharpener will guide the optimal angle
                  automatically.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </span>
              <div>
                <p className="font-semibold text-gray-900">Check the Point</p>
                <p className="text-gray-700 text-sm">
                  Remove the pencil and inspect. For a finer point, repeat step
                  3 for 2-3 more rotations.
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                5
              </span>
              <div>
                <p className="font-semibold text-gray-900">Clean Regularly</p>
                <p className="text-gray-700 text-sm">
                  Empty the shavings reservoir after every 10-15 uses. Wipe the
                  blade opening with a soft cloth monthly.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-600">Pro Tip:</strong> For colored
              pencils, use slightly less pressure and more rotations for best
              results. For graphite pencils, standard pressure works perfectly.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          Additional Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              Maintenance &amp; Repair
            </h4>
            <p className="text-gray-700">
              Free blade replacement for the first year. Lifetime repair service
              available at cost.
            </p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span> Custom Engraving
            </h4>
            <p className="text-gray-700">
              Personalize your MadEdge with custom engraving for corporate gifts
              or personal use.
            </p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span> Educational
              Workshops
            </h4>
            <p className="text-gray-700">
              Free monthly online workshops on tool maintenance and optimal
              sharpening techniques.
            </p>
          </div>

          <div className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2">◆</span> Bulk Orders
            </h4>
            <p className="text-gray-700">
              Special pricing and customization options for schools, studios,
              and corporations.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-16 border-gray-200" />

      {/* --- Upcoming Events --- */}
      <section id="upcoming-events" className="mb-16 scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-gray-900 pl-3">
          Upcoming Events
        </h2>

        <p className="text-gray-700 mb-6 text-lg">
          Join us at these upcoming events to experience MadEdge products
          firsthand and meet our team.
        </p>

        <div className="space-y-6">
          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  International Art Supply Expo
                </h3>
                <p className="text-gray-600 mt-1">Chicago, IL</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">
              Visit our booth #A-245 to see live demonstrations of the new
              ProEdge X2 and participate in our daily raffles.
            </p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">
                November 15-17, 2025
              </span>
              <span className="text-gray-500">McCormick Place</span>
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  MadEdge Factory Tour
                </h3>
                <p className="text-gray-600 mt-1">Portland, OR</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">
              Get an exclusive behind-the-scenes look at our manufacturing
              process. Tours are limited to 20 participants. Registration
              required.
            </p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">December 5, 2025</span>
              <span className="text-gray-500">MadEdge Headquarters</span>
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Professional Artist Workshop Series
                </h3>
                <p className="text-gray-600 mt-1">Online Event</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">
              Monthly online workshops featuring professional artists sharing
              their techniques and tool maintenance tips. Free for MadEdge
              customers.
            </p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">
                First Saturday of Each Month
              </span>
              <span className="text-gray-500">Zoom</span>
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  New Product Launch Event
                </h3>
                <p className="text-gray-600 mt-1">New York, NY</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-gray-700 mb-3">
              Be the first to see and try our revolutionary new sharpening
              system. Special early-bird pricing available for event attendees.
            </p>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-blue-600">January 20, 2026</span>
              <span className="text-gray-500"></span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-3">Stay Updated</h3>
          <p className="text-gray-700 mb-4">
            Subscribe to our newsletter to receive notifications about new
            events, product launches, and exclusive offers.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Subscribe Now
          </button>
        </div>
      </section>
    </div>
  );
}
