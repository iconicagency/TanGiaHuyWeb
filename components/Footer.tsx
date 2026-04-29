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
        <h1 className="text-[25vw] font-serif tracking-tighter">EUROTILE</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[12px] tracking-[0.5em] font-medium opacity-60 uppercase mb-4">KIỆT TÁC GẠCH MEN</span>
          <h2 className="text-7xl md:text-9xl font-serif tracking-tighter">eurotile<span className="text-xl align-top">®</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-20">
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-red uppercase">Showroom Hà Nội</span>
             <p className="text-sm font-light text-white/60 leading-relaxed">
               Viglacera Tower, số 1 Đại lộ Thăng Long, Mễ Trì, Hà Nội
             </p>
          </div>
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-red uppercase">Showroom TP.HCM</span>
             <p className="text-sm font-light text-white/60 leading-relaxed">
               Số 270 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh
             </p>
          </div>
          <div className="flex flex-col space-y-4">
             <span className="text-[10px] tracking-[0.3em] font-bold text-brand-red uppercase">Liên hệ</span>
             <p className="text-lg font-serif italic text-white leading-relaxed">
               1900 1234
             </p>
             <p className="text-sm font-light text-white/40">
               info@eurotile.vn
             </p>
          </div>
        </div>

        <div className="flex items-center space-x-12 mb-20">
           <Link href="#" className="text-white/40 hover:text-brand-red transition-all transform hover:scale-110"><Facebook className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-red transition-all transform hover:scale-110"><Instagram className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-red transition-all transform hover:scale-110"><Youtube className="w-6 h-6" /></Link>
           <Link href="#" className="text-white/40 hover:text-brand-red transition-all transform hover:scale-110"><Mail className="w-6 h-6" /></Link>
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between w-full text-[10px] tracking-[0.3em] font-bold text-white/20 uppercase">
          <span>© 2026 EUROTILE — A VIGLACERA BRAND</span>
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