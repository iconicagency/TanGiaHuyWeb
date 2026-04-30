'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const DEFAULT_CONTACT = {
  address: "TT Nam Giang, Nam Trực, tỉnh Nam Định",
  phone: "0971.325.658",
  email: "tangiahuy.nd@gmail.com",
  background: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80"
};

interface ContactProps {
  isActive?: boolean;
}

const Contact: React.FC<ContactProps> = ({ isActive }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [bgImage, setBgImage] = useState(DEFAULT_CONTACT.background);
  const [prevActive, setPrevActive] = useState(isActive);

  if (prevActive !== isActive) {
    setPrevActive(isActive);
    setIsRevealed(false);
  }

  useEffect(() => {
    const unsubGen = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists() && snap.data().section6Bg) {
        setBgImage(snap.data().section6Bg);
      }
    });

    const unsub = onSnapshot(doc(db, 'contact', 'info'), (snap) => {
      if (snap.exists()) {
        setContact(snap.data() as any);
      }
    }, (err) => {
      console.error("[Contact] Snapshot error:", err);
    });
    return () => {
      unsubGen();
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <section className="relative h-full w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background with blurred reveal effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Vintage background"
          className={cn(
            "w-full h-full object-cover transition-all duration-[2000ms] ease-in-out",
            isRevealed ? "blur-xl opacity-40 grayscale" : "blur-none opacity-100 grayscale-0"
          )}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Content Reveal */}
      <motion.div
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 40 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl px-12 md:px-24 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Side: Contact Info */}
        <div className="text-white space-y-6 md:space-y-12 md:w-[45%]">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight uppercase opacity-90 text-brand-gold whitespace-nowrap">
              TÂN GIA HUY
            </h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start space-x-4 md:space-x-6 group">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-brand-gold mt-1" />
              <div>
                <p className="text-base md:text-xl font-light leading-snug max-w-sm text-white/80">
                  {contact.address || 'TT Nam Giang, Nam Trực, tỉnh Nam Định'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 group">
              <Phone className="w-5 h-5 md:w-6 md:h-6 text-brand-gold" />
              <p className="text-base md:text-xl font-light text-white/80">
                {contact.phone}
              </p>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 group">
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-brand-gold" />
              <p className="text-base md:text-xl font-light text-white/80">
                {contact.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Map - Increased size by 30% from previous small version */}
        <div className="md:w-[50%] flex justify-center md:justify-end mt-8 md:mt-0">
          <div className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] max-w-[90vw] max-h-[90vw] rounded-full overflow-hidden border-[8px] border-white/5 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14945.54160417578!2d106.205!3d20.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135e69f8c6cd7b1%3A0x8c7c7f3e8f6e80b1!2zTmFtIEdpYW5nLCBOYW0gVHLhu7FjLCBOYW0gxJDhu4tuaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1714490000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert-[5%] contrast-[110%] brightness-[95%] hover:grayscale-0 transition-all duration-1000 scale-[1.5]"
            />
            {/* Inner vignette overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </motion.div>

      {/* Synchronized Footer Area like Projects section */}
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

export default Contact;
