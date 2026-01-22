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
import {
    products as racketProducts,
    shoeProducts,
    sportswearProducts,
    bundleProducts,
    supplementProducts,
} from "@/data/productData";

// Unified sale product interface
interface SaleProduct {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    categoryLabelTh: string;
    price: number;
    originalPrice: number;
    discount: number;
    href: string;
    colors: {
        name: string;
        nameTh: string;
        hex: string;
        image: string;
    }[];
}

export default function SalePage() {
    const { language } = useLanguage();
    const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters, setFilterValue } = useProductFilters();

    // Collect all products with originalPrice (on sale) from all categories
    const allSaleProducts: SaleProduct[] = useMemo(() => {
        const saleItems: SaleProduct[] = [];

        // Rackets with sale
        racketProducts.filter(p => p.originalPrice).forEach(p => {
            saleItems.push({
                id: p.id,
                name: language === 'th' ? p.nameTh : p.name,
                category: 'rackets',
                categoryLabel: 'Rackets',
                categoryLabelTh: 'ไม้แบด',
                price: p.price,
                originalPrice: p.originalPrice!,
                discount: Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100),
                href: `/rackets/${p.id}`,
                colors: p.colors.map(c => ({ name: c.name, nameTh: c.nameTh, hex: c.hex, image: c.image })),
            });
        });

        // Shoes with sale
        shoeProducts.filter(p => p.originalPrice).forEach(p => {
            saleItems.push({
                id: p.id,
                name: language === 'th' ? p.nameTh : p.name,
                category: 'shoes',
                categoryLabel: 'Shoes',
                categoryLabelTh: 'รองเท้า',
                price: p.price,
                originalPrice: p.originalPrice!,
                discount: Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100),
                href: `/shoes/${p.id}`,
                colors: p.colors.map(c => ({ name: c.name, nameTh: c.nameTh, hex: c.hex, image: c.image })),
            });
        });

        // Sportswear with sale
        sportswearProducts.filter(p => p.originalPrice).forEach(p => {
            saleItems.push({
                id: p.id,
                name: language === 'th' ? p.nameTh : p.name,
                category: 'sportswear',
                categoryLabel: 'Sportswear',
                categoryLabelTh: 'ชุดกีฬา',
                price: p.price,
                originalPrice: p.originalPrice!,
                discount: Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100),
                href: `/sportswear/${p.id}`,
                colors: p.colors.map(c => ({ name: c.name, nameTh: c.nameTh, hex: c.hex, image: c.image })),
            });
        });

        // Bundles (all have originalPrice by design)
        bundleProducts.forEach(p => {
            saleItems.push({
                id: p.id,
                name: language === 'th' ? p.nameTh : p.name,
                category: 'bundles',
                categoryLabel: 'Bundles',
                categoryLabelTh: 'เซ็ตสุดคุ้ม',
                price: p.price,
                originalPrice: p.originalPrice,
                discount: p.savingsPercent,
                href: `/bundles/${p.id}`,
                colors: [{ name: 'Default', nameTh: 'ค่าเริ่มต้น', hex: '#1a1a1a', image: p.images[0] }],
            });
        });

        // Supplements with sale
        supplementProducts.filter(p => p.originalPrice).forEach(p => {
            saleItems.push({
                id: p.id,
                name: language === 'th' ? p.nameTh : p.name,
                category: 'supplements',
                categoryLabel: 'Supplements',
                categoryLabelTh: 'อาหารเสริม',
                price: p.price,
                originalPrice: p.originalPrice!,
                discount: Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100),
                href: `/supplements/${p.id}`,
                colors: p.colors.map(c => ({ name: c.name, nameTh: c.nameTh, hex: c.hex, image: c.image })),
            });
        });

        return saleItems;
    }, [language]);

    // Category options
    const categoryOptions = [
        { value: 'rackets', label: 'Rackets', labelTh: 'ไม้แบด' },
        { value: 'shoes', label: 'Shoes', labelTh: 'รองเท้า' },
        { value: 'sportswear', label: 'Sportswear', labelTh: 'ชุดกีฬา' },
        { value: 'bundles', label: 'Bundles', labelTh: 'เซ็ตสุดคุ้ม' },
        { value: 'supplements', label: 'Supplements', labelTh: 'อาหารเสริม' },
    ];

    // Price range options
    const priceOptions = [
        { value: 'under-1000', label: 'Under ฿1,000', labelTh: 'ต่ำกว่า ฿1,000' },
        { value: '1000-3000', label: '฿1,000 - ฿3,000', labelTh: '฿1,000 - ฿3,000' },
        { value: '3000-5000', label: '฿3,000 - ฿5,000', labelTh: '฿3,000 - ฿5,000' },
        { value: 'over-5000', label: 'Over ฿5,000', labelTh: 'มากกว่า ฿5,000' },
    ];

    // Filter configurations
    const filters: FilterConfig[] = [
        {
            key: 'category',
            label: 'Category',
            labelTh: 'หมวดหมู่',
            options: categoryOptions
        },
        {
            key: 'color',
            label: 'Color',
            labelTh: 'สี',
            options: colorFilterOptions,
            type: 'color'
        },
        {
            key: 'discount',
            label: 'Discount',
            labelTh: 'ส่วนลด',
            type: 'range',
            range: {
                min: 0,
                max: 95,
                step: 5,
                unit: '%'
            }
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
        let result = [...allSaleProducts];

        // Apply category filter
        if (activeFilters.category?.length > 0) {
            result = result.filter(p => activeFilters.category.includes(p.category));
        }

        // Apply color filter
        if (activeFilters.color?.length > 0) {
            result = result.filter(p =>
                p.colors.some(c => activeFilters.color.includes(c.hex))
            );
        }

        // Apply discount filter
        if (activeFilters.discount?.length > 0) {
            const minDiscount = Number(activeFilters.discount[0] ?? 0);
            if (minDiscount > 0) {
                result = result.filter(p => p.discount >= minDiscount);
            }
        }

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(p => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-1000': return p.price < 1000;
                        case '1000-3000': return p.price >= 1000 && p.price <= 3000;
                        case '3000-5000': return p.price > 3000 && p.price <= 5000;
                        case 'over-5000': return p.price > 5000;
                        default: return true;
                    }
                });
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
        }

        return result;
    }, [activeFilters, sortBy, allSaleProducts]);

    const getSelectedColorIndex = (productId: string) => selectedColors[productId] || 0;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'SALE', labelTh: 'ลดกระหน่ำ' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {language === 'th' ? '🔥 ลดกระหน่ำ' : '🔥 SALE'}
                    </h1>
                    <p className="text-white/80 mt-2">
                        {language === 'th' ? 'ลดสูงสุด 50% ของมีจำนวนจำกัด!' : 'Up to 50% off! Limited quantities!'}
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <ProductFilterBar
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={toggleFilter}
                onFilterValueChange={setFilterValue}
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
                                className="mt-4 text-red-500 hover:underline"
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
                                        <Link href={product.href} className="block relative">
                                            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 text-xs font-bold">
                                                -{product.discount}%
                                            </div>
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                                    style={{ backgroundImage: `url('${selectedColor.image}')` }}
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex gap-1.5 mt-3 mb-3">
                                            {product.colors.map((color: SaleProduct['colors'][0], colorIndex: number) => (
                                                <button
                                                    key={colorIndex}
                                                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: colorIndex }))}
                                                    className={`w-7 h-7 rounded-full border-2 transition-all ${colorIndex === selectedIndex ? 'border-black ring-1 ring-black/30' : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={language === 'th' ? color.nameTh : color.name}
                                                />
                                            ))}
                                        </div>

                                        <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">{language === 'th' ? product.categoryLabelTh : product.categoryLabel}</p>
                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">{language === 'th' ? selectedColor.nameTh : selectedColor.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-red-600">฿{product.price.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>
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
