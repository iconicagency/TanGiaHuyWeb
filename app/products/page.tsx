'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronRight, Grid, List, Plus, Minus, ArrowUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FilterAccordion = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 hover:bg-gray-50/20 transition-colors">
      <button 
        onClick={onToggle}
        className="w-full py-6 flex justify-between items-center text-left group px-2"
      >
        <span className="text-[14px] font-bold tracking-tight text-gray-800 uppercase">{title}</span>
        <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-gray-100' : 'bg-transparent'}`}>
          {isOpen ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-8 space-y-4 px-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSwitch = ({ label, count, active, onToggle }: { label: string; count: number; active: boolean; onToggle: () => void }) => (
  <div className="flex items-center justify-between group/switch cursor-pointer" onClick={onToggle}>
    <div className="flex items-center gap-4">
      <div className={`relative w-[42px] h-[24px] rounded-full transition-colors duration-300 ${active ? 'bg-brand-gold' : 'bg-[#E5E7EB]'}`}>
        <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full transition-transform duration-300 shadow-md ${active ? 'translate-x-[18px]' : 'translate-x-0'}`} />
      </div>
      <span className={`text-[15px] font-medium tracking-tight transition-colors ${active ? 'text-black' : 'text-gray-600'}`}>{label}</span>
    </div>
    <div className="min-w-[32px] h-[20px] flex items-center justify-center rounded-full border border-gray-200 px-1.5 text-[10px] font-bold text-gray-400 bg-gray-50/50">
      {count}
    </div>
  </div>
);

const ProductCard = ({ name, specs, image }: { name: string; specs: string; image: string }) => (
  <Link href={`/san-pham/${encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))}`} className="block group cursor-pointer">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-[#F0F0F0] mb-5 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      <h3 className="text-[16px] font-bold text-black mb-1 group-hover:text-brand-gold transition-colors tracking-tight">{name}</h3>
      <p className="text-[12px] text-gray-500 font-light leading-relaxed">{specs}</p>
    </motion.div>
  </Link>
);

const ProductsPage = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [openCategory, setOpenCategory] = useState<string | null>("Loại hình ứng dụng");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categoriesData = [
    {
      title: "Gạch",
      options: [
        { label: "Gạch lát nền", count: 420 },
        { label: "Gạch ốp tường", count: 310 },
        { label: "Gạch trang trí", count: 150 },
        { label: "Gạch vân gỗ", count: 100 }
      ]
    },
    {
      title: "Ngói lợp",
      options: [
        { label: "Ngói tráng men", count: 45 },
        { label: "Ngói đất nung", count: 30 }
      ]
    },
    {
      title: "Thiết bị phòng bếp",
      options: [
        { label: "Bếp từ", count: 85 },
        { label: "Chậu rửa bát", count: 120 },
        { label: "Máy hút mùi", count: 65 },
        { label: "Vòi rửa bát", count: 90 }
      ]
    },
    {
      title: "Thiết bị phòng tắm",
      options: [
        { label: "Bồn cầu", count: 110 },
        { label: "Bồn tắm", count: 40 },
        { label: "Chậu lavabo", count: 150 },
        { label: "Nội thất và phụ kiện", count: 200 },
        { label: "Sen tắm", count: 130 },
        { label: "Vòi lavabo", count: 140 }
      ]
    },
    {
      title: "Thương Hiệu",
      options: [
        { label: "Amalif", count: 50 },
        { label: "Beuer", count: 35 },
        { label: "Caesar", count: 180 },
        { label: "D&K", count: 95 },
        { label: "Koenl", count: 40 },
        { label: "Monalisa", count: 120 },
        { label: "Toto", count: 210 },
        { label: "Viglacera", count: 190 },
        { label: "Vitto", count: 110 }
      ]
    }
  ];

  const products = [
    { name: "Alchemy Argent", specs: "40×80, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1616484173745-0d23bc0451ae?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Argent", specs: "80×80, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Argent", specs: "120×120, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Argent", specs: "60×120, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Copper", specs: "40×80, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Copper", specs: "80×80, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Copper", specs: "120×120, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800" },
    { name: "Alchemy Copper", specs: "120×278, 6mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800" },
    { name: "Join Platinum", specs: "60x120, 9mm, Silk, RT, R9 A", image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=800" },
    { name: "Join Platinum", specs: "80x80, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800" },
    { name: "Wide Vento", specs: "120x278, 6mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" },
    { name: "Wide Vento", specs: "120x120, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1600566753190-17f0abc2a6c4?auto=format&fit=crop&q=80&w=800" },
    { name: "Anima Graphite", specs: "60x60, 9mm, Matt, RT, R10 B", image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=800" },
    { name: "Anima Graphite", specs: "30x60, 9mm, Matt, RT, R10 B", image: "https://images.unsplash.com/photo-1518481612222-68bbe828eba1?auto=format&fit=crop&q=80&w=800" },
    { name: "Icon Bone", specs: "60x120, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&q=80&w=800" },
    { name: "Icon Bone", specs: "60x60, 9mm, Matt, RT, R9 A", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-brand-gold/30">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920"
          alt="Products Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 px-6 md:px-12 lg:px-24 pointer-events-none flex flex-col justify-end pb-24 lg:pb-32">
          <div className="w-full mx-auto max-w-[1920px] pointer-events-auto text-left">
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="bg-[#F8F7F5] pt-12 pb-4 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-[15px] mb-8">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors font-sans font-light">Home</Link>
          <span className="text-gray-300 font-light">•</span>
          <span className="font-light text-black underline underline-offset-8 font-sans">Danh sách sản phẩm</span>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[39px] font-sans font-bold tracking-tight uppercase leading-tight text-black mb-8"
        >
          DANH SÁCH <span className="text-brand-gold">SẢN PHẨM</span>
        </motion.h1>
      </section>

      <div className="px-6 md:px-12 lg:px-24 pb-24 bg-[#F8F7F5]">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-0">
              {categoriesData.map((category) => (
                <FilterAccordion 
                  key={category.title}
                  title={category.title}
                  isOpen={openCategory === category.title}
                  onToggle={() => setOpenCategory(openCategory === category.title ? null : category.title)}
                >
                  {category.options.map((opt) => (
                    <FilterSwitch 
                      key={opt.label}
                      label={opt.label}
                      count={opt.count}
                      active={!!activeFilters[`${category.title}-${opt.label}`]}
                      onToggle={() => toggleFilter(`${category.title}-${opt.label}`)}
                    />
                  ))}
                </FilterAccordion>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Toolbar */}
            <div className="space-y-6 mb-12">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                <input 
                  type="text" 
                  placeholder="Hôm nay bạn đang tìm kiếm gì?"
                  className="w-full py-4 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-gold/30 focus:bg-white transition-all text-sm font-light"
                />
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div className="flex gap-2 items-center">
                   <select className="bg-transparent text-sm font-bold uppercase tracking-widest outline-none cursor-pointer text-black hover:opacity-70 transition-all">
                     <option>Sắp xếp mặc định</option>
                     <option>Mới nhất</option>
                     <option>Phổ biến nhất</option>
                   </select>
                   <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-8">
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                    Tìm thấy <span className="text-black">1.180</span> kết quả
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => setLayout('grid')} className={`transition-colors ${layout === 'grid' ? 'text-black' : 'text-gray-300'}`}>
                      <Grid className="w-5 h-5" />
                    </button>
                    <button onClick={() => setLayout('list')} className={`transition-colors ${layout === 'list' ? 'text-black' : 'text-gray-300'}`}>
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid gap-x-8 gap-y-16 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {products.map((p, idx) => (
                <ProductCard key={idx} {...p} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-24 flex justify-center gap-4">
               {[1, 2, 3, '...', 12].map((num, i) => (
                 <button key={i} className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-sm font-bold transition-all hover:border-brand-gold ${num === 1 ? 'bg-black text-white border-black' : 'text-gray-400 hover:text-black'}`}>
                   {num}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductsPage;
