'use client';

import React, { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

  const { scrollYProgress: s2Progress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"]
  });

  const section1Opacity = useTransform(s1Progress, [0, 0.8, 1], [1, 1, 0]);
  const section1Scale = useTransform(s1Progress, [0.5, 1], [1, 0.95]);
  const section2Y = useTransform(s2Progress, [0, 0.5], ["100%", "0%"]);

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
      <section className="bg-[#F8F7F5] py-12 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-sm mb-12">
          <span className="text-gray-500 font-sans">Home</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-black underline underline-offset-4 font-sans">Company</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-20">
          <button className="border border-black px-8 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-white transition-colors font-sans text-xs uppercase tracking-widest">
            {content.intro_cta1 || "About us"} <span>→</span>
          </button>
          <button className="border border-black px-8 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-white transition-colors font-sans text-xs uppercase tracking-widest">
            {content.intro_cta2 || "Caesar porcelain tiles"} <span>→</span>
          </button>
        </div>

        <div className="w-full space-y-8 pb-12">
          <p className="text-xl md:text-3xl text-gray-800 leading-relaxed font-sans font-bold tracking-tight uppercase">
            {content.intro_vocation_text || "Our vocation for materials, in particular porcelain stoneware, has been guiding our work, our thoughts and our actions since the date of our establishment."}
          </p>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-sans font-light max-w-5xl">
            {content.intro_design_activity_text || "Our design activities have the purpose of creating ceramic surfaces that work towards the best in terms of technical performance and aesthetics."}
          </p>
        </div>
      </section>
      
      {/* Sequence Container */}
      <div className="relative bg-[#F5F3F1]">
        {/* Section 1: Material for your projects */}
        <section ref={section1Ref} className="h-[120vh] relative">
          <motion.div 
            style={{ opacity: section1Opacity, scale: section1Scale }}
            className="sticky top-0 h-screen bg-[#F5F3F1] py-24 px-6 md:px-12 lg:px-24 flex items-center"
          >
            <div className="w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={content.section1_image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"}
                  alt="Material"
                  className="w-full h-auto object-cover aspect-[16/10]"
                />
              </div>
              <div className="space-y-10">
                <div className="bg-[#EBE9E4]/20 backdrop-blur-md px-8 md:px-12 py-2 md:py-3 rounded-lg border border-[#D5D3CE]/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] inline-block">
                  <h2 className="text-[39px] font-sans font-normal tracking-tight text-black leading-tight uppercase">
                    {content.section1_title}
                  </h2>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg max-w-xl font-sans font-light">
                  {content.section1_description}
                </p>
                <motion.button 
                  whileHover={{ backgroundColor: "#000", color: "#fff" }}
                  className="border-2 border-black px-12 py-5 transition-colors flex items-center gap-4 font-bold uppercase tracking-[0.2em] text-xs font-sans"
                >
                  Xem thêm <span>→</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Caesar porcelain tiles */}
        <section ref={section2Ref} className="h-[120vh] relative z-20">
          <motion.div 
            style={{ y: section2Y }}
            className="sticky top-0 h-screen bg-white py-24 px-6 md:px-12 lg:px-24 flex items-center shadow-[0_-20px_50px_rgba(0,0,0,0.08)]"
          >
            <div className="w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="lg:order-2 overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={content.section2_image || "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200"}
                  alt="Tiles"
                  className="w-full h-auto object-cover aspect-[16/10]"
                />
              </div>
              <div className="lg:order-1 space-y-10">
                <div className="bg-[#EBE9E4]/20 backdrop-blur-md px-8 md:px-12 py-2 md:py-3 rounded-lg border border-[#D5D3CE]/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] inline-block">
                  <h2 className="text-[39px] font-sans font-normal tracking-tight text-black leading-tight uppercase">
                    {content.section2_title}
                  </h2>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg max-w-xl font-sans font-light">
                  {content.section2_description}
                </p>
                <motion.button 
                  whileHover={{ backgroundColor: "#000", color: "#fff" }}
                  className="border-2 border-black px-12 py-5 transition-colors flex items-center gap-4 font-bold uppercase tracking-[0.2em] text-xs font-sans"
                >
                  Khám phá bộ sưu tập <span>→</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Video Section spacing adjustment */}
      <div className="bg-white py-12 md:py-24">
        {/* Video Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="rounded-[3rem] overflow-hidden px-6 md:px-12 lg:px-24 w-full"
        >
          <div className="relative w-full aspect-video bg-gray-200">
            <img 
               src={content.video_placeholder_image || "https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600"} 
               alt="Video Placeholder"
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <button className="bg-white/90 p-10 rounded-full text-black hover:scale-110 transition-transform shadow-2xl">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Quick Links Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="pb-24 px-6 md:px-12 lg:px-24 w-full"
        >
          <div className="bg-[#EBE9E4]/20 backdrop-blur-md px-8 md:px-12 py-2 md:py-3 rounded-lg border border-[#D5D3CE]/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] inline-block mb-12">
            <h2 className="text-[39px] font-sans font-normal tracking-tight uppercase leading-tight text-black">
              Quick <br /> <span className="text-brand-gold">links</span>
            </h2>
            <p className="text-gray-600 font-light italic mt-4 max-w-md">
              Quickly access some of the most useful sections of the site.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
               { title: "Find a dealer", desc: "Discover the retailer nearest to you and experience the quality of our surfaces firsthand." },
               { title: "Resources", desc: "Quickly access technical documentation, catalogs, digital tools, and materials to support your projects." },
               { title: "Technical manual", desc: "Consult all the technical information necessary to correctly design, install, and maintain our collections." },
               { title: "Sign up for the newsletter", desc: "Stay updated on news, collections, and trends from the world of Tân Gia Huy." }
            ].map((link, i) => (
              <div key={i} className="border-t border-black/10 pt-8 group cursor-pointer">
                <h3 className="text-2xl font-bold mb-6 group-hover:text-zinc-600 transition-colors">{link.title}</h3>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-sans">{link.desc}</p>
                <a href="#" className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest hover:gap-5 transition-all">View <span>→</span></a>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
      
      <Footer />
    </main>
  );
}
