"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ApiProduct, fetchProducts, getDisplayPrice } from "@/lib/apiClient";

export default function ShoesPage() {
    const { language } = useLanguage();
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const data = await fetchProducts({ category: "SHOES", limit: 200 });
                if (!isMounted) return;
                setProducts(data);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Price range options
    const priceOptions = [
        { value: 'under-3000', label: 'Under ฿3,000', labelTh: 'ต่ำกว่า ฿3,000' },
        { value: '3000-5000', label: '฿3,000 - ฿5,000', labelTh: '฿3,000 - ฿5,000' },
        { value: '5000-7000', label: '฿5,000 - ฿7,000', labelTh: '฿5,000 - ฿7,000' },
        { value: 'over-7000', label: 'Over ฿7,000', labelTh: 'มากกว่า ฿7,000' },
    ];

    // Filter configurations for shoes
    const filters: FilterConfig[] = [
        {
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        }
    ];

    const displayProducts = useMemo(() => {
        return products.map((product) => {
            const price = getDisplayPrice(product);
            return {
                id: product.id,
                name: product.name,
                nameTh: product.nameTh,
                price: price.current,
                originalPrice: price.original,
                images: product.images ?? [],
            };
        });
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...displayProducts];

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
    }, [activeFilters, displayProducts, sortBy]);

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
                    {isLoading ? (
                        <div className="text-center py-16 text-gray-500">
                            {language === 'th' ? 'กำลังโหลดสินค้า...' : 'Loading products...'}
                        </div>
                    ) : filteredProducts.length === 0 ? (
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
                                const displayImage = product.images[0] ?? "/placeholder.png";

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <Link href={`/shoes/${product.id}`} className="block relative">
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                                    style={{ backgroundImage: `url('${displayImage}')` }}
                                                />
                                            </div>
                                        </Link>

                                        <Link href={`/shoes/${product.id}`}>
                                            <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                                {language === 'th' ? product.nameTh : product.name}
                                            </h3>
                                        </Link>
                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-end">
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
