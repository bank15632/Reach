"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getShoeProductById, shoeProducts, ShoeProduct, shoeSizeGuide } from "@/data/productData";
import { notFound } from "next/navigation";
import { use } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import ProductAddToCart from "@/components/product/ProductAddToCart";

// Performance Slider Component - YELLOW dots (for shoes) with slide animation
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

// Size Selector Component - Matching the reference image
function SizeSelector({
    sizes,
    selectedSize,
    onSelectSize,
    onOpenGuide,
    language
}: {
    sizes: ShoeProduct['sizes'];
    selectedSize: string | null;
    onSelectSize: (size: string) => void;
    onOpenGuide: () => void;
    language: string;
}) {
    return (
        <div className="space-y-3">
            {/* Header with Size Guide link */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    <span className="font-bold">{language === 'th' ? 'ไซส์' : 'Size'}:</span>
                    <span className="text-gray-500 text-xs ml-2">
                        ({language === 'th' ? 'US Size - เลือก size guide สำหรับหน่วยอื่น' : 'US Size - Select size guide for other metrics'})
                    </span>
                </p>
                <button
                    onClick={onOpenGuide}
                    className="text-sm text-gray-600 underline hover:text-black transition-colors"
                >
                    {language === 'th' ? 'Size Guide' : 'Size Guide'}
                </button>
            </div>

            {/* Size Grid */}
            <div className="grid grid-cols-8 gap-2">
                {sizes.map((sizeItem) => (
                    <button
                        key={sizeItem.size}
                        onClick={() => sizeItem.available && onSelectSize(sizeItem.size)}
                        disabled={!sizeItem.available}
                        className={`
                            relative h-12 flex items-center justify-center text-sm font-medium
                            border transition-all
                            ${!sizeItem.available
                                ? 'bg-white border-gray-200 text-gray-300 cursor-not-allowed'
                                : selectedSize === sizeItem.size
                                    ? 'bg-white border-2 border-black text-black'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                            }
                        `}
                    >
                        {sizeItem.size}
                        {/* Strikethrough for unavailable sizes */}
                        {!sizeItem.available && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(to bottom right, transparent calc(50% - 1px), #d1d5db calc(50% - 1px), #d1d5db calc(50% + 1px), transparent calc(50% + 1px))'
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Size Guide Modal Component
function SizeGuideModal({
    isOpen,
    onClose,
    language
}: {
    isOpen: boolean;
    onClose: () => void;
    language: string;
}) {
    if (!isOpen) return null;

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
                                {language === 'th' ? 'คู่มือไซส์รองเท้า' : 'Shoe Size Guide'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="p-6">
                            {/* Size Chart Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-3 text-left font-bold text-gray-900">US</th>
                                            <th className="px-4 py-3 text-left font-bold text-gray-900">UK</th>
                                            <th className="px-4 py-3 text-left font-bold text-gray-900">EU</th>
                                            <th className="px-4 py-3 text-left font-bold text-gray-900">CM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shoeSizeGuide.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-2 text-gray-900 font-medium">{row.us}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.uk}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.eu}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.cm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Measuring Tips */}
                            <div className="mt-6 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {language === 'th' ? '💡 วิธีวัดเท้า' : '💡 How to Measure Your Feet'}
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>{language === 'th' ? '1. วัดเท้าตอนเย็นเมื่อเท้าขยายตัวเต็มที่' : '1. Measure your feet in the evening when they are at their largest'}</li>
                                    <li>{language === 'th' ? '2. ยืนบนกระดาษและวาดรอบเท้า' : '2. Stand on a piece of paper and trace around your foot'}</li>
                                    <li>{language === 'th' ? '3. วัดจากส้นเท้าถึงปลายนิ้วที่ยาวที่สุด' : '3. Measure from the heel to the longest toe'}</li>
                                    <li>{language === 'th' ? '4. เปรียบเทียบกับตารางไซส์ด้านบน' : '4. Compare with the size chart above'}</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Chevron Dropdown Component
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

// Specifications Dropdown for Shoes
function ShoeSpecificationsDropdown({ specs, language }: { specs: ShoeProduct['specs']; language: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const specItems = [
        { key: 'weight', label: 'Weight', labelTh: 'น้ำหนัก' },
        { key: 'upperMaterial', label: 'Upper Material', labelTh: 'วัสดุส่วนบน' },
        { key: 'soleMaterial', label: 'Sole Material', labelTh: 'วัสดุพื้น' },
        { key: 'closureType', label: 'Closure Type', labelTh: 'ประเภทการปิด' },
        { key: 'cushioning', label: 'Cushioning', labelTh: 'การรองรับแรงกระแทก' },
        { key: 'playerType', label: 'Player Type', labelTh: 'ระดับผู้เล่น' },
        { key: 'productTier', label: 'Product Tier', labelTh: 'ระดับสินค้า' },
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

// Shoe Features Section with dropdowns
function ShoeFeaturesSection({
    product,
    language
}: {
    product: ShoeProduct;
    language: string;
}) {
    const [importantOpen, setImportantOpen] = useState(false);
    const [techNerdsOpen, setTechNerdsOpen] = useState(false);
    const [attentionOpen, setAttentionOpen] = useState(false);

    // Important features based on product specs
    const importantFeatures = [
        {
            title: language === 'th' ? 'เทคโนโลยีรองรับแรงกระแทก' : 'Cushioning Technology',
            desc: language === 'th'
                ? `${product.specs.cushioning} สำหรับความสบายและการปกป้องข้อเท้า`
                : `${product.specs.cushioning} for comfort and ankle protection`
        },
        {
            title: language === 'th' ? 'วัสดุส่วนบนคุณภาพสูง' : 'Premium Upper Material',
            desc: language === 'th'
                ? `ผลิตจาก ${product.specs.upperMaterial} ระบายอากาศดี`
                : `Made with ${product.specs.upperMaterial}, excellent breathability`
        },
        {
            title: language === 'th' ? 'พื้นรองเท้ายึดเกาะสูง' : 'High-grip Sole',
            desc: language === 'th'
                ? `พื้น ${product.specs.soleMaterial} ยึดเกาะคอร์ทได้ดีเยี่ยม`
                : `${product.specs.soleMaterial} sole for excellent court grip`
        },
    ];

    // Tech specs table data
    const techSpecs = [
        { label: language === 'th' ? 'น้ำหนัก' : 'Weight', value: product.specs.weight },
        { label: language === 'th' ? 'วัสดุส่วนบน' : 'Upper', value: product.specs.upperMaterial },
        { label: language === 'th' ? 'พื้นรองเท้า' : 'Sole', value: product.specs.soleMaterial },
        { label: language === 'th' ? 'รองรับแรงกระแทก' : 'Cushioning', value: product.specs.cushioning },
        { label: language === 'th' ? 'ระดับผู้เล่น' : 'Player Level', value: product.specs.playerType },
        { label: language === 'th' ? 'รหัสสินค้า' : 'SKU', value: product.specs.parentSku },
    ];

    // Attention to Detail content (3 columns) - shoe specific
    const detailFeatures = [
        {
            title: language === 'th' ? 'พื้นรองเท้านุ่มสบาย' : 'Cushioned Sole',
            desc: language === 'th' ? 'พื้นรองเท้าที่ออกแบบมาเพื่อรองรับแรงกระแทกและความสบายสูงสุด' : 'Sole designed for maximum shock absorption and comfort'
        },
        {
            title: language === 'th' ? 'ระบายอากาศดีเยี่ยม' : 'Excellent Breathability',
            desc: language === 'th' ? 'วัสดุระบายอากาศคุณภาพสูงเพื่อความสบายตลอดการเล่น' : 'High-quality breathable materials for comfort during play'
        },
        {
            title: language === 'th' ? 'ยึดเกาะคอร์ทสูง' : 'Superior Court Grip',
            desc: language === 'th' ? 'พื้นยางคุณภาพสูงยึดเกาะพื้นคอร์ทได้อย่างมั่นคง' : 'High-quality rubber sole for stable court grip'
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

// Community Gallery Component
function CommunityGallery({ language }: { language: string }) {
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

    const communityContent = [
        { thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', username: '@reach_official' },
        { thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600', username: '@badminton_pro' },
        { thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600', username: '@player_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600', username: '@coach_reach' },
        { thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', username: '@shuttlecock_king' },
        { thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600', username: '@pro_player' },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-10">
                    {language === 'th' ? 'จากคอมมูนิตี้ของเรา' : 'From Our Community'}
                </h2>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {communityContent.map((item, index) => (
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
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${item.thumbnail}')` }}
                                />
                                <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
                                </div>
                            </a>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {item.username}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center justify-end mt-6 gap-4">
                    <div className="flex-1 h-px bg-gray-300 relative">
                        <div
                            className="absolute left-0 top-0 h-px bg-brand-yellow transition-all duration-300"
                            style={{ width: `${Math.max(25, scrollProgress * 75 + 25)}%` }}
                        />
                    </div>
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

// You Might Also Like Component
function YouMightAlsoLike({ currentProductId, language }: { currentProductId: string; language: string }) {
    const relatedProducts = shoeProducts.filter(p => p.id !== currentProductId);

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
                            href={`/shoes/${product.id}`}
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
                                <p className="text-xs text-gray-500">{product.specs.productTier}</p>
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

// Shoe Color Selector Component - Uses actual product colors
function ShoeColorSelector({
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

// QuantitySelector removed - using ProductAddToCart component instead

// Main Page Component
export default function ShoeProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const product = getShoeProductById(resolvedParams.productId);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    if (!product) {
        notFound();
    }

    // Get the current color's image
    const currentColorImage = product.colors[selectedColorIndex]?.image;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'SHOES', labelTh: 'รองเท้า', href: '/shoes' },
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
                                <span>{product.specs.productTier}</span>
                                <span>•</span>
                                <span>{product.specs.sport}</span>
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
                            {product.originalPrice && (
                                <div className="space-y-2">
                                    {/* Promo Code Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-bold text-green-700">REACH30</span>
                                        </div>
                                    </div>
                                    {/* Discount Message */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-100 rounded-sm" />
                                        <p className="text-sm text-gray-600">
                                            {language === 'th'
                                                ? `ลด ${Math.round((1 - product.price / product.originalPrice) * 100)}% สำหรับรองเท้าซีรีส์นี้ ส่วนลดแสดงแล้ว`
                                                : `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF THIS SERIES. DISCOUNT AS SHOWN.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

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
                            <ShoeColorSelector
                                colors={product.colors}
                                selectedColorIndex={selectedColorIndex}
                                onColorChange={setSelectedColorIndex}
                                language={language}
                            />

                            {/* Size Selector */}
                            <div className="pt-4 border-t border-gray-200">
                                <SizeSelector
                                    sizes={product.sizes}
                                    selectedSize={selectedSize}
                                    onSelectSize={setSelectedSize}
                                    onOpenGuide={() => setIsSizeGuideOpen(true)}
                                    language={language}
                                />
                            </div>

                            {/* Quantity & Add to Cart */}
                            <ProductAddToCart
                                product={product}
                                selectedColor={product.colors[selectedColorIndex]}
                                selectedSize={selectedSize || undefined}
                                category="shoes"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <ShoeFeaturesSection product={product} language={language} />

            {/* Performance Ratings Section - Same position as racket page */}
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
                                            ? `${product.specs.cushioning} รองรับแรงกระแทกอย่างยอดเยี่ยม`
                                            : `${product.specs.cushioning} for excellent shock absorption`
                                        }
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">02</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `พื้น ${product.specs.soleMaterial} ยึดเกาะคอร์ทได้ดี`
                                            : `${product.specs.soleMaterial} sole for optimal grip`
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
                                label="Cushioning"
                                labelTh="รองรับแรงกระแทก"
                                value={product.performanceRatings.cushioning}
                                leftLabel="FIRM"
                                rightLabel="SOFT"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Stability"
                                labelTh="ความมั่นคง"
                                value={product.performanceRatings.stability}
                                leftLabel="FLEXIBLE"
                                rightLabel="STABLE"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Grip"
                                labelTh="การยึดเกาะ"
                                value={product.performanceRatings.grip}
                                leftLabel="LOW"
                                rightLabel="HIGH"
                                language={language}
                            />
                            <PerformanceSlider
                                label="Breathability"
                                labelTh="การระบายอากาศ"
                                value={product.performanceRatings.breathability}
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Gallery */}
            <CommunityGallery language={language} />

            {/* You Might Also Like */}
            <YouMightAlsoLike currentProductId={product.id} language={language} />

            {/* Size Guide Modal */}
            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                language={language}
            />
        </main>
    );
}
