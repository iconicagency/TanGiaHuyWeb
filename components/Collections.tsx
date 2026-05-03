'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Facebook, Youtube, MapPin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

interface CollectionsProps {
  isActive?: boolean;
}

const Collections: React.FC<CollectionsProps> = ({ isActive }) => {
  const [current, setCurrent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [bgImage, setBgImage] = useState("");
  const [prevConfig, setPrevConfig] = useState({ current, isActive });

  if (prevConfig.current !== current || prevConfig.isActive !== isActive) {
    setPrevConfig({ current, isActive });
    setIsRevealed(false);
  }

  useEffect(() => {
    const unsubGen = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().section4Bg) {
        setBgImage(snap.data().section4Bg);
      }
    });

    const unsubSlides = onSnapshot(query(collection(db, 'collection_slides'), orderBy('order')), (snap) => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });

    return () => {
      unsubGen();
      unsubSlides();
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [current, isActive]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  // Group slides into pairs for the layout
  const slidesAsPairs: any[][] = [];
  for (let i = 0; i < slides.length; i += 2) {
    const pair = [slides[i]];
    if (slides[i + 1]) pair.push(slides[i + 1]);
    slidesAsPairs.push(pair);
  }

  const currentPair = slidesAsPairs[current % slidesAsPairs.length] || [];

  return (
    <section className="relative h-full w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background matching Project style */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={bgImage || (currentPair[0]?.image)}
              alt=""
              className={cn(
                "w-full h-full object-cover scale-110 transition-all duration-[2000ms] ease-in-out",
                isRevealed ? "blur-2xl opacity-40" : "blur-none opacity-100"
              )}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Reveal */}
      <motion.div
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 40 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        {/* Title */}
        <div className="mb-6 md:mb-12">
          <h2 className="text-white text-4xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight uppercase">
            BỘ SƯU TẬP
          </h2>
        </div>

        {/* Main Content: Two Side-by-Side Cards */}
        <div className="relative w-full max-w-7xl px-8 md:px-24">
        {/* Navigation Arrows - Closely pinned to the frame */}
        <button
          onClick={prevSlide}
          className="absolute -left-10 md:-left-4 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all"
        >
          <ChevronLeft className="w-12 h-12 md:w-16 md:h-16 stroke-[1px]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-10 md:-right-4 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all"
        >
          <ChevronRight className="w-12 h-12 md:w-16 md:h-16 stroke-[1px]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-1 gap-y-12">
          <AnimatePresence mode="wait">
            {currentPair.map((project, idx) => (
              <motion.div
                key={`${current}-${project.id}`}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: idx === 0 ? 20 : -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group cursor-pointer"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] max-h-[30vh] md:max-h-none overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Green-Gold Gradient Footer Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#004d33]/95 to-[#C5A059]/95 backdrop-blur-sm p-4 md:p-6 border-t border-white/10">
                  <h3 className="text-white text-sm md:text-lg font-bold tracking-wider mb-1 md:mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-start space-x-2 text-white/80">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-[9px] md:text-xs leading-relaxed font-light line-clamp-2">
                      {project.description || 'Chi tiết bộ sưu tập'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>

      {/* Selection Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2">
        {slidesAsPairs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              current === index ? "bg-brand-gold scale-125" : "bg-white/40 hover:bg-white"
            )}
          />
        ))}
      </div>

      {/* Synchronized Footer Area like Projects section */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center space-x-6 text-white/40">
        <span className="text-[9px] font-bold tracking-widest hidden md:inline">© 2024 TÂN GIA HUY. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center space-x-4">
          <Facebook className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Youtube className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <span className="text-[10px] font-bold cursor-pointer hover:text-white transition-colors">Zalo</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-8 text-white/70">
        <div className="flex items-center space-x-8 text-[10px] font-bold tracking-wider mr-4">
          <span className="opacity-60 uppercase">hotline: 0971.325.658</span>
        </div>
        <div className="flex items-center space-x-3 bg-brand-gold/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 group cursor-pointer hover:bg-brand-gold/20 transition-all">
          <div className="w-7 h-7 flex items-center justify-center bg-brand-gold rounded-full text-white">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-wider group-hover:text-brand-gold transition-colors">tangiahuy.nd@gmail.com</span>
        </div>
      </div>
    </section>
  );
};

export default Collections;
