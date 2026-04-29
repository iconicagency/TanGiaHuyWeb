'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Home, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      }
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { name: 'Tổng quan về Tân Gia Huy', href: '#' },
    { name: 'Tin tức và Sự kiện', href: '#' },
    { name: 'Sản phẩm', href: '#' },
    { name: 'Phối cảnh 360', href: '#' },
    { name: 'Thư viện', href: '#' },
    { name: 'Liên hệ', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between pointer-events-none">
      {/* Logo */}
      <div className="flex flex-col pointer-events-auto text-white">
        <Link href="/" className="group">
          {logoUrl ? (
            <div className="h-12 md:h-16 w-auto flex items-center">
              <img src={logoUrl} alt="Logo" className="h-full w-auto object-contain" />
            </div>
          ) : (
            <>
              <span className="text-[10px] tracking-[0.3em] font-medium opacity-80 uppercase font-sans">VẬT LIỆU HOÀN THIỆN CAO CẤP</span>
              <div className="text-4xl font-sans font-bold tracking-tighter leading-none mt-1 uppercase">
                tân gia huy
              </div>
            </>
          )}
        </Link>
      </div>

      {/* Main Nav Items */}
      <div className="hidden xl:flex items-center space-x-6 pointer-events-auto bg-black/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-white">
        <button className="w-8 h-8 flex items-center justify-center bg-brand-gold rounded-full text-white hover:scale-110 transition-transform">
          <Home className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/20 mx-2" />
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[16px] font-light leading-[22px] hover:text-brand-gold transition-all whitespace-nowrap font-sans"
          >
            {link.name}
          </Link>
        ))}
        <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
          <button className="hover:text-brand-gold transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-[10px] font-bold tracking-widest hover:text-brand-gold transition-colors">
            EN
          </button>
        </div>
      </div>

      {/* Placeholder for spacing */}
      <div className="w-24 hidden xl:block" />
      
      {/* Sound Toggle (Bottom Right in original, but putting here for visibility in simpler layout) */}
      <button className="fixed bottom-8 right-8 w-10 h-10 flex items-center justify-center bg-brand-gold/20 border border-brand-gold/40 rounded-full text-white pointer-events-auto hover:bg-brand-gold transition-all">
        <Volume2 className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Navbar;
