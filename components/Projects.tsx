'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Facebook, Youtube, Phone, Mail, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/large1/1920/1080',
    title: 'Large Format Thạch An',
    description: 'Là biểu tượng của sự yên ổn và vững chắc. Thạch An tựa như những ngọn núi sừng sững đã chứng kiến bao đổi thay, thăng trầm của thiên nhiên vẫn hiện ngang đứng giữa đất trời bao la.',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/large2/1920/1080',
    title: 'Large Format Mộc Trà',
    description: 'Mang hơi thở của những cánh rừng già, Mộc Trà là sự kết tinh của thời gian và hơi ấm tự nhiên, mang lại cảm giác bình yên, thư thái cho mọi không gian sống.',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/large3/1920/1080',
    title: 'Large Format Vũ điệu xanh',
    description: 'Những đường vân uốn lượn như dải lụa mềm mại, Vũ điệu xanh khơi gợi trí tưởng tượng và khát vọng tự do, biến mỗi gian phòng thành một tác phẩm nghệ thuật sống động.',
  },
];

interface NewProductsProps {
  isActive?: boolean;
}

const NewProducts: React.FC<NewProductsProps> = ({ isActive }) => {
  const [current, setCurrent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'project_slides'), orderBy('order')), (snap) => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() }) as any));
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setIsRevealed(false);
    
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [current, isActive]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-full w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Blurred Background */}
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
              src={slides[current]?.image}
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

      {/* Main Content Container */}
      <motion.div 
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 40 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-[900px] h-[506.25px] mx-auto"
      >
        <div className="relative w-full h-full">
          {/* External Controls - Positioned relative to the 900px frame */}
          <button
            onClick={prevSlide}
            className="absolute -left-20 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all p-2"
          >
            <ChevronLeft className="w-12 h-12 stroke-[1px]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-20 top-1/2 -translate-y-1/2 z-30 text-white/30 hover:text-white transition-all p-2"
          >
            <ChevronRight className="w-12 h-12 stroke-[1px]" />
          </button>

          {/* Main Image Frame (The window) */}
          <div className="relative w-full h-full overflow-hidden z-10 bg-zinc-900 border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={slides[current]?.image}
                  alt={slides[current]?.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
          </div>
  
          {/* Protruding Content Box & White Decorative Frame */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[10%] z-20 flex justify-center w-[420px]">
            {/* The white outer decorative border line frame */}
            <div className="absolute -inset-4 border border-white/40 pointer-events-none" />

            <motion.div 
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              style={{ width: '420px', height: '321.61px' }}
              className="relative bg-gradient-to-b from-[#1a3a4a]/90 via-[#2a4a5a]/80 to-[#8a7b5a]/90 backdrop-blur-md p-8 md:p-10 border border-white/20 pointer-events-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[14px] font-bold tracking-[0.1em] text-white block mb-3">Sản Phẩm Mới</span>
                <h2 className="text-white text-3xl md:text-5xl font-sans font-light mb-6 leading-tight">
                  {slides[current]?.title}
                </h2>
                <p className="text-white/90 text-sm leading-relaxed font-light tracking-wide line-clamp-3">
                  {slides[current]?.description}
                </p>
              </div>
              <button className="group self-start flex items-center space-x-2 text-[11px] text-white font-bold tracking-[0.2em] uppercase border border-white px-8 py-3.5 hover:bg-white hover:text-black transition-all duration-500 mt-4">
                <span>CHI TIẾT</span>
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pagination Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative flex items-center justify-center p-2"
          >
            <div className={cn(
              "absolute w-5 h-5 rounded-full border transition-all duration-300",
              current === index ? "border-brand-red scale-100 opacity-100" : "border-white/0 scale-0 opacity-0"
            )} />
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              current === index ? "bg-brand-red" : "bg-white/40 hover:bg-white"
            )} />
          </button>
        ))}
      </div>

      {/* Footer Elements (Shared across sections) */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center space-x-6 text-white/60">
        <span className="text-[9px] font-bold tracking-widest hidden md:inline">2018 EUROTILE. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-white transition-colors"><Facebook className="w-4 h-4 fill-current" /></a>
          <a href="#" className="hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>
          <a href="#" className="hover:text-white transition-colors text-[10px] font-bold">Zalo</a>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-8 text-white/80">
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-wider">
          <span className="opacity-60 cursor-pointer hover:opacity-100 uppercase">Site map</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-wider">
          <span className="opacity-60 uppercase">hotline:</span>
          <span>0902.798.538</span>
        </div>
        <div className="flex items-center space-x-3 bg-brand-red/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 group cursor-pointer hover:bg-brand-red/20 transition-all">
          <div className="w-7 h-7 flex items-center justify-center bg-brand-red rounded-full text-white">
            <PenTool className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-wider group-hover:text-brand-red transition-colors">tuvanthietke@eurotile.vn</span>
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
