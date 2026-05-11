'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Facebook, Instagram, Linkedin, Send, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const [footerData, setFooterData] = useState<any>(null);
  const [quickLinkIndex, setQuickLinkIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const docRef = doc(db, 'settings', 'footer');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFooterData(docSnap.data());
        }
      } catch (e) {
        console.error("Error fetching footer data:", e);
      }
    }
    fetchFooter();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickLinks = [
    { title: "Tìm đại lý", desc: "Khám phá đại lý Tân Gia Huy gần bạn nhất và trực tiếp trải nghiệm chất lượng bề mặt của chúng tôi." },
    { title: "Tài liệu", desc: "Truy cập nhanh hồ sơ kỹ thuật, catalogue, công cụ số và vật liệu hỗ trợ dự án của bạn." },
    { title: "Hướng dẫn kỹ thuật", desc: "Tham khảo tài liệu hướng dẫn kỹ thuật cần thiết để thiết kế, lắp đặt và bảo trì đúng quy chuẩn." },
    { title: "Đăng ký nhận tin", desc: "Cập nhật những tin tức, bộ sưu tập và xu hướng mới nhất từ thế giới Tân Gia Huy. Đăng ký để nhận cảm hứng trực tiếp qua hộp thư của bạn." }
  ];

  const nextQuickLink = () => {
    const itemsPerView = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4;
    if (quickLinkIndex < quickLinks.length - itemsPerView) {
      setQuickLinkIndex(prev => prev + 1);
    }
  };

  const prevQuickLink = () => {
    if (quickLinkIndex > 0) {
      setQuickLinkIndex(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Quick Links Section */}
      <section className="py-20 bg-[#F8F7F5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#F3F2F0] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)] z-0 hidden lg:block" />
        
        <div className="px-6 md:px-12 lg:px-24 mb-10 relative z-10 w-full">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-black mb-2 tracking-tight">Liên kết nhanh</h2>
            <p className="text-[#404040] text-[17px] font-normal font-sans">Truy cập nhanh vào một số chuyên mục hữu ích nhất của trang web.</p>
          </div>
        </div>

        <div className="pl-6 md:pl-12 lg:pl-24 pr-6 w-full overflow-hidden relative z-10 pb-8">
          <motion.div 
            className="flex min-w-max pr-6"
            animate={{
              x: `calc(-${quickLinkIndex * (windowWidth < 768 ? 85 : windowWidth < 1024 ? 45 : 22.5)}vw - ${quickLinkIndex * 24}px)`
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {quickLinks.map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-white rounded-[12px] border border-gray-200 flex flex-col flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow p-8"
                style={{ 
                  width: windowWidth < 768 ? '85vw' : windowWidth < 1024 ? '45vw' : '22.5vw',
                  marginRight: 24 
                }}
              >
                <h3 className="text-[19px] font-sans font-normal text-black mb-4">
                  {item.title}
                </h3>
                <p className="text-[#404040] text-[15px] font-normal font-sans leading-relaxed mb-10 flex-1">
                  {item.desc}
                </p>
                <div className="text-[15px] font-medium text-black flex items-center group">
                  Xem <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8 relative z-10 w-full">
          <button 
            onClick={prevQuickLink}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              quickLinkIndex === 0 
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-black text-black hover:bg-black hover:text-white cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={nextQuickLink}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              quickLinkIndex >= quickLinks.length - (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4)
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-black text-black hover:bg-black hover:text-white cursor-pointer'
            }`}
          >
            <ArrowRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </section>

      {/* Dark Footer Section */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-6 px-6 md:px-12 lg:px-24 border-t-4 border-black relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 border-b border-gray-800 pb-12 mb-8">
            {footerData?.locations?.map((loc: any, i: number) => (
              <div key={loc.id || i}>
                <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center">
                  <span className="h-[1px] w-8 bg-gray-500 mr-2"></span>
                  {loc.type || "OFFICE"}
                </h4>
                <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                  <p className="font-bold text-white mb-2 text-[14px]">{loc.name}</p>
                  <p>{loc.address}</p>
                  <p>{loc.city}</p>
                  <p>{loc.country}</p>
                  <p className="mt-2">Tel: {loc.phone}</p>
                </div>
              </div>
            )) || (
              <>
                <div>
                  <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center">
                    <span className="h-[1px] w-8 bg-gray-500 mr-2"></span>
                    HEADQUARTERS
                  </h4>
                  <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                    <p className="font-bold text-white mb-2 text-[14px]">Ceramiche Tân Gia Huy</p>
                    <p>Via del Canaletto, 49, 41042</p>
                    <p>Fiorano Modenese MO</p>
                    <p>Italia</p>
                    <p className="mt-2">Tel: +39 0536 817111</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center opacity-0 h-4">
                    <span className="h-[1px] w-8 bg-gray-500 mr-2"></span>
                    SPACER
                  </h4>
                  <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                    <p className="font-bold text-white mb-2 text-[14px]">Tân Gia Huy USA, INC.</p>
                    <p>500 Wilson Pike Cir, 37027</p>
                    <p>Brentwood TN</p>
                    <p>USA</p>
                    <p className="mt-2">Tel: +1 (615) 986-1500</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-800 pb-8 mb-6">
            <div className="flex flex-col gap-1">
              {footerData?.logo ? (
                <div className="relative h-12 w-48">
                  <Image src={footerData.logo} alt="Logo" fill className="object-contain object-left" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-serif font-medium tracking-widest uppercase mb-1">
                    Tân Gia Huy<span className="text-xl align-top">&bull;</span>
                  </div>
                  <div className="text-[10px] tracking-widest text-[#A3A3A3] font-sans text-white">CERAMICHE</div>
                </>
              )}
            </div>
            
            <div className="text-[13px] text-[#A3A3A3] font-sans font-medium md:mr-auto md:ml-12 max-w-sm">
              <p className="font-bold text-white mb-1">{footerData?.description || "Ceramiche Tân Gia Huy S.p.A."}</p>
              <p>{footerData?.copyright || "Fiscal Code and VAT Code: P.iva: IT00179660360"}</p>
            </div>

            <div className="flex gap-4">
              {footerData?.socials?.map((social: any, i: number) => {
                const Icon = {
                  facebook: Facebook,
                  instagram: Instagram,
                  linkedin: Linkedin,
                  youtube: Youtube,
                  twitter: Send
                }[social.platform.toLowerCase()] || Send;

                return (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-sans font-medium text-[#A3A3A3]">
            <Link href="#" className="hover:text-white transition-colors">Contacts</Link>
            <Link href="#" className="hover:text-white transition-colors">General sales conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Legal notes</Link>
            <Link href="#" className="hover:text-white transition-colors">Group Policy – Health, Safety and Environment</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <span className="w-4 h-3 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">&#10003;</span>
              Update your advertising tracking settings
            </Link>
          </div>
        </div>

        {/* Back to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed right-6 bottom-6 w-14 h-14 bg-[#1A1A1A] border-2 border-gray-600 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#1A1A1A] hover:border-gray-200 transition-all duration-300 shadow-xl group z-50 ${
            showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <ArrowLeft className="w-6 h-6 rotate-90 group-hover:-translate-y-1 transition-transform" />
        </button>
      </footer>
    </>
  );
};

export default Footer;

