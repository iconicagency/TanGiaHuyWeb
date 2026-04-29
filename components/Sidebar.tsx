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
          <button
            onClick={() => onSectionClick(index)}
            className="group relative flex items-center justify-center transition-all duration-300"
            aria-label={`Go to section ${index + 1}`}
          >
            <div className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-500",
              currentSection === index 
                ? "border-red-600 text-red-600 bg-red-600/5 shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                : "border-white/20 text-white/40 hover:border-white/60 hover:text-white"
            )}>
              {(index + 1).toString().padStart(2, '0')}
            </div>
          </button>

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
