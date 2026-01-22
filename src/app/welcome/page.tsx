"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { articles as articleData, Article } from "@/data/articleData";
import { bundleProducts } from "@/data/productData";

// Hero Section
function WelcomeHero() {
    const { language } = useLanguage();

    return (
        <section className="relative min-h-[60vh] flex items-center justify-center">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2000')" }}
            />
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center px-6"
            >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                    {language === 'th' ? 'รู้จัก REACH' : 'GET TO KNOW REACH'}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    {language === 'th'
                        ? 'อุปกรณ์แบดมินตันคุณภาพสูง สำหรับผู้เริ่มต้นจนถึงมืออาชีพ'
                        : 'Quality badminton equipment for beginners to professionals'}
                </p>
            </motion.div>
        </section>
    );
}

// Shop By Category Section
function ShopByCategory() {
    const { language } = useLanguage();

    const categories = [
        {
            id: 'rackets',
            name: language === 'th' ? 'ไม้แบดมินตัน' : 'Rackets',
            description: language === 'th' ? 'ไม้คุณภาพสูง หลากหลายรุ่น' : 'Quality rackets for every level',
            image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
            href: '/rackets',
        },
        {
            id: 'shoes',
            name: language === 'th' ? 'รองเท้า' : 'Shoes',
            description: language === 'th' ? 'ยึดเกาะดี คล่องตัวทุกสนาม' : 'Grip and agility for every court',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
            href: '/shoes',
        },
        {
            id: 'bundles',
            name: language === 'th' ? 'เซ็ทสุดคุ้ม' : 'Bundles',
            description: language === 'th' ? 'อุปกรณ์ครบ ราคาประหยัด' : 'Complete sets, great value',
            image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600',
            href: '/bundles',
        },
        {
            id: 'apparel',
            name: language === 'th' ? 'ชุดกีฬา' : 'Apparel',
            description: language === 'th' ? 'ระบายอากาศ ยืดหยุ่นสูง' : 'Breathable and flexible',
            image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600',
            href: '/sportswear',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-black mb-12"
                >
                    {language === 'th' ? 'เลือกช้อปตามประเภท' : 'Shop By Category'}
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <motion.a
                            key={category.id}
                            href={category.href}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden aspect-[3/4]"
                        >
                            {/* Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${category.image}')` }}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-300">{category.description}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Before You Decide - Article Cards Section
function BeforeYouDecide() {
    const { language } = useLanguage();

    const featuredArticleIds = ['choose-racket', 'choose-shoes', 'choose-apparel', 'proper-training'];
    const featuredArticles = featuredArticleIds
        .map((id) => articleData.find((article) => article.id === id))
        .filter((article): article is Article => Boolean(article));

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-black mb-8"
                >
                    {language === 'th' ? 'ก่อนตัดสินใจ' : 'Before You Decide'}
                </motion.h2>

                {/* 4-Column Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featuredArticles.map((article, index) => (
                        <motion.a
                            key={article.id}
                            href={`/articles/${article.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg"
                        >
                            {/* Card Image Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${article.image ?? article.heroImage}')` }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Article Title - Bottom Right */}
                            <div className="absolute bottom-4 right-4 left-4 text-right">
                                <h3 className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                                    {language === 'th' ? article.title : article.titleEn}
                                </h3>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Shop The Look - NOBULL Style Full Width with Floating Card
function ShopTheLook() {
    const { language } = useLanguage();

    return (
        <section className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-black mb-8"
                >
                    {language === 'th' ? 'เซ็ทแนะนำ' : 'Recommended Sets'}
                </motion.h2>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bundleProducts.map((bundle, index) => (
                        <motion.a
                            key={bundle.id}
                            href={`/bundles/${bundle.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl"
                        >
                            {/* Card Image Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${bundle.images[0]}')` }}
                            />

                            {/* Set Name Label - Top Left, White Text, No Background */}
                            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                                    {language === 'th' ? bundle.nameTh : bundle.name}
                                </h3>
                            </div>

                            {/* Floating Product Card - Bottom Right */}
                            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-[200px] md:w-[260px] bg-white shadow-2xl rounded-lg">
                                {/* Card Header */}
                                <div className="p-3 pb-2 border-b border-gray-100">
                                    <h4 className="text-sm md:text-base font-bold text-black">
                                        {language === 'th' ? 'รายละเอียดในเซ็ต' : 'In the Bundle'}
                                    </h4>
                                </div>

                                {/* Products List - Compact */}
                                <div className="p-3 space-y-2">
                                    {/* Main Product */}
                                    {bundle.items[0] && (
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 bg-gray-50 flex-shrink-0 overflow-hidden rounded">
                                                <div
                                                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                                                    style={{ backgroundImage: `url('${bundle.items[0].image}')` }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-black truncate">
                                                    {language === 'th' ? bundle.items[0].nameTh : bundle.items[0].name}
                                                </p>
                                                <p className="text-xs font-bold text-black">
                                                    ฿{bundle.items[0].price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Side Products */}
                                    {bundle.items.slice(1, 3).map((product, pIndex) => (
                                        <div key={pIndex} className="flex gap-2">
                                            <div className="w-10 h-10 bg-gray-50 flex-shrink-0 overflow-hidden rounded">
                                                <div
                                                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                                                    style={{ backgroundImage: `url('${product.image}')` }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-black truncate">
                                                    {language === 'th' ? product.nameTh : product.name}
                                                </p>
                                                <p className="text-xs font-bold text-black">
                                                    ฿{product.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}


// Help & Support Section
function HelpSection() {
    const { language } = useLanguage();

    const helpItems = [
        {
            title: language === 'th' ? 'คำถามที่พบบ่อย' : 'FAQs',
            href: '/faq',
        },
        {
            title: language === 'th' ? 'ติดต่อเรา' : 'Contact Us',
            href: '/contact',
        },
        {
            title: language === 'th' ? 'นโยบายคืนสินค้า' : 'Returns & Exchanges',
            href: '/returns',
        },
        {
            title: language === 'th' ? 'ติดตามคำสั่งซื้อ' : 'Track Order',
            href: '/track-order',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-black mb-12"
                >
                    {language === 'th' ? 'ต้องการความช่วยเหลือ?' : 'Need Help?'}
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {helpItems.map((item, index) => (
                        <motion.a
                            key={item.title}
                            href={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 border border-gray-200 hover:border-brand-yellow hover:bg-gray-50 transition-all group"
                        >
                            <span className="font-medium text-black">{item.title}</span>
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-yellow transition-colors" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Video Showcase Section - NOBULL Style
function VideoShowcase() {
    const { language } = useLanguage();

    const videos = [
        {
            id: 'video1',
            thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
            username: '@reach_official',
            videoUrl: '#',
        },
        {
            id: 'video2',
            thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600',
            username: '@badminton_pro',
            videoUrl: '#',
        },
        {
            id: 'video3',
            thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600',
            username: '@player_th',
            videoUrl: '#',
        },
        {
            id: 'video4',
            thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600',
            username: '@coach_reach',
            videoUrl: '#',
        },
        {
            id: 'video5',
            thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
            username: '@shuttlecock_king',
            videoUrl: '#',
        },
        {
            id: 'video6',
            thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600',
            username: '@pro_player',
            videoUrl: '#',
        },
        {
            id: 'video7',
            thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=600',
            username: '@badminton_th',
            videoUrl: '#',
        },
        {
            id: 'video8',
            thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600',
            username: '@reach_athlete',
            videoUrl: '#',
        },
    ];

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

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-black text-center mb-10"
                >
                    {language === 'th' ? 'นี่คือ REACH' : 'This is REACH'}
                </motion.h2>

                {/* Scrollable Video Carousel - Instagram 4:5 aspect ratio */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex-shrink-0 w-[45%] md:w-[23%] snap-start"
                        >
                            <a
                                href={video.videoUrl}
                                className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-black block"
                            >
                                {/* Video Thumbnail */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${video.thumbnail}')` }}
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
                                {video.username}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Slider Progress Bar & Navigation */}
                <div className="flex items-center justify-end mt-6 gap-4">
                    {/* Progress Bar */}
                    <div className="flex-1 h-px bg-gray-300 relative">
                        <div
                            className="absolute left-0 top-0 h-px bg-black transition-all duration-300"
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

// Footer (simplified for welcome page)
function WelcomeFooter() {
    const { language } = useLanguage();

    return (
        <footer className="py-12 bg-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">REACH</h3>
                <p className="text-gray-400 mb-8">
                    {language === 'th'
                        ? 'อุปกรณ์แบดมินตันระดับมืออาชีพ'
                        : 'Professional badminton equipment'}
                </p>
                <a
                    href="/shop"
                    className="inline-block bg-brand-yellow text-black px-8 py-4 font-semibold text-sm tracking-wider hover:bg-white transition-colors"
                >
                    {language === 'th' ? 'เริ่มช้อปเลย' : 'START SHOPPING'}
                </a>
                <p className="text-gray-500 text-sm mt-8">
                    © {new Date().getFullYear()} Reach Pro Store. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
                </p>
            </div>
        </footer>
    );
}

// Main Welcome Page
export default function WelcomePage() {
    return (
        <main>
            <Navbar />
            <WelcomeHero />
            <BeforeYouDecide />
            <ShopTheLook />
            <HelpSection />
            <VideoShowcase />
            <WelcomeFooter />
        </main>
    );
}
