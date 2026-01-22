"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { getProductById, products, Product } from "@/data/productData";
import { notFound } from "next/navigation";
import { use } from "react";
import { ChevronDown, ChevronRight, X, ShoppingCart, Check } from "lucide-react";
import CartToast from "@/components/ui/CartToast";

// Performance Slider Component - YELLOW dots with slide animation
function PerformanceSlider({
    label,
    labelTh,
    value,
    leftLabel,
    rightLabel,
    language
}: {
    label: string;
    labelTh: string;
    value: number;
    leftLabel: string;
    rightLabel: string;
    language: string;
}) {
    const percentage = (value / 10) * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{language === 'th' ? labelTh : label}</span>
            </div>
            <div className="relative">
                <div className="h-1 bg-gray-200 rounded-full">
                    <motion.div
                        initial={{ left: 0 }}
                        whileInView={{ left: `calc(${percentage}% - 8px)` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="absolute h-4 w-4 bg-brand-yellow rounded-full top-1/2 -translate-y-1/2 shadow-md border-2 border-white"
                    />
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            </div>
        </div>
    );
}

// Product Gallery Component with Color-Based Main Image
function ProductGallery({ images, mainImage }: { images: string[]; mainImage?: string }) {
    const [selectedImage, setSelectedImage] = useState(0);

    // Use mainImage (from color selection) if provided, otherwise use images array
    const displayImage = mainImage || images[selectedImage];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <motion.div
                key={displayImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-100 overflow-hidden"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${displayImage}')` }}
                />
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 bg-cover bg-center border-2 transition-colors ${idx === selectedImage && !mainImage ? 'border-black' : 'border-transparent hover:border-gray-300'
                                }`}
                            style={{ backgroundImage: `url('${img}')` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Collapsible Specifications Section (Dropdown)
function SpecificationsDropdown({ specs, language }: { specs: Product['specs']; language: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const specItems = [
        { key: 'weightGrip', label: 'Weight & Grip', labelTh: 'น้ำหนัก & กริป' },
        { key: 'performance', label: 'Performance', labelTh: 'ประสิทธิภาพ' },
        { key: 'series', label: 'Series', labelTh: 'ซีรีส์' },
        { key: 'playerType', label: 'Player Type', labelTh: 'ระดับผู้เล่น' },
        { key: 'stringingAdvice', label: 'Stringing Advice', labelTh: 'แรงขึ้นเอ็น' },
        { key: 'balance', label: 'Balance', labelTh: 'สมดุล' },
        { key: 'material', label: 'Material', labelTh: 'วัสดุ' },
        { key: 'racquetLength', label: 'Racquet Length', labelTh: 'ความยาว' },
        { key: 'shaftFlex', label: 'Shaft Flex', labelTh: 'ความยืดหยุ่นก้าน' },
        { key: 'productTier', label: 'Product Tier', labelTh: 'ระดับสินค้า' },
        { key: 'stringPattern', label: 'String Pattern', labelTh: 'ลายเอ็น' },
        { key: 'parentSku', label: 'SKU', labelTh: 'รหัสสินค้า' },
    ];

    return (
        <div className="border-t border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <h2 className="text-lg font-bold text-gray-900">
                    {language === 'th' ? 'สเปคสินค้า' : 'Specifications'}
                </h2>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {specItems.map((item) => (
                                <div key={item.key} className="border-b border-gray-100 pb-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        {language === 'th' ? item.labelTh : item.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {specs[item.key as keyof typeof specs]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Chevron Dropdown Component (like สเปคสินค้า)
function ChevronDropdown({
    title,
    children,
    isOpen,
    onToggle
}: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-t border-gray-200">
            <button
                onClick={onToggle}
                className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <h2 className="text-lg font-bold text-gray-900">
                    {title}
                </h2>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Attention to Detail Section with all 3 dropdowns
function AttentionToDetailSection({
    product,
    language
}: {
    product: Product;
    language: string;
}) {
    const [importantOpen, setImportantOpen] = useState(false);
    const [techNerdsOpen, setTechNerdsOpen] = useState(false);
    const [attentionOpen, setAttentionOpen] = useState(false);

    // Important features based on product specs
    const importantFeatures = [
        {
            title: language === 'th' ? 'สมดุลหัวเบา' : 'Head Light Balance',
            desc: language === 'th'
                ? `${product.specs.balance} สำหรับการตอบสนองที่รวดเร็วและการควบคุมที่แม่นยำ`
                : `${product.specs.balance} for quick response and precise control`
        },
        {
            title: language === 'th' ? 'ก้านยืดหยุ่น' : 'Shaft Flexibility',
            desc: language === 'th'
                ? `ก้าน ${product.specs.shaftFlex} สำหรับการเล่นที่ลื่นไหลและพลังที่เหมาะสม`
                : `${product.specs.shaftFlex} shaft for smooth play and optimal power`
        },
        {
            title: language === 'th' ? 'วัสดุคุณภาพสูง' : 'Premium Material',
            desc: language === 'th'
                ? `ผลิตจาก ${product.specs.material} น้ำหนักเบา ทนทาน`
                : `Made with ${product.specs.material}, lightweight and durable`
        },
    ];

    // Tech specs table data
    const techSpecs = [
        { label: language === 'th' ? 'น้ำหนัก' : 'Weight', value: product.specs.weightGrip },
        { label: language === 'th' ? 'สมดุล' : 'Balance', value: product.specs.balance },
        { label: language === 'th' ? 'แรงขึ้นเอ็น' : 'Stringing Advice', value: product.specs.stringingAdvice },
        { label: language === 'th' ? 'วัสดุ' : 'Material', value: product.specs.material },
        { label: language === 'th' ? 'ความยาว' : 'Length', value: product.specs.racquetLength },
        { label: language === 'th' ? 'ระดับผู้เล่น' : 'Player Level', value: product.specs.playerType },
        { label: language === 'th' ? 'รหัสสินค้า' : 'SKU', value: product.specs.parentSku },
    ];

    // Attention to Detail content (3 columns)
    const detailFeatures = [
        {
            title: language === 'th' ? 'โครงสร้างแข็งแรง' : 'Strong Frame',
            desc: language === 'th' ? 'โครงไม้ที่ออกแบบมาเพื่อความทนทานและพลังในการตี' : 'Frame designed for durability and hitting power'
        },
        {
            title: language === 'th' ? 'น้ำหนักสมดุล' : 'Balanced Weight',
            desc: language === 'th' ? 'การกระจายน้ำหนักที่ลงตัวเพื่อการควบคุมที่ดี' : 'Perfect weight distribution for excellent control'
        },
        {
            title: language === 'th' ? 'กริปพรีเมียม' : 'Premium Grip',
            desc: language === 'th' ? 'ด้ามจับคุณภาพสูงช่วยเพิ่มความมั่นใจในการเล่น' : 'High-quality handle for confident play'
        },
    ];

    return (
        <section className="py-4 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* สิ่งสำคัญ Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'สิ่งสำคัญ' : 'The Important Stuff'}
                    isOpen={importantOpen}
                    onToggle={() => setImportantOpen(!importantOpen)}
                >
                    <div className="pb-6">
                        {importantFeatures.map((feature, idx) => (
                            <div key={idx} className="mb-4">
                                <p className="text-sm font-bold text-black">{feature.title}</p>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </ChevronDropdown>

                {/* สำหรับสาย TECH Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'สำหรับสาย Tech' : 'For the Tech Nerds'}
                    isOpen={techNerdsOpen}
                    onToggle={() => setTechNerdsOpen(!techNerdsOpen)}
                >
                    <div className="pb-6">
                        {techSpecs.map((spec, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                            >
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {spec.label}
                                </span>
                                <span className="text-sm font-medium text-black uppercase">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </ChevronDropdown>

                {/* Attention to Detail Dropdown with custom layout */}
                <ChevronDropdown
                    title={language === 'th' ? 'ความใส่ใจในรายละเอียด' : 'Attention to Detail'}
                    isOpen={attentionOpen}
                    onToggle={() => setAttentionOpen(!attentionOpen)}
                >
                    <div className="pb-8">
                        {/* Row 1: Large image + Small image */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Large image (2/3 width) */}
                            <div className="col-span-2 aspect-[16/10] bg-gray-100 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${product.images[0]}')` }}
                                />
                            </div>
                            {/* Small image (1/3 width) */}
                            <div className="col-span-1 aspect-[10/16] bg-gray-100 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${product.images[1] || product.images[0]}')` }}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-300 my-6" />

                        {/* Row 2: 3-column text */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {detailFeatures.map((feature, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-bold text-black mb-1">{feature.title}</p>
                                    <p className="text-sm text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Row 3: Ultrawide 21:9 image */}
                        <div className="aspect-[21/9] bg-gray-100 overflow-hidden">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${product.images[2] || product.images[0]}')` }}
                            />
                        </div>
                    </div>
                </ChevronDropdown>
            </div>
        </section>
    );
}

// Community Gallery Component - REACH Style (4:5 aspect ratio with progress bar)
function CommunityGallery({ videos, language }: { videos: Product['videos']; language: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

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

    // Extended community content
    const communityContent = [
        { thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', username: '@reach_official' },
        { thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600', username: '@badminton_pro' },
        { thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600', username: '@player_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600', username: '@coach_reach' },
        { thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', username: '@shuttlecock_king' },
        { thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', username: '@pro_player' },
        { thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600', username: '@badminton_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600', username: '@reach_athlete' },
    ];

    const allContent = videos && videos.length > 0 ? [...videos, ...communityContent] : communityContent;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-10">
                    {language === 'th' ? 'จากคอมมูนิตี้ของเรา' : 'From Our Community'}
                </h2>

                {/* Scrollable Video Carousel - Instagram 4:5 aspect ratio */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {allContent.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex-shrink-0 w-[45%] md:w-[23%] snap-start"
                        >
                            <a
                                href="#"
                                className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-black block"
                            >
                                {/* Video Thumbnail */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${item.thumbnail}')` }}
                                />

                                {/* Play Button Overlay */}
                                <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
                                </div>

                                {/* Mute Icon */}
                                <div className="absolute top-3 right-3 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </a>
                            {/* Username below each video */}
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {item.username}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Slider Progress Bar & Navigation */}
                <div className="flex items-center justify-end mt-6 gap-4">
                    {/* Progress Bar */}
                    <div className="flex-1 h-px bg-gray-300 relative">
                        <div
                            className="absolute left-0 top-0 h-px bg-brand-yellow transition-all duration-300"
                            style={{ width: `${Math.max(25, scrollProgress * 75 + 25)}%` }}
                        />
                    </div>

                    {/* Navigation Arrows with Dividers */}
                    <div className="flex items-center">
                        <button
                            onClick={scrollLeftFn}
                            className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <div className="w-px h-4 bg-gray-300" />
                        <button
                            onClick={scrollRightFn}
                            className="px-3 py-2 text-gray-400 hover:text-black transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// You Might Also Like Component (Full width, more products)
function YouMightAlsoLike({ currentProductId, language }: { currentProductId: string; language: string }) {
    // Get all products except current one
    const relatedProducts = products.filter(p => p.id !== currentProductId);

    if (relatedProducts.length === 0) return null;

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 italic">
                    {language === 'th' ? 'สินค้าที่คุณอาจชอบ' : 'You Might Also Like'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {relatedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/rackets/${product.id}`}
                            className="group"
                        >
                            <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${product.images[0]}')` }}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:underline line-clamp-1">
                                    {language === 'th' ? product.nameTh : product.name}
                                </p>
                                <p className="text-xs text-gray-500">{product.specs.series}</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    ฿{product.price.toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Discount Badge Component (NOBULL style)
function DiscountBadge({
    product,
    language
}: {
    product: Product;
    language: string;
}) {
    if (!product.originalPrice) return null;

    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
    const promoCode = "REACH30"; // Promo code

    return (
        <div className="space-y-2">
            {/* Promo Code Badge */}
            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-bold text-green-700">{promoCode}</span>
                </div>
            </div>
            {/* Discount Message */}
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded-sm" />
                <p className="text-sm text-gray-600">
                    {language === 'th'
                        ? `ลด ${discountPercent}% สำหรับไม้แบดซีรีส์นี้ ส่วนลดแสดงแล้ว`
                        : `${discountPercent}% OFF TRAINING ESSENTIALS. DISCOUNT AS SHOWN.`
                    }
                </p>
            </div>
        </div>
    );
}

// Racket Guide Modal Component
function RacketGuideModal({
    isOpen,
    onClose,
    language
}: {
    isOpen: boolean;
    onClose: () => void;
    language: string;
}) {
    if (!isOpen) return null;

    const guideContent = [
        {
            title: language === 'th' ? '1. สมดุลไม้ (Balance)' : '1. Racket Balance',
            desc: language === 'th'
                ? 'Head Heavy: พลังมาก เหมาะสำหรับสแมช | Head Light: ยืดหยุ่นสูง เหมาะสำหรับเกมหน้าเน็ต | Even Balance: สมดุลทั้งสองด้าน'
                : 'Head Heavy: More power for smashes | Head Light: Flexible for net play | Even Balance: Balanced for all-round'
        },
        {
            title: language === 'th' ? '2. ความยืดหยุ่นก้าน (Shaft Flex)' : '2. Shaft Flexibility',
            desc: language === 'th'
                ? 'Stiff: ควบคุมดี เหมาะผู้เล่นเร็ว | Medium: สมดุล | Flexible: พลังมาก เหมาะมือใหม่'
                : 'Stiff: Better control for fast players | Medium: Balanced | Flexible: More power for beginners'
        },
        {
            title: language === 'th' ? '3. น้ำหนักไม้ (Weight)' : '3. Racket Weight',
            desc: language === 'th'
                ? '2U (90-94g): หนัก พลังสูง | 3U (85-89g): สมดุล | 4U (80-84g): เบา ว่องไว | 5U (75-79g): เบามาก'
                : '2U (90-94g): Heavy, more power | 3U (85-89g): Balanced | 4U (80-84g): Light, agile | 5U (75-79g): Ultra light'
        },
        {
            title: language === 'th' ? '4. ขนาดกริป (Grip Size)' : '4. Grip Size',
            desc: language === 'th'
                ? 'G4: เล็ก มือเล็ก | G5: กลาง มาตรฐาน | G6: ใหญ่ มือใหญ่'
                : 'G4: Small hands | G5: Medium, standard | G6: Large hands'
        },
        {
            title: language === 'th' ? '5. แรงขึ้นเอ็น (String Tension)' : '5. String Tension',
            desc: language === 'th'
                ? '20-23 lbs: มือใหม่ | 24-26 lbs: ระดับกลาง | 27-30 lbs: มืออาชีพ'
                : '20-23 lbs: Beginners | 24-26 lbs: Intermediate | 27-30 lbs: Professional'
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {language === 'th' ? 'วิธีเลือกไม้แบด' : 'How to Choose a Racket'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {guideContent.map((item, idx) => (
                                <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                            {/* Tip */}
                            <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-800">
                                    💡 {language === 'th'
                                        ? 'เคล็ดลับ: หากเป็นมือใหม่ แนะนำให้เลือกไม้ 4U หรือ 5U ที่มีก้าน Flexible และสมดุล Even Balance เพื่อการเรียนรู้ที่ง่าย'
                                        : 'Tip: If you\'re a beginner, choose a 4U or 5U racket with Flexible shaft and Even Balance for easier learning.'
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Color Selector Component - Uses actual product colors
function ColorSelector({
    colors,
    selectedColorIndex,
    onColorChange,
    language
}: {
    colors: Array<{ name: string; nameTh: string; hex: string; image: string }>;
    selectedColorIndex: number;
    onColorChange: (index: number) => void;
    language: string;
}) {
    const selectedColor = colors[selectedColorIndex];

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-700">
                <span className="font-medium">{language === 'th' ? 'สี' : 'Color'}:</span> {language === 'th' ? selectedColor?.nameTh : selectedColor?.name}
            </p>
            <div className="flex gap-2">
                {colors.map((color, index) => (
                    <button
                        key={color.name}
                        onClick={() => onColorChange(index)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${index === selectedColorIndex
                            ? 'border-black ring-2 ring-offset-1 ring-black'
                            : 'border-gray-300 hover:border-gray-500'
                            }`}
                        style={{ backgroundColor: color.hex }}
                        title={language === 'th' ? color.nameTh : color.name}
                    />
                ))}
            </div>
        </div>
    );
}

// Weight & Grip Selector Component
function WeightGripSelector({
    specs,
    language,
    selectedGrip,
    onGripChange
}: {
    specs: Product['specs'];
    language: string;
    selectedGrip: string;
    onGripChange: (grip: string) => void;
}) {
    const grips = ['3UG5', '4UG5', '4UG6', '5UG5'];

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-700">
                <span className="font-medium">{language === 'th' ? 'น้ำหนัก & ขนาดกริป' : 'Weight & Grip Size'}:</span> {selectedGrip}
            </p>
            <div className="flex flex-wrap gap-2">
                {grips.map((grip) => (
                    <button
                        key={grip}
                        onClick={() => onGripChange(grip)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${selectedGrip === grip
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {grip}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Quantity Selector Component with Add to Cart
function QuantitySelector({
    language,
    product,
    selectedColor,
    selectedGrip,
    onAddToCart
}: {
    language: string;
    product: Product;
    selectedColor: { name: string; nameTh: string; hex: string; image: string };
    selectedGrip: string;
    onAddToCart: () => void;
}) {
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem } = useCart();

    const decrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increase = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            nameTh: product.nameTh,
            price: product.price,
            originalPrice: product.originalPrice,
            image: selectedColor.image || product.images[0],
            color: {
                name: selectedColor.name,
                nameTh: selectedColor.nameTh,
                hex: selectedColor.hex
            },
            size: selectedGrip,
            category: "rackets"
        }, quantity);

        setIsAdded(true);
        onAddToCart();

        // Reset after animation
        setTimeout(() => {
            setIsAdded(false);
            setQuantity(1);
        }, 2000);
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-700 font-medium">
                {language === 'th' ? 'จำนวน' : 'Quantity'}
            </p>
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 bg-white">
                    <button
                        onClick={decrease}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300"
                        disabled={quantity <= 1}
                    >
                        <span className="text-2xl font-light text-gray-700">−</span>
                    </button>
                    <span className="w-14 h-12 flex items-center justify-center text-center text-lg font-medium text-gray-900">
                        {quantity}
                    </span>
                    <button
                        onClick={increase}
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300"
                    >
                        <span className="text-2xl font-light text-gray-700">+</span>
                    </button>
                </div>
                <motion.button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-3 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isAdded
                            ? 'bg-green-500 text-white border-2 border-green-500'
                            : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
                    }`}
                >
                    <AnimatePresence mode="wait">
                        {isAdded ? (
                            <motion.span
                                key="added"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2"
                            >
                                <Check size={18} />
                                {language === 'th' ? 'เพิ่มแล้ว!' : 'Added!'}
                            </motion.span>
                        ) : (
                            <motion.span
                                key="add"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                {language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}

// Main Page Component
export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const product = getProductById(resolvedParams.productId);
    const [isRacketGuideOpen, setIsRacketGuideOpen] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedGrip, setSelectedGrip] = useState('4UG5');
    const [showCartToast, setShowCartToast] = useState(false);

    if (!product) {
        notFound();
    }

    // Get the current color's image
    const currentColorImage = product.colors[selectedColorIndex]?.image;
    const selectedColor = product.colors[selectedColorIndex];

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'RACKETS', labelTh: 'ไม้แบด', href: '/rackets' },
                            { label: product.name, labelTh: product.nameTh }
                        ]}
                    />
                </div>
            </section>

            {/* Main Product Section */}
            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Left: Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ProductGallery images={product.images} mainImage={currentColorImage} />
                        </motion.div>

                        {/* Right: Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Series & Tier */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{product.specs.series}</span>
                                <span>•</span>
                                <span>{product.specs.productTier}</span>
                                {product.badge && (
                                    <>
                                        <span>•</span>
                                        <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">
                                            {product.badge}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {language === 'th' ? product.nameTh : product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    ฿{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        ฿{product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Discount Badge */}
                            <DiscountBadge product={product} language={language} />

                            {/* Note */}
                            {product.note && (
                                <p className="text-sm text-gray-500 italic">
                                    {language === 'th' ? product.noteTh : product.note}
                                </p>
                            )}

                            {/* Stock Count */}
                            {product.stockCount !== undefined && (
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                                    product.stockCount > 10
                                        ? 'bg-green-100 text-green-700'
                                        : product.stockCount > 0
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${
                                        product.stockCount > 10
                                            ? 'bg-green-500'
                                            : product.stockCount > 0
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }`} />
                                    {product.stockCount > 0 ? (
                                        language === 'th'
                                            ? `เหลือ ${product.stockCount} ชิ้น`
                                            : `${product.stockCount} in stock`
                                    ) : (
                                        language === 'th' ? 'สินค้าหมด' : 'Out of stock'
                                    )}
                                </div>
                            )}

                            {/* Product Detail Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Detail'}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {language === 'th' ? product.descriptionTh : product.description}
                                </p>
                            </div>

                            {/* Color Selector */}
                            <ColorSelector
                                colors={product.colors}
                                selectedColorIndex={selectedColorIndex}
                                onColorChange={setSelectedColorIndex}
                                language={language}
                            />

                            {/* Racket Guide Link */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{language === 'th' ? 'น้ำหนัก & ขนาดกริป' : 'Weight & Grip Size'}</span>
                                </p>
                                <button
                                    onClick={() => setIsRacketGuideOpen(true)}
                                    className="text-sm text-gray-900 underline hover:text-gray-600 transition-colors"
                                >
                                    {language === 'th' ? 'วิธีเลือกไม้แบด' : 'Racket Guide'}
                                </button>
                            </div>

                            {/* Weight & Grip Selector */}
                            <WeightGripSelector
                                specs={product.specs}
                                language={language}
                                selectedGrip={selectedGrip}
                                onGripChange={setSelectedGrip}
                            />

                            {/* Quantity + Add to Cart */}
                            <QuantitySelector
                                language={language}
                                product={product}
                                selectedColor={selectedColor}
                                selectedGrip={selectedGrip}
                                onAddToCart={() => setShowCartToast(true)}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Racket Guide Modal */}
            <RacketGuideModal
                isOpen={isRacketGuideOpen}
                onClose={() => setIsRacketGuideOpen(false)}
                language={language}
            />

            {/* Specifications Dropdown Section */}
            <section className="py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <SpecificationsDropdown specs={product.specs} language={language} />
                </div>
            </section>

            {/* NOBULL Style Attention to Detail Section */}
            <AttentionToDetailSection product={product} language={language} />

            {/* Performance Ratings Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left: Key Features */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {language === 'th' ? product.nameTh : product.name}
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">01</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `สมดุล ${product.specs.balance === 'Head Light' ? 'หัวเบา' : product.specs.balance === 'Head Heavy' ? 'หัวหนัก' : 'สมดุล'} สำหรับการเล่นที่รวดเร็ว`
                                            : `${product.specs.balance} balance for quick maneuverability`
                                        }
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">02</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `ก้าน ${product.specs.shaftFlex === 'Stiff' ? 'แข็ง' : product.specs.shaftFlex === 'Medium' ? 'ปานกลาง' : 'อ่อน'} สำหรับการควบคุมที่ดี`
                                            : `${product.specs.shaftFlex} shaft flex for optimal control`
                                        }
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">03</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `เหมาะสำหรับผู้เล่นระดับ ${product.specs.playerType}`
                                            : `Designed for ${product.specs.playerType} players`
                                        }
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Performance Sliders - YELLOW dots */}
                        <div>
                            <PerformanceSlider
                                label="Power"
                                labelTh="พลัง"
                                value={product.performanceRatings.power}
                                leftLabel="SOFT"
                                rightLabel="HARD"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Speed"
                                labelTh="ความเร็ว"
                                value={product.performanceRatings.speed}
                                leftLabel="SLOW"
                                rightLabel="FAST"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Control"
                                labelTh="ควบคุม"
                                value={product.performanceRatings.control}
                                leftLabel="LOW"
                                rightLabel="HIGH"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Durability"
                                labelTh="ความทนทาน"
                                value={product.performanceRatings.durability}
                                leftLabel="LIGHT"
                                rightLabel="HEAVY"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Shaft Flex"
                                labelTh="ความยืดหยุ่น"
                                value={product.performanceRatings.shaftFlex}
                                leftLabel="STIFF"
                                rightLabel="FLEXIBLE"
                                language={language}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Gallery (REACH Style) */}
            <CommunityGallery videos={product.videos} language={language} />

            {/* You Might Also Like (Full) */}
            <YouMightAlsoLike currentProductId={product.id} language={language} />

            {/* Back to Rackets */}
            <section className="py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <Link
                        href="/rackets"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {language === 'th' ? 'กลับไปหน้าไม้แบด' : 'Back to Rackets'}
                    </Link>
                </div>
            </section>

            {/* Cart Toast Notification */}
            <CartToast
                isOpen={showCartToast}
                onClose={() => setShowCartToast(false)}
                product={showCartToast ? {
                    name: product.name,
                    nameTh: product.nameTh,
                    image: selectedColor?.image || product.images[0],
                    price: product.price,
                    color: selectedColor ? {
                        name: selectedColor.name,
                        nameTh: selectedColor.nameTh
                    } : undefined,
                    size: selectedGrip
                } : null}
            />
        </main>
    );
}
