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
import { shoeProducts } from "@/data/productData";

export default function ShoesPage() {
    const { language } = useLanguage();
    const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    // Size options (US sizes)
    const sizeOptions = [
        { value: '6', label: 'US 6', labelTh: 'US 6' },
        { value: '6.5', label: 'US 6.5', labelTh: 'US 6.5' },
        { value: '7', label: 'US 7', labelTh: 'US 7' },
        { value: '7.5', label: 'US 7.5', labelTh: 'US 7.5' },
        { value: '8', label: 'US 8', labelTh: 'US 8' },
        { value: '8.5', label: 'US 8.5', labelTh: 'US 8.5' },
        { value: '9', label: 'US 9', labelTh: 'US 9' },
        { value: '9.5', label: 'US 9.5', labelTh: 'US 9.5' },
        { value: '10', label: 'US 10', labelTh: 'US 10' },
        { value: '10.5', label: 'US 10.5', labelTh: 'US 10.5' },
        { value: '11', label: 'US 11', labelTh: 'US 11' },
        { value: '12', label: 'US 12', labelTh: 'US 12' },
    ];

    // Product tier options
    const tierOptions = [
        { value: 'Professional', label: 'Professional', labelTh: 'มืออาชีพ' },
        { value: 'Advanced', label: 'Advanced', labelTh: 'ขั้นสูง' },
        { value: 'Intermediate', label: 'Intermediate', labelTh: 'ปานกลาง' },
        { value: 'Beginner', label: 'Beginner', labelTh: 'เริ่มต้น' },
    ];

    // Price range options
    const priceOptions = [
        { value: 'under-3000', label: 'Under ฿3,000', labelTh: 'ต่ำกว่า ฿3,000' },
        { value: '3000-5000', label: '฿3,000 - ฿5,000', labelTh: '฿3,000 - ฿5,000' },
        { value: '5000-7000', label: '฿5,000 - ฿7,000', labelTh: '฿5,000 - ฿7,000' },
        { value: 'over-7000', label: 'Over ฿7,000', labelTh: 'มากกว่า ฿7,000' },
    ];

    // Gender options
    const genderOptions = [
        { value: 'unisex', label: 'Unisex', labelTh: 'ยูนิเซ็กส์' },
        { value: 'men', label: 'Men', labelTh: 'ผู้ชาย' },
        { value: 'women', label: 'Women', labelTh: 'ผู้หญิง' },
    ];

    // Filter configurations for shoes
    const filters: FilterConfig[] = [
        {
            key: 'size',
            label: 'Size',
            labelTh: 'ไซส์',
            options: sizeOptions
        },
        {
            key: 'color',
            label: 'Color',
            labelTh: 'สี',
            options: colorFilterOptions,
            type: 'color'
        },
        {
            key: 'tier',
            label: 'Level',
            labelTh: 'ระดับ',
            options: tierOptions
        },
        {
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        },
        {
            key: 'gender',
            label: 'Gender',
            labelTh: 'เพศ',
            options: genderOptions
        },
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...shoeProducts];

        // Apply size filter
        if (activeFilters.size?.length > 0) {
            result = result.filter(p =>
                p.sizes.some(s => activeFilters.size.includes(s.size) && s.available)
            );
        }

        // Apply color filter
        if (activeFilters.color?.length > 0) {
            result = result.filter(p =>
                p.colors.some(c => activeFilters.color.includes(c.hex))
            );
        }

        // Apply tier filter
        if (activeFilters.tier?.length > 0) {
            result = result.filter(p => activeFilters.tier.includes(p.specs.productTier));
        }

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(p => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-3000': return p.price < 3000;
                        case '3000-5000': return p.price >= 3000 && p.price <= 5000;
                        case '5000-7000': return p.price > 5000 && p.price <= 7000;
                        case 'over-7000': return p.price > 7000;
                        default: return true;
                    }
                });
            });
        }

        // Apply gender filter (assuming all shoes are unisex for now)
        // You can add gender field to shoeProducts data if needed

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result = result.reverse();
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                // Keep original order for bestseller
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
                    <Breadcrumb items={[{ label: 'SHOES', labelTh: 'รองเท้า' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow">
                        {language === 'th' ? 'รองเท้า' : 'Shoes'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {language === 'th' ? 'รองเท้าแบดมินตันระดับมืออาชีพ' : 'Professional badminton footwear'}
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
                                        <Link href={`/shoes/${product.id}`} className="block relative">
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

                                        <Link href={`/shoes/${product.id}`}>
                                            <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                                {language === 'th' ? product.nameTh : product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 mb-2">{product.specs.productTier}</p>
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
