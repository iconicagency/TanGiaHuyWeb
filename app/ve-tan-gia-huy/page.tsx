'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';

export default function CompanyPage() {
  return (
    <main className="relative bg-white text-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1920"
          alt="Company"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-10 left-10 md:left-20 bg-[#EBE9E4]/90 p-8 md:p-12 w-[300px] md:w-[400px]">
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            Về Tân Gia Huy
          </h1>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="bg-[#f5f4ef] py-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600 mb-6 font-medium">
            Trang chủ • Về Tân Gia Huy
          </nav>
          <div className="flex flex-wrap gap-4 mb-8">
            <button className="border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-[0.2em] text-xs rounded-full">
              Về chúng tôi <span>→</span>
            </button>
            <button className="border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-[0.2em] text-xs rounded-full">
              Gạch ốp lát Tân Gia Huy <span>→</span>
            </button>
          </div>
          <div className="text-gray-700 font-light text-lg max-w-4xl leading-relaxed space-y-4">
            <p>
              Tân Gia Huy tự hào là đơn vị tiên phong trong lĩnh vực phân phối vật liệu hoàn thiện cao cấp, đặc biệt là gạch ốp lát khổ lớn. Chúng tôi mang đến những giải pháp không gian sống sang trọng, bền vững và đầy cảm hứng.
            </p>
            <p>
              Với hơn 10 năm kinh nghiệm, chúng tôi không chỉ cung cấp sản phẩm, mà còn trao gửi giải pháp kiến trúc toàn diện, đáp ứng những tiêu chuẩn khắt khe nhất của các dự án tầm cỡ.
            </p>
          </div>
        </div>
      </section>
      
      <div className="py-20 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-[#f5f4ef] rounded-3xl p-8 md:p-16 mb-16"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-3/5 overflow-hidden rounded-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200"
                alt="Material for projects"
                className="w-full h-auto object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Material+Image'; }}
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900">Vật liệu cho dự án của bạn</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Kể từ khi thành lập, Tân Gia Huy đã trở thành điểm tựa vững chắc cho các đối tác, công ty xây dựng, nhà thiết kế và kiến trúc sư trong phân khúc gạch ốp lát cao cấp.
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

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-[#f5f4ef] rounded-3xl p-8 md:p-16 mb-16"
        >
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-3/5 overflow-hidden rounded-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1574362848149-11d06bdad3f4?auto=format&fit=crop&q=80&w=1200"
                alt="Caesar porcelain tiles"
                className="w-full h-auto object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Tiles+Image'; }}
              />
            </motion.div>
            <div className="w-full lg:w-2/5 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gray-900">Gạch ốp lát Tân Gia Huy</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Sản phẩm của chúng tôi là sự kết hợp hoàn hảo giữa công nghệ hiện đại và thẩm mỹ tinh tế, đáp ứng mọi yêu cầu khắt khe của các không gian kiến trúc.
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
        {/* Video Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl overflow-hidden"
        >
          <div className="relative w-full aspect-video bg-gray-200">
            <img 
               src="https://images.unsplash.com/photo-1542744173-8e7e53415acc?auto=format&fit=crop&q=80&w=1600" 
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
          className="py-20"
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
      </div>
      <Footer />
    </main>
  );
}
