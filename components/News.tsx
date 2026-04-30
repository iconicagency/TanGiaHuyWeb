'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Facebook, Youtube, Mail } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const DEFAULT_NEWS: any = {
  'left': {
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
      title: "[DỰ ÁN TÂN GIA HUY] TN HOME - KHÔNG GIAN SỐNG MANG HƠI THỞ INDOCHINE GIỮA LÒNG HỘI AN",
      description: "Nằm tại thành phố Hội An, tỉnh Quảng Nam, TN Home là một công trình nhà ở có diện tích hơn 300m²...",
      category: "TIN DỰ ÁN"
  },
  'top-right': {
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80",
      title: "XU HƯỚNG THIẾT KẾ NỘI THẤT 2026: KHI VẬT LIỆU, MÀU SẮC VÀ HÌNH KHỐI TẠO NÊN CẢM XÚC",
      description: "Dữ liệu tổng hợp từ các báo cáo chuyên sâu và nhận định của các chuyên gia tại Salone del Mobile 2026...",
  },
  'bottom-right': {
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      title: "[GẠCH TẤM LỚN 1200X1200MM] BỘ SƯU TẬP ĐÔNG PHƯƠNG: VẺ ĐẸP THIÊN NHIÊN",
      description: "\"Mây vật qua mái đến xưa, cuộn mình trên gấm vóc, uốn theo nét vẽ sơn mài...\"",
  }
};

interface NewsProps {
  isActive?: boolean;
}

const News: React.FC<NewsProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [news, setNews] = useState<any>(DEFAULT_NEWS);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80");
  const [prevActive, setPrevActive] = useState(isActive);

  if (prevActive !== isActive) {
    setPrevActive(isActive);
    setIsRevealed(false);
  }

  useEffect(() => {
    const unsubGen = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().section5Bg) {
        setBgImage(snap.data().section5Bg);
      }
    });

    const unsub = onSnapshot(collection(db, 'news_items'), (snap) => {
      if (!snap.empty) {
        const data: any = {};
        snap.docs.forEach(doc => {
          const item = doc.data();
          data[item.position] = item;
        });
        setNews((prev: any) => ({ ...prev, ...data }));
      }
    }, (err) => {
      console.error("[News] Snapshot error:", err);
    });
    return () => {
      unsubGen();
      unsub();
    };
  }, []);

  const getItem = (pos: string) => news[pos] || DEFAULT_NEWS[pos];

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <section className="relative h-full w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Dynamic Background with reveal animation like Section 3 */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt=""
          className={cn(
            "w-full h-full object-cover scale-110 transition-all duration-[2000ms] ease-in-out",
            isRevealed ? "blur-2xl opacity-40" : "blur-none opacity-100"
          )}
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.div 
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 40 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex items-center"
      >
        {/* Vertical Title - "TIN MỚI" */}
        <div className="mr-6 md:mr-16">
          <h2 className="text-white text-4xl md:text-8xl font-sans font-black tracking-tight uppercase [writing-mode:vertical-rl] rotate-180 transform select-none opacity-80 mix-blend-difference">
            TIN MỚI
          </h2>
        </div>

        {/* Content Container - 900x429 area with 10px gaps */}
        <div className="flex flex-col md:flex-row gap-[10px] items-center justify-center max-h-[70vh] md:h-[429px] shadow-2xl overflow-hidden md:overflow-visible">
          
          {/* Left Large Card - 315 x 429 */}
          <div className="w-full md:w-[315px] h-full md:h-[429px] bg-gradient-to-b from-[#004d33]/95 to-[#C5A059]/95 group cursor-pointer transition-all duration-500 flex flex-col flex-shrink-0 border border-white/10">
            <div className="relative h-[150px] md:h-[250px] overflow-hidden">
              <img
                src={getItem('left').image}
                alt={getItem('left').title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/40 px-4 py-3">
                <span className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">{getItem('left').category || 'TIN DỰ ÁN'}</span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-[15px] font-bold leading-tight mb-4 tracking-tight uppercase">
                {getItem('left').title}
              </h3>
              <p className="text-white/80 text-[10px] leading-relaxed font-normal">
                {getItem('left').description}
              </p>
            </div>
          </div>

          {/* Right Column - 585 width with 10px gap between rows */}
          <div className="w-[585px] h-[429px] flex flex-col gap-[10px] flex-shrink-0">
            
            {/* Top Right Item - 585 x 209.5 */}
            <div className="h-[209.5px] w-full flex bg-gradient-to-r from-[#004d33]/95 to-[#C5A059]/95 group cursor-pointer hover:brightness-110 transition-all border border-white/10">
               <div className="flex-[3] p-8 flex flex-col justify-center">
                  <h4 className="text-white text-sm md:text-[16px] font-bold leading-snug mb-3 uppercase tracking-tight">
                    {getItem('top-right').title}
                  </h4>
                  <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2 font-medium">
                    {getItem('top-right').description}
                  </p>
                  <span className="text-[10px] text-white/30 mt-3">[...]</span>
               </div>
               <div className="flex-[2] overflow-hidden">
                  <img
                    src={getItem('top-right').image}
                    alt={getItem('top-right').title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
               </div>
            </div>

            {/* Bottom Right Item - 585 x 209.5 */}
            <div className="h-[209.5px] w-full flex bg-gradient-to-r from-[#C5A059]/95 to-[#004d33]/95 group cursor-pointer hover:brightness-110 transition-all border border-white/10">
               <div className="flex-[2] overflow-hidden relative">
                  <img
                    src={getItem('bottom-right').image}
                    alt={getItem('bottom-right').title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/5 backdrop-blur-sm px-2 py-1">
                    <span className="text-white text-[9px] font-bold tracking-widest italic opacity-60">tân gia huy</span>
                  </div>
               </div>
               <div className="flex-[3] p-8 flex flex-col justify-center">
                  <h4 className="text-white text-sm md:text-[16px] font-bold leading-snug mb-3 uppercase tracking-tight">
                    {getItem('bottom-right').title}
                  </h4>
                  <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2 font-medium">
                    {getItem('bottom-right').description}
                  </p>
                  <span className="text-[10px] text-white/30 mt-3">[...]</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

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

export default News;
