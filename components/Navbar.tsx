'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Home, Menu, X, Plus, LayoutGrid, SlidersHorizontal, Globe, ChevronDown, User, AlignRight, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
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
        <nav className="pointer-events-auto w-full mx-auto max-w-[1920px] bg-[#EBE9E4]/20 backdrop-blur-md rounded-lg flex items-center justify-between pl-2 pr-6 py-1 md:py-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-[#1A1A1A] transition-all duration-500 border border-[#D5D3CE]/50 overflow-hidden">
          
          {/* Left Section: Logo */}
          <div className="flex-shrink-0 flex items-center pr-8">
            <Link href="/" className="flex flex-col items-start justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-[50px] md:h-[70px] w-auto object-contain mix-blend-multiply scale-[1.3] md:scale-[1.4] origin-left ml-2" />
              ) : (
                <div className="text-left flex flex-col items-center">
                  <span className="text-3xl md:text-5xl font-serif tracking-tight leading-none text-[#1A1A1A] flex items-center gap-1">
                    <span className="text-[20px]">✦</span>
                    TÂN GIA HUY
                    <span className="text-[20px]">✦</span>
                  </span>
                  <span className="text-[9px] md:text-[11px] tracking-[0.3em] font-medium opacity-70 uppercase block mt-1">
                    VẬT LIỆU CAO CẤP
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Center Section: Desktop Links */}
          <div className="hidden xl:flex flex-1 items-center justify-end space-x-6 2xl:space-x-10 pr-6">
            {navLinks.map((link, idx) => (
              <button
                key={link.name}
                onClick={() => window.dispatchEvent(new CustomEvent('scrollToSection', { detail: idx }))}
                className="text-[14px] 2xl:text-[15px] font-medium hover:text-[#555] transition-colors whitespace-nowrap text-[#1A1A1A] tracking-wide"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Section: Hamburger Menu */}
          <div className="flex items-center border-l border-[#1A1A1A]/10 pl-6 h-8">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-[#1A1A1A] hover:text-[#555] transition-colors"
            >
              <AlignRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-[400px] max-w-[100vw] bg-white text-black shadow-2xl flex flex-col"
            >
              {/* Close Header */}
              <div className="flex justify-end p-4">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 bg-[#1e1e1e] rounded flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col flex-1 mt-4 overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <button 
                    key={link.name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('scrollToSection', { detail: idx }));
                    }}
                    className="flex justify-between items-center px-8 py-5 border-b border-gray-100 w-full text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[15px] font-medium text-[#1e1e1e]">
                      {link.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90" />
                  </button>
                ))}
              </div>

              {/* Social Foot */}
              <div className="px-8 py-10 flex space-x-6 text-[#1e1e1e]">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-black hover:opacity-75 transition-all" />
                <Instagram className="w-5 h-5 cursor-pointer hover:text-black hover:opacity-75 transition-all" />
                <Youtube className="w-5 h-5 cursor-pointer hover:text-black hover:opacity-75 transition-all" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-black hover:opacity-75 transition-all" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-black hover:opacity-75 transition-all" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
