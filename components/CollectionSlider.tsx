'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP THẠCH AN',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP MỘC TRÀ',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687940-c52af096999a?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP VŨ ĐIỆU XANH',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP AN NIÊN',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP TRƯỜNG SƠN',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80',
    title: 'BỘ SƯU TẬP ĐĂNG LỘC',
  },
];

interface CollectionSliderProps {
  isActive?: boolean;
}

const CollectionSlider: React.FC<CollectionSliderProps> = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'collection_slides'), orderBy('order')), (snap) => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }) as any));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-full w-full bg-black overflow-hidden">
      {/* Main Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current]?.image}
            alt={slides[current]?.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default CollectionSlider;
