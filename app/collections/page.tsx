'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Play, ChevronRight, Search, Menu, Globe, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CollectionsPage = () => {
  const [content, setContent] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const [magazineSlideIndex, setMagazineSlideIndex] = useState(0);
  const [solutionSlideIndex, setSolutionSlideIndex] = useState(0);
  const [spaceSlideIndex, setSpaceSlideIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, 'cms', 'collections_page');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          setContent({
            hero_title: "BỘ SƯU TẬP",
            hero_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
            explore_title: "Explore our collections",
            explore_description: "Inspirations, colors, and sizes for every design vision.",
            research_title: "Nghiên cứu Vật liệu",
            research_description: "Một cuộc hành trình xuyên thấu bề mặt, nơi vật liệu bộc lộ chiều sâu qua nghiên cứu và thiết kế.",
            research_image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2070&auto=format&fit=crop"
          });
        }
      } catch (e) {
        console.error("Error fetching collections data:", e);
      }
    }
    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!content) return <div className="h-screen bg-white flex items-center justify-center font-serif text-2xl uppercase tracking-widest text-black">Loading...</div>;

  const featuredSlides = [
    {
      id: 1,
      title: "Connections",
      buttonText: "Discover more",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Virtual Room",
      buttonText: "Try Caesar tiles in your rooms",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Caesar Urban Lab London",
      buttonText: "Book visit",
      image: "https://www.caesar.it/assets/Uploads/_resampled/CroppedFocusedImageWyIxMDI0IiwiNTc2Il0/DSC-5646.jpg",
    }
  ];

  const solutionSlides = [
    {
      id: 1,
      title: "Sàn ngoài trời",
      buttonText: "Xem chi tiết",
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Giải pháp kỹ thuật",
      buttonText: "Xem chi tiết",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Mặt tiền thông gió",
      buttonText: "Xem chi tiết",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    }
  ];

  const nextSolutionSlide = () => {
    if (solutionSlideIndex < solutionSlides.length - 1) {
      setSolutionSlideIndex(prev => prev + 1);
    }
  };

  const prevSolutionSlide = () => {
    if (solutionSlideIndex > 0) {
      setSolutionSlideIndex(prev => prev - 1);
    }
  };

  const spaceItems = [
    { title: "BIỆT THỰ TƯ NHÂN", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
    { title: "CĂN HỘ CAO CẤP", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop" },
    { title: "SÂN BAY QUỐC TẾ KING SHAKA", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" },
    { title: "RESORT NGHỈ DƯỠNG", img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop" }
  ];

  const nextSpaceSlide = () => {
    const itemsPerView = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3;
    if (spaceSlideIndex < spaceItems.length - itemsPerView) {
      setSpaceSlideIndex(prev => prev + 1);
    }
  };

  const prevSpaceSlide = () => {
    if (spaceSlideIndex > 0) {
      setSpaceSlideIndex(prev => prev - 1);
    }
  };

  const nextFeaturedSlide = () => {
    if (featuredSlideIndex < featuredSlides.length - 1) {
      setFeaturedSlideIndex(prev => prev + 1);
    }
  };

  const prevFeaturedSlide = () => {
    if (featuredSlideIndex > 0) {
      setFeaturedSlideIndex(prev => prev - 1);
    }
  };

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
    { name: "Cảm hứng Đá tự nhiên", img: "https://images.unsplash.com/photo-1616484173745-0d23bc0451ae?auto=format&fit=crop&q=80&w=800" },
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
    },
    {
      date: "20 Tháng 2 2026",
      title: 'Tân Gia Huy giới thiệu bộ sưu tập gạch porcelain khổ lớn',
      img: "https://images.unsplash.com/photo-1600607687940-47a04b629571?q=80&w=800&auto=format&fit=crop"
    },
    {
      date: "15 Tháng 1 2026",
      title: 'Xu hướng vật liệu sinh thái trong kiến trúc hiện đại',
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const nextMagazineSlide = () => {
    const itemsPerView = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3;
    if (magazineSlideIndex < magazineItems.length - itemsPerView) {
      setMagazineSlideIndex(prev => prev + 1);
    }
  };

  const prevMagazineSlide = () => {
    if (magazineSlideIndex > 0) {
      setMagazineSlideIndex(prev => prev - 1);
    }
  };

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-brand-gold/30">
      <Navbar />

      {/* Hero Image (like Company page) */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src={content.hero_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}
          alt="Collections Hero"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="absolute inset-0 px-4 md:px-8 pointer-events-none flex flex-col justify-end pb-20">
          <div className="w-full mx-auto max-w-[1920px] pointer-events-auto text-left">
            <div className="bg-[#EBE9E4]/20 backdrop-blur-md py-5 px-10 md:py-8 md:px-16 max-w-2xl rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D5D3CE]/50 inline-block">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[39px] font-sans font-normal tracking-tight uppercase leading-tight text-black"
              >
                {content.hero_title}
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Page Header / Breadcrumbs (like Company & Products page) */}
      <section className="bg-[#F8F7F5] pt-12 pb-4 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-[15px] mb-4">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors font-sans font-light">Home</Link>
          <span className="text-gray-300 font-light">•</span>
          <span className="font-light text-black underline underline-offset-8 font-sans">Bộ sưu tập</span>
        </div>
      </section>

      {/* Explore our collections */}
      <section className="pb-16 px-6 md:px-12 lg:px-24 bg-[#F8F7F5]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-[40px] md:text-[56px] font-sans font-light text-black mb-2 tracking-tight leading-tight">{content.explore_title}</h2>
            <p className="text-[#404040] text-[20px] font-light font-sans">{content.explore_description}</p>
          </div>
          <div className="flex gap-3 mt-8 md:mt-0">
            <button className="px-5 py-2.5 bg-white border border-black rounded-md text-[14px] font-normal text-black flex items-center gap-2 hover:bg-black hover:text-white transition-all font-sans">
              Search Product <Search className="w-4 h-4 ml-1" />
            </button>
            <button className="px-5 py-2.5 bg-white border border-black rounded-md text-[14px] font-normal text-black flex items-center gap-2 hover:bg-black hover:text-white transition-all font-sans">
              All the collections <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href="/products">
              <motion.div 
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
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 relative overflow-hidden bg-[#F8F7F5]">
        {/* Diagonal background element */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-white [clip-path:polygon(0_0,100%_0,70%_100%,0_100%)] z-0 hidden md:block"></div>
        
        <div className="relative z-10 w-full">
          <div className="px-6 md:px-12 lg:px-24 mb-10 w-full md:w-1/2">
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-black mb-1 tracking-tight">Featured</h2>
            <p className="text-[#404040] text-[17px] font-normal font-sans">Products, trends, and news selected to inspire your next project.</p>
          </div>

          <div className="pl-6 md:pl-12 lg:pl-24 w-full mt-10 md:mt-8 overflow-hidden">
            <motion.div 
              className="md:ml-[33%] flex min-w-max pr-6"
              animate={{
                x: `calc(-${featuredSlideIndex * (windowWidth < 768 ? 85 : 35)}vw - ${featuredSlideIndex * 24}px)`
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {featuredSlides.map((slide, index) => {
                const isActive = index === featuredSlideIndex;
                return (
                  <motion.div 
                    key={slide.id}
                    className="flex-shrink-0 group cursor-pointer"
                    animate={{
                      width: isActive ? (windowWidth < 768 ? '85vw' : '55vw') : (windowWidth < 768 ? '85vw' : '35vw'),
                      marginRight: 24,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.div 
                      className="relative overflow-hidden rounded-[12px] mb-4 shadow-sm group-hover:shadow-md transition-shadow"
                      animate={{
                        aspectRatio: isActive ? 16/10 : (windowWidth < 768 ? 16/10 : 10/10),
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    <h3 className="text-[26px] font-sans font-normal mb-3 text-black">{slide.title}</h3>
                    <button className="px-5 py-2 bg-white border border-black rounded-md text-[14px] font-medium text-black hover:bg-black hover:text-white transition-all">
                      {slide.buttonText}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex justify-center mt-12 gap-4 relative z-10 w-full ml-0 md:ml-[15%]">
            <button 
              onClick={prevFeaturedSlide}
              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all ${
                featuredSlideIndex === 0 
                  ? 'border border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border border-gray-300 text-black hover:border-black cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button 
              onClick={nextFeaturedSlide}
              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all ${
                featuredSlideIndex === featuredSlides.length - 1 
                  ? 'border border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border border-gray-300 text-black hover:border-black cursor-pointer'
              }`}
            >
              <ArrowRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* Exploring Material Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-black mb-4 tracking-tighter uppercase">{content.research_title}</h2>
        <p className="text-gray-500 mb-16 text-lg font-light">{content.research_description}</p>
        
        <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden group shadow-2xl">
          <Image
            src={content.research_image || "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2070&auto=format&fit=crop"}
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
      <section className="py-20 bg-[#F8F8F8] relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24 mb-10 relative z-10 w-full">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-black mb-1 tracking-tight">Từ chuyên mục tin tức</h2>
            <p className="text-[#404040] text-[17px] font-normal font-sans">Những câu chuyện, ý tưởng và góc nhìn từ thế giới gốm sứ và thiết kế.</p>
          </div>
        </div>

        <div className="pl-6 md:pl-12 lg:pl-24 pr-6 w-full overflow-hidden relative z-10">
          <motion.div 
            className="flex min-w-max pr-6"
            animate={{
              x: `calc(-${magazineSlideIndex * (windowWidth < 768 ? 85 : windowWidth < 1024 ? 45 : 30)}vw - ${magazineSlideIndex * 24}px)`
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {magazineItems.map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex flex-col flex-shrink-0 relative group"
                style={{ 
                  width: windowWidth < 768 ? '85vw' : windowWidth < 1024 ? '45vw' : '30vw',
                  marginRight: 24 
                }}
              >
                <div className="aspect-[16/10] relative w-full overflow-hidden shrink-0 rounded-[12px] mb-4">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col flex-1 pl-1">
                  <div className="mb-2">
                    <p className="text-[#404040] text-[13px] font-normal font-sans">{item.date}</p>
                  </div>
                  <h3 className="text-[19px] font-sans font-normal text-black mb-5 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                    <Link href="/products" className="mt-auto">
                      <button className="px-5 py-2 bg-transparent border border-black rounded-md text-[14px] font-medium text-black hover:bg-black hover:text-white transition-all">
                        Read more
                      </button>
                    </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-12 relative z-10 w-full">
          <button 
            onClick={prevMagazineSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              magazineSlideIndex === 0 
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-gray-900 text-black hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={nextMagazineSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              magazineSlideIndex >= magazineItems.length - (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3)
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-gray-900 text-black hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <ArrowRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        {/* Diagonal background element */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F8F7F5] [clip-path:polygon(0_0,100%_0,70%_100%,0_100%)] z-0 hidden md:block"></div>
        
        <div className="relative z-10 w-full">
          <div className="px-6 md:px-12 lg:px-24 mb-10 w-full md:w-1/2">
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-black mb-1 tracking-tight">Giải pháp kiến trúc</h2>
            <p className="text-[#404040] text-[17px] font-normal font-sans">Sự giao thao hoàn hảo giữa tính thẩm mỹ và công năng sử dụng.</p>
          </div>

          <div className="pl-6 md:pl-12 lg:pl-24 w-full mt-10 md:mt-8 overflow-hidden">
            <motion.div 
              className="md:ml-[33%] flex min-w-max pr-6"
              animate={{
                x: `calc(-${solutionSlideIndex * (windowWidth < 768 ? 85 : 35)}vw - ${solutionSlideIndex * 24}px)`
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {solutionSlides.map((slide, index) => {
                const isActive = index === solutionSlideIndex;
                return (
                  <motion.div 
                    key={slide.id}
                    className="flex-shrink-0 group cursor-pointer"
                    animate={{
                      width: isActive ? (windowWidth < 768 ? '85vw' : '55vw') : (windowWidth < 768 ? '85vw' : '35vw'),
                      marginRight: 24,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.div 
                      className="relative overflow-hidden rounded-[12px] mb-4 shadow-sm group-hover:shadow-md transition-shadow"
                      animate={{
                        aspectRatio: isActive ? 16/10 : (windowWidth < 768 ? 16/10 : 10/10),
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                    <h3 className="text-[26px] font-sans font-normal mb-3 text-black">{slide.title}</h3>
                    <button className="px-5 py-2 bg-white border border-black rounded-md text-[14px] font-medium text-black hover:bg-black hover:text-white transition-all">
                      {slide.buttonText}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex justify-center mt-12 gap-4 relative z-10 w-full ml-0 md:ml-[15%]">
            <button 
              onClick={prevSolutionSlide}
              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all ${
                solutionSlideIndex === 0 
                  ? 'border border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border border-gray-300 text-black hover:border-black cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button 
              onClick={nextSolutionSlide}
              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all ${
                solutionSlideIndex === solutionSlides.length - 1 
                  ? 'border border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border border-gray-300 text-black hover:border-black cursor-pointer'
              }`}
            >
              <ArrowRight className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* Spaces that speak of Caesar */}
      <section className="py-20 bg-[#F0F0F0] relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24 mb-10 relative z-10 w-full flex justify-between items-end">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-black mb-1 tracking-tight">Không gian kiến trúc</h2>
            <p className="text-[#404040] text-[17px] font-normal font-sans">Nơi kiến trúc quốc tế kể câu chuyện của vật liệu qua các công trình tiêu biểu.</p>
          </div>
          <button className="hidden md:flex px-6 py-2 border border-gray-300 rounded-full text-[10px] font-bold uppercase tracking-widest items-center gap-2 hover:border-black transition-all">
            Tất cả dự án <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pl-6 md:pl-12 lg:pl-24 pr-6 w-full overflow-hidden relative z-10">
          <motion.div 
            className="flex min-w-max pr-6"
            animate={{
              x: `calc(-${spaceSlideIndex * (windowWidth < 768 ? 85 : windowWidth < 1024 ? 45 : 30)}vw - ${spaceSlideIndex * 24}px)`
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {spaceItems.map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex flex-col flex-shrink-0 relative group"
                style={{ 
                  width: windowWidth < 768 ? '85vw' : windowWidth < 1024 ? '45vw' : '30vw',
                  marginRight: 24 
                }}
              >
                <div className="aspect-[4/3] relative w-full overflow-hidden shrink-0 rounded-[2rem] mb-6">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col flex-1 pl-1">
                  <h4 className="text-[19px] font-sans font-bold text-black mb-5 leading-snug uppercase tracking-tight">
                    {item.title}
                  </h4>
                  <div className="mt-auto flex">
                    <button className="px-6 py-2 bg-black border border-black rounded-md text-[12px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                      Xem dự án
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-12 relative z-10 w-full">
          <button 
            onClick={prevSpaceSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              spaceSlideIndex === 0 
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-gray-900 text-black hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={nextSpaceSlide}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              spaceSlideIndex >= spaceItems.length - (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 3)
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-gray-900 text-black hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <ArrowRight className="w-5 h-5 stroke-[1.5]" />
          </button>
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
            <h2 className="text-4xl md:text-6xl font-sans font-bold text-black mb-8 tracking-tighter leading-[1.1] uppercase">
              Giải pháp khơi nguồn cảm hứng kiến trúc
            </h2>
            <p className="text-gray-500 mb-10 text-xl leading-relaxed font-light">
              Chúng tôi cung cấp những giải pháp vật liệu tối ưu để biến những ý tưởng táo bạo của bạn thành hiện thực rực rỡ.
            </p>
            <button className="px-6 py-2.5 border border-black rounded-md text-[15px] font-sans font-medium text-black hover:bg-black hover:text-white transition-all">
              Khám phá cảm hứng
            </button>
          </div>
        </div>

        {/* Categories Detail Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 items-start">
          {[
            { title: "Gạch porcelain phòng tắm", desc: "Đảm bảo hiệu suất vượt trội và giá trị thẩm mỹ cao, dù là lát sàn, ốp tường hay các mục đích đặc biệt.", img: categories[0].img },
            { title: "Gạch porcelain phòng bếp", desc: "Sự kết hợp giữa chất lượng kỹ thuật và thiết kế tỉ mỉ để tạo nên không gian hiệu quả và đẹp mắt.", img: categories[1].img },
            { title: "Gạch porcelain hồ bơi", desc: "Tự do trong thiết kế với tất cả các đặc tính tiên tiến của gạch porcelain cao cấp.", img: categories[2].img },
            { title: "Không gian thương mại", desc: "Bề mặt quyến rũ và chất lượng kỹ thuật vượt trội cho các dự án thương mại và công cộng.", img: categories[3].img }
          ].map((cat, idx) => (
            <div key={idx} className="bg-white rounded-[12px] overflow-hidden border border-gray-200 flex flex-col group transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1">
              <div className="aspect-[16/10] relative w-full overflow-hidden shrink-0">
                <Image src={cat.img} alt={cat.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6 md:p-8 flex flex-col items-center text-center">
                <h5 className="text-[19px] font-sans font-normal mb-3 text-black tracking-tight">{cat.title}</h5>
                <p className="text-[#404040] text-[15px] leading-relaxed font-sans font-normal">{cat.desc}</p>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out w-full">
                  <div className="overflow-hidden w-full flex justify-center">
                    <div className="pt-6">
                      <Link href="/products">
                        <button className="px-6 py-2 border border-black rounded-md text-[14px] font-sans font-medium text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 duration-300">
                          Read more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CollectionsPage;
