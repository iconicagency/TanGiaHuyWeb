'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Home, Menu, X, Plus, LayoutGrid, SlidersHorizontal, Globe, ChevronDown, User, AlignRight, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<any[]>([
    { name: 'TRANG CHỦ', href: '/', desc: 'Kiến tạo không gian sống' },
    { name: 'VỀ TÂN GIA HUY', href: '/ve-tan-gia-huy', desc: 'Hành trình và sứ mệnh' },
    { name: 'SẢN PHẨM', href: '/products', desc: 'Tinh hoa vật liệu cao cấp' },
    { name: 'BỘ SƯU TẬP', href: '/collections', desc: 'Đẳng cấp và khác biệt' },
    { name: 'TIN TỨC', href: '/', desc: 'Cập nhật xu hướng mới nhất' },
    { name: 'LIÊN HỆ', href: '/contact', desc: 'Kết nối cùng chúng tôi' },
  ]);

  useEffect(() => {
    const unsubLogo = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      }
    });

    const unsubNav = onSnapshot(doc(db, 'settings', 'navigation'), (snap) => {
      if (snap.exists() && snap.data().links) {
        setNavLinks(snap.data().links);
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      unsubLogo();
      unsubNav();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (link: { name: string; href: string }, idx: number) => {
    setIsMenuOpen(false);
    if (link.href.startsWith('/')) {
      router.push(link.href);
    } else {
      window.dispatchEvent(new CustomEvent('scrollToSection', { detail: idx }));
    }
  };

  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[60] px-4 md:px-8 transition-all duration-500 pointer-events-none",
        scrolled ? "py-4 md:py-6" : "py-4 md:py-6"
      )}>
        <nav className="pointer-events-auto w-full mx-auto max-w-[1920px] bg-white/60 backdrop-blur-md rounded-lg flex items-center justify-between px-6 py-2 md:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-black transition-all duration-500 border border-[#D5D3CE]/50 overflow-hidden">
          
          {/* Left Section: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col items-start justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-[45px] md:h-[60px] w-auto object-contain mix-blend-multiply origin-left ml-[8px] md:ml-[16px]" />
              ) : (
                <div className="text-left flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-serif tracking-tight leading-none text-black flex items-center gap-1">
                    <span className="text-[16px]">✦</span>
                    TÂN GIA HUY
                    <span className="text-[16px]">✦</span>
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Center Section: Desktop Links */}
          <div className="hidden xl:flex flex-1 items-center justify-end space-x-6 2xl:space-x-10 pr-10">
            {navLinks.map((link, idx) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link, idx)}
                className="text-[15px] 2xl:text-[16px] font-bold hover:text-[#C5A059] transition-colors whitespace-nowrap text-black tracking-wider uppercase"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Section: Hamburger Menu */}
          <div className="flex items-center pl-2">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="text-black hover:text-[#C5A059] transition-colors"
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
                  className="w-10 h-10 bg-black rounded flex items-center justify-center text-white hover:bg-[#C5A059] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col flex-1 mt-4 overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <button 
                    key={link.name}
                    onClick={() => handleNavClick(link, idx)}
                    className="flex justify-between items-center px-8 py-6 border-b border-gray-100 w-full text-left hover:bg-gray-50 group transition-colors"
                  >
                    <span className="text-[17px] font-bold text-black group-hover:text-[#C5A059] transition-colors">
                      {link.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059] -rotate-90 transition-colors" />
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
