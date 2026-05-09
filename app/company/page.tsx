'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';

export default function CompanyPage() {
  return (
    <main className="relative bg-white text-black min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 block">
            VỀ TÂN GIA HUY
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Tinh hoa vật liệu <br className="hidden md:block" /> hoàn thiện
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-lg text-gray-700 font-light"
          >
            <p>
              Tân Gia Huy tự hào là đơn vị tiên phong trong lĩnh vực phân phối vật liệu hoàn thiện cao cấp, đặc biệt là gạch ốp lát khổ lớn. Chúng tôi mang đến những giải pháp không gian sống sang trọng, bền vững và đầy cảm hứng.
            </p>
            <p>
              Với hơn 10 năm kinh nghiệm, chúng tôi không chỉ cung cấp sản phẩm, mà còn trao gửi giải pháp kiến trúc toàn diện, đáp ứng những tiêu chuẩn khắt khe nhất của các dự án tầm cỡ.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-100 p-8 rounded-lg"
          >
            <h3 className="text-xl font-bold mb-4">Giá trị cốt lõi</h3>
            <ul className="space-y-4 text-gray-600">
              <li>• Uy tín: Cam kết chất lượng sản phẩm và dịch vụ</li>
              <li>• Tận tâm: Đồng hành cùng khách hàng trong mọi giải pháp</li>
              <li>• Chất lượng: Vật liệu cao cấp, tiêu chuẩn quốc tế</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
