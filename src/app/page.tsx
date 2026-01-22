"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Pause, Play, Calendar, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { products as racketProducts, shoeProducts, sportswearProducts, supplementProducts } from "@/data/productData";
import { tournaments, statusConfig, TournamentStatus } from "@/data/tournamentData";

// Hero Section - Auto-Sliding Carousel like NOBULL
function HeroSection() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

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

  // Auto-advance slides (prevent skipping)
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

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Transition */}
      <AnimatePresence mode="sync">
        <motion.video
          key={currentSlideData.video}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full object-cover bg-black"
          style={{ y: backgroundY, scale: backgroundScale }}
          src={currentSlideData.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

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
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight mb-6">
              <span className="text-white">{currentSlideData.title}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg">
              {currentSlideData.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href={currentSlideData.cta1.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-white text-black px-8 py-4 font-semibold text-sm tracking-wider hover:bg-brand-yellow hover:text-black transition-colors"
              >
                {currentSlideData.cta1.text}
              </motion.a>
              <motion.a
                href={currentSlideData.cta2.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block border-2 border-white text-white px-8 py-4 font-semibold text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                {currentSlideData.cta2.text}
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls - NOBULL Style */}
      <div className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-20 flex items-center justify-between">
        {/* Left: Progress Bars & Counter */}
        <div className="flex items-center gap-6">
          {/* Progress Bars */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative w-12 md:w-16 h-1 bg-white/30 overflow-hidden cursor-pointer"
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

          {/* Slide Counter */}
          <span className="text-white/70 text-sm font-medium tracking-wider">
            {String(currentSlide + 1).padStart(2, '0')} OF {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Pause/Play Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          {isPaused ? (
            <>
              <Play size={16} />
              <span className="text-sm font-medium tracking-wider hidden md:inline">{language === 'th' ? 'เล่น' : 'PLAY'}</span>
            </>
          ) : (
            <>
              <Pause size={16} />
              <span className="text-sm font-medium tracking-wider hidden md:inline">{language === 'th' ? 'หยุด' : 'PAUSE'}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

// Tournament Showcase - Slider row with action buttons
function TournamentShowcase() {
  const { language } = useLanguage();
  const tournamentSlides = useMemo(() => tournaments.slice(0, 4), []);
  const [activeSlide, setActiveSlide] = useState(0);

  if (tournamentSlides.length === 0) return null;

  const totalSlides = tournamentSlides.length;

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (language === 'th') {
      const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear() + 543}`;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  };

  const actionConfig: Record<TournamentStatus, { label: string; labelTh: string; className: string; tab: string }> = {
    registration_open: {
      label: 'Register Now',
      labelTh: 'สมัครแข่งขัน',
      className: 'bg-brand-yellow text-black hover:bg-yellow-400',
      tab: 'register'
    },
    registration_closed: {
      label: 'View Schedule',
      labelTh: 'ดูกำหนดการ',
      className: 'bg-white text-black hover:bg-gray-100',
      tab: 'schedule'
    },
    coming_soon: {
      label: 'See Details',
      labelTh: 'ดูรายละเอียด',
      className: 'bg-white text-black hover:bg-gray-100',
      tab: 'info'
    },
    in_progress: {
      label: 'Live Results',
      labelTh: 'ดูผลสด',
      className: 'bg-red-500 text-white hover:bg-red-600',
      tab: 'cards'
    },
    completed: {
      label: 'View Results',
      labelTh: 'ดูผลคะแนน',
      className: 'bg-gray-900 text-white hover:bg-black',
      tab: 'winners'
    }
  };

  const goPrev = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setActiveSlide((prev) => (prev + 1) % totalSlides);

  return (
    <section className="relative py-16 md:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/tournament-showcase.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="lg:max-w-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'th' ? 'ทัวร์นาเมนต์ล่าสุด' : 'Latest Tournaments'}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6">
              {language === 'th'
                ? 'อัปเดตการแข่งขันใหม่ล่าสุด พร้อมเปิดรับสมัครและติดตามผลแบบเรียลไทม์'
                : 'Fresh competitions, live updates, and registration details for every event.'}
            </p>
            <a
              href="/tournament"
              className="inline-block bg-white text-black px-6 py-3 font-semibold text-sm tracking-wider rounded-full hover:bg-brand-yellow transition-colors"
            >
              {language === 'th' ? 'ดูทัวร์นาเมนต์ทั้งหมด' : 'View All Tournaments'}
            </a>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-xs font-semibold tracking-[0.3em] uppercase">
                {language === 'th' ? 'ไฮไลท์ทัวร์นาเมนต์' : 'Tournament Highlights'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  className="p-2 rounded-full border border-white/40 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous tournament"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  className="p-2 rounded-full border border-white/40 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next tournament"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {tournamentSlides.map((tournament) => {
                  const statusDisplay = statusConfig[tournament.status];
                  const action = actionConfig[tournament.status];
                  const actionHref = action.tab
                    ? `/tournament/${tournament.id}?tab=${action.tab}`
                    : `/tournament/${tournament.id}`;

                  return (
                    <div key={tournament.id} className="min-w-full">
                      <div className="bg-white/95 backdrop-blur rounded-2xl p-6 md:p-7 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded ${statusDisplay.bgColor} ${statusDisplay.textColor}`}>
                            {language === 'th' ? statusDisplay.labelTh : statusDisplay.label}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {language === 'th' ? 'เงินรางวัล' : 'Prize'} {tournament.prize}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-4">
                          {language === 'th' ? tournament.nameTh : tournament.name}
                        </h3>

                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{formatDateRange(tournament.dateStart, tournament.dateEnd)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>
                              {language === 'th'
                                ? `${tournament.location.cityTh} • ${tournament.location.venueTh}`
                                : `${tournament.location.city} • ${tournament.location.venue}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            <span>
                              {tournament.registeredCount}/{tournament.participants} {language === 'th' ? 'ผู้สมัคร' : 'registered'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-gray-800">
                            {language === 'th' ? 'ค่าสมัคร' : 'Entry fee'} {tournament.entryFee || '—'}
                          </span>
                          <a
                            href={actionHref}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${action.className}`}
                          >
                            {language === 'th' ? action.labelTh : action.label}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {tournamentSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${index === activeSlide ? 'bg-brand-yellow' : 'bg-white/40'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeaturedColor = {
  name: string;
  nameTh: string;
  hex: string;
  image: string;
};

interface FeaturedProduct {
  id: string;
  name: string;
  nameTh: string;
  categoryLabel: string;
  categoryLabelTh: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  href: string;
  images: string[];
  colors: FeaturedColor[];
}

// Featured Products Grid - NOBULL Style
function FeaturedProducts() {
  const { language } = useLanguage();
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});

  const featuredProducts = useMemo<FeaturedProduct[]>(() => {
    const isBestSeller = (badge?: string) => badge?.toLowerCase().includes('best');

    const rackets = racketProducts
      .filter((product) => isBestSeller(product.badge))
      .map((product) => ({
        id: product.id,
        name: product.name,
        nameTh: product.nameTh,
        categoryLabel: 'Badminton',
        categoryLabelTh: 'ไม้แบดมินตัน',
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        href: `/rackets/${product.id}`,
        images: product.images,
        colors: product.colors,
      }));

    const shoes = shoeProducts
      .filter((product) => isBestSeller(product.badge))
      .map((product) => ({
        id: product.id,
        name: product.name,
        nameTh: product.nameTh,
        categoryLabel: 'Shoes',
        categoryLabelTh: 'รองเท้า',
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        href: `/shoes/${product.id}`,
        images: product.images,
        colors: product.colors,
      }));

    const sportswear = sportswearProducts
      .filter((product) => isBestSeller(product.badge))
      .map((product) => ({
        id: product.id,
        name: product.name,
        nameTh: product.nameTh,
        categoryLabel: 'Sportswear',
        categoryLabelTh: 'ชุดกีฬา',
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        href: `/sportswear/${product.id}`,
        images: product.images,
        colors: product.colors,
      }));

    const supplements = supplementProducts
      .filter((product) => isBestSeller(product.badge))
      .map((product) => ({
        id: product.id,
        name: product.name,
        nameTh: product.nameTh,
        categoryLabel: 'Supplements',
        categoryLabelTh: 'อาหารเสริม',
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        href: `/supplements/${product.id}`,
        images: product.images,
        colors: product.colors,
      }));

    return [...rackets, ...shoes, ...sportswear, ...supplements].slice(0, 4);
  }, []);

  const getSelectedColorIndex = (productId: string) => selectedColors[productId] || 0;
  const isLightSwatch = (hex: string) => ['#ffffff', '#f5f5f5', '#f3e5ab'].includes(hex.toLowerCase());

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            {language === 'th' ? 'สินค้าขายดี' : 'Shop Best Sellers'}
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product: FeaturedProduct, index: number) => {
            const selectedIndex = getSelectedColorIndex(product.id);
            const selectedColor = product.colors[selectedIndex] ?? product.colors[0];
            const displayImage = selectedColor?.image || product.images[0];
            const hoverImage = product.images[1] || displayImage;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                {/* Product Card */}
                <a href={product.href} className="block relative">
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-3 left-3 z-10 px-2 py-1 text-xs font-bold ${product.badge.includes('OFF') || product.badge.includes('ประหยัด')
                      ? 'bg-lime-400 text-black'
                      : 'bg-black text-white'
                      }`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {/* Main Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-0"
                      style={{ backgroundImage: `url('${displayImage}')` }}
                    />
                    {/* Hover Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ backgroundImage: `url('${hoverImage}')` }}
                    />
                  </div>
                </a>

                {/* Color Swatches */}
                <div className="flex gap-1.5 mt-3 mb-3">
                  {product.colors.map((color: FeaturedProduct['colors'][number], colorIndex: number) => (
                    <button
                      key={colorIndex}
                      type="button"
                      onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: colorIndex }))}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${colorIndex === selectedIndex
                        ? 'border-black ring-2 ring-offset-1 ring-black'
                        : 'border-gray-300 hover:border-gray-500'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={language === 'th' ? color.nameTh : color.name}
                    >
                      {isLightSwatch(color.hex) && (
                        <span className="block w-full h-full border border-gray-200 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Product Info */}
                <a href={product.href} className="block">
                  <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                    {language === 'th' ? product.nameTh : product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {language === 'th' ? product.categoryLabelTh : product.categoryLabel}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {language === 'th' ? selectedColor?.nameTh : selectedColor?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">฿{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/shop"
            className="inline-block border-2 border-black text-black px-8 py-4 font-semibold text-sm tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            {language === 'th' ? 'ดูสินค้าทั้งหมด' : 'VIEW ALL PRODUCTS'}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// New To Reach Banner - For Beginners (Full Width Background with Text Overlay)
function NewToReachBanner() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center">
      {/* Full Width Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2000')" }}
      />
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {language === 'th' ? 'สำหรับผู้เริ่มต้นใหม่' : 'NEW TO REACH?'}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            {language === 'th'
              ? 'คุณเป็นมือใหม่ใช่ไหม? เราแนะนำเซ็ทที่ช่วยให้คุณพร้อมเล่นได้ทันที อุปกรณ์ครบ ราคาสุดคุ้ม'
              : 'New to badminton? We recommend starter sets that get you ready to play right away. Complete gear at great value.'}
          </p>
          <a
            href="/welcome"
            className="inline-block bg-brand-yellow text-black px-8 py-4 font-semibold text-sm tracking-wider rounded-full hover:bg-white transition-colors"
          >
            {language === 'th' ? 'เริ่มต้นที่นี่' : 'Learn More'}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// Latest Articles Section - 9:16 Cards
function LatestArticles() {
  const { language } = useLanguage();

  const articles = [
    {
      id: 'choosing-right-racket',
      title: 'วิธีเลือกไม้แบดให้เหมาะกับสไตล์การเล่น',
      titleEn: 'How to Choose the Right Racket',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
      category: 'Tips',
      categoryTh: 'เคล็ดลับ',
    },
    {
      id: 'string-tension-guide',
      title: 'ความตึงเอ็นแบบไหนเหมาะกับคุณ?',
      titleEn: 'String Tension Guide',
      image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
      category: 'Guide',
      categoryTh: 'คู่มือ',
    },
    {
      id: 'warm-up-exercises',
      title: '5 ท่าอบอุ่นร่างกายก่อนเล่นแบด',
      titleEn: '5 Essential Warm-up Exercises',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
      category: 'Fitness',
      categoryTh: 'ฟิตเนส',
    },
    {
      id: 'doubles-strategy',
      title: 'กลยุทธ์คู่: ตำแหน่งและการเคลื่อนที่',
      titleEn: 'Doubles Strategy: Positioning',
      image: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?q=80&w=800',
      category: 'Strategy',
      categoryTh: 'กลยุทธ์',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            {language === 'th' ? 'บทความล่าสุด' : 'Latest Articles'}
          </h2>
          <a
            href="/articles"
            className="text-sm font-medium text-gray-600 hover:text-black underline transition-colors"
          >
            {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
          </a>
        </motion.div>

        {/* Articles Grid - 4 cards 9:16 ratio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href={`/articles/${article.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* 9:16 Image */}
              <div className="relative aspect-[9/16] overflow-hidden bg-gray-100 rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${article.image}')` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-yellow text-black px-2 py-1 text-xs font-bold uppercase">
                    {language === 'th' ? article.categoryTh : article.category}
                  </span>
                </div>
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight group-hover:text-brand-yellow transition-colors">
                    {language === 'th' ? article.title : article.titleEn}
                  </h3>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Gallery - NOBULL Style "Get Stronger With Us"
function InstagramGallery() {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const posts = [
    {
      id: 'post1',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
      handle: '@reachbadminton',
      link: 'https://instagram.com/reachbadminton',
    },
    {
      id: 'post2',
      image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600',
      handle: '@reachtraining',
      link: 'https://instagram.com/reachtraining',
    },
    {
      id: 'post3',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600',
      handle: '@reachcommunity',
      link: 'https://instagram.com/reachcommunity',
    },
    {
      id: 'post4',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600',
      handle: '@reachstyle',
      link: 'https://instagram.com/reachstyle',
    },
    {
      id: 'post5',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
      handle: '@reachfootwork',
      link: 'https://instagram.com/reachfootwork',
    },
    {
      id: 'post6',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      handle: '@reachgear',
      link: 'https://instagram.com/reachgear',
    },
    {
      id: 'post7',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600',
      handle: '@reachmoves',
      link: 'https://instagram.com/reachmoves',
    },
    {
      id: 'post8',
      image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=600',
      handle: '@reachofficial',
      link: 'https://instagram.com/reachofficial',
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(progress);
    }
  };

  const scrollLeftFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-medium text-black text-center mb-10 italic"
        >
          {language === 'th' ? 'ก้าวหน้าไปด้วยกัน' : 'Get Stronger With Us'}
        </motion.h2>

        {/* Scrollable Gallery */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[70%] md:w-[23%] max-w-[320px] snap-start group"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-black">
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                {post.handle}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Large Brand Text */}
        <div className="mt-8 overflow-hidden">
          <h3 className="text-[80px] md:text-[150px] font-bold text-gray-200 leading-none tracking-tighter select-none">
            REACH
          </h3>
        </div>

        {/* Slider Progress Bar & Navigation */}
        <div className="flex items-center justify-end mt-4 gap-4">
          {/* Progress Bar */}
          <div className="flex-1 h-px bg-gray-300 relative">
            <div
              className="absolute left-0 top-0 h-px bg-black transition-all duration-300"
              style={{ width: `${Math.max(25, scrollProgress * 75 + 25)}%` }}
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center">
            <button
              onClick={scrollLeftFn}
              className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-300" />
            <button
              onClick={scrollRightFn}
              className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="py-12 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">REACH</h3>
            <p className="text-gray-400 text-sm">
              {language === 'th'
                ? 'อุปกรณ์แบดมินตันระดับมืออาชีพ'
                : 'Professional badminton equipment'}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">{language === 'th' ? 'ช้อป' : 'SHOP'}</h4>
            <ul className="space-y-2">
              <li><a href="/rackets" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'ไม้แบด' : 'Rackets'}</a></li>
              <li><a href="/shoes" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'รองเท้า' : 'Shoes'}</a></li>
              <li><a href="/sportswear" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'ชุดกีฬา' : 'Sportswear'}</a></li>
              <li><a href="/supplements" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'อาหารเสริม' : 'Supplements'}</a></li>
              <li><a href="/bundles" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'เซ็ตสุดคุ้ม' : 'Bundles'}</a></li>
              <li><a href="/shop" className="text-gray-400 hover:text-white text-sm">{language === 'th' ? 'ดูสินค้าทั้งหมด' : 'All Products'}</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">{language === 'th' ? 'ช่วยเหลือ' : 'HELP'}</h4>
            <ul className="space-y-3">
              <li>
                <a href="/track-order" className="text-gray-200 hover:text-white text-sm font-medium">{language === 'th' ? 'ติดตามคำสั่งซื้อ' : 'Track Order'}</a>
                <p className="text-gray-500 text-xs">{language === 'th' ? 'กรอกเลขพัสดุและติดต่อทีมงานผ่านโซเชียลได้ทันที' : 'Enter your tracking ID and chat with support instantly.'}</p>
              </li>
              <li>
                <a href="/returns" className="text-gray-200 hover:text-white text-sm font-medium">{language === 'th' ? 'คืน / เปลี่ยนสินค้า' : 'Returns & Exchanges'}</a>
                <p className="text-gray-500 text-xs">{language === 'th' ? 'อ่านขั้นตอนการคืนสินค้าและติดต่อทีมงานผ่าน Social ช่องทางต่างๆ' : 'Review the return steps and reach us via social channels.'}</p>
              </li>
              <li>
                <a href="/welcome" className="text-gray-200 hover:text-white text-sm font-medium">{language === 'th' ? 'คู่มือเลือกสินค้า' : 'Product Guides'}</a>
                <p className="text-gray-500 text-xs">{language === 'th' ? 'คำแนะนำการเลือกอุปกรณ์ให้เหมาะกับระดับการเล่น' : 'Find the right gear for your play style.'}</p>
              </li>
              <li>
                <a href="/affiliate" className="text-gray-200 hover:text-brand-yellow text-sm font-medium">{language === 'th' ? 'ร่วมงานกับเรา' : 'Partner With Us'}</a>
                <p className="text-gray-500 text-xs">{language === 'th' ? 'สำหรับโค้ช สโมสร และผู้จัดงานที่ต้องการความร่วมมือ' : 'For coaches, clubs, and event partners.'}</p>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">{language === 'th' ? 'ติดตามเรา' : 'FOLLOW US'}</h4>
            <div className="flex gap-4">
              {/* Facebook */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="X">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* LINE */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LINE">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Reach Pro Store. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <NewToReachBanner />
      <LatestArticles />
      <TournamentShowcase />
      <InstagramGallery />
      <Footer />
    </main>
  );
}
