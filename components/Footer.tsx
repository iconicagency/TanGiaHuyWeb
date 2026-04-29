'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';

interface FooterProps {
  isActive?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="relative h-full w-full bg-black overflow-hidden flex flex-col items-center justify-center py-20 px-12 md:px-24">
      {/* Decorative center element */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <h1 className="text-[25vw] font-sans font-black tracking-tighter uppercase">TÂN GIA HUY</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[12px] tracking-[0.5em] font-medium opacity-60 uppercase mb-4">VẬT LIỆU HOÀN THIỆN CAO CẤP</span>
          <h2 className="text-7xl md:text-9xl font-sans font-black tracking-tighter uppercase text-brand-gold">tân gia huy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-20">
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-gold uppercase">Showroom Nam Định</span>
             <p className="text-sm font-light text-white/60 leading-relaxed">
               TT Nam Giang, Nam Trực, tỉnh Nam Định
             </p>
          </div>
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-gold uppercase">Showroom Sơn La</span>
             <p className="text-sm font-light text-white/60 leading-relaxed">
               Phân phối đa dạng các phân khúc gạch ốp lát tại Sơn La
             </p>
          </div>
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-gold uppercase">Liên hệ</span>
             <p className="text-lg font-sans font-bold text-white leading-relaxed">
               0971.325.658
             </p>
             <p className="text-sm font-light text-white/40 italic">
               tangiahuy.nd@gmail.com
             </p>
          </div>
        </div>

        <div className="flex items-center space-x-12 mb-20">
           <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110"><Facebook className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110"><Instagram className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110"><Youtube className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110"><Mail className="w-6 h-6" /></Link>
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between w-full text-[10px] tracking-[0.3em] font-bold text-white/20 uppercase">
          <span>© 2024 TÂN GIA HUY — KIẾN TẠO KHÔNG GIAN SỐNG</span>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;