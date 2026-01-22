"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters,
    colorFilterOptions
} from "@/components/ui/ProductFilterBar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
    products as racketProducts,
    shoeProducts,
    sportswearProducts,
    bundleProducts,
    supplementProducts
} from "@/data/productData";

// Unified product type for shop page
interface ShopProduct {
    id: string;
    name: string;
    nameTh: string;
    category: 'rackets' | 'shoes' | 'apparel' | 'bundles' | 'supplements';
    categoryLabel: string;
    categoryLabelTh: string;
    price: number;
    originalPrice?: number;
    href: string;
    badge?: string;
    isNew: boolean;
    isBestseller: boolean;
    colors: Array<{
        name: string;
        nameTh: string;
        hex: string;
        image: string;
    }>;
    images: string[];
}

export default function ShopPage() {
    const { language } = useLanguage();
    const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    // Transform all product types to unified ShopProduct format
    const allProducts = useMemo<ShopProduct[]>(() => {
        const result: ShopProduct[] = [];

        // Add rackets
        racketProducts.forEach(product => {
            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: 'rackets',
                categoryLabel: 'Badminton Racket',
                categoryLabelTh: 'ไม้แบดมินตัน',
                price: product.price,
                originalPrice: product.originalPrice,
                href: `/rackets/${product.id}`,
                badge: product.badge,
                isNew: product.badge === 'NEW',
                isBestseller: product.badge === 'BEST SELLER',
                colors: product.colors.map(c => ({
                    name: c.name,
                    nameTh: c.nameTh,
                    hex: c.hex,
                    image: c.image
                })),
                images: product.images,
            });
        });

        // Add shoes
        shoeProducts.forEach(product => {
            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: 'shoes',
                categoryLabel: 'Shoes',
                categoryLabelTh: 'รองเท้า',
                price: product.price,
                originalPrice: product.originalPrice,
                href: `/shoes/${product.id}`,
                badge: product.badge,
                isNew: product.badge === 'NEW',
                isBestseller: product.badge === 'BEST SELLER',
                colors: product.colors.map(c => ({
                    name: c.name,
                    nameTh: c.nameTh,
                    hex: c.hex,
                    image: c.image
                })),
                images: product.images,
            });
        });

        // Add sportswear
        sportswearProducts.forEach(product => {
            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: 'apparel',
                categoryLabel: 'Sportswear',
                categoryLabelTh: 'ชุดกีฬา',
                price: product.price,
                originalPrice: product.originalPrice,
                href: `/sportswear/${product.id}`,
                badge: product.badge,
                isNew: product.badge === 'NEW',
                isBestseller: product.badge === 'BEST SELLER',
                colors: product.colors.map(c => ({
                    name: c.name,
                    nameTh: c.nameTh,
                    hex: c.hex,
                    image: c.image
                })),
                images: product.images,
            });
        });

        // Add bundles (bundles don't have colors, use first image as default)
        bundleProducts.forEach(product => {
            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: 'bundles',
                categoryLabel: 'Bundle',
                categoryLabelTh: 'เซ็ตสุดคุ้ม',
                price: product.price,
                originalPrice: product.originalPrice,
                href: `/bundles/${product.id}`,
                badge: product.badge,
                isNew: false,
                isBestseller: product.badge === 'BEST SELLER' || product.badge === 'BEST VALUE',
                colors: [{
                    name: 'Default',
                    nameTh: 'มาตรฐาน',
                    hex: '#1a1a1a',
                    image: product.images[0]
                }],
                images: product.images,
            });
        });

        // Add supplements
        supplementProducts.forEach(product => {
            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: 'supplements',
                categoryLabel: 'Supplements',
                categoryLabelTh: 'อาหารเสริม',
                price: product.price,
                originalPrice: product.originalPrice,
                href: `/supplements/${product.id}`,
                badge: product.badge,
                isNew: product.badge === 'NEW',
                isBestseller: product.badge === 'BEST SELLER',
                colors: product.colors.map(c => ({
                    name: c.name,
                    nameTh: c.nameTh,
                    hex: c.hex,
                    image: c.image
                })),
                images: product.images,
            });
        });

        return result;
    }, []);

    // Category options
    const categoryOptions = [
        { value: 'rackets', label: 'Rackets', labelTh: 'ไม้แบด' },
        { value: 'shoes', label: 'Shoes', labelTh: 'รองเท้า' },
        { value: 'apparel', label: 'Apparel', labelTh: 'ชุดกีฬา' },
        { value: 'bundles', label: 'Bundles', labelTh: 'เซ็ตสุดคุ้ม' },
        { value: 'supplements', label: 'Supplements', labelTh: 'อาหารเสริม' },
    ];

    // Price range options
    const priceOptions = [
        { value: 'under-3000', label: 'Under ฿3,000', labelTh: 'ต่ำกว่า ฿3,000' },
        { value: '3000-5000', label: '฿3,000 - ฿5,000', labelTh: '฿3,000 - ฿5,000' },
        { value: '5000-10000', label: '฿5,000 - ฿10,000', labelTh: '฿5,000 - ฿10,000' },
        { value: 'over-10000', label: 'Over ฿10,000', labelTh: 'มากกว่า ฿10,000' },
    ];

    // Size options (combined for shoes and apparel)
    const sizeOptions = [
        { value: 'XS', label: 'XS', labelTh: 'XS' },
        { value: 'S', label: 'S', labelTh: 'S' },
        { value: 'M', label: 'M', labelTh: 'M' },
        { value: 'L', label: 'L', labelTh: 'L' },
        { value: 'XL', label: 'XL', labelTh: 'XL' },
        { value: '2XL', label: '2XL', labelTh: '2XL' },
        { value: '7', label: 'US 7', labelTh: 'US 7' },
        { value: '8', label: 'US 8', labelTh: 'US 8' },
        { value: '9', label: 'US 9', labelTh: 'US 9' },
        { value: '10', label: 'US 10', labelTh: 'US 10' },
        { value: '11', label: 'US 11', labelTh: 'US 11' },
        { value: '12', label: 'US 12', labelTh: 'US 12' },
    ];

    // Gender options
    const genderOptions = [
        { value: 'unisex', label: 'Unisex', labelTh: 'ยูนิเซ็กส์' },
        { value: 'men', label: 'Men', labelTh: 'ผู้ชาย' },
        { value: 'women', label: 'Women', labelTh: 'ผู้หญิง' },
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
        let result = [...allProducts];

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

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(p => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-3000': return p.price < 3000;
                        case '3000-5000': return p.price >= 3000 && p.price <= 5000;
                        case '5000-10000': return p.price > 5000 && p.price <= 10000;
                        case 'over-10000': return p.price > 10000;
                        default: return true;
                    }
                });
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                result = result.filter(p => p.isBestseller).concat(result.filter(p => !p.isBestseller));
                break;
        }

        return result;
    }, [allProducts, activeFilters, sortBy]);

    // Helper to get selected color for a product
    const getSelectedColorIndex = (productId: string) => selectedColors[productId] || 0;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header Section */}
            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'HOME', labelTh: 'หน้าแรก', href: '/' },
                            { label: 'ALL PRODUCTS', labelTh: 'สินค้าทั้งหมด' }
                        ]}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-4"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow mb-2">
                            {language === 'th' ? 'สินค้าทั้งหมด' : 'All Products'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {language === 'th' ? 'อุปกรณ์แบดมินตันครบวงจร' : 'Complete Badminton Equipment'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Bar */}
            <ProductFilterBar
                filters={filters}
                sortOptions={defaultSortOptions}
                activeFilters={activeFilters}
                sortValue={sortBy}
                onFilterChange={toggleFilter}
                onSortChange={setSortBy}
                onClearAll={clearAllFilters}
                totalItems={filteredProducts.length}
            />

            {/* Products Grid */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filteredProducts.map((product, index) => {
                            const selectedIndex = getSelectedColorIndex(product.id);
                            const selectedColor = product.colors[selectedIndex];
                            const displayImage = selectedColor?.image || product.images[0];

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group"
                                >
                                    {/* Product Image */}
                                    <Link href={product.href} className="block">
                                        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url('${displayImage}')` }}
                                            />

                                            {/* Badge */}
                                            {product.badge && (
                                                <div className="absolute top-2 left-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1">
                                                    {product.badge}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Color Swatches */}
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

                                    {/* Product Info */}
                                    <Link href={product.href} className="block">
                                        <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                            {language === 'th' ? product.nameTh : product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {language === 'th' ? product.categoryLabelTh : product.categoryLabel}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">
                                                {language === 'th' ? selectedColor?.nameTh : selectedColor?.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ฿{product.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="text-sm font-bold text-black">
                                                    ฿{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {language === 'th' ? 'ไม่พบสินค้าที่ตรงกับตัวกรอง' : 'No products found matching your filters'}
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-brand-yellow underline"
                            >
                                {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : 'Clear all filters'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
