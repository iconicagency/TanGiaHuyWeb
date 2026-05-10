'use client';

import React, { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform } from 'motion/react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CompanyPage() {
  const [content, setContent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, 'cms', 'company_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Fallback with default data if doc doesn't exist yet
        setContent({
          hero_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920",
          hero_title: "Về Tân Gia Huy",
          section1_image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200",
          section1_title: "Vật liệu cho dự án của bạn",
          section1_description: "Kể từ khi thành lập, Tân Gia Huy đã trở thành điểm tựa vững chắc cho các đối tác, công ty xây dựng, nhà thiết kế và kiến trúc sư trong phân khúc gạch ốp lát cao cấp.",
          section2_image: "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200",
          section2_title: "Gạch ốp lát Tân Gia Huy",
          section2_description: "Sản phẩm của chúng tôi là sự kết hợp hoàn hảo giữa công nghệ hiện đại và thẩm mỹ tinh tế, đáp ứng mọi yêu cầu khắt khe của các không gian kiến trúc.",
          video_placeholder_image: "https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600"
        });
      }
    }
    fetchData();
  }, []);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });

  // Adjusted progress points:
  // Assuming total page is ~4 screens. Hero is 0.6 screens.
  // Sections container is 2 screens.
  // We want section 1 to appear after hero.
  const section1Opacity = useTransform(scrollYProgress, [0.1, 0.15, 0.35, 0.4], [0, 1, 1, 0]);
  const section1Scale = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.95]);
  const section1PointerEvents = useTransform(scrollYProgress, [0.38, 0.4], ["auto", "none"]);
  const section1Y = useTransform(scrollYProgress, [0.1, 0.4], [0, -50]);
  
  const section2Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.7, 0.75], [0, 1, 1, 0]);
  const section2Y = useTransform(scrollYProgress, [0.4, 0.45], ["100%", "0%"]);
  const section2PointerEvents = useTransform(scrollYProgress, [0.4, 0.42], ["none", "auto"]);
  const section2YImg = useTransform(scrollYProgress, [0.4, 0.7], [50, 0]);

  if (!content) return <div>Loading...</div>;

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
        <div className="absolute bottom-20 left-6 md:left-24 bg-[#EBE9E4]/95 p-12 md:p-16 max-w-2xl shadow-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif font-bold leading-tight"
          >
            {content.hero_title}
          </motion.h1>
        </div>
      </section>

      {/* Breadcrumbs and Intro Section */}
      <section className="bg-[#F8F7F5] py-8 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2 text-sm mb-12">
          <span className="text-gray-500">Home</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-black underline underline-offset-4">Company</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-20">
          <button className="border border-black px-8 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-white transition-colors">
            About us <span>→</span>
          </button>
          <button className="border border-black px-8 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-white transition-colors">
            Caesar porcelain tiles <span>→</span>
          </button>
        </div>

        <div className="w-full space-y-8 pb-12">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Our vocation for materials, in particular porcelain stoneware, has been guiding our work, our thoughts and our actions since the date of our establishment.
          </p>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
            Our design activities have the purpose of creating <span className="font-bold not-italic">ceramic surfaces</span> that work towards <span className="font-bold not-italic">the best in terms of technical performance and aesthetics</span>. Our ceramic products are solutions for architecture, an invaluable tool for technicians, architects and designers. The <span className="font-bold not-italic text-black">culture of material</span> combines with technology and gives life to values that, since 1988, contribute to defining our work and our company: Tân Gia Huy.
          </p>
        </div>
      </section>
      
      <div className="relative h-[250vh]">
        {/* Section 1: Material for your projects */}
        <motion.section 
          style={{ opacity: section1Opacity, scale: section1Scale, pointerEvents: section1PointerEvents as any, y: section1Y }}
          className="bg-[#F5F3F1] py-24 px-6 md:px-12 lg:px-24 min-h-screen flex items-center sticky top-0"
        >
          <div className="w-full h-full flex flex-col lg:flex-row gap-16 items-center">
            <motion.div className="w-full lg:w-3/5 overflow-hidden rounded-3xl shadow-xl">
              <img 
                src={content.section1_image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"}
                alt="Material"
                className="w-full h-auto object-cover aspect-[16/10]"
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-10">
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
                {content.section1_title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-xl max-w-xl">
                {content.section1_description}
              </p>
              <motion.button 
                whileHover={{ backgroundColor: "#000", color: "#fff" }}
                className="border-2 border-black px-12 py-5 transition-colors flex items-center gap-4 font-bold uppercase tracking-[0.2em] text-xs"
              >
                Xem thêm <span>→</span>
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Caesar porcelain tiles */}
        <motion.section 
          style={{ opacity: section2Opacity, y: section2Y, pointerEvents: section2PointerEvents as any, zIndex: 10 }}
          className="bg-[#FDFDFD] py-24 px-6 md:px-12 lg:px-24 min-h-screen flex items-center absolute top-0 left-0 w-full"
        >
          <div className="w-full h-full flex flex-col lg:flex-row-reverse gap-16 items-center">
            <motion.div 
              className="w-full lg:w-3/5 overflow-hidden rounded-3xl shadow-xl"
              style={{ y: section2YImg }}
            >
              <img 
                src={content.section2_image || "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200"}
                alt="Tiles"
                className="w-full h-auto object-cover aspect-[16/10]"
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-10">
              <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-gray-900 leading-tight">
                {content.section2_title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-xl max-w-xl">
                {content.section2_description}
              </p>
              <motion.button 
                whileHover={{ backgroundColor: "#000", color: "#fff" }}
                className="border-2 border-black px-12 py-5 transition-colors flex items-center gap-4 font-bold uppercase tracking-[0.2em] text-xs"
              >
                Khám phá bộ sưu tập <span>→</span>
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>

        {/* Video Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden px-6 md:px-12 lg:px-24 w-full"
        >
          <div className="relative w-full aspect-video bg-gray-200">
            <img 
               src={content.video_placeholder_image || "https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600"} 
               alt="Video Placeholder"
               className="w-full h-full object-cover"
               onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1600x900?text=Video+Placeholder'; }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 backdrop-blur-sm p-8 rounded-full text-white hover:scale-110 transition-transform">
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
          className="py-20 px-6 md:px-12 lg:px-24 w-full"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">Quick links</h2>
          <p className="text-gray-600 mb-12">Quickly access some of the most useful sections of the site.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { title: "Find a dealer", desc: "Discover the retailer nearest to you and experience the quality of our surfaces firsthand." },
               { title: "Resources", desc: "Quickly access technical documentation, catalogs, digital tools, and materials to support your projects." },
               { title: "Technical manual", desc: "Consult all the technical information necessary to correctly design, install, and maintain our collections." },
               { title: "Sign up for the newsletter", desc: "Stay updated on news, collections, and trends from the world of Tân Gia Huy. Subscribe to receive inspiration directly in your inbox." }
            ].map((link, i) => (
              <div key={i} className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold mb-4">{link.title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">{link.desc}</p>
                <a href="#" className="flex items-center gap-2 font-medium text-sm hover:underline">View →</a>
              </div>
            ))}
          </div>
        </motion.section>
      
      <Footer />
    </main>
  );
}
