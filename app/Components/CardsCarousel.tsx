"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { JSX } from "react";
import Link from "next/link";

interface Slide {
  title: string;
  img: string;
  desc: string;
  category: "sharpeners" | "stones" | "accessories";
}

const slides: Slide[] = [
  {
    title: "Grinding Stones",
    img: "/images/grindingstones.jpg",
    desc: "High-quality grinding stones designed for precision sharpening.",
    category: "stones",
  },
  {
    title: "Sharpeners",
    img: "/images/sharpeners.jpg",
    desc: "Professional sharpeners for blades, tools, and knives.",
    category: "sharpeners",
  },
  {
    title: "Accessories",
    img: "/images/accseroies.jpg",
    desc: "Essential accessories to complement your sharpening setup.",
    category: "accessories",
  },
];

export default function CardCarousel(): JSX.Element {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden mb-30">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        loop
        spaceBetween={40}
        slidesPerView={1}
        className="w-full h-[60vh] flex items-center justify-center"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-[60vh] flex items-center justify-center"
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gray-900/10" />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center bg-gray-200/60 backdrop-blur-sm p-8 rounded-2xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.3)] max-w-xl flex flex-col items-center justify-center"
              >
                <h1 className="text-4xl text-black/90 font-bold mb-3 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-black/90 text-lg mb-4 text-center max-w-md">
                  {slide.desc}
                </p>
                <Link
                  href={`/shop?category=${slide.category}`}
                  className="px-5 py-2 bg-gray-300/30 text-black font-semibold rounded-full hover:bg-gray-200 transition border border-gray-400/10 hover:border-gray-600/25"
                >
                  View {slide.title}
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
