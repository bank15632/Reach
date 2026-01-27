"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import ProductAddToCart from "@/components/product/ProductAddToCart";
import { ApiBundle, fetchBundle } from "@/lib/apiClient";

function BundleGallery({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const displayImage = images[selectedImage] ?? "/placeholder.png";

    return (
        <div className="space-y-4">
            <motion.div
                key={displayImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-100 overflow-hidden rounded-lg"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${displayImage}')` }}
                />
            </motion.div>
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 bg-cover bg-center border-2 rounded-lg transition-colors ${idx === selectedImage ? "border-black" : "border-transparent hover:border-gray-300"}`}
                            style={{ backgroundImage: `url('${img}')` }}
                            aria-label={`Thumbnail ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function BundleDetailPage({ params }: { params: Promise<{ bundleId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const [bundle, setBundle] = useState<ApiBundle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadBundle() {
            try {
                const data = await fetchBundle(resolvedParams.bundleId);
                if (!isMounted) return;
                setBundle(data);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadBundle();

        return () => {
            isMounted = false;
        };
    }, [resolvedParams.bundleId]);

    if (!isLoading && !bundle) {
        notFound();
    }

    if (isLoading || !bundle) {
        return (
            <main className="bg-white min-h-screen">
                <Navbar />
                <div className="pt-32 text-center text-gray-500">
                    {language === "th" ? "กำลังโหลดเซ็ต..." : "Loading bundle..."}
                </div>
            </main>
        );
    }

    const itemCount = bundle.items?.length ?? 0;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: "BUNDLES", labelTh: "เซ็ตสุดคุ้ม", href: "/bundles" },
                            { label: bundle.name, labelTh: bundle.nameTh },
                        ]}
                    />
                </div>
            </section>

            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <BundleGallery images={bundle.images ?? []} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {language === "th" ? bundle.nameTh : bundle.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    ฿{bundle.price.toLocaleString()}
                                </span>
                                {bundle.originalPrice > bundle.price && (
                                    <span className="text-lg text-gray-400 line-through">
                                        ฿{bundle.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {bundle.description && (
                                <p className="text-gray-600 leading-relaxed">{bundle.description}</p>
                            )}

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    {language === "th" ? "รายการในเซ็ต" : "Items Included"}
                                </h3>
                                {itemCount === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        {language === "th" ? "ยังไม่มีรายการในเซ็ตนี้" : "No items listed for this bundle."}
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {bundle.items?.map((item) => (
                                            <li key={item.id} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                                                {item.product
                                                    ? language === "th"
                                                        ? item.product.nameTh
                                                        : item.product.name
                                                    : language === "th"
                                                        ? `สินค้า ${item.productId}`
                                                        : `Product ${item.productId}`}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <ProductAddToCart
                                product={{
                                    id: bundle.id,
                                    name: bundle.name,
                                    nameTh: bundle.nameTh,
                                    price: bundle.price,
                                    originalPrice: bundle.originalPrice,
                                    images: bundle.images ?? [],
                                }}
                                category="bundles"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <Link
                        href="/bundles"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {language === "th" ? "กลับไปหน้าเซ็ตสุดคุ้ม" : "Back to Bundles"}
                    </Link>
                </div>
            </section>
        </main>
    );
}
