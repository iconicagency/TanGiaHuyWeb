'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import CollectionSlider from '@/components/CollectionSlider';
import Collections from '@/components/Collections';
import Projects from '@/components/Projects';
import News from '@/components/News';
import Contact from '@/components/Contact';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  
  const sections = [
    { component: Hero, id: 'hero' },
    { component: CollectionSlider, id: 'collection-slider' },
    { component: Projects, id: 'projects' },
    { component: Collections, id: 'collections' },
    { component: News, id: 'news' },
    { component: Contact, id: 'contact' },
  ];

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollY = scrollContainerRef.current.scrollTop;
      const height = window.innerHeight;
      const index = Math.round(scrollY / height);
      if (index !== currentSection) {
        setCurrentSection(index);
      }
    }
  };

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      isScrolling.current = true;
      scrollContainerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
      setCurrentSection(index);
      
      // Reset blocking after animation
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent multiple triggered scrolls
      if (isScrolling.current) return;

      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentSection, sections.length]);

  return (
    <main className="relative bg-black overflow-hidden h-screen">
      <Navbar />
      <Sidebar 
        currentSection={currentSection} 
        totalSections={sections.length} 
        onSectionClick={scrollToSection} 
      />
      
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sections.map((Section, index) => (
          <div 
            key={Section.id} 
            className="h-screen w-full snap-start snap-always overflow-hidden relative force-snap"
          >
            <Section.component isActive={currentSection === index} />
          </div>
        ))}
      </div>
    </main>
  );
}
