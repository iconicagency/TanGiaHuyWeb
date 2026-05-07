'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Home, Menu, X, Plus, LayoutGrid, SlidersHorizontal, Globe, ChevronDown, User, AlignRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'TRANG CHỦ', href: '#hero', desc: 'Kiến tạo không gian sống' },
    { name: 'VỀ TÂN GIA HUY', href: '#about', desc: 'Hành trình và sứ mệnh' },
    { name: 'SẢN PHẨM', href: '#products', desc: 'Tinh hoa vật liệu cao cấp' },
    { name: 'BỘ SƯU TẬP', href: '#collections', desc: 'Đẳng cấp và khác biệt' },
    { name: 'TIN TỨC', href: '#news', desc: 'Cập nhật xu hướng mới nhất' },
    { name: 'LIÊN HỆ', href: '#contact', desc: 'Kết nối cùng chúng tôi' },
  ];

  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[60] px-4 md:px-8 transition-all duration-500 pointer-events-none",
        scrolled ? "py-4 md:py-6" : "py-4 md:py-6"
      )}>
        <nav className="pointer-events-auto w-full mx-auto max-w-[1920px] bg-[#EBE9E4]/95 backdrop-blur-xl rounded-lg flex items-center justify-between px-6 py-2 md:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-[#1A1A1A] transition-all duration-500 border border-[#D5D3CE]/50">
          
          {/* Left Section: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col items-start justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 md:h-14 w-auto object-contain mix-blend-multiply" />
              ) : (
                <div className="text-left flex flex-col items-center">
                  <span className="text-2xl md:text-4xl font-serif tracking-tight leading-none text-[#1A1A1A] flex items-center gap-1">
                    <span className="text-[16px]">✦</span>
                    TÂN GIA HUY
                    <span className="text-[16px]">✦</span>
                  </span>
                  <span className="text-[8px] md:text-[10px] tracking-[0.3em] font-medium opacity-70 uppercase block mt-1">
                    VẬT LIỆU CAO CẤP
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Center Section: Desktop Links */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <button
                key={link.name}
                onClick={() => window.dispatchEvent(new CustomEvent('scrollToSection', { detail: idx }))}
                className="text-[15px] font-sans hover:text-[#555] transition-colors whitespace-nowrap text-[#1A1A1A]"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Section: Actions & Settings */}
          <div className="hidden xl:flex items-center h-full">
            <div className="flex items-center space-x-6 text-[#1A1A1A]">
              <button className="flex items-center space-x-1 hover:text-[#555] transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-[14px] font-medium min-w-[20px]">EN</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-8 bg-[#1A1A1A]/10 mx-6"></div>
            
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="hover:text-[#555] transition-colors"
            >
              <AlignRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="xl:hidden flex items-center space-x-4">
            <button className="text-[#1A1A1A] hover:text-[#555] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#1A1A1A] hover:text-[#555] transition-colors"
            >
              <AlignRight className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay Remains for Mobile Experience */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            className="fixed inset-0 z-[70] bg-[#0a0a0a] text-white flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[80] group flex items-center space-x-3"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
              <div className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </button>

            {/* Left Section: Visual/Logo */}
            <div className="w-full md:w-[40%] h-[30vh] md:h-full bg-zinc-900/50 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
              <div className="flex flex-col items-center md:items-start space-y-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-12 md:h-20 w-auto object-contain" />
                ) : (
                  <div>
                    <span className="text-[10px] tracking-[0.3em] font-medium opacity-80 uppercase block">VẬT LIỆU CAO CẤP</span>
                    <span className="text-3xl md:text-5xl font-sans font-black tracking-tighter leading-none uppercase">
                      tân gia huy
                    </span>
                  </div>
                )}
                <p className="text-zinc-500 text-xs md:text-sm font-light tracking-wide max-w-xs text-center md:text-left">
                  Showroom Gạch Ốp Lát Khổ Lớn - Vật Liệu Hoàn Thiện Cao Cấp Tân Gia Huy.
                </p>
              </div>

              <div className="hidden md:flex flex-col space-y-2 opacity-40 text-[10px] font-bold tracking-widest uppercase">
                <p>Hotline: 0912 345 678</p>
                <p>Email: contact@tangiahuy.vn</p>
                <p>© 2024 Tân Gia Huy</p>
              </div>
            </div>

            {/* Right Section: Navigation Links */}
            <div className="flex-1 h-full p-10 md:p-20 flex flex-col justify-center bg-black">
              <div className="space-y-6 md:space-y-10">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.dispatchEvent(new CustomEvent('scrollToSection', { detail: idx }));
                      }}
                      className="group flex items-baseline space-x-6 hover:text-brand-gold transition-colors text-left w-full"
                    >
                      <span className="text-[10px] md:text-xs font-mono opacity-30 group-hover:opacity-100 transition-opacity">
                        0{idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-3xl md:text-6xl font-sans font-black tracking-tighter uppercase leading-none">
                          {link.name}
                        </span>
                        <span className="text-[10px] md:text-xs font-light tracking-[0.2em] opacity-40 uppercase mt-2 hidden md:block">
                          {link.desc}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 md:w-8 md:h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all ml-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Social Links on Mobile */}
              <div className="md:hidden mt-20 flex space-x-6 text-[10px] font-bold tracking-widest uppercase opacity-40">
                <span>FB</span>
                <span>IG</span>
                <span>YT</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
