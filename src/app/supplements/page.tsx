"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters
} from "@/components/ui/ProductFilterBar";
import { useLanguage } from "@/context/LanguageContext";
import { supplementProducts, supplementCategoryNames, SupplementCategory } from "@/data/productData";

export default function SupplementsPage() {
    const { language } = useLanguage();
    const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    // Category options from supplementCategoryNames
    const categoryOptions = useMemo(() => {
        return (Object.keys(supplementCategoryNames) as SupplementCategory[]).map(key => ({
            value: key,
            label: supplementCategoryNames[key].en,
            labelTh: supplementCategoryNames[key].th
        }));
    }, []);

    // Flavor options (text-based)
    const flavorOptions = useMemo(() => {
        const flavorMap = new Map<string, { label: string; labelTh: string }>();
        supplementProducts.forEach(product => {
            product.colors.forEach(color => {
                if (!flavorMap.has(color.name)) {
                    flavorMap.set(color.name, { label: color.name, labelTh: color.nameTh });
                }
            });
        });
        return Array.from(flavorMap.entries()).map(([value, labels]) => ({
            value,
            label: labels.label,
            labelTh: labels.labelTh,
        }));
    }, []);

    // Price range options
    const priceOptions = [
        { value: 'under-500', label: 'Under ฿500', labelTh: 'ต่ำกว่า ฿500' },
        { value: '500-1000', label: '฿500 - ฿1,000', labelTh: '฿500 - ฿1,000' },
        { value: '1000-2000', label: '฿1,000 - ฿2,000', labelTh: '฿1,000 - ฿2,000' },
        { value: 'over-2000', label: 'Over ฿2,000', labelTh: 'มากกว่า ฿2,000' },
    ];

    // Filter configurations for supplements
    const filters: FilterConfig[] = [
        {
            key: 'category',
            label: 'Category',
            labelTh: 'หมวดหมู่',
            options: categoryOptions
        },
        {
            key: 'flavor',
            label: 'Flavor',
            labelTh: 'รสชาติ',
            options: flavorOptions
        },
        {
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        },
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...supplementProducts];

        // Apply category filter
        if (activeFilters.category?.length > 0) {
            result = result.filter(p => activeFilters.category.includes(p.category));
        }

        // Apply flavor filter
        if (activeFilters.flavor?.length > 0) {
            result = result.filter(p =>
                p.colors.some(c => activeFilters.flavor.includes(c.name))
            );
        }

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(p => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-500': return p.price < 500;
                        case '500-1000': return p.price >= 500 && p.price <= 1000;
                        case '1000-2000': return p.price > 1000 && p.price <= 2000;
                        case 'over-2000': return p.price > 2000;
                        default: return true;
                    }
                });
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result = result.filter(p => p.badge === 'NEW').concat(result.filter(p => p.badge !== 'NEW'));
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                result = result.filter(p => p.badge === 'BEST SELLER').concat(result.filter(p => p.badge !== 'BEST SELLER'));
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
                    <Breadcrumb items={[{ label: 'SUPPLEMENTS', labelTh: 'อาหารเสริม' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow">
                        {language === 'th' ? 'อาหารเสริม' : 'Supplements'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {language === 'th' ? 'อาหารเสริมสำหรับนักกีฬา เพิ่มพลังและฟื้นฟูร่างกาย' : 'Sports nutrition for enhanced performance and recovery'}
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
                                        <Link href={`/supplements/${product.id}`} className="block relative">
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

                                        <div className="flex flex-wrap gap-2 mt-3 mb-3">
                                            {product.colors.map((color, colorIndex) => (
                                                <button
                                                    key={colorIndex}
                                                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: colorIndex }))}
                                                    className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${colorIndex === selectedIndex
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                                                        }`}
                                                >
                                                    {language === 'th' ? color.nameTh : color.name}
                                                </button>
                                            ))}
                                        </div>

                                        <Link href={`/supplements/${product.id}`}>
                                            <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                                {language === 'th' ? product.nameTh : product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {language === 'th' 
                                                ? supplementCategoryNames[product.category].th 
                                                : supplementCategoryNames[product.category].en}
                                        </p>
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
