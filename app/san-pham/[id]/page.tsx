'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  Share2, 
  Heart, 
  Maximize2,
  Building2,
  Layers,
  Ruler,
  Sparkles,
  Palette,
  Tag,
  LayoutGrid,
  ShoppingBag
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';

const ProductDetailPage = () => {
  const params = useParams();
  const idValue = params?.id;
  const productName = typeof idValue === 'string' ? decodeURIComponent(idValue).replace(/-/g, ' ') : 'Gạch 75x150 Nhập Khẩu Trung Quốc';

  // Mock data based on the user's image
  const productData = {
    name: productName,
    subtitle: "Nhập Khẩu Trung Quốc",
    price: "620.000đ / m²",
    images: [
      "https://images.unsplash.com/photo-1616484173745-0d23bc0451ae?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    ],
    specs: [
      { label: "Thương hiệu", value: "Nhập khẩu Trung Quốc", icon: Building2 },
      { label: "Chất liệu", value: "Xương đá Granite", icon: Layers },
      { label: "Kích Thước", value: "750 x 1500 mm", icon: Ruler },
      { label: "Men", value: "Siêu bóng kính kim cương", icon: Sparkles },
      { label: "Màu Sắc", value: "Ghi xám vân đá marble", icon: Palette },
      { label: "Độ Dày", value: "1cm", icon: Layers },
      { label: "Danh mục", value: "Gạch, Gạch lát nền, Gạch ốp tường, Sản Phẩm", icon: LayoutGrid },
      { label: "Thẻ", value: "Gạch 75x150 Trung Quốc, gạch khổ lớn, gạch ốp tường, Gạch Tân Gia Huy", icon: Tag }
    ],
    fullSpecs: [
      { label: "Thương Hiệu", value: "Nhập khẩu Trung Quốc" },
      { label: "Chất Liệu", value: "Granite" },
      { label: "Kích Thước", value: "750 x 1500 mm" },
      { label: "Men", value: "Siêu bóng kính kim cương" },
      { label: "Màu Sắc", value: "Màu ghi xám vân đá marble" },
      { label: "Độ Dày", value: "1cm" },
      { label: "Công Năng", value: "Lát nền, ốp tường cho phòng khách, phòng ngủ, nhà bếp, nhà tắm..." }
    ],
    description: `Tấm gương kháng gạch sáng với vẻ đẹp sang trọng, đẳng cấp của dòng gạch 75x1500, nhập khẩu trực tiếp từ Trung Quốc.
    Sở hữu mẫu sản phẩm này vừa đủ để tạo cảm giác mềm mại, tinh tế khi sử dụng và dễ dàng tạo điểm nhấn cho không gian phòng khách hiện đại yêu cầu sự tinh tế, vừa hiện đại vừa mang lại sự phóng khoáng cho mọi sự lựa chọn gạch lát tường sắp tới để tạo thành combo.
    Không chỉ vậy màu, bề mặt gạch màu ghi xám kết hợp cùng với những màu sắc, các đồ nội thất khác mang đến không gian sống hài hòa, thống nhất.`
  };

  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = [
    { name: "Gạch 75x150 Nhập Khẩu Trung Quốc", code: "TG-HTS15-01", price: "620.000đ / m²", image: "https://images.unsplash.com/photo-1616484173745-0d23bc0451ae?auto=format&fit=crop&q=80&w=800" },
    { name: "Gạch 75x150 Nhập Khẩu Trung Quốc", code: "TG-HTS15-02", price: "620.000đ / m²", image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800" },
    { name: "Gạch 75x150 Nhập Khẩu Trung Quốc", code: "TG-HTS15-03", price: "620.000đ / m²", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
         <Image 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
         />
         <div className="absolute inset-0 bg-black/5" />
         <div className="relative z-10 text-center px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/30 backdrop-blur-xl px-10 py-12 md:px-24 md:py-20 rounded-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] inline-block max-w-[90vw] md:min-w-[600px]"
            >
              <h1 className="text-3xl md:text-6xl font-sans font-normal leading-tight mb-4 tracking-[0.15em] text-[#1A1A1A] uppercase">
                {productData.name}
              </h1>
              <p className="text-lg md:text-2xl font-light text-gray-700 italic font-sans opacity-80">{productData.subtitle}</p>
            </motion.div>
         </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4 font-sans text-[13px] font-normal text-gray-500 flex items-center gap-2 border-b border-gray-100">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-4 h-4 opacity-30" />
        <Link href="/products" className="hover:text-black">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4 opacity-30" />
        <span className="text-gray-900 truncate">{productData.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Main Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-12 lg:gap-[5%] items-start">
          
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[3/2] rounded overflow-hidden shadow-sm bg-white border border-gray-200 group">
              <Image 
                src={productData.images[activeImage]}
                alt={productData.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-4 right-4 p-3 bg-white shadow-md rounded hover:bg-gray-100 transition-colors z-20">
                <Maximize2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square rounded overflow-hidden border transition-all ${activeImage === i ? 'border-brand-gold ring-1 ring-brand-gold' : 'border-gray-200'}`}
                >
                  <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-brand-green mb-4 leading-tight">
                {productData.name}
              </h2>
              <div className="text-2xl font-bold text-brand-gold">{productData.price}</div>
            </div>

            <div className="space-y-4">
              {productData.specs.map((spec, i) => (
                <div key={i} className="flex gap-4 text-[14px] font-sans items-center">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <spec.icon className="w-4 h-4 text-brand-green" />
                  </div>
                  <span className="w-24 text-gray-800 shrink-0 font-bold">{spec.label}:</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
               <button className="flex-1 min-w-[200px] px-8 py-4 bg-brand-green text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2">
                 <ShoppingBag className="w-4 h-4" /> Liên hệ báo giá
               </button>
               <button className="p-4 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-all">
                 <Heart className="w-5 h-5 text-gray-400" />
               </button>
               <button className="p-4 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-all">
                 <Share2 className="w-5 h-5 text-gray-400" />
               </button>
            </div>
          </div>
        </div>

        {/* Tabs & Full Specs */}
        <div className="mt-20">
          <div className="flex gap-8 mb-12 border-b border-gray-100">
            <button className="pb-4 border-b-2 border-brand-green text-brand-green font-bold uppercase tracking-widest text-[14px] font-sans">
              Mô tả
            </button>
          </div>

          <div className="space-y-16">
            <div>
              <h3 className="text-lg font-bold font-sans uppercase mb-8 text-brand-green flex items-center gap-3">
                Thông số sản phẩm {productData.name}
              </h3>
              <div className="rounded overflow-hidden bg-white border border-gray-100">
                <table className="w-full text-left font-sans text-sm">
                  <tbody>
                    {productData.fullSpecs.map((spec, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-800 w-1/3 border-r border-gray-100">{spec.label}:</td>
                        <td className="py-4 px-6 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold font-sans uppercase mb-8 text-brand-green">
                Mô tả sản phẩm {productData.name}
              </h3>
              <div className="text-gray-600 leading-[1.8] font-sans text-[15px] space-y-6 max-w-4xl">
                {productData.description.split('\n').map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32 pt-20 border-t border-gray-100">
           <div className="text-center mb-16">
             <h2 className="text-2xl font-sans font-bold text-brand-green uppercase tracking-[0.2em] relative inline-block pb-4">
               Sản phẩm liên quan
               <div className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-brand-gold rounded-full" />
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {relatedProducts.map((p, i) => (
               <Link 
                href={`/san-pham/${encodeURIComponent(p.name.toLowerCase().replace(/ /g, '-'))}`}
                key={i}
                className="bg-white rounded overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
               >
                 <div className="aspect-[4/3] relative overflow-hidden">
                   <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                 </div>
                 <div className="p-6 text-center">
                   <h3 className="text-[14px] font-bold text-gray-900 mb-2 group-hover:text-brand-gold transition-colors">{p.name}</h3>
                   <p className="text-[10px] text-gray-400 mb-3 font-sans font-bold uppercase tracking-widest leading-none">Mã: {p.code}</p>
                   <p className="text-brand-gold font-bold text-[15px]">{p.price}</p>
                 </div>
               </Link>
             ))}
           </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetailPage;
