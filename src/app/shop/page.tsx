"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters
} from "@/components/ui/ProductFilterBar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ApiBundle, ApiProduct, fetchBundles, fetchProducts, getDisplayPrice } from "@/lib/apiClient";

// Unified product type for shop page
interface ShopProduct {
    id: string;
    name: string;
    nameTh: string;
    category: 'rackets' | 'shoes' | 'apparel' | 'bundles' | 'supplements' | 'accessories';
    categoryLabel: string;
    categoryLabelTh: string;
    price: number;
    originalPrice?: number;
    href: string;
    images: string[];
}

export default function ShopPage() {
    const { language } = useLanguage();
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [bundles, setBundles] = useState<ApiBundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [productData, bundleData] = await Promise.all([
                    fetchProducts({ limit: 200 }),
                    fetchBundles({ limit: 200 }),
                ]);

                if (!isMounted) return;

                setProducts(productData);
                setBundles(bundleData);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Transform all product types to unified ShopProduct format
    const allProducts = useMemo<ShopProduct[]>(() => {
        const result: ShopProduct[] = [];
        const categoryMap: Record<string, { key: ShopProduct["category"]; label: string; labelTh: string; hrefPrefix: string }> = {
            RACKETS: { key: "rackets", label: "Badminton Racket", labelTh: "ไม้แบดมินตัน", hrefPrefix: "/rackets" },
            SHOES: { key: "shoes", label: "Shoes", labelTh: "รองเท้า", hrefPrefix: "/shoes" },
            SPORTSWEAR: { key: "apparel", label: "Sportswear", labelTh: "ชุดกีฬา", hrefPrefix: "/sportswear" },
            SUPPLEMENTS: { key: "supplements", label: "Supplements", labelTh: "อาหารเสริม", hrefPrefix: "/supplements" },
            ACCESSORIES: { key: "accessories", label: "Accessories", labelTh: "อุปกรณ์เสริม", hrefPrefix: "/shop" },
        };

        products.forEach((product) => {
            const mapped = categoryMap[product.category] ?? {
                key: "accessories",
                label: "Accessories",
                labelTh: "อุปกรณ์เสริม",
                hrefPrefix: "/shop",
            };
            const price = getDisplayPrice(product);

            result.push({
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                category: mapped.key,
                categoryLabel: mapped.label,
                categoryLabelTh: mapped.labelTh,
                price: price.current,
                originalPrice: price.original,
                href: `${mapped.hrefPrefix}/${product.id}`,
                images: product.images ?? [],
            });
        });

        bundles.forEach((bundle) => {
            result.push({
                id: bundle.id,
                name: bundle.name,
                nameTh: bundle.nameTh,
                category: "bundles",
                categoryLabel: "Bundle",
                categoryLabelTh: "เซ็ตสุดคุ้ม",
                price: bundle.price,
                originalPrice: bundle.originalPrice,
                href: `/bundles/${bundle.id}`,
                images: bundle.images ?? [],
            });
        });

        return result;
    }, [products, bundles]);

    // Category options
    const categoryOptions = [
        { value: 'rackets', label: 'Rackets', labelTh: 'ไม้แบด' },
        { value: 'shoes', label: 'Shoes', labelTh: 'รองเท้า' },
        { value: 'apparel', label: 'Apparel', labelTh: 'ชุดกีฬา' },
        { value: 'bundles', label: 'Bundles', labelTh: 'เซ็ตสุดคุ้ม' },
        { value: 'supplements', label: 'Supplements', labelTh: 'อาหารเสริม' },
        { value: 'accessories', label: 'Accessories', labelTh: 'อุปกรณ์เสริม' },
    ];

    // Price range options
    const priceOptions = [
        { value: 'under-3000', label: 'Under ฿3,000', labelTh: 'ต่ำกว่า ฿3,000' },
        { value: '3000-5000', label: '฿3,000 - ฿5,000', labelTh: '฿3,000 - ฿5,000' },
        { value: '5000-10000', label: '฿5,000 - ฿10,000', labelTh: '฿5,000 - ฿10,000' },
        { value: 'over-10000', label: 'Over ฿10,000', labelTh: 'มากกว่า ฿10,000' },
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
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        },
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Apply category filter
        if (activeFilters.category?.length > 0) {
            result = result.filter(p => activeFilters.category.includes(p.category));
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
                result = result.slice().reverse();
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'bestseller':
                break;
        }

        return result;
    }, [allProducts, activeFilters, sortBy]);

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
                    {isLoading && (
                        <div className="text-center py-12 text-gray-500">
                            {language === 'th' ? 'กำลังโหลดสินค้า...' : 'Loading products...'}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filteredProducts.map((product, index) => {
                            const displayImage = product.images[0] ?? "/placeholder.png";

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
                                        </div>
                                    </Link>

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
                    {!isLoading && filteredProducts.length === 0 && (
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
