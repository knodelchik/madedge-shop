"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { JSX } from "react";

interface Slide {
  title: string;
  img: string;
  desc: string;
}

const slides: Slide[] = [
  {
    title: "Grinding Stones",
    img: "https://images.unsplash.com/photo-1602524205734-28e95b220d9f",
    desc: "High-quality grinding stones designed for precision sharpening.",
  },
  {
    title: "Sharpeners",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    desc: "Professional sharpeners for blades, tools, and knives.",
  },
  {
    title: "Accessories",
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    desc: "Essential accessories to complement your sharpening setup.",
  },
];

export default function CardCarousel(): JSX.Element {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
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
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-xl flex flex-col items-center justify-center"
              >
                <h1 className="text-4xl font-bold mb-3 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-200 text-lg mb-4 text-center max-w-md">
                  {slide.desc}
                </p>
                <button className="px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
                  View Collection
                </button>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
