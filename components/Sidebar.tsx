'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentSection: number;
  totalSections: number;
  onSectionClick: (index: number) => void;
}

const SECTION_LABELS = [
  'TRANG CHỦ',
  'GIỚI THIỆU',
  'SẢN PHẨM MỚI',
  'BỘ SƯU TẬP',
  'TIN TỨC',
  'LIÊN HỆ'
];

const Sidebar: React.FC<SidebarProps> = ({ currentSection, totalSections, onSectionClick }) => {
  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
      {Array.from({ length: totalSections }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Section Marker */}
          <div className="group relative flex items-center">
            {/* Hover Label */}
            <div className="absolute right-full mr-3 pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out flex items-center">
                <div className="bg-brand-gold text-white text-[10px] font-bold tracking-[0.1em] px-4 py-2 rounded-sm whitespace-nowrap relative shadow-xl">
                  {SECTION_LABELS[index] || `SECTION ${index + 1}`}
                  {/* Sharp Arrow Pointer */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -right-[6px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-brand-gold" 
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => onSectionClick(index)}
              className="relative flex items-center justify-center transition-all duration-300 p-1 md:p-2"
              aria-label={`Go to section ${index + 1}`}
            >
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold transition-all duration-500",
                currentSection === index 
                  ? "border-brand-gold text-brand-gold bg-brand-gold/5 shadow-[0_0_15px_rgba(197,160,89,0.3)]" 
                  : "border-white/20 text-white/40 hover:border-white/60 hover:text-white"
              )}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </button>
          </div>

          {/* Interstitial Dot (except after the last one) */}
          {index < totalSections - 1 && (
            <div className="w-[2px] h-3 md:h-6 flex items-center justify-center">
              <div className="w-[3px] h-[3px] md:w-[4px] md:h-[4px] rounded-full bg-white/20" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;
