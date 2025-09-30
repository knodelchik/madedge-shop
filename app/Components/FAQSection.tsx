'use client';

import React, { useState } from 'react';
import { Star as StarIcon } from 'lucide-react';

// Local SpotlightCard
const SpotlightCard: React.FC<{
  image?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ image, footer, className = '', style }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${className}`}
      style={style}
    >
      {image}
      {footer}
    </div>
  );
};

const reviews = [
  {
    name: 'Alice Johnson',
    role: 'Product Manager',
    text: 'MadEdge completely transformed the way our team collaborates. Highly recommended!',
  },
  {
    name: 'Michael Smith',
    role: 'Entrepreneur',
    text: 'I love the clean design and smooth performance. Definitely worth it!',
  },
  {
    name: 'Sophie Lee',
    role: 'Designer',
    text: 'The attention to detail is outstanding. It made my workflow so much easier.',
  },
  {
    name: 'Daniel Carter',
    role: 'Developer',
    text: 'Finally, a solution that just works. Fast, reliable, and user-friendly.',
  },
  {
    name: 'Emma Wilson',
    role: 'Marketing Specialist',
    text: 'Our clients noticed improvements immediately. It has been a game changer.',
  },
  {
    name: 'James Brown',
    role: 'CEO',
    text: 'The best investment we made this year. Support team is fantastic as well!',
  },
  {
    name: 'Olivia Martinez',
    role: 'Content Creator',
    text: 'It simplified my process and saved me hours every week.',
  },
  {
    name: 'William Taylor',
    role: 'Consultant',
    text: 'Professional, clean, and intuitive. Could not ask for more.',
  },
  {
    name: 'Isabella Lopez',
    role: 'Freelancer',
    text: 'A tool that finally matches my expectations. Smooth and polished.',
  },
  {
    name: 'Henry Evans',
    role: 'Startup Founder',
    text: 'Our team productivity skyrocketed after switching to MadEdge.',
  },
  {
    name: 'Grace Kim',
    role: 'Engineer',
    text: 'It feels natural to use and everything just works.',
  },
  {
    name: 'Ethan Davis',
    role: 'Manager',
    text: 'The reliability is unmatched. A must-have for serious work.',
  },
];

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-800">
      {initials}
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-gray-800" />
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Trusted by 500+ happy customers worldwide
          </h2>
          <p className="text-gray-600 mt-2">
            Here’s what some of them say about MadEdge
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {visibleReviews.map((r, idx) => (
            <SpotlightCard
              key={idx}
              className="transition hover:shadow-lg"
              style={{ background: 'white' }}
              image={
                <div className="w-full h-24 bg-gray-100 flex items-end p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {r.name}
                      </div>
                      <div className="text-sm text-gray-500">{r.role}</div>
                    </div>
                  </div>
                </div>
              }
              footer={
                <div className="px-6 pb-6">
                  <p className="text-gray-700">“{r.text}”</p>
                </div>
              }
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            {showAll ? 'Show less' : 'Show more reviews'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
