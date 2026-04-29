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
        <div className="text-white space-y-12 md:w-[45%]">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-black tracking-[0.25em] uppercase opacity-90 text-brand-gold">
              TÂN GIA HUY
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-6 group">
              <MapPin className="w-6 h-6 text-white/40 mt-1" />
              <div>
                <p className="text-lg md:text-xl font-light leading-snug max-w-sm text-white/80">
                  {contact.address}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 group">
              <Phone className="w-6 h-6 text-white/40" />
              <p className="text-lg md:text-xl font-light text-white/80">
                {contact.phone}
              </p>
            </div>

            <div className="flex items-center space-x-6 group">
              <Mail className="w-6 h-6 text-white/40" />
              <p className="text-lg md:text-xl font-light text-white/80">
                {contact.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Map */}
        <div className="md:w-[55%] flex justify-end">
          <div className="relative w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full overflow-hidden border-[15px] border-white/5 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324283!2d106.66336597587842!3d10.7760193893732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f143714697d%3A0xc07a27eb27670729!2sEurotile%20Center!5e0!3m2!1sen!2s!4v1709187342930!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert-[5%] contrast-[110%] brightness-[95%] hover:grayscale-0 transition-all duration-1000 scale-[1.3] translate-y-[-5%]"
            />
            {/* Inner vignette overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
          </div>
        </div>
      </motion.div>

      {/* Global Footer Bar - Integrated at bottom */}
      <div className="absolute bottom-0 left-0 w-full z-30 px-12 py-8 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">
            © 2024 TÂN GIA HUY. ALL RIGHTS RESERVED.
          </span>
          <div className="flex space-x-4">
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110">
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110">
              <Youtube className="w-4 h-4" />
            </Link>
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-all transform hover:scale-110 font-bold text-[10px]">
              Zalo
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-8 text-[11px] text-white/60 font-bold tracking-widest uppercase">
          <Link href="#" className="hover:text-white transition-colors">Site map</Link>
          <div className="flex items-center space-x-2">
            <span className="text-white/30">|</span>
            <span>hotline: 0971.325.658</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/30">|</span>
            <Link href="mailto:tangiahuy.nd@gmail.com" className="p-2 bg-brand-gold rounded-full hover:scale-110 transition-transform">
              <Mail className="w-3 h-3 text-white" />
            </Link>
            <span className="lowercase text-[10px] opacity-60">tangiahuy.nd@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
