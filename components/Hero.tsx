'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const DEFAULT_SLIDES = [
  {
    image: 'https://picsum.photos/seed/tiles1/1920/1080',
    title: 'Vũ điệu xanh',
    description: 'Bản hòa ca của thiên nhiên và nghệ thuật kiến trúc',
  },
  {
    image: 'https://picsum.photos/seed/tiles2/1920/1080',
    title: 'Mộc Trà',
    description: 'Vẻ đẹp ấm áp của gỗ trong không gian hiện đại',
  },
];

interface HeroProps {
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'hero_slides'), orderBy('order')), (snap) => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => d.data() as any));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover grayscale-[10%] brightness-[0.7]"
          poster={slides[currentSlide].image}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          {/* Fallback to image if video fails or not found */}
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="h-full w-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="absolute bottom-10 left-12 z-30 animate-bounce cursor-pointer flex items-center space-x-4">
        <span className="text-[10px] tracking-[0.3em] font-bold opacity-60 text-white">CUỘN XUỐNG</span>
        <ChevronDown className="w-5 h-5 opacity-60 text-white" />
      </div>
    </section>
  );
};

export default Hero;
