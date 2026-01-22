"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getCourtServiceById, courtServices, CourtService } from "@/data/productData";
import {
    ChevronDown,
    ChevronRight,
    Phone,
    MessageCircle,
    Mail,
    Layers,
    Lightbulb,
    Wrench,
    Users,
    Shield,
} from "lucide-react";

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

// Service Gallery Component
function ServiceGallery({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <motion.div
                key={images[selectedImage]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-video bg-gray-100 overflow-hidden rounded-lg"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${images[selectedImage]}')` }}
                />
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 bg-cover bg-center rounded border-2 transition-colors ${idx === selectedImage ? 'border-black' : 'border-transparent hover:border-gray-300'
                                }`}
                            style={{ backgroundImage: `url('${img}')` }}
                        />
                    ))}
                </div>
            )}
        </div>
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

// Attention to Detail Section with all 3 dropdowns
function AttentionToDetailSection({
    service,
    language
}: {
    service: CourtService;
    language: string;
}) {
    const [importantOpen, setImportantOpen] = useState(false);
    const [techNerdsOpen, setTechNerdsOpen] = useState(false);
    const [attentionOpen, setAttentionOpen] = useState(false);

    // Important features from service highlights
    const importantFeatures = service.highlights?.map((h, idx) => ({
        title: language === 'th' ? `จุดเด่นที่ ${idx + 1}` : `Key Feature ${idx + 1}`,
        desc: language === 'th' ? h.textTh : h.text
    })) || [
        {
            title: language === 'th' ? 'คุณภาพสูง' : 'High Quality',
            desc: language === 'th' ? 'บริการคุณภาพสูงจากทีมผู้เชี่ยวชาญ' : 'High quality service from expert team'
        },
        {
            title: language === 'th' ? 'มาตรฐาน BWF' : 'BWF Standard',
            desc: language === 'th' ? 'ได้มาตรฐานการแข่งขันระดับสากล' : 'International competition standards'
        },
        {
            title: language === 'th' ? 'รับประกัน' : 'Warranty',
            desc: language === 'th' ? 'รับประกันคุณภาพงานติดตั้ง' : 'Installation quality warranty'
        },
    ];

    // Tech specs - materials and features
    const techSpecs = [
        ...(service.materials?.map((m, idx) => ({
            label: language === 'th' ? `วัสดุ ${idx + 1}` : `Material ${idx + 1}`,
            value: language === 'th' ? (service.materialsTh?.[idx] || m) : m
        })) || []),
        ...(service.warranty ? [{
            label: language === 'th' ? 'การรับประกัน' : 'Warranty',
            value: language === 'th' ? service.warrantyTh : service.warranty
        }] : []),
        {
            label: language === 'th' ? 'ประเภทบริการ' : 'Service Type',
            value: getTypeLabel(service.serviceType, language)
        },
    ];

    function getTypeLabel(type: string, lang: string) {
        switch (type) {
            case "flooring": return lang === "th" ? "พื้นสนาม" : "Flooring";
            case "lighting": return lang === "th" ? "ระบบไฟ" : "Lighting";
            case "renovation": return lang === "th" ? "ปรับปรุง" : "Renovation";
            case "consultation": return lang === "th" ? "ที่ปรึกษา" : "Consultation";
            default: return type;
        }
    }

    // Attention to Detail content
    const detailFeatures = (language === 'th' ? service.featuresTh : service.features).slice(0, 3).map((f, idx) => ({
        title: language === 'th' ? `คุณสมบัติที่ ${idx + 1}` : `Feature ${idx + 1}`,
        desc: f
    }));

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

                {/* Attention to Detail Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'ความใส่ใจในรายละเอียด' : 'Attention to Detail'}
                    isOpen={attentionOpen}
                    onToggle={() => setAttentionOpen(!attentionOpen)}
                >
                    <div className="pb-8">
                        {/* Row 1: Large image + Small image */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="col-span-2 aspect-[16/10] bg-gray-100 overflow-hidden rounded-lg">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${service.images[0]}')` }}
                                />
                            </div>
                            <div className="col-span-1 aspect-[10/16] bg-gray-100 overflow-hidden rounded-lg">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${service.images[1] || service.images[0]}')` }}
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

                        {/* Row 3: Ultrawide image */}
                        <div className="aspect-[21/9] bg-gray-100 overflow-hidden rounded-lg">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${service.images[0]}')` }}
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

    // Court installation community content
    const communityContent = [
        { thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', username: '@reach_courts' },
        { thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600', username: '@badminton_arena' },
        { thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600', username: '@court_pro_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600', username: '@reach_installation' },
        { thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', username: '@bwf_court' },
        { thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600', username: '@arena_design' },
        { thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600', username: '@court_th' },
        { thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600', username: '@reach_project' },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-10">
                    {language === 'th' ? 'จากคอมมูนิตี้ของเรา' : 'From Our Community'}
                </h2>

                {/* Scrollable Carousel */}
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
                                <div className="absolute top-3 right-3 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </a>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {item.username}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Slider Progress Bar & Navigation */}
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
function YouMightAlsoLike({ currentServiceId, language }: { currentServiceId: string; language: string }) {
    const relatedServices = courtServices.filter(s => s.id !== currentServiceId);

    if (relatedServices.length === 0) return null;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "flooring": return <Layers className="w-4 h-4" />;
            case "lighting": return <Lightbulb className="w-4 h-4" />;
            case "renovation": return <Wrench className="w-4 h-4" />;
            case "consultation": return <Users className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 italic">
                    {language === 'th' ? 'บริการอื่นที่คุณอาจสนใจ' : 'You Might Also Like'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {relatedServices.map((service) => (
                        <Link
                            key={service.id}
                            href={`/courts/${service.id}`}
                            className="group"
                        >
                            <div className="aspect-square bg-gray-100 overflow-hidden mb-3 rounded-lg">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${service.images[0]}')` }}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:underline line-clamp-1">
                                    {language === 'th' ? service.nameTh : service.name}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    {getTypeIcon(service.serviceType)}
                                    <span>{service.serviceType}</span>
                                </div>
                                <p className="text-sm font-semibold text-brand-yellow">
                                    {language === 'th' ? 'ติดต่อสอบถาม' : 'Contact for Quote'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Main Page Component
export default function CourtServiceDetailPage() {
    const { language } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState<CourtService | null>(null);

    useEffect(() => {
        const serviceId = params.serviceId as string;
        const foundService = getCourtServiceById(serviceId);
        if (foundService) {
            setService(foundService);
        } else {
            router.push("/courts");
        }
    }, [params.serviceId, router]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "flooring": return <Layers className="w-5 h-5" />;
            case "lighting": return <Lightbulb className="w-5 h-5" />;
            case "renovation": return <Wrench className="w-5 h-5" />;
            case "consultation": return <Users className="w-5 h-5" />;
            default: return null;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "flooring": return language === "th" ? "พื้นสนาม" : "Flooring";
            case "lighting": return language === "th" ? "ระบบไฟ" : "Lighting";
            case "renovation": return language === "th" ? "ปรับปรุง" : "Renovation";
            case "consultation": return language === "th" ? "ที่ปรึกษา" : "Consultation";
            default: return type;
        }
    };

    if (!service) {
        return (
            <main className="bg-white min-h-screen">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-screen">
                    <div className="text-center text-gray-500">
                        {language === "th" ? "กำลังโหลด..." : "Loading..."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'COURTS', labelTh: 'สนามแบด', href: '/courts' },
                            { label: service.name, labelTh: service.nameTh }
                        ]}
                    />
                </div>
            </section>

            {/* Main Service Section */}
            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Left: Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ServiceGallery images={service.images} />
                        </motion.div>

                        {/* Right: Service Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Type Badge */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {getTypeIcon(service.serviceType)}
                                <span>{getTypeLabel(service.serviceType)}</span>
                                {service.suitableFor && (
                                    <>
                                        <span>•</span>
                                        <span>{language === 'th' ? service.suitableForTh : service.suitableFor}</span>
                                    </>
                                )}
                            </div>

                            {/* Service Name */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {language === 'th' ? service.nameTh : service.name}
                            </h1>

                            {/* Price Notice */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-brand-yellow">
                                    {language === 'th' ? 'ราคาตามขนาดงาน' : 'Custom Pricing'}
                                </span>
                            </div>

                            {/* Contact CTA */}
                            <div className="bg-gradient-to-r from-brand-yellow/20 to-yellow-100 rounded-xl p-4 border border-brand-yellow/30">
                                <p className="text-sm text-gray-600">
                                    {language === 'th'
                                        ? 'ราคาขึ้นอยู่กับขนาดสนาม ทำเล และข้อกำหนดเฉพาะ ติดต่อเราเพื่อรับใบเสนอราคาโดยละเอียด'
                                        : 'Price varies based on court size, location, and specifications. Contact us for a detailed quote.'
                                    }
                                </p>
                            </div>

                            {/* Warranty */}
                            {service.warranty && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <Shield className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="text-xs text-green-600">{language === 'th' ? 'การรับประกัน' : 'Warranty'}</p>
                                        <p className="font-bold text-green-700">
                                            {language === 'th' ? service.warrantyTh : service.warranty}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    {language === 'th' ? 'รายละเอียดบริการ' : 'Service Detail'}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {language === 'th' ? service.descriptionTh : service.description}
                                </p>
                            </div>

                            {/* Contact Buttons */}
                            <div className="space-y-3 pt-4">
                                <a
                                    href="tel:+66812345678"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    {language === 'th' ? 'โทรหาเรา' : 'Call Us'}: 081-234-5678
                                </a>
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href="https://line.me/ti/p/@reachbadminton"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        LINE
                                    </a>
                                    <a
                                        href="mailto:courts@reach.co.th"
                                        className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Attention to Detail Section (3 Dropdowns) */}
            <AttentionToDetailSection service={service} language={language} />

            {/* Performance Ratings Section (for flooring only) */}
            {service.performanceRatings && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Left: Key Features */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {language === 'th' ? service.nameTh : service.name}
                                </h2>
                                <ul className="space-y-4">
                                    {service.highlights?.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-gray-400 font-medium">{highlight.number}</span>
                                            <span className="text-gray-700">
                                                {language === 'th' ? highlight.textTh : highlight.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right: Performance Sliders - YELLOW dots */}
                            <div>
                                <PerformanceSlider
                                    label="Shock Absorption"
                                    labelTh="รองรับแรงกระแทก"
                                    value={service.performanceRatings.shockAbsorption}
                                    leftLabel="FIRM"
                                    rightLabel="SOFT"
                                    language={language}
                                />
                                <PerformanceSlider
                                    label="Stability"
                                    labelTh="ความมั่นคง"
                                    value={service.performanceRatings.stability}
                                    leftLabel="FLEXIBLE"
                                    rightLabel="STABLE"
                                    language={language}
                                />
                                <PerformanceSlider
                                    label="Grip"
                                    labelTh="การยึดเกาะ"
                                    value={service.performanceRatings.grip}
                                    leftLabel="LOW"
                                    rightLabel="HIGH"
                                    language={language}
                                />
                                <PerformanceSlider
                                    label="Breathability"
                                    labelTh="การระบายอากาศ"
                                    value={service.performanceRatings.breathability}
                                    leftLabel="LOW"
                                    rightLabel="HIGH"
                                    language={language}
                                />
                                <PerformanceSlider
                                    label="Durability"
                                    labelTh="ความทนทาน"
                                    value={service.performanceRatings.durability}
                                    leftLabel="LIGHT"
                                    rightLabel="HEAVY"
                                    language={language}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Community Gallery */}
            <CommunityGallery language={language} />

            {/* You Might Also Like */}
            <YouMightAlsoLike currentServiceId={service.id} language={language} />

            {/* Back to Courts */}
            <section className="py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <Link
                        href="/courts"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {language === 'th' ? 'กลับไปหน้าบริการสนาม' : 'Back to Courts'}
                    </Link>
                </div>
            </section>
        </main>
    );
}
