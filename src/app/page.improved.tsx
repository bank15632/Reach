"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from "react";
import { Pause, Play, Calendar, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { products as racketProducts, shoeProducts, sportswearProducts, supplementProducts } from "@/data/productData";
import { tournaments, statusConfig, TournamentStatus } from "@/data/tournamentData";
import { SectionErrorBoundary } from "@/components/ErrorBoundary";
import { SectionLoading, ProductCardSkeleton } from "@/components/ui/Loading";
import SkipLink from "@/components/ui/SkipLink";

// Lazy load heavy components
const InstagramGallery = lazy(() => import("@/components/sections/InstagramGallery"));
const Footer = lazy(() => import("@/components/sections/Footer"));

// Hero Section - Improved with accessibility and video optimization
function HeroSection() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);

  const SLIDE_DURATION = 5000;

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070',
      video: '/video/hero-01.mp4',
      title: language === 'th' ? 'ไม้แบดรุ่นใหม่' : 'NEW RACKETS',
      subtitle: language === 'th'
        ? 'ทรงพลัง แม่นยำ เบาสุดขีด เพื่อก้าวสู่แชมป์'
        : 'Power. Precision. Performance. Built for champions.',
      cta1: { text: language === 'th' ? 'ช้อปไม้แบด' : 'SHOP RACKETS', href: '/rackets' },
      cta2: { text: language === 'th' ? 'ดูทั้งหมด' : 'VIEW ALL', href: '/shop' },
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070',
      video: '/video/hero-02.mp4',
      title: language === 'th' ? 'รองเท้าคอร์ท' : 'COURT SHOES',
      subtitle: language === 'th'
        ? 'ยึดเกาะสนามทุกจังหวะ คล่องตัวทุกการเคลื่อนไหว'
        : 'Superior grip. Lightning agility. Dominate every court.',
      cta1: { text: language === 'th' ? 'ช้อปรองเท้า' : 'SHOP SHOES', href: '/shoes' },
      cta2: { text: language === 'th' ? 'ดูทั้งหมด' : 'VIEW ALL', href: '/shop' },
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=2070',
      video: '/video/hero-03.mp4',
      title: language === 'th' ? 'เซ็ทสุดคุ้ม' : 'TOURNAMENT SETS',
      subtitle: language === 'th'
        ? 'อุปกรณ์ครบชุด ประหยัดกว่าซื้อแยก พร้อมลุยทัวร์นาเมนต์'
        : 'Complete gear bundles. Save up to 20%. Ready to compete.',
      cta1: { text: language === 'th' ? 'ช้อปเซ็ท' : 'SHOP BUNDLES', href: '/bundles' },
      cta2: { text: language === 'th' ? 'ดูทั้งหมด' : 'VIEW ALL', href: '/shop' },
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2070',
      video: '/video/hero-04.mp4',
      title: language === 'th' ? 'ชุดกีฬา' : 'SPORTSWEAR',
      subtitle: language === 'th'
        ? 'เสื้อผ้าระบายอากาศดี ยืดหยุ่นสูง พร้อมลุยทุกแมตช์'
        : 'Breathable. Flexible. Performance apparel for every match.',
      cta1: { text: language === 'th' ? 'ช้อปชุดกีฬา' : 'SHOP APPAREL', href: '/apparel' },
      cta2: { text: language === 'th' ? 'ดูทั้งหมด' : 'VIEW ALL', href: '/shop' },
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(nextProgress);

      if (elapsed >= SLIDE_DURATION) {
        setCurrentSlide((current) => (current + 1) % slides.length);
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, currentSlide, slides.length]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const currentSlideData = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={language === 'th' ? 'แบนเนอร์หลัก' : 'Hero banner'}
    >
      {/* Background Video with fallback image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlideData.video}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          {/* Fallback Image */}
          <Image
            src={currentSlideData.image}
            alt=""
            fill
            priority={currentSlide === 0}
            quality={85}
            className={`object-cover ${videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            sizes="100vw"
          />

          {/* Video */}
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            src={currentSlideData.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 lg:px-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight mb-6">
              <span className="text-white">{currentSlideData.title}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg">
              {currentSlideData.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href={currentSlideData.cta1.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-white text-black px-8 py-4 font-semibold text-sm tracking-wider hover:bg-brand-yellow hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-black"
                aria-label={currentSlideData.cta1.text}
              >
                {currentSlideData.cta1.text}
              </motion.a>
              <motion.a
                href={currentSlideData.cta2.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block border-2 border-white text-white px-8 py-4 font-semibold text-sm tracking-wider hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label={currentSlideData.cta2.text}
              >
                {currentSlideData.cta2.text}
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div
        className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-20 flex items-center justify-between"
        role="region"
        aria-label={language === 'th' ? 'การควบคุมสไลด์' : 'Slide controls'}
      >
        <div className="flex items-center gap-6">
          <div className="flex gap-2" role="tablist" aria-label={language === 'th' ? 'เลือกสไลด์' : 'Select slide'}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative w-12 md:w-16 h-1 bg-white/30 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`${language === 'th' ? 'สไลด์' : 'Slide'} ${index + 1}`}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: 0 }}
                  animate={{
                    width: index === currentSlide ? `${progress}%` : index < currentSlide ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.05 }}
                />
              </button>
            ))}
          </div>

          <span className="text-white/70 text-sm font-medium tracking-wider" aria-live="polite">
            {String(currentSlide + 1).padStart(2, '0')} OF {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
          aria-label={isPaused ? (language === 'th' ? 'เล่นสไลด์' : 'Play slideshow') : (language === 'th' ? 'หยุดสไลด์' : 'Pause slideshow')}
        >
          {isPaused ? (
            <>
              <Play size={16} aria-hidden="true" />
              <span className="text-sm font-medium tracking-wider hidden md:inline">{language === 'th' ? 'เล่น' : 'PLAY'}</span>
            </>
          ) : (
            <>
              <Pause size={16} aria-hidden="true" />
              <span className="text-sm font-medium tracking-wider hidden md:inline">{language === 'th' ? 'หยุด' : 'PAUSE'}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

// Continue with other sections...
// (I'll create separate files for modularity)

export default function Home() {
  return (
    <>
      <SkipLink />
      <main id="main-content">
        <Navbar />

        <SectionErrorBoundary>
          <HeroSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<SectionLoading />}>
            {/* Other sections will go here */}
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<SectionLoading />}>
            <InstagramGallery />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <Suspense fallback={<SectionLoading />}>
            <Footer />
          </Suspense>
        </SectionErrorBoundary>
      </main>
    </>
  );
}
