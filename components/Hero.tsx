'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Youtube, Mail } from 'lucide-react';
import { db } from '@/lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

interface HeroProps {
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = () => {
  const [videoUrl, setVideoUrl] = useState('/videos/hero-video.mp4');
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const getDirectVideoUrl = (url: string) => {
    if (!url) return '/videos/hero-video.mp4';
    
    // Handle Pexels links - if it's a download/page link, it won't work in <video>
    if (url.includes('pexels.com') && (url.includes('/video/') || url.includes('/download/video/')) && !url.includes('.mp4')) {
      console.warn("[Hero Video] Pexels page link detected. Falling back to default video. Please use a direct .mp4 link.");
      return '/videos/hero-video.mp4';
    }

    // Handle Vimeo links - regular page links won't work in <video> tag
    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com/external') && !url.includes('.mp4')) {
      console.warn("[Hero Video] Vimeo page link detected. Falling back to default video. Direct links usually require Vimeo Pro/Business.");
      return '/videos/hero-video.mp4';
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
      if (match && match[1]) {
        // Updated format to try and avoid some common blocks, but 50MB+ remains an issue
        return `https://drive.google.com/uc?id=${match[1]}&export=download`;
      }
    }
    
    // Auto-fix Dropbox
    if (url.includes('dropbox.com')) {
      let freshUrl = url.replace(/(\?|&)dl=[01]/g, '');
      const separator = freshUrl.includes('?') ? '&' : '?';
      return freshUrl.includes('raw=1') ? freshUrl : `${freshUrl}${separator}raw=1`;
    }

    return url;
  };

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'hero'), (snap) => {
      if (snap.exists() && snap.data().videoUrl) {
        const directUrl = getDirectVideoUrl(snap.data().videoUrl);
        setVideoUrl(directUrl);
        setHasError(false); // Reset error state on URL change
      }
    }, (err) => {
      console.error("[Hero] Snapshot error:", err);
    });

    return () => {
      unsubSettings();
    };
  }, []);

  const handleVideoError = (e: any) => {
    const errorMsg = e?.target?.error?.message || "Unknown error";
    console.error(`[Hero Video] Load failed for: ${videoUrl}. Reason: ${errorMsg}`);
    
    // Check if it's already using the fallback
    if (videoUrl !== '/videos/hero-video.mp4') {
      console.info("[Hero Video] Attempting fallback to local video...");
      setVideoUrl('/videos/hero-video.mp4');
      setHasError(false);
    } else {
      console.error("[Hero Video] Both primary and local videos failed.");
      setHasError(true);
    }
  };

  useEffect(() => {
    if (videoRef.current && !hasError) {
      console.log("[Hero Video] Loading:", videoUrl);
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.warn("[Hero Video] Autoplay blocked or load failed:", error);
      });
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
              if (videoRef.current) videoRef.current.style.opacity = '1';
            }}
            onError={handleVideoError}
            style={{ opacity: 0 }}
          >
            <source 
              src={videoUrl} 
              type="video/mp4" 
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

      {/* Synchronized Footer Area like other sections */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center space-x-6 text-white/40">
        <span className="text-[9px] font-bold tracking-widest hidden md:inline">© 2024 TÂN GIA HUY. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center space-x-4">
          <Facebook className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Youtube className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <span className="text-[10px] font-bold cursor-pointer hover:text-white transition-colors">Zalo</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-8 text-white/70">
        <div className="flex items-center space-x-8 text-[10px] font-bold tracking-wider mr-4">
          <span className="opacity-60 uppercase">hotline: 0971.325.658</span>
        </div>
        <div className="flex items-center space-x-3 bg-brand-gold/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 group cursor-pointer hover:bg-brand-gold/20 transition-all">
          <div className="w-7 h-7 flex items-center justify-center bg-brand-gold rounded-full text-white">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-wider group-hover:text-brand-gold transition-colors">tangiahuy.nd@gmail.com</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
