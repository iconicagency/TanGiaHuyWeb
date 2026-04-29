'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { db } from '@/lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

interface HeroProps {
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = () => {
  const [videoUrl, setVideoUrl] = useState('/videos/hero-video.mp4');
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'hero'), (snap) => {
      if (snap.exists() && snap.data().videoUrl) {
        setVideoUrl(snap.data().videoUrl);
        setHasError(false); // Reset error state on URL change
      }
    }, (err) => {
      console.error("[Hero] Snapshot error:", err);
    });

    return () => {
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && !hasError) {
      console.log("[Hero Video] Attempting to load video:", videoUrl);
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("[Hero Video] Autoplay blocked or initial load failed:", error);
        });
      }
    }
  }, [videoUrl, hasError]);

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {!hasError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            key={videoUrl}
            preload="auto"
            className="h-full w-full object-cover grayscale-[10%] brightness-[0.7] transition-opacity duration-1000"
            onCanPlay={() => {
              console.log("[Hero Video] Video is ready to play");
              if (videoRef.current) videoRef.current.style.opacity = '1';
            }}
            onError={(e: any) => {
              console.error("[Hero Video] Video tag error detected:", e);
              setHasError(true);
            }}
            style={{ opacity: 0 }}
          >
            <source 
              src={videoUrl} 
              type="video/mp4" 
              onError={(e) => {
                console.error("[Hero Video] Source element reported error for:", videoUrl);
                setHasError(true);
              }}
            />
          </video>
        ) : (
          <div className="h-full w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
            <img 
              src="https://picsum.photos/seed/hero/1920/1080?grayscale" 
              className="h-full w-full object-cover brightness-[0.4]"
              alt="Hero Fallback"
            />
          </div>
        )}
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
