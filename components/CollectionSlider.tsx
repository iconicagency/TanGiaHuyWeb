'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Facebook, Youtube, Mail } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AboutSectionProps {
  isActive?: boolean;
}

const CollectionSlider: React.FC<AboutSectionProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().section2Bg) {
        setBgImage(snap.data().section2Bg);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setIsRevealed(true), 500);
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <section className="relative h-full w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image - High-end Interior with Green Marble */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className={cn(
            "w-full h-full object-cover transition-all duration-[3000ms] ease-out",
            isRevealed ? "scale-105 opacity-60" : "scale-100 opacity-100"
          )}
          referrerPolicy="no-referrer"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-24 flex flex-col items-center">
        {/* Title */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={isActive ? { opacity: 1, scale: 1 } : {}}
           transition={{ duration: 1, ease: "easeOut" }}
           className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight text-white uppercase leading-tight">
            VỀ <span className="text-brand-gold">TÂN GIA HUY</span>
          </h2>
        </motion.div>

        {/* Green Content Box with dual white frame */}
        <div className="relative mx-auto w-full max-w-5xl max-h-[60vh] overflow-y-auto hide-scrollbar md:overflow-visible">
          {/* Decorative frame overlay */}
          <div className="absolute -inset-4 border border-white/20 pointer-events-none hidden md:block" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={isRevealed ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative bg-brand-gold/10 backdrop-blur-md p-6 md:p-10 lg:p-14 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            {/* The actual green background for the inner box as per image */}
            <div className="absolute inset-0 bg-[#004d33]/90 -z-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                <p className="text-white text-xs md:text-[14px] lg:text-[15px] leading-relaxed font-medium">
                  Với 10 năm kinh nghiệm trên thị trường gạch ốp lát và thiết bị vệ sinh, cùng tôn chỉ kinh doanh <span className="text-brand-gold">“Uy Tín – Tận Tâm – Chất Lượng”</span>, Chúng tôi luôn mang đến cho Quý khách hàng những sản phẩm tốt nhất, cập nhật những xu hướng hiện đại và chất lượng dịch vụ hàng đầu.
                </p>
                <p className="text-white/80 text-[10px] md:text-[11px] lg:text-xs leading-relaxed font-light">
                  Tân Gia Huy tự hào là đơn vị có phạm vi hoạt động trên khắp các tỉnh miền Bắc với hàng trăm Đại lý và Nhà Phân Phối tại các tỉnh thành như: <span className="text-brand-gold font-medium">Sơn La, Hà Giang, Yên Bái, Thái Nguyên, Quảng Bình, Hà Nam, Ninh Bình, Nam Định…</span> phân phối đa dạng các ngành hàng với nhiều phân khúc sản phẩm khác nhau. Chúng tôi vinh dự là đối tác đồng hành cùng nhiều thương hiệu nổi tiếng như <span className="font-bold">ToTo, Caesar, Viglacera, D&K, Inax, Bauer,…..vv.</span>
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-4 md:space-y-6 flex flex-col justify-between">
                <p className="text-white text-xs md:text-[14px] lg:text-[15px] leading-relaxed font-medium">
                  Tân Gia Huy cam kết sẽ mang <span className="text-brand-gold">Tín – Tâm – Chất</span> từ mọi nguồn lực để đem đến những trải nghiệm về không gian sống đầy cảm hứng và đậm dấu ấn cá nhân. Chúng tôi luôn nỗ lực không ngừng để giữ vững vị trí tiên phong trên thị trường cũng như trong lòng khách hàng về chất lượng sản phẩm và cả dịch vụ tư vấn.
                </p>
                <p className="text-brand-gold text-xs md:text-sm lg:text-base leading-relaxed font-bold italic pt-4 md:pt-8 border-t border-white/10">
                  Chúng tôi hy vọng được hợp tác và phục vụ Quý khách hàng, Quý đối tác trong những cơ hội đầu tư mới, và những trải nghiệm sống đẳng cấp mới.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
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

export default CollectionSlider;
