'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronDown, MousePointer2 } from 'lucide-react';

interface SidebarProps {
  currentSection: number;
  totalSections: number;
  onSectionClick: (index: number) => void;
}

const SECTION_LABELS = [
  'TRANG CHỦ',
  'BỘ SƯU TẬP',
  'SẢN PHẨM MỚI',
  'CẢM HỨNG',
  'TIN TỨC',
  'LIÊN HỆ'
];

const Sidebar: React.FC<SidebarProps> = ({ currentSection, totalSections, onSectionClick }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
      {/* Scroll indicator (Mouse) - Moved to bottom left fixed */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center space-y-2 group">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-white/60 rounded-full"
          />
        </div>
      </div>

      {Array.from({ length: totalSections }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Section Marker */}
          <div className="group relative flex items-center">
            {/* Hover Label */}
            <div className="absolute right-full mr-4 pointer-events-none overflow-hidden">
              <div className="opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center">
                <div className="bg-brand-red text-white text-[10px] font-bold tracking-[0.1em] px-4 py-2 rounded-l-md rounded-r-sm whitespace-nowrap relative">
                  {SECTION_LABELS[index] || `SECTION ${index + 1}`}
                  {/* Arrow pointer */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2.5 h-2.5 bg-brand-red rotate-45" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onSectionClick(index)}
              className="relative flex items-center justify-center transition-all duration-300 p-2"
              aria-label={`Go to section ${index + 1}`}
            >
              <div className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                currentSection === index 
                  ? "border-brand-red text-brand-red bg-brand-red/5 shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                  : "border-white/20 text-white/40 hover:border-white/60 hover:text-white"
              )}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </button>
          </div>

          {/* Interstitial Dot (except after the last one) */}
          {index < totalSections - 1 && (
            <div className="w-[2px] h-6 flex items-center justify-center">
              <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Down Arrow */}
      <div className="mt-8 flex flex-col items-center">
        <div className="w-[2px] h-12 bg-white/10 mb-4" />
        <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
      </div>
    </div>
  );
};

export default Sidebar;
