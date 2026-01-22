"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getSportswearProductById, sportswearProducts, SportswearProduct } from "@/data/productData";
import { notFound } from "next/navigation";
import { use } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import ProductAddToCart from "@/components/product/ProductAddToCart";

// Performance Slider Component with slide animation
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
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 bg-cover bg-center border-2 transition-colors ${idx === selectedImage && !mainImage ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                            style={{ backgroundImage: `url('${img}')` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Size Selector Component for Sportswear (XS-3XL)
function SizeSelector({
    sizes,
    selectedSize,
    onSelectSize,
    onOpenGuide,
    language
}: {
    sizes: SportswearProduct['sizes'];
    selectedSize: string | null;
    onSelectSize: (size: string) => void;
    onOpenGuide: () => void;
    language: string;
}) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    <span className="font-bold">{language === 'th' ? 'ไซส์' : 'Size'}:</span>
                </p>
                <button
                    onClick={onOpenGuide}
                    className="text-sm text-gray-600 underline hover:text-black transition-colors"
                >
                    {language === 'th' ? 'Size Guide' : 'Size Guide'}
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
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

// Size Guide Modal Component - Dynamic based on category
function SizeGuideModal({
    isOpen,
    onClose,
    language,
    category
}: {
    isOpen: boolean;
    onClose: () => void;
    language: string;
    category: import("@/data/productData").SportswearCategory;
}) {
    if (!isOpen) return null;

    // Import size guides dynamically based on category
    const { getSizeGuideByCategory, sportswearCategoryNames } = require("@/data/productData");
    const sizeGuide = getSizeGuideByCategory(category);
    const categoryName = sportswearCategoryNames[category];

    const renderTopsTable = () => (
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ไซส์' : 'Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'รอบอก' : 'Chest'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ไหล่' : 'Shoulder'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ความยาว' : 'Length'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'แขน' : 'Sleeve'}</th>
                </tr>
            </thead>
            <tbody>
                {sizeGuide.data.map((row: { size: string; chest: string; shoulder: string; length: string; sleeve: string }, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-900 font-medium">{row.size}</td>
                        <td className="px-4 py-2 text-gray-600">{row.chest}</td>
                        <td className="px-4 py-2 text-gray-600">{row.shoulder}</td>
                        <td className="px-4 py-2 text-gray-600">{row.length}</td>
                        <td className="px-4 py-2 text-gray-600">{row.sleeve}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderBottomsTable = () => (
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ไซส์' : 'Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'รอบเอว' : 'Waist'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'รอบสะโพก' : 'Hip'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ยาวใน' : 'Inseam'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ยาวนอก' : 'Outseam'}</th>
                </tr>
            </thead>
            <tbody>
                {sizeGuide.data.map((row: { size: string; waist: string; hip: string; inseam: string; outseam: string }, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-900 font-medium">{row.size}</td>
                        <td className="px-4 py-2 text-gray-600">{row.waist}</td>
                        <td className="px-4 py-2 text-gray-600">{row.hip}</td>
                        <td className="px-4 py-2 text-gray-600">{row.inseam}</td>
                        <td className="px-4 py-2 text-gray-600">{row.outseam}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderSocksTable = () => (
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ไซส์' : 'Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'US Size' : 'US Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'EU Size' : 'EU Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ความยาวเท้า' : 'Foot Length'}</th>
                </tr>
            </thead>
            <tbody>
                {sizeGuide.data.map((row: { size: string; usSize: string; euSize: string; footLength: string }, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-900 font-medium">{row.size}</td>
                        <td className="px-4 py-2 text-gray-600">{row.usSize}</td>
                        <td className="px-4 py-2 text-gray-600">{row.euSize}</td>
                        <td className="px-4 py-2 text-gray-600">{row.footLength}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderUnderwearTable = () => (
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'ไซส์' : 'Size'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'รอบเอว' : 'Waist'}</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">{language === 'th' ? 'รอบสะโพก' : 'Hip'}</th>
                </tr>
            </thead>
            <tbody>
                {sizeGuide.data.map((row: { size: string; waist: string; hip: string }, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-900 font-medium">{row.size}</td>
                        <td className="px-4 py-2 text-gray-600">{row.waist}</td>
                        <td className="px-4 py-2 text-gray-600">{row.hip}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderTable = () => {
        switch (sizeGuide.type) {
            case 'tops': return renderTopsTable();
            case 'shorts':
            case 'pants': return renderBottomsTable();
            case 'socks': return renderSocksTable();
            case 'underwear': return renderUnderwearTable();
            default: return renderTopsTable();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {language === 'th' ? `คู่มือไซส์ - ${categoryName.th}` : `Size Guide - ${categoryName.en}`}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                {language === 'th' ? 'หน่วยวัด: เซนติเมตร (cm)' : 'Measurements in centimeters (cm)'}
                            </p>
                            <div className="overflow-x-auto">
                                {renderTable()}
                            </div>
                            <div className="mt-6 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-2">
                                    {language === 'th' ? '💡 เคล็ดลับการเลือกไซส์' : '💡 Sizing Tips'}
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>{language === 'th' ? '• วัดขนาดตัวคุณและเปรียบเทียบกับตารางไซส์' : '• Measure yourself and compare with the size chart'}</li>
                                    <li>{language === 'th' ? '• หากอยู่ระหว่างไซส์ แนะนำให้เลือกไซส์ที่ใหญ่กว่า' : '• If between sizes, we recommend sizing up'}</li>
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
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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

// Features Section with dropdowns
function SportswearFeaturesSection({
    product,
    language
}: {
    product: SportswearProduct;
    language: string;
}) {
    const [importantOpen, setImportantOpen] = useState(false);
    const [techNerdsOpen, setTechNerdsOpen] = useState(false);
    const [attentionOpen, setAttentionOpen] = useState(false);

    const importantFeatures = [
        {
            title: language === 'th' ? 'วัสดุคุณภาพสูง' : 'Premium Material',
            desc: language === 'th'
                ? `ผลิตจาก ${product.specs.material} สวมใส่สบาย`
                : `Made with ${product.specs.material} for comfort`
        },
        {
            title: language === 'th' ? 'ทรงที่ลงตัว' : 'Perfect Fit',
            desc: language === 'th'
                ? `ทรง ${product.specs.fit} เหมาะกับการเคลื่อนไหว`
                : `${product.specs.fit} for optimal movement`
        },
        {
            title: language === 'th' ? 'ดูแลง่าย' : 'Easy Care',
            desc: language === 'th'
                ? product.specs.care
                : product.specs.care
        },
    ];

    const techSpecs = [
        { label: language === 'th' ? 'วัสดุ' : 'Material', value: product.specs.material },
        { label: language === 'th' ? 'ทรง' : 'Fit', value: product.specs.fit },
        { label: language === 'th' ? 'การดูแล' : 'Care', value: product.specs.care },
        { label: language === 'th' ? 'ระดับผู้เล่น' : 'Player Level', value: product.specs.playerType },
        { label: language === 'th' ? 'รหัสสินค้า' : 'SKU', value: product.specs.parentSku },
    ];

    const detailFeatures = [
        {
            title: language === 'th' ? 'ผ้าระบายอากาศ' : 'Breathable Fabric',
            desc: language === 'th' ? 'วัสดุระบายอากาศได้ดีเยี่ยม เหมาะกับกีฬา' : 'Excellent breathability for sports'
        },
        {
            title: language === 'th' ? 'สวมใส่สบาย' : 'Comfortable Wear',
            desc: language === 'th' ? 'ออกแบบมาเพื่อความสบายตลอดวัน' : 'Designed for all-day comfort'
        },
        {
            title: language === 'th' ? 'ทนทานต่อการซัก' : 'Durable Quality',
            desc: language === 'th' ? 'คงทนแม้ซักหลายครั้ง' : 'Maintains quality after multiple washes'
        },
    ];

    return (
        <section className="py-4 bg-white">
            <div className="max-w-7xl mx-auto px-6">
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

                <ChevronDropdown
                    title={language === 'th' ? 'สำหรับสาย Tech' : 'For the Tech Nerds'}
                    isOpen={techNerdsOpen}
                    onToggle={() => setTechNerdsOpen(!techNerdsOpen)}
                >
                    <div className="pb-6">
                        {techSpecs.map((spec, idx) => (
                            <div key={idx} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{spec.label}</span>
                                <span className="text-sm font-medium text-black uppercase">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </ChevronDropdown>

                <ChevronDropdown
                    title={language === 'th' ? 'ความใส่ใจในรายละเอียด' : 'Attention to Detail'}
                    isOpen={attentionOpen}
                    onToggle={() => setAttentionOpen(!attentionOpen)}
                >
                    <div className="pb-8">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="col-span-2 aspect-[16/10] bg-gray-100 overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${product.images[0]}')` }} />
                            </div>
                            <div className="col-span-1 aspect-[10/16] bg-gray-100 overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${product.images[1] || product.images[0]}')` }} />
                            </div>
                        </div>
                        <div className="border-t border-gray-300 my-6" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {detailFeatures.map((feature, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-bold text-black mb-1">{feature.title}</p>
                                    <p className="text-sm text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="aspect-[21/9] bg-gray-100 overflow-hidden">
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${product.images[2] || product.images[0]}')` }} />
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

    const scrollLeftFn = () => { if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' }); };
    const scrollRightFn = () => { if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); };

    const communityContent = [
        { thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600', username: '@reach_official' },
        { thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600', username: '@badminton_pro' },
        { thumbnail: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600', username: '@player_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600', username: '@coach_reach' },
        { thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600', username: '@shuttlecock_king' },
        { thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600', username: '@pro_player' },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-10">
                    {language === 'th' ? 'จากคอมมูนิตี้ของเรา' : 'From Our Community'}
                </h2>
                <div ref={scrollRef} onScroll={handleScroll} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                    {communityContent.map((item, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="flex-shrink-0 w-[45%] md:w-[23%] snap-start">
                            <a href="#" className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-black block">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${item.thumbnail}')` }} />
                                <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
                                </div>
                            </a>
                            <p className="text-center text-sm text-gray-600 mt-2">{item.username}</p>
                        </motion.div>
                    ))}
                </div>
                <div className="flex items-center justify-end mt-6 gap-4">
                    <div className="flex-1 h-px bg-gray-300 relative">
                        <div className="absolute left-0 top-0 h-px bg-brand-yellow transition-all duration-300" style={{ width: `${Math.max(25, scrollProgress * 75 + 25)}%` }} />
                    </div>
                    <div className="flex items-center">
                        <button onClick={scrollLeftFn} className="px-3 py-2 text-gray-400 hover:text-black transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
                        <div className="w-px h-4 bg-gray-300" />
                        <button onClick={scrollRightFn} className="px-3 py-2 text-gray-400 hover:text-black transition-colors"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// You Might Also Like Component
function YouMightAlsoLike({ currentProductId, language }: { currentProductId: string; language: string }) {
    const relatedProducts = sportswearProducts.filter(p => p.id !== currentProductId);
    if (relatedProducts.length === 0) return null;

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 italic">{language === 'th' ? 'สินค้าที่คุณอาจชอบ' : 'You Might Also Like'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((product) => (
                        <Link key={product.id} href={`/sportswear/${product.id}`} className="group">
                            <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url('${product.images[0]}')` }} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:underline line-clamp-1">{language === 'th' ? product.nameTh : product.name}</p>
                                <p className="text-xs text-gray-500">{product.specs.productTier}</p>
                                <p className="text-sm font-semibold text-gray-900">฿{product.price.toLocaleString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Color Selector Component
function ColorSelector({ colors, selectedColor, onSelectColor, language }: { colors: SportswearProduct['colors']; selectedColor: number; onSelectColor: (idx: number) => void; language: string; }) {
    const selected = colors[selectedColor];
    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-700">
                <span className="font-medium">{language === 'th' ? 'สี' : 'Color'}:</span> {language === 'th' ? selected.nameTh : selected.name}
            </p>
            <div className="flex gap-2">
                {colors.map((color, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectColor(idx)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === idx ? 'border-black ring-2 ring-offset-1 ring-black' : 'border-gray-300 hover:border-gray-500'}`}
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
export default function SportswearProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const product = getSportswearProductById(resolvedParams.productId);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(0);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    if (!product) {
        notFound();
    }

    // Get the current color's image
    const currentColorImage = product.colors[selectedColor]?.image;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'SPORTSWEAR', labelTh: 'ชุดกีฬา', href: '/sportswear' }, { label: product.name, labelTh: product.nameTh }]} />
                </div>
            </section>

            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <ProductGallery images={product.images} mainImage={currentColorImage} />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{product.specs.productTier}</span>
                                <span>•</span>
                                <span>{product.specs.sport}</span>
                                {product.badge && (<><span>•</span><span className="bg-black text-white px-2 py-0.5 text-xs font-bold">{product.badge}</span></>)}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{language === 'th' ? product.nameTh : product.name}</h1>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">฿{product.price.toLocaleString()}</span>
                                {product.originalPrice && (<span className="text-lg text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>)}
                            </div>

                            {product.originalPrice && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded">
                                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-bold text-green-700">REACH30</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-100 rounded-sm" />
                                        <p className="text-sm text-gray-600">
                                            {language === 'th'
                                                ? `ลด ${Math.round((1 - product.price / product.originalPrice) * 100)}% สำหรับชุดกีฬานี้ ส่วนลดแสดงแล้ว`
                                                : `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF THIS ITEM. DISCOUNT AS SHOWN.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {product.note && (<p className="text-sm text-gray-500 italic">{language === 'th' ? product.noteTh : product.note}</p>)}

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

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{language === 'th' ? 'รายละเอียดสินค้า' : 'Product Detail'}</h3>
                                <p className="text-gray-600 leading-relaxed">{language === 'th' ? product.descriptionTh : product.description}</p>
                            </div>

                            <ColorSelector colors={product.colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} language={language} />

                            <div className="pt-4 border-t border-gray-200">
                                <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} onOpenGuide={() => setIsSizeGuideOpen(true)} language={language} />
                            </div>

                            <ProductAddToCart
                                product={product}
                                selectedColor={product.colors[selectedColor]}
                                selectedSize={selectedSize || undefined}
                                category="sportswear"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <SportswearFeaturesSection product={product} language={language} />

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'th' ? product.nameTh : product.name}</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">01</span>
                                    <span className="text-gray-700">{language === 'th' ? `วัสดุ ${product.specs.material} คุณภาพสูง` : `High-quality ${product.specs.material}`}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">02</span>
                                    <span className="text-gray-700">{language === 'th' ? `ทรง ${product.specs.fit} สวมใส่สบาย` : `${product.specs.fit} for comfortable wear`}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">03</span>
                                    <span className="text-gray-700">{language === 'th' ? `เหมาะสำหรับผู้เล่นระดับ ${product.specs.playerType}` : `Designed for ${product.specs.playerType} players`}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <PerformanceSlider label="Comfort" labelTh="ความสบาย" value={product.performanceRatings.comfort} leftLabel="BASIC" rightLabel="PREMIUM" language={language} />
                            <PerformanceSlider label="Breathability" labelTh="การระบายอากาศ" value={product.performanceRatings.breathability} leftLabel="LOW" rightLabel="HIGH" language={language} />
                            <PerformanceSlider label="Durability" labelTh="ความทนทาน" value={product.performanceRatings.durability} leftLabel="STANDARD" rightLabel="HEAVY-DUTY" language={language} />
                            <PerformanceSlider label="Fit" labelTh="ความพอดี" value={product.performanceRatings.fit} leftLabel="LOOSE" rightLabel="FITTED" language={language} />
                            <PerformanceSlider label="Flexibility" labelTh="ความยืดหยุ่น" value={product.performanceRatings.flexibility} leftLabel="RIGID" rightLabel="FLEXIBLE" language={language} />
                        </div>
                    </div>
                </div>
            </section>

            <CommunityGallery language={language} />
            <YouMightAlsoLike currentProductId={product.id} language={language} />
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} language={language} category={product.category} />
        </main>
    );
}
