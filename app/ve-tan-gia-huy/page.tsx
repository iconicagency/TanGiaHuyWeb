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

  const section1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const section1Scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const section1PointerEvents = useTransform(scrollYProgress, [0.3, 0.31], ["auto", "none"]);
  const section1Y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  const section2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.7], [0, 1, 1]);
  const section2Y = useTransform(scrollYProgress, [0.3, 0.7], ["100%", "0%"]);
  const section2PointerEvents = useTransform(scrollYProgress, [0.3, 0.31], ["none", "auto"]);
  const section2YImg = useTransform(scrollYProgress, [0.3, 1], [100, 0]);

  if (!content) return <div>Loading...</div>;

  return (
    <main className="relative bg-white text-black min-h-screen" ref={containerRef}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <img 
          src={content.hero_image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920"}
          alt="Company"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-10 left-10 md:left-20 bg-[#EBE9E4]/90 p-8 md:p-12 w-[300px] md:w-[400px]">
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            {content.hero_title}
          </h1>
        </div>
      </section>
      
      <div className="relative h-[200vh]">
        {/* Section 1: Material for your projects */}
        <motion.section 
          style={{ opacity: section1Opacity, scale: section1Scale, pointerEvents: section1PointerEvents as any }}
          className="bg-[#F5F3F1] py-24 px-6 md:px-12 lg:px-20 min-h-screen flex items-center sticky top-0"
        >
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              className="w-full lg:w-3/5 overflow-hidden rounded-2xl"
              style={{ y: section1Y }}
            >
              <img 
                src={content.section1_image || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"}
                alt="Material for projects"
                className="w-full h-auto object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Material+Image'; }}
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900">{content.section1_title}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {content.section1_description}
              </p>
              <motion.button 
                whileHover={{ backgroundColor: "#000", color: "#fff" }}
                className="border-2 border-black px-8 py-3 transition-colors flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-[10px]"
              >
                Xem thêm <span>→</span>
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Caesar porcelain tiles */}
        <motion.section 
          style={{ opacity: section2Opacity, y: section2Y, pointerEvents: section2PointerEvents as any }}
          className="bg-[#FDFDFD] py-24 px-6 md:px-12 lg:px-20 min-h-screen flex items-center absolute top-0 left-0 w-full"
        >
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row-reverse gap-12 items-center">
            <motion.div 
              className="w-full lg:w-3/5 overflow-hidden rounded-2xl"
              style={{ y: section2YImg }}
            >
              <img 
                src={content.section2_image || "https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200"}
                alt="Caesar porcelain tiles"
                className="w-full h-auto object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Tiles+Image'; }}
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900">{content.section2_title}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {content.section2_description}
              </p>
              <motion.button 
                whileHover={{ backgroundColor: "#000", color: "#fff" }}
                className="border-2 border-black px-8 py-3 transition-colors flex items-center gap-2 font-semibold uppercase tracking-[0.2em] text-[10px]"
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
          className="mt-12 rounded-3xl overflow-hidden px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto"
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
          className="py-20 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto"
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
