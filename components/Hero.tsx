'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Play, Pause } from 'lucide-react';
import { db } from '@/lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

interface HeroProps {
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = () => {
  const [videoUrl, setVideoUrl] = useState('/videos/hero-video.mp4');
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const getDirectVideoUrl = (url: string) => {
    if (!url) return '/videos/hero-video.mp4';
    
    // Handle Pexels links - if it's a download/page link, it won't work in <video>
    if (url.includes('pexels.com') && (url.includes('/video/') || url.includes('/download/video/')) && !url.includes('.mp4')) {
      console.warn("[Hero Video] Pexels page link detected. Falling back to default video. Please use a direct .mp4 link.");
      return '/videos/hero-video.mp4';
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
      const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
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

  useEffect(() => {
    if (videoRef.current && !hasError) {
      console.log("[Hero Video] Attempting to load video:", videoUrl);
      videoRef.current.load();
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("[Hero Video] Autoplay blocked or initial load failed:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [videoUrl, hasError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

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
            onError={() => {
              console.error("[Hero Video] Video tag error detected");
              setHasError(true);
            }}
            style={{ opacity: 0 }}
          >
            <source 
              src={videoUrl} 
              type="video/mp4" 
              onError={() => {
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

      <div className="absolute bottom-10 left-12 z-30 flex items-center space-x-8">
        <div className="animate-bounce cursor-pointer flex items-center space-x-4">
          <span className="text-[10px] tracking-[0.3em] font-bold opacity-60 text-white uppercase">CUỘN XUỐNG</span>
          <ChevronDown className="w-5 h-5 opacity-60 text-white" />
        </div>

        <button 
          onClick={togglePlay}
          className="group flex items-center space-x-3 cursor-pointer hover:opacity-100 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            ) : (
              <Play className="w-4 h-4 text-white/60 group-hover:text-white transition-colors ml-0.5" />
            )}
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold opacity-40 group-hover:opacity-80 text-white uppercase transition-opacity">
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
