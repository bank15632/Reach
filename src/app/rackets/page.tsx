"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters,
    colorFilterOptions
} from "@/components/ui/ProductFilterBar";
import { useLanguage } from "@/context/LanguageContext";
import { products } from "@/data/productData";

export default function RacketsPage() {
    const { language } = useLanguage();
    const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    // Extract unique series from products
    const seriesOptions = useMemo(() => {
        const series = [...new Set(products.map(p => p.specs.series))];
        return series.map(s => ({ value: s, label: s, labelTh: s }));
    }, []);

    // Extract unique play styles
    const playStyleOptions = [
        { value: 'power', label: 'Power', labelTh: 'พลัง' },
        { value: 'speed', label: 'Speed', labelTh: 'ความเร็ว' },
        { value: 'control', label: 'Control', labelTh: 'ควบคุม' },
        { value: 'all-round', label: 'All-Round', labelTh: 'รอบด้าน' },
    ];

    // Price range options
    const priceOptions = [
        { value: 'under-5000', label: 'Under ฿5,000', labelTh: 'ต่ำกว่า ฿5,000' },
        { value: '5000-7000', label: '฿5,000 - ฿7,000', labelTh: '฿5,000 - ฿7,000' },
        { value: 'over-7000', label: 'Over ฿7,000', labelTh: 'มากกว่า ฿7,000' },
    ];

    // Skill level options
    const skillOptions = [
        { value: 'beginner', label: 'Beginner', labelTh: 'เริ่มต้น' },
        { value: 'intermediate', label: 'Intermediate', labelTh: 'ปานกลาง' },
        { value: 'advanced', label: 'Advanced', labelTh: 'ขั้นสูง' },
        { value: 'professional', label: 'Professional', labelTh: 'มืออาชีพ' },
    ];

    // Filter configurations for rackets
    const filters: FilterConfig[] = [
        {
            key: 'series',
            label: 'Series',
            labelTh: 'ซีรีส์',
            options: seriesOptions
        },
        {
            key: 'color',
            label: 'Color',
            labelTh: 'สี',
            options: colorFilterOptions,
            type: 'color'
        },
        {
            key: 'playStyle',
            label: 'Play Style',
            labelTh: 'สไตล์การเล่น',
            options: playStyleOptions
        },
        {
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        },
        {
            key: 'skill',
            label: 'Skill Level',
            labelTh: 'ระดับทักษะ',
            options: skillOptions
        },
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Apply series filter
        if (activeFilters.series?.length > 0) {
            result = result.filter(p => activeFilters.series.includes(p.specs.series));
        }

        // Apply color filter
        if (activeFilters.color?.length > 0) {
            result = result.filter(p =>
                p.colors.some(c => activeFilters.color.includes(c.hex))
            );
        }

        // Apply play style filter
        if (activeFilters.playStyle?.length > 0) {
            result = result.filter(p => {
                const ratings = p.performanceRatings;
                return activeFilters.playStyle.some(style => {
                    switch (style) {
                        case 'power': return ratings.power >= 80;
                        case 'speed': return ratings.speed >= 80;
                        case 'control': return ratings.control >= 80;
                        case 'all-round': return ratings.power >= 70 && ratings.speed >= 70 && ratings.control >= 70;
                        default: return true;
                    }
                });
            });
        }

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(p => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-5000': return p.price < 5000;
                        case '5000-7000': return p.price >= 5000 && p.price <= 7000;
                        case 'over-7000': return p.price > 7000;
                        default: return true;
                    }
                });
            });
        }

        // Apply skill level filter (using productTier)
        if (activeFilters.skill?.length > 0) {
            result = result.filter(p => {
                const tier = p.specs.productTier.toLowerCase();
                return activeFilters.skill.some(skill => tier.includes(skill));
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                // Assuming newer products are at the end of the array
                result = result.reverse();
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                // Sort by a bestseller flag if available, otherwise keep original order
                break;
        }

        return result;
    }, [activeFilters, sortBy]);

    const getSelectedColorIndex = (productId: string) => selectedColors[productId] || 0;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'RACKETS', labelTh: 'ไม้แบด' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow">
                        {language === 'th' ? 'ไม้แบด' : 'Rackets'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {language === 'th' ? 'ไม้แบดระดับมืออาชีพ' : 'Professional grade rackets'}
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <ProductFilterBar
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={toggleFilter}
                onClearAll={clearAllFilters}
                sortOptions={defaultSortOptions}
                sortValue={sortBy}
                onSortChange={setSortBy}
                totalItems={filteredProducts.length}
            />

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-6">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                {language === 'th' ? 'ไม่พบสินค้าที่ตรงกับตัวกรอง' : 'No products match your filters'}
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-brand-yellow hover:underline"
                            >
                                {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : 'Clear all filters'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map((product, index) => {
                                const selectedIndex = getSelectedColorIndex(product.id);
                                const selectedColor = product.colors[selectedIndex];

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <Link href={`/rackets/${product.id}`} className="block relative">
                                            {product.badge && (
                                                <div className="absolute top-3 left-3 z-10 bg-black text-white px-2 py-1 text-xs font-bold">
                                                    {product.badge}
                                                </div>
                                            )}
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                                    style={{ backgroundImage: `url('${selectedColor?.image || product.images[0]}')` }}
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex gap-2 mt-3 mb-3">
                                            {product.colors.map((color, colorIndex) => (
                                                <button
                                                    key={colorIndex}
                                                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: colorIndex }))}
                                                    className={`w-7 h-7 rounded-full border-2 transition-all ${colorIndex === selectedIndex
                                                        ? 'border-black ring-2 ring-offset-1 ring-black'
                                                        : 'border-gray-300 hover:border-gray-500'
                                                        }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={language === 'th' ? color.nameTh : color.name}
                                                />
                                            ))}
                                        </div>

                                        <Link href={`/rackets/${product.id}`}>
                                            <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                                {language === 'th' ? product.nameTh : product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 mb-2">{product.specs.series}</p>
                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">{language === 'th' ? selectedColor?.nameTh : selectedColor?.name}</span>
                                            <div className="flex items-center gap-2">
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>
                                                )}
                                                <span className="text-sm font-bold text-black">฿{product.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
