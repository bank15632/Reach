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
import { ApiBundle, fetchBundles } from "@/lib/apiClient";

export default function BundlesPage() {
    const { language } = useLanguage();
    const [bundles, setBundles] = useState<ApiBundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    useEffect(() => {
        let isMounted = true;

        async function loadBundles() {
            try {
                const data = await fetchBundles({ limit: 200 });
                if (!isMounted) return;
                setBundles(data);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadBundles();

        return () => {
            isMounted = false;
        };
    }, []);

    // Price range options
    const priceOptions = [
        { value: 'under-7000', label: 'Under ฿7,000', labelTh: 'ต่ำกว่า ฿7,000' },
        { value: '7000-15000', label: '฿7,000 - ฿15,000', labelTh: '฿7,000 - ฿15,000' },
        { value: 'over-15000', label: 'Over ฿15,000', labelTh: 'มากกว่า ฿15,000' },
    ];

    // Filter configurations
    const filters: FilterConfig[] = [
        {
            key: 'price',
            label: 'Price',
            labelTh: 'ราคา',
            options: priceOptions
        },
    ];

    // Filter and sort bundles
    const filteredBundles = useMemo(() => {
        let result = [...bundles];

        // Apply price filter
        if (activeFilters.price?.length > 0) {
            result = result.filter(b => {
                return activeFilters.price.some(range => {
                    switch (range) {
                        case 'under-7000': return b.price < 7000;
                        case '7000-15000': return b.price >= 7000 && b.price <= 15000;
                        case 'over-15000': return b.price > 15000;
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
    }, [activeFilters, bundles, sortBy]);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'BUNDLES', labelTh: 'เซ็ตสุดคุ้ม' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow">
                        {language === 'th' ? 'เซ็ตสุดคุ้ม' : 'Bundles'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {language === 'th' ? 'ซื้อเซ็ตประหยัดกว่า' : 'Save more when you bundle'}
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
                totalItems={filteredBundles.length}
            />

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading ? (
                        <div className="text-center py-16 text-gray-500">
                            {language === 'th' ? 'กำลังโหลดเซ็ต...' : 'Loading bundles...'}
                        </div>
                    ) : filteredBundles.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                {language === 'th' ? 'ไม่พบเซ็ตที่ตรงกับตัวกรอง' : 'No bundles match your filters'}
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-brand-yellow hover:underline"
                            >
                                {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : 'Clear all filters'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredBundles.map((bundle, index) => (
                                <motion.div
                                    key={bundle.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg group"
                                >
                                    {/* Image */}
                                    <Link href={`/bundles/${bundle.id}`} className="relative h-64 md:h-80 overflow-hidden rounded-lg block">
                                        {bundle.originalPrice > bundle.price && (
                                            <div className="absolute top-4 right-4 z-10 bg-lime-400 text-black px-4 py-2 font-bold rounded">
                                                {language === 'th'
                                                    ? `ประหยัด ${Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}%`
                                                    : `SAVE ${Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)}%`}
                                            </div>
                                        )}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${bundle.images?.[0] || "/placeholder.png"}')` }}
                                        />
                                    </Link>

                                    {/* Content */}
                                    <div className="flex flex-col justify-center">
                                        <Link href={`/bundles/${bundle.id}`}>
                                            <h2 className="text-2xl font-bold text-black mb-2 hover:text-brand-yellow transition-colors">
                                                {language === 'th' ? bundle.nameTh : bundle.name}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-500 mb-4">
                                            {bundle.items?.length ?? 0} {language === 'th' ? 'รายการ' : 'items included'}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-3xl font-bold text-black">฿{bundle.price.toLocaleString()}</span>
                                            {bundle.originalPrice > bundle.price && (
                                                <>
                                                    <span className="text-lg text-gray-400 line-through">฿{bundle.originalPrice.toLocaleString()}</span>
                                                    <span className="text-sm text-green-600 font-semibold">
                                                        {language === 'th'
                                                            ? `ประหยัด ฿${(bundle.originalPrice - bundle.price).toLocaleString()}`
                                                            : `Save ฿${(bundle.originalPrice - bundle.price).toLocaleString()}`}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/bundles/${bundle.id}`}
                                                className="flex-1 md:flex-none bg-black text-white px-8 py-4 font-semibold text-sm tracking-wider hover:bg-brand-yellow hover:text-black transition-colors text-center rounded-lg"
                                            >
                                                {language === 'th' ? 'ดูรายละเอียด' : 'VIEW DETAILS'}
                                            </Link>
                                            <button className="flex-1 md:flex-none border-2 border-black text-black px-8 py-4 font-semibold text-sm tracking-wider hover:bg-black hover:text-white transition-colors rounded-lg">
                                                {language === 'th' ? 'เพิ่มลงตะกร้า' : 'ADD TO CART'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
