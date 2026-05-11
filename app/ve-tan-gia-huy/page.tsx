'use client';

import React, { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CompanyPage() {
  const [content, setContent] = useState<any>(null);
  
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, 'cms', 'company_page');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          setContent({
            hero_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920",
            hero_title: "Về Tân Gia Huy",
            intro_vocation_text: "Our vocation for materials, in particular porcelain stoneware, has been guiding our work, our thoughts and our actions since the date of our establishment.",
            intro_design_activity_text: "Our design activities have the purpose of creating ceramic surfaces that work towards the best in terms of technical performance and aesthetics. Our ceramic products are solutions for architecture, an invaluable tool for technicians, architects and designers. The culture of material combines with technology and gives life to values that, since 1988, contribute to defining our work and our company: Tân Gia Huy.",
            intro_cta1: "About us",
            intro_cta2: "Caesar porcelain tiles",
            section1_image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200",
            section1_title: "Vật liệu cho dự án của bạn",
            section1_description: "Kể từ khi thành lập, Tân Gia Huy đã trở thành điểm tựa vững chắc cho các đối tác, công ty xây dựng, nhà thiết kế và kiến trúc sư trong phân khúc gạch ốp lát cao cấp.",
            section2_image: "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200",
            section2_title: "Gạch ốp lát Tân Gia Huy",
            section2_description: "Sản phẩm của chúng tôi là sự kết hợp hoàn hảo giữa công nghệ hiện đại và thẩm mỹ tinh tế, đáp ứng mọi yêu cầu khắt khe của các không gian kiến trúc.",
            video_placeholder_image: "https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600"
          });
        }
      } catch (e) {
        console.error("Error fetching company data:", e);
      }
    }
    fetchData();
  }, []);

  if (!content) return <div className="h-screen bg-white flex items-center justify-center font-serif text-2xl uppercase tracking-widest text-black">Loading...</div>;

  return <CompanyPageContent content={content} />;
}

function CompanyPageContent({ content }: { content: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);

  const { scrollYProgress: s1Progress } = useScroll({
    target: section1Ref,
    offset: ["start start", "end end"]
  });

  const section1Opacity = useTransform(s1Progress, [0, 1], [1, 0.4]);
  const section1Scale = useTransform(s1Progress, [0, 1], [1, 0.95]);

  return (
    <main className="relative bg-white text-black min-h-screen" ref={containerRef}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src={content.hero_image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920"}
          alt="Company"
          className="absolute inset-0 w-full h-full object-cover"
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

      {/* Breadcrumbs and Intro Section */}
      <section className="bg-[#F8F7F5] pt-12 pb-4 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-[15px] mb-4">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors font-sans font-light">Home</Link>
          <span className="text-gray-300 font-light">•</span>
          <span className="font-light text-black underline underline-offset-8 font-sans">Company</span>
        </div>
      </section>

      <section className="bg-[#F8F7F5] pb-16 px-6 md:px-12 lg:px-24">
        <div className="w-full mb-12">
          <div>
            <h2 className="text-[#1A1A1A] text-[20px] font-light font-sans mb-2 max-w-5xl">
              {content.intro_vocation_text || "Our vocation for materials, in particular porcelain stoneware, has been guiding our work, our thoughts and our actions since the date of our establishment."}
            </h2>
            <p className="text-[#404040] text-[20px] font-light font-sans mt-2 max-w-5xl">
              {content.intro_design_activity_text || "Our design activities have the purpose of creating ceramic surfaces that work towards the best in terms of technical performance and aesthetics."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-[#1A1A1A] rounded-md text-[14px] font-normal text-[#1A1A1A] flex items-center gap-2 hover:bg-[#1A1A1A] hover:text-white transition-all font-sans">
            {content.intro_cta1 || "About us"} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <button className="px-5 py-2.5 bg-white border border-[#1A1A1A] rounded-md text-[14px] font-normal text-[#1A1A1A] flex items-center gap-2 hover:bg-[#1A1A1A] hover:text-white transition-all font-sans">
            {content.intro_cta2 || "Caesar porcelain tiles"} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>
      
      {/* Sequence Container */}
      <div className="relative bg-[#F5F3F1]">
        {/* Section 1: Material for your projects */}
        <section ref={section1Ref} className="h-[200vh] relative z-10">
          <motion.div 
            style={{ opacity: section1Opacity, scale: section1Scale }}
            className="sticky top-0 h-screen bg-[#F5F3F1] py-24 px-6 md:px-12 lg:px-24 flex items-center"
          >
            <div className="w-full max-w-[1920px] mx-auto grid lg:grid-cols-[70%_25%] gap-8 lg:gap-[5%] items-center">
              <div className="overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={content.section1_image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"}
                  alt="Material"
                  className="w-full h-auto object-cover aspect-[16/10]"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-[18px] font-sans font-bold text-[#1A1A1A] mb-3 leading-tight tracking-tight">
                    {content.section1_title}
                  </h2>
                  <p className="text-[#404040] leading-relaxed text-[14px] font-sans font-normal max-w-[95%]">
                    {content.section1_description}
                  </p>
                </div>
                <Link href="/products">
                  <button className="px-4 py-2 bg-transparent border border-[#1A1A1A] rounded-md text-[13px] font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all font-sans">
                    Read more
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Caesar porcelain tiles */}
        <section ref={section2Ref} className="h-[200vh] relative z-20 mt-[-100vh]">
          <div className="sticky top-0 h-screen bg-white py-24 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
            <div className="w-full max-w-[1920px] mx-auto grid lg:grid-cols-[25%_70%] gap-8 lg:gap-[5%] items-center">
              <div className="lg:order-2 overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={content.section2_image || "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200"}
                  alt="Tiles"
                  className="w-full h-auto object-cover aspect-[16/10]"
                />
              </div>
              <div className="lg:order-1 space-y-4">
                <div>
                  <h2 className="text-[18px] font-sans font-bold text-[#1A1A1A] mb-3 leading-tight tracking-tight">
                    {content.section2_title}
                  </h2>
                  <p className="text-[#404040] leading-relaxed text-[14px] font-sans font-normal max-w-[95%]">
                    {content.section2_description}
                  </p>
                </div>
                <Link href="/products">
                  <button className="px-4 py-2 bg-transparent border border-[#1A1A1A] rounded-md text-[13px] font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all font-sans">
                    Khám phá bộ sưu tập
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-[#F5F3F1] py-12 md:py-24">
        {/* Video Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="px-6 md:px-12 lg:px-24 w-full"
        >
          <div className="relative w-full aspect-video bg-gray-200 rounded-[3rem] overflow-hidden">
            <img 
               src={content.video_placeholder_image || "https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600"} 
               alt="Video Placeholder"
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <button className="bg-white/90 p-8 rounded-full text-black hover:scale-110 transition-transform shadow-2xl">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
