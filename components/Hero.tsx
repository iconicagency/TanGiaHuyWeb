'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

const DEFAULT_SLIDES = [
  {
    image: 'https://picsum.photos/seed/tiles1/1920/1080',
    title: 'Vũ điệu xanh',
    description: 'Bản hòa ca của thiên nhiên và nghệ thuật kiến trúc',
  },
  {
    image: 'https://picsum.photos/seed/tiles2/1920/1080',
    title: 'Mộc Trà',
    description: 'Vẻ đẹp ấm áp của gỗ trong không gian hiện đại',
  },
];

interface HeroProps {
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = () => {
  const [videoUrl, setVideoUrl] = useState('/videos/hero-video.mp4');
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'hero'), (snap) => {
      if (snap.exists() && snap.data().videoUrl) {
        setVideoUrl(snap.data().videoUrl);
      }
    });

    return () => {
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.log("Autoplay blocked or video missing:", error);
      });
    }
  }, [videoUrl]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          key={videoUrl}
          preload="auto"
          className="h-full w-full object-cover grayscale-[10%] brightness-[0.7]"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      <div className="absolute bottom-10 left-12 z-30 animate-bounce cursor-pointer flex items-center space-x-4">
        <span className="text-[10px] tracking-[0.3em] font-bold opacity-60 text-white">CUỘN XUỐNG</span>
        <ChevronDown className="w-5 h-5 opacity-60 text-white" />
      </div>
    </section>
  );
};

export default Hero;
