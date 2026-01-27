"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import ProductAddToCart from "@/components/product/ProductAddToCart";
import { ApiProduct, fetchProduct, getDisplayPrice } from "@/lib/apiClient";

function ProductGallery({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const displayImage = images[selectedImage] ?? "/placeholder.png";

    return (
        <div className="space-y-4">
            <motion.div
                key={displayImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-100 overflow-hidden"
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
                            className={`w-16 h-16 bg-cover bg-center border-2 transition-colors ${idx === selectedImage ? "border-black" : "border-transparent hover:border-gray-300"}`}
                            style={{ backgroundImage: `url('${img}')` }}
                            aria-label={`Thumbnail ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SupplementDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { language } = useLanguage();
    const resolvedParams = use(params);
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        async function loadProduct() {
            try {
                const data = await fetchProduct(resolvedParams.productId);
                if (!isMounted) return;
                setProduct(data);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [resolvedParams.productId]);

    const variantGroups = useMemo(() => {
        if (!product?.variants?.length) return [];
        const map = new Map<string, Set<string>>();
        product.variants.forEach((variant) => {
            if (!map.has(variant.name)) {
                map.set(variant.name, new Set());
            }
            map.get(variant.name)?.add(variant.value);
        });
        return Array.from(map.entries()).map(([name, values]) => ({
            name,
            values: Array.from(values),
        }));
    }, [product]);

    useEffect(() => {
        if (variantGroups.length === 0) return;
        setSelectedVariants((prev) => {
            const next = { ...prev };
            let changed = false;
            variantGroups.forEach((group) => {
                if (!next[group.name]) {
                    next[group.name] = group.values[0];
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [variantGroups]);

    const selectedVariantValue = useMemo(() => {
        const entry = Object.entries(selectedVariants)[0];
        return entry?.[1];
    }, [selectedVariants]);

    if (!isLoading && !product) {
        notFound();
    }

    if (isLoading || !product) {
        return (
            <main className="bg-white min-h-screen">
                <Navbar />
                <div className="pt-32 text-center text-gray-500">
                    {language === "th" ? "กำลังโหลดสินค้า..." : "Loading product..."}
                </div>
            </main>
        );
    }

    const price = getDisplayPrice(product);
    const selectedColor = selectedVariantValue
        ? {
              name: selectedVariantValue,
              nameTh: selectedVariantValue,
              hex: "#111827",
              image: product.images?.[0],
          }
        : undefined;

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: "SUPPLEMENTS", labelTh: "อาหารเสริม", href: "/supplements" },
                            { label: product.name, labelTh: product.nameTh },
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
                            <ProductGallery images={product.images ?? []} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {language === "th" ? product.nameTh : product.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    ฿{price.current.toLocaleString()}
                                </span>
                                {price.original && (
                                    <span className="text-lg text-gray-400 line-through">
                                        ฿{price.original.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {product.stockCount > 0 ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {language === "th"
                                        ? `เหลือ ${product.stockCount} ชิ้น`
                                        : `${product.stockCount} in stock`}
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    {language === "th" ? "สินค้าหมด" : "Out of stock"}
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    {language === "th" ? "รายละเอียดสินค้า" : "Product Detail"}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {language === "th" ? product.descriptionTh || product.description : product.description || product.descriptionTh}
                                </p>
                            </div>

                            {variantGroups.map((group) => (
                                <div key={group.name} className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">{group.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.values.map((value) => (
                                            <button
                                                key={value}
                                                onClick={() =>
                                                    setSelectedVariants((prev) => ({ ...prev, [group.name]: value }))
                                                }
                                                className={`px-4 py-2 text-sm font-medium border transition-colors ${
                                                    selectedVariants[group.name] === value
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                                }`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <ProductAddToCart
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    nameTh: product.nameTh,
                                    price: price.current,
                                    originalPrice: price.original,
                                    images: product.images ?? [],
                                }}
                                selectedColor={selectedColor}
                                category="supplements"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <Link
                        href="/supplements"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {language === "th" ? "กลับไปหน้าอาหารเสริม" : "Back to Supplements"}
                    </Link>
                </div>
            </section>
        </main>
    );
}
