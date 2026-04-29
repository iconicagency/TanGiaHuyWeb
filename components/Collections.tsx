'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Facebook, Youtube, MapPin, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const projectPairs = [
  [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
      title: 'FINN HOUSE',
      location: 'Khu Căn Hộ Giảng Viên Đại Học Cần Thơ, phường An Khánh, quận Ninh Kiều, thành phố Cần Thơ',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80',
      title: 'VILLA ALIBU',
      location: '86 Nguyễn Viết Xuân, TT.Phước An, H.Krông Pắc, Đắk Lắk',
    }
  ],
  [
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600607687940-c52af096999a?auto=format&fit=crop&q=80',
      title: 'MODERN RETREAT',
      location: 'Khu dân cư cao cấp, Quận 7, TP. Hồ Chí Minh',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80',
      title: 'OCEAN VILLA',
      location: 'Bán đảo Sơn Trà, TP. Đà Nẵng',
    }
  ]
];

interface CollectionsProps {
  isActive?: boolean;
}

const Collections: React.FC<CollectionsProps> = ({ isActive }) => {
  const [current, setCurrent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [bgImage, setBgImage] = useState("");
  const [prevConfig, setPrevConfig] = useState({ current, isActive });

  if (prevConfig.current !== current || prevConfig.isActive !== isActive) {
    setPrevConfig({ current, isActive });
    setIsRevealed(false);
  }

  React.useEffect(() => {
    const unsubGen = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().section4Bg) {
        setBgImage(snap.data().section4Bg);
      }
    });
    return () => unsubGen();
  }, []);

  React.useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [current, isActive]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % projectPairs.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + projectPairs.length) % projectPairs.length);

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
              src={bgImage || projectPairs[current][0].image}
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
        <div className="mb-12">
          <h2 className="text-white text-5xl md:text-7xl font-extralight tracking-[0.3em] uppercase opacity-80">
            DỰ ÁN
          </h2>
        </div>

        {/* Main Content: Two Side-by-Side Cards */}
        <div className="relative w-full max-w-7xl px-12 md:px-24">
        {/* Navigation Arrows - Closely pinned to the frame */}
        <button
          onClick={prevSlide}
          className="absolute -left-12 md:-left-4 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all"
        >
          <ChevronLeft className="w-16 h-16 stroke-[1px]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-12 md:-right-4 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all"
        >
          <ChevronRight className="w-16 h-16 stroke-[1px]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-y-12">
          <AnimatePresence mode="wait">
            {projectPairs[current].map((project, idx) => (
              <motion.div
                key={`${current}-${project.id}`}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: idx === 0 ? 20 : -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group cursor-pointer"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Green-Gold Gradient Footer Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#004d33]/95 to-[#C5A059]/95 backdrop-blur-sm p-4 md:p-6 border-t border-white/10">
                  <h3 className="text-white text-lg font-bold tracking-wider mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-start space-x-2 text-white/80">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] md:text-xs leading-relaxed font-light">
                      {project.location}
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
        {projectPairs.map((_, index) => (
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

      {/* Footer Branding Area */}
      <div className="absolute bottom-0 left-0 w-full z-40 bg-black/40 backdrop-blur-sm py-4 px-12 flex justify-between items-center text-[9px] text-white/60 font-bold tracking-widest border-t border-white/5">
        <div className="flex items-center space-x-6">
          <span>© 2024 TÂN GIA HUY. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center space-x-4">
            <Facebook className="w-4 h-4" />
            <Youtube className="w-4 h-4" />
            <span>Zalo</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <span className="hover:text-white cursor-pointer transition-colors">SITE MAP</span>
          <div className="flex items-center space-x-2">
            <span>HOTLINE:</span>
            <span className="text-white">0971.325.658</span>
          </div>
          <div className="flex items-center space-x-2 bg-brand-gold/20 text-white px-4 py-2 rounded-full group cursor-pointer transition-all hover:bg-brand-gold/40 border border-brand-gold/30">
             <PenTool className="w-4 h-4" />
             <span>tangiahuy.nd@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
