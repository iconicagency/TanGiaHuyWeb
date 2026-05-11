'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Accessibility, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const [quickLinkIndex, setQuickLinkIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            <h2 className="text-[32px] md:text-[40px] font-sans font-normal text-[#1A1A1A] mb-2 tracking-tight">Liên kết nhanh</h2>
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
                <h3 className="text-[19px] font-sans font-normal text-[#1A1A1A] mb-4">
                  {item.title}
                </h3>
                <p className="text-[#404040] text-[15px] font-normal font-sans leading-relaxed mb-10 flex-1">
                  {item.desc}
                </p>
                <div className="text-[15px] font-medium text-[#1A1A1A] flex items-center group">
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
                : 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-black hover:text-white cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={nextQuickLink}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              quickLinkIndex >= quickLinks.length - (windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4)
                ? 'bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-black hover:text-white cursor-pointer'
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
              <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center hidden md:flex opacity-0">
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
            <div>
              <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center">
                <span className="h-[1px] w-8 bg-gray-500 mr-2"></span>
                URBAN LAB
              </h4>
              <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                <p className="font-bold text-white mb-2 text-[14px]">Tân Gia Huy Urban Lab London</p>
                <p>17-18 Great Sutton Street, EC1V 0DP</p>
                <p>London</p>
                <p>UK</p>
                <p className="mt-2">Tel: +44 (0) 20 7836 4662</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-[#E0E0E0] uppercase tracking-[0.1em] text-[11px] font-bold mb-5 flex items-center hidden md:flex opacity-0">
                  <span className="h-[1px] w-8 bg-gray-500 mr-2"></span>
                  SPACER
                </h4>
                <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                  <p className="font-bold text-white mb-2 text-[14px]">Tân Gia Huy Urban Lab Paris</p>
                  <p>10b, Rue Saint Nicolas, 75012</p>
                  <p>Paris</p>
                  <p>France</p>
                  <p className="mt-2">Tel: +33 1 44 73 42 02</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-1 text-[13px] text-[#A3A3A3] font-sans font-medium">
                  <p className="font-bold text-white mb-2 text-[14px]">Tân Gia Huy Urban Lab Milano</p>
                  <p>Via Molino delle Armi, 14, 20123</p>
                  <p>Milano</p>
                  <p>Italia</p>
                  <p className="mt-2">Tel: +39 02 97107119</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-800 pb-8 mb-6">
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-serif font-medium tracking-widest uppercase mb-1">
                Tân Gia Huy<span className="text-xl align-top">&bull;</span>
              </div>
              <div className="text-[10px] tracking-widest text-[#A3A3A3] font-sans">CERAMICHE</div>
            </div>
            
            <div className="text-[13px] text-[#A3A3A3] font-sans font-medium md:mr-auto md:ml-12">
              <p className="font-bold text-white mb-1">Ceramiche Tân Gia Huy S.p.A.</p>
              <p>Fiscal Code and VAT Code: P.iva: IT00179660360</p>
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

        {/* Floating action buttons */}
        <div className="absolute right-6 bottom-32 flex flex-col gap-2">
          <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg">
            <Accessibility size={20} />
          </button>
          <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg">
            <Mail size={20} />
          </button>
        </div>
        
        {/* Back to top button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute right-6 bottom-6 w-10 h-10 bg-gray-400/20 rounded-full flex items-center justify-center text-white hover:bg-gray-400/40 transition-colors"
        >
          <span className="text-xl leading-none">&uarr;</span>
        </button>
      </footer>
    </>
  );
};

export default Footer;

