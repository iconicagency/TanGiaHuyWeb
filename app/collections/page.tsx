'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Play, ChevronRight, Search, Menu, Globe, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CollectionsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "CI VIC",
      subtitle: "Ba khái niệm, một tầm nhìn đẳng cấp",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "GIAO THOA",
      subtitle: "Bản sắc xúc giác của vật liệu",
      image: "https://images.unsplash.com/photo-1600607687940-47a04b629571?q=80&w=2070&auto=format&fit=crop",
    }
  ];

  const categories = [
    { name: "Cảm hứng Cẩm thạch", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" },
    { name: "Cảm hứng Gỗ tự nhiên", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" },
    { name: "Cảm hứng Đá tự nhiên", img: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?q=80&w=800&auto=format&fit=crop" },
    { name: "Bê tông & Kim loại", img: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800&auto=format&fit=crop" },
    { name: "Giải pháp Trang trí", img: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=800&auto=format&fit=crop" },
  ];

  const magazineItems = [
    {
      date: "28 Tháng 4 2026",
      title: '"Một thập kỷ thiết kế": 10 năm hành trình sáng tạo tại London',
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
    },
    {
      date: "01 Tháng 4 2026",
      title: 'Fuorisalone 2026: Ngôn ngữ của vật liệu giữa không gian triển lãm',
      img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=800&auto=format&fit=crop"
    },
    {
      date: "06 Tháng 3 2026",
      title: 'Sự tiến hóa của vật liệu: Tân Gia Huy tại triễn lãm Las Vegas',
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-brand-gold/30">
      <Navbar />

      {/* Hero Image (like Company page) */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Collections Hero"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="absolute bottom-20 left-6 md:left-24 bg-[#EBE9E4]/95 p-12 md:p-16 max-w-2xl shadow-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-sans font-bold tracking-tight uppercase leading-tight"
          >
            BỘ SƯU TẬP <br /> <span className="text-brand-gold">HÌNH ẢNH</span>
          </motion.h1>
        </div>
      </section>

      {/* Page Header / Breadcrumbs (like Company & Products page) */}
      <section className="bg-[#F8F7F5] py-12 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors font-sans">Home</Link>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-black underline underline-offset-4 font-sans">Collections</span>
        </div>
        <p className="text-gray-500 max-w-xl text-lg font-light italic mt-8">
          &quot;Cảm hứng, màu sắc và kích thước cho mọi phong cách thiết kế.&quot;
        </p>
      </section>

      {/* Explore our collections */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-4 tracking-tight uppercase">Khám phá bộ sưu tập</h2>
            <p className="text-gray-500 max-w-xl text-lg font-light italic">Cảm hứng, màu sắc và kích thước cho mọi phong cách thiết kế.</p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0">
            <button className="px-6 py-2 border border-gray-300 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-black transition-all group">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" /> Tìm kiếm sản phẩm
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-black transition-all">
              Tất cả bộ sưu tập <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="space-y-4 cursor-pointer group"
            >
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-center font-bold text-[13px] text-gray-800 tracking-tight group-hover:text-brand-gold transition-colors uppercase">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="px-6 md:px-12 lg:px-24 mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-4 tracking-tight uppercase">Các dòng tiêu biểu</h2>
          <p className="text-gray-500 max-w-xl text-lg font-light">Sản phẩm, xu hướng và cảm hứng được lựa chọn cho dự án tiếp theo của bạn.</p>
        </div>

        <div className="px-6 md:px-12 lg:px-24 grid md:grid-cols-2 gap-12">
          {/* Main card */}
          <div className="group cursor-pointer">
            <div className="aspect-[16/9] relative overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2070&auto=format&fit=crop"
                alt="Gạch phòng tắm"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-3xl font-sans font-bold mb-4 uppercase tracking-tighter">Kết nối không gian</h3>
            <button className="px-8 py-3 border border-gray-900 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              Khám phá thêm
            </button>
          </div>

          {/* Side card */}
          <div className="group cursor-pointer">
            <div className="aspect-[16/9] relative overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070&auto=format&fit=crop"
                alt="Phòng ảo"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-3xl font-sans font-bold mb-4 uppercase tracking-tighter">Phòng trải nghiệm ảo</h3>
            <button className="px-8 py-3 border border-gray-900 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              Trải nghiệm trong không gian của bạn
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-12 gap-4">
          <button className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-all">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Exploring Material Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-gray-900 mb-4 tracking-tighter uppercase">Nghiên cứu Vật liệu</h2>
        <p className="text-gray-500 mb-16 text-lg font-light">Một cuộc hành trình xuyên thấu bề mặt, nơi vật liệu bộc lộ chiều sâu qua nghiên cứu và thiết kế.</p>
        
        <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden group shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2070&auto=format&fit=crop"
            alt="Nghiên cứu vật liệu"
            fill
            className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-all group/play">
              <Play className="w-10 h-10 md:w-12 md:h-12 fill-white group-hover/play:scale-110 transition-transform ml-1" />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center gap-6 text-white text-[10px] font-bold tracking-widest bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex gap-4">
              <Play className="w-4 h-4" />
              <span>01:44</span>
            </div>
            <div className="flex-1 h-[2px] bg-white/20 relative">
              <div className="absolute top-0 left-0 w-1/3 h-full bg-white" />
            </div>
            <div className="flex gap-6">
              <Globe className="w-4 h-4" />
              <Search className="w-4 h-4" />
              <Menu className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#F8F8F8]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-4 tracking-tight uppercase">Từ chuyên mục tin tức</h2>
            <p className="text-gray-500 max-w-xl text-lg font-light">Những câu chuyện, ý tưởng và góc nhìn từ thế giới gốm sứ và thiết kế.</p>
          </div>
          <button className="px-6 py-2 border border-gray-300 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-black transition-all">
            Xem tất cả tin tức <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {magazineItems.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <p className="text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-widest">{item.date}</p>
                <h3 className="text-xl font-sans font-bold text-gray-900 mb-6 leading-tight line-clamp-3 min-h-[4.5rem] uppercase tracking-tighter">
                  {item.title}
                </h3>
                <button className="px-6 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                  Đọc thêm
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-4 tracking-tight uppercase">Giải pháp kiến trúc</h2>
          <p className="text-gray-500 max-w-xl text-lg font-light">Sự giao thao hoàn hảo giữa tính thẩm mỹ và công năng sử dụng.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="group cursor-pointer">
            <div className="aspect-[16/10] relative overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop"
                alt="Sàn ngoài trời"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-3xl font-sans font-bold mb-4 text-gray-900 uppercase tracking-tighter">Sàn ngoài trời</h3>
            <button className="px-8 py-3 border border-gray-900 rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
              Xem chi tiết
            </button>
          </div>

          <div className="group cursor-pointer">
            <div className="aspect-[16/10] relative overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
                alt="Giải pháp kỹ thuật"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-3xl font-sans font-bold mb-4 text-gray-900 uppercase tracking-tighter">Giải pháp kỹ thuật</h3>
            <button className="px-8 py-3 border border-gray-900 rounded-full text-[10px] font-extrabold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
              Xem chi tiết
            </button>
          </div>
        </div>
      </section>

      {/* Spaces that speak of Caesar */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#F0F0F0]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-4 tracking-tight uppercase">Không gian kiến trúc</h2>
            <p className="text-gray-500 max-w-xl text-lg font-light">Nơi kiến trúc quốc tế kể câu chuyện của vật liệu qua các công trình tiêu biểu.</p>
          </div>
          <button className="px-6 py-2 border border-gray-300 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-black transition-all">
            Tất cả dự án <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Biệt thự tư nhân", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
            { title: "Căn hộ cao cấp", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop" },
            { title: "Sân bay quốc tế King Shaka", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" }
          ].map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-[4/3] relative overflow-hidden rounded-[2rem] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-2xl font-sans font-bold text-gray-900 mb-4 uppercase tracking-tighter">{item.title}</h4>
              <button className="px-6 py-2 border border-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-widest group-hover:bg-gray-900 group-hover:text-white transition-all">
                Xem dự án
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions designed to bring... Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="grid grid-cols-2 gap-6 scale-90 lg:scale-100">
             <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden translate-y-12 shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop" alt="P1" fill className="object-cover" referrerPolicy="no-referrer" />
             </div>
             <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop" alt="P2" fill className="object-cover" referrerPolicy="no-referrer" />
             </div>
             <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden translate-y-12 shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" alt="P3" fill className="object-cover" referrerPolicy="no-referrer" />
             </div>
             <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1554034483-04cca0a3d7d4?q=80&w=800&auto=format&fit=crop" alt="P4" fill className="object-cover" referrerPolicy="no-referrer" />
             </div>
          </div>
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-sans font-bold text-gray-900 mb-8 tracking-tighter leading-[1.1] uppercase">
              Giải pháp khơi nguồn cảm hứng kiến trúc
            </h2>
            <p className="text-gray-500 mb-10 text-xl leading-relaxed font-light">
              Chúng tôi cung cấp những giải pháp vật liệu tối ưu để biến những ý tưởng táo bạo của bạn thành hiện thực rực rỡ.
            </p>
            <button className="px-10 py-4 bg-gray-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all shadow-xl">
              Khám phá cảm hứng
            </button>
          </div>
        </div>

        {/* Categories Detail Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-32">
          {[
            { title: "Gạch porcelain phòng tắm", desc: "Đảm bảo hiệu suất vượt trội và giá trị thẩm mỹ cao, dù là lát sàn, ốp tường hay các mục đích đặc biệt.", img: categories[0].img },
            { title: "Gạch porcelain phòng bếp", desc: "Sự kết hợp giữa chất lượng kỹ thuật và thiết kế tỉ mỉ để tạo nên không gian hiệu quả và đẹp mắt.", img: categories[1].img },
            { title: "Gạch porcelain hồ bơi", desc: "Tự do trong thiết kế với tất cả các đặc tính tiên tiến của gạch porcelain cao cấp.", img: categories[2].img },
            { title: "Không gian thương mại", desc: "Bề mặt quyến rũ và chất lượng kỹ thuật vượt trội cho các dự án thương mại và công cộng.", img: categories[3].img }
          ].map((cat, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-square relative rounded-[2rem] overflow-hidden mb-8 bg-gray-100 shadow-lg">
                <Image src={cat.img} alt={cat.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
              </div>
              <h5 className="text-lg font-sans font-bold mb-4 text-gray-900 uppercase tracking-tighter">{cat.title}</h5>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-8 min-h-[5rem] font-light">{cat.desc}</p>
              <button className="px-8 py-2 border border-gray-200 rounded-lg text-[10px] font-extrabold uppercase tracking-widest hover:border-black transition-all">
                Xem thêm
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#F8F8F8] border-t border-gray-200">
        <h2 className="text-3xl md:text-5xl font-sans font-bold mb-6 uppercase tracking-tight">Liên kết nhanh</h2>
        <p className="text-zinc-500 mb-16 text-lg max-w-2xl font-light italic">Truy cập nhanh vào các chuyên mục hữu ích nhất.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: "Tìm đại lý", desc: "Khám phá các đại lý Tân Gia Huy gần bạn nhất để trực tiếp trải nghiệm chất lượng sản phẩm." },
            { title: "Tài liệu", desc: "Truy cập nhanh hồ sơ kỹ thuật, catalogue, công cụ số và vật liệu hỗ trợ dự án của bạn." },
            { title: "Hướng dẫn kỹ thuật", desc: "Tham khảo thông tin kỹ thuật cần thiết để thiết kế, lắp đặt và bảo trì đúng quy chuẩn." },
            { title: "Đăng ký nhận tin", desc: "Cập nhật những tin tức, bộ sưu tập và xu hướng mới nhất từ thế giới Tân Gia Huy." }
          ].map((link, idx) => (
            <div key={idx} className="group cursor-pointer">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter">
                {link.title}
              </h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed mb-6 font-light">{link.desc}</p>
              <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">
                Xem ngay →
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CollectionsPage;
