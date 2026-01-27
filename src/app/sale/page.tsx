"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters,
} from "@/components/ui/ProductFilterBar";
import { useLanguage } from "@/context/LanguageContext";
import { ApiBundle, ApiProduct, fetchBundles, fetchProducts, getDisplayPrice } from "@/lib/apiClient";

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
    image: string;
}

export default function SalePage() {
    const { language } = useLanguage();
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [bundles, setBundles] = useState<ApiBundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters, setFilterValue } = useProductFilters();

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

    // Collect all products with originalPrice (on sale) from all categories
    const allSaleProducts: SaleProduct[] = useMemo(() => {
        const saleItems: SaleProduct[] = [];
        const categoryMap: Record<string, { key: string; label: string; labelTh: string; hrefPrefix: string }> = {
            RACKETS: { key: "rackets", label: "Rackets", labelTh: "ไม้แบด", hrefPrefix: "/rackets" },
            SHOES: { key: "shoes", label: "Shoes", labelTh: "รองเท้า", hrefPrefix: "/shoes" },
            SPORTSWEAR: { key: "sportswear", label: "Sportswear", labelTh: "ชุดกีฬา", hrefPrefix: "/sportswear" },
            SUPPLEMENTS: { key: "supplements", label: "Supplements", labelTh: "อาหารเสริม", hrefPrefix: "/supplements" },
            ACCESSORIES: { key: "accessories", label: "Accessories", labelTh: "อุปกรณ์เสริม", hrefPrefix: "/shop" },
        };

        products.forEach((product) => {
            const price = getDisplayPrice(product);
            if (!price.original) return;
            const mapped = categoryMap[product.category] ?? categoryMap.ACCESSORIES;

            saleItems.push({
                id: product.id,
                name: language === 'th' ? product.nameTh : product.name,
                category: mapped.key,
                categoryLabel: mapped.label,
                categoryLabelTh: mapped.labelTh,
                price: price.current,
                originalPrice: price.original,
                discount: Math.round(((price.original - price.current) / price.original) * 100),
                href: `${mapped.hrefPrefix}/${product.id}`,
                image: product.images?.[0] ?? "/placeholder.png",
            });
        });

        bundles.forEach((bundle) => {
            if (bundle.originalPrice <= bundle.price) return;
            saleItems.push({
                id: bundle.id,
                name: language === 'th' ? bundle.nameTh : bundle.name,
                category: 'bundles',
                categoryLabel: 'Bundles',
                categoryLabelTh: 'เซ็ตสุดคุ้ม',
                price: bundle.price,
                originalPrice: bundle.originalPrice,
                discount: Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100),
                href: `/bundles/${bundle.id}`,
                image: bundle.images?.[0] ?? "/placeholder.png",
            });
        });

        return saleItems;
    }, [bundles, language, products]);

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
                    {isLoading ? (
                        <div className="text-center py-16 text-gray-500">
                            {language === 'th' ? 'กำลังโหลดสินค้า...' : 'Loading sale items...'}
                        </div>
                    ) : filteredProducts.length === 0 ? (
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
                                                    style={{ backgroundImage: `url('${product.image || "/placeholder.png"}')` }}
                                                />
                                            </div>
                                        </Link>

                                        <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">{language === 'th' ? product.categoryLabelTh : product.categoryLabel}</p>
                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
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
