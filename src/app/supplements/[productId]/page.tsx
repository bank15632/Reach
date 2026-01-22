"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getSupplementProductById, supplementProducts, SupplementProduct, supplementCategoryNames } from "@/data/productData";
import { notFound } from "next/navigation";
import { use } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import ProductAddToCart from "@/components/product/ProductAddToCart";

// Nutrition Bar Component - similar to Performance Slider but for nutrition values
function NutritionBar({
    label,
    labelTh,
    value,
    maxValue,
    unit,
    language
}: {
    label: string;
    labelTh: string;
    value: number;
    maxValue: number;
    unit: string;
    language: string;
}) {
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{language === 'th' ? labelTh : label}</span>
                <span className="text-sm font-bold text-gray-900">{value}{unit}</span>
            </div>
            <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-brand-yellow rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}

// Product Gallery Component with Flavor-Based Main Image
function ProductGallery({ images, mainImage }: { images: string[]; mainImage?: string }) {
    const [selectedImage, setSelectedImage] = useState(0);

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

// Supplement Features Section with dropdowns
function SupplementFeaturesSection({
    product,
    language
}: {
    product: SupplementProduct;
    language: string;
}) {
    const [benefitsOpen, setBenefitsOpen] = useState(false);
    const [ingredientsOpen, setIngredientsOpen] = useState(false);
    const [howToUseOpen, setHowToUseOpen] = useState(false);

    const benefits = language === 'th' ? product.benefitsTh : product.benefits;

    // Ingredients info based on product specs
    const ingredientsInfo = [
        { label: language === 'th' ? 'รูปแบบ' : 'Form', value: product.specs.form },
        { label: language === 'th' ? 'ขนาดรับประทาน' : 'Serving Size', value: product.specs.servingSize },
        { label: language === 'th' ? 'จำนวนครั้ง' : 'Servings Per Container', value: product.specs.servingsPerContainer },
        { label: language === 'th' ? 'รสชาติ' : 'Flavor', value: product.specs.flavor },
    ];

    // How to use content
    const howToUseContent = [
        {
            title: language === 'th' ? 'วิธีรับประทาน' : 'How to Take',
            desc: language === 'th'
                ? `รับประทาน ${product.specs.servingSize} ต่อครั้ง ผสมกับน้ำ 200-300 ml`
                : `Take ${product.specs.servingSize} per serving, mix with 200-300 ml of water`
        },
        {
            title: language === 'th' ? 'เวลาที่เหมาะสม' : 'Best Time',
            desc: language === 'th'
                ? product.category === 'protein' ? 'หลังออกกำลังกาย 30 นาที' : 'ก่อนหรือหลังออกกำลังกาย'
                : product.category === 'protein' ? '30 minutes after workout' : 'Before or after workout'
        },
        {
            title: language === 'th' ? 'คำเตือน' : 'Warning',
            desc: language === 'th'
                ? 'ไม่ควรรับประทานเกินปริมาณที่แนะนำ เก็บให้พ้นมือเด็ก'
                : 'Do not exceed recommended dose. Keep out of reach of children.'
        },
    ];

    return (
        <section className="py-4 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* ประโยชน์ Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'ประโยชน์' : 'Benefits'}
                    isOpen={benefitsOpen}
                    onToggle={() => setBenefitsOpen(!benefitsOpen)}
                >
                    <div className="pb-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="mb-4 flex items-start gap-3">
                                <div className="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-black">{idx + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </ChevronDropdown>

                {/* ส่วนประกอบ Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'ข้อมูลผลิตภัณฑ์' : 'Product Information'}
                    isOpen={ingredientsOpen}
                    onToggle={() => setIngredientsOpen(!ingredientsOpen)}
                >
                    <div className="pb-6">
                        {ingredientsInfo.map((info, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                            >
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {info.label}
                                </span>
                                <span className="text-sm font-medium text-black">
                                    {info.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </ChevronDropdown>

                {/* วิธีใช้ Dropdown */}
                <ChevronDropdown
                    title={language === 'th' ? 'วิธีรับประทาน' : 'How to Use'}
                    isOpen={howToUseOpen}
                    onToggle={() => setHowToUseOpen(!howToUseOpen)}
                >
                    <div className="pb-8">
                        {/* Row 1: Large image + Small image */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="col-span-2 aspect-[16/10] bg-gray-100 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${product.images[0]}')` }}
                                />
                            </div>
                            <div className="col-span-1 aspect-[10/16] bg-gray-100 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${product.images[1] || product.images[0]}')` }}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-300 my-6" />

                        {/* Row 2: 3-column text */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {howToUseContent.map((content, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-bold text-black mb-1">{content.title}</p>
                                    <p className="text-sm text-gray-600">{content.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Row 3: Ultrawide image */}
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
        { thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600', username: '@reach_official' },
        { thumbnail: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=600', username: '@fit_athlete' },
        { thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600', username: '@gym_pro' },
        { thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600', username: '@coach_reach' },
        { thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600', username: '@nutrition_king' },
        { thumbnail: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=600', username: '@pro_athlete' },
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
    const relatedProducts = supplementProducts.filter(p => p.id !== currentProductId);

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
                            href={`/supplements/${product.id}`}
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
                                <p className="text-xs text-gray-500">
                                    {language === 'th' 
                                        ? supplementCategoryNames[product.category].th 
                                        : supplementCategoryNames[product.category].en}
                                </p>
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

// Flavor Selector Component
function FlavorSelector({
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
                <span className="font-medium">{language === 'th' ? 'รสชาติ' : 'Flavor'}:</span> {language === 'th' ? selectedColor?.nameTh : selectedColor?.name}
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
export default function SupplementProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const product = getSupplementProductById(resolvedParams.productId);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    if (!product) {
        notFound();
    }

    // Get the current flavor's image
    const currentFlavorImage = product.colors[selectedColorIndex]?.image;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'SUPPLEMENTS', labelTh: 'อาหารเสริม', href: '/supplements' },
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
                            <ProductGallery images={product.images} mainImage={currentFlavorImage} />
                        </motion.div>

                        {/* Right: Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Category & Form */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{language === 'th' ? supplementCategoryNames[product.category].th : supplementCategoryNames[product.category].en}</span>
                                <span>•</span>
                                <span className="capitalize">{product.specs.form}</span>
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
                                                ? `ลด ${Math.round((1 - product.price / product.originalPrice) * 100)}% สำหรับสินค้านี้ ส่วนลดแสดงแล้ว`
                                                : `${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF THIS PRODUCT. DISCOUNT AS SHOWN.`
                                            }
                                        </p>
                                    </div>
                                </div>
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

                            {/* Flavor Selector */}
                            <FlavorSelector
                                colors={product.colors}
                                selectedColorIndex={selectedColorIndex}
                                onColorChange={setSelectedColorIndex}
                                language={language}
                            />

                            {/* Quantity & Add to Cart */}
                            <ProductAddToCart
                                product={product}
                                selectedColor={product.colors[selectedColorIndex]}
                                category="supplements"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <SupplementFeaturesSection product={product} language={language} />

            {/* Nutrition Section */}
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
                                            ? `${product.specs.servingSize} ต่อครั้ง สำหรับผลลัพธ์ที่ดีที่สุด`
                                            : `${product.specs.servingSize} per serving for best results`
                                        }
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">02</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `มี ${product.specs.servingsPerContainer} มื้อต่อกระปุก`
                                            : `${product.specs.servingsPerContainer} servings per container`
                                        }
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium">03</span>
                                    <span className="text-gray-700">
                                        {language === 'th'
                                            ? `รูปแบบ ${product.specs.form} ละลายง่าย`
                                            : `${product.specs.form} form for easy mixing`
                                        }
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Nutrition Bars */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                {language === 'th' ? 'ข้อมูลโภชนาการ' : 'Nutrition Facts'}
                            </h3>
                            {product.nutrition.calories !== undefined && (
                                <NutritionBar
                                    label="Calories"
                                    labelTh="แคลอรี่"
                                    value={product.nutrition.calories}
                                    maxValue={500}
                                    unit=" kcal"
                                    language={language}
                                />
                            )}
                            {product.nutrition.protein !== undefined && (
                                <NutritionBar
                                    label="Protein"
                                    labelTh="โปรตีน"
                                    value={product.nutrition.protein}
                                    maxValue={50}
                                    unit="g"
                                    language={language}
                                />
                            )}
                            {product.nutrition.carbs !== undefined && (
                                <NutritionBar
                                    label="Carbohydrates"
                                    labelTh="คาร์โบไฮเดรต"
                                    value={product.nutrition.carbs}
                                    maxValue={50}
                                    unit="g"
                                    language={language}
                                />
                            )}
                            {product.nutrition.sugar !== undefined && (
                                <NutritionBar
                                    label="Sugar"
                                    labelTh="น้ำตาล"
                                    value={product.nutrition.sugar}
                                    maxValue={30}
                                    unit="g"
                                    language={language}
                                />
                            )}
                            {product.nutrition.sodium !== undefined && (
                                <NutritionBar
                                    label="Sodium"
                                    labelTh="โซเดียม"
                                    value={product.nutrition.sodium}
                                    maxValue={1000}
                                    unit="mg"
                                    language={language}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Gallery */}
            <CommunityGallery language={language} />

            {/* You Might Also Like */}
            <YouMightAlsoLike currentProductId={product.id} language={language} />
        </main>
    );
}
