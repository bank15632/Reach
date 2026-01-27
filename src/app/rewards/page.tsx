"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductFilterBar, {
    FilterConfig,
    defaultSortOptions,
    useProductFilters,
    colorFilterOptions
} from "@/components/ui/ProductFilterBar";
import RewardSelectionModal from "@/components/ui/RewardSelectionModal";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { ApiBundle, ApiProduct, fetchBundles, fetchProducts, getDisplayPrice } from "@/lib/apiClient";

interface RewardProduct {
    id: string;
    name: string;
    nameTh: string;
    category: "rackets" | "shoes" | "apparel" | "bundles" | "supplements";
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

export default function RewardsPage() {
    const { language } = useLanguage();
    const { availablePoints, redeemReward } = useUser();
    const router = useRouter();
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [bundles, setBundles] = useState<ApiBundle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
    const [selectedReward, setSelectedReward] = useState<RewardProduct | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeFilters, sortBy, toggleFilter, setSortBy, clearAllFilters } = useProductFilters();

    useEffect(() => {
        let isMounted = true;

        async function loadRewards() {
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

        loadRewards();

        return () => {
            isMounted = false;
        };
    }, []);

    const pointsUnit = language === "th" ? "คะแนน" : "pts";

    const rewardSortOptions = defaultSortOptions.map(option => {
        if (option.value === "price-low") {
            return {
                ...option,
                label: "Points: Low → High",
                labelTh: "คะแนน: ต่ำ → สูง"
            };
        }
        if (option.value === "price-high") {
            return {
                ...option,
                label: "Points: High → Low",
                labelTh: "คะแนน: สูง → ต่ำ"
            };
        }
        return option;
    });

    const allRewards = useMemo<RewardProduct[]>(() => {
        const result: RewardProduct[] = [];
        const categoryMap: Record<string, { key: RewardProduct["category"]; label: string; labelTh: string; hrefPrefix: string }> = {
            RACKETS: { key: "rackets", label: "Badminton Racket", labelTh: "ไม้แบดมินตัน", hrefPrefix: "/rackets" },
            SHOES: { key: "shoes", label: "Shoes", labelTh: "รองเท้า", hrefPrefix: "/shoes" },
            SPORTSWEAR: { key: "apparel", label: "Sportswear", labelTh: "ชุดกีฬา", hrefPrefix: "/sportswear" },
            SUPPLEMENTS: { key: "supplements", label: "Supplements", labelTh: "อาหารเสริม", hrefPrefix: "/supplements" },
        };

        products.forEach((product) => {
            const mapped = categoryMap[product.category];
            if (!mapped) {
                return;
            }
            const price = getDisplayPrice(product);
            const image = product.images?.[0] ?? "/placeholder.png";

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
                badge: undefined,
                isNew: false,
                isBestseller: false,
                colors: [
                    {
                        name: "Default",
                        nameTh: "มาตรฐาน",
                        hex: "#111827",
                        image,
                    },
                ],
                images: product.images ?? [],
            });
        });

        bundles.forEach((bundle) => {
            const image = bundle.images?.[0] ?? "/placeholder.png";
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
                badge: undefined,
                isNew: false,
                isBestseller: false,
                colors: [
                    {
                        name: "Default",
                        nameTh: "มาตรฐาน",
                        hex: "#111827",
                        image,
                    },
                ],
                images: bundle.images ?? [],
            });
        });

        return result;
    }, [bundles, products]);

    const categoryOptions = [
        { value: "rackets", label: "Rackets", labelTh: "ไม้แบด" },
        { value: "shoes", label: "Shoes", labelTh: "รองเท้า" },
        { value: "apparel", label: "Apparel", labelTh: "ชุดกีฬา" },
        { value: "bundles", label: "Bundles", labelTh: "เซ็ตสุดคุ้ม" },
        { value: "supplements", label: "Supplements", labelTh: "อาหารเสริม" },
    ];

    const pointsOptions = [
        { value: "under-3000", label: "Under 3,000 pts", labelTh: "ต่ำกว่า 3,000 คะแนน" },
        { value: "3000-5000", label: "3,000 - 5,000 pts", labelTh: "3,000 - 5,000 คะแนน" },
        { value: "5000-10000", label: "5,000 - 10,000 pts", labelTh: "5,000 - 10,000 คะแนน" },
        { value: "over-10000", label: "Over 10,000 pts", labelTh: "มากกว่า 10,000 คะแนน" },
    ];

    const filters: FilterConfig[] = [
        {
            key: "category",
            label: "Category",
            labelTh: "หมวดหมู่",
            options: categoryOptions
        },
        {
            key: "color",
            label: "Color",
            labelTh: "สี",
            options: colorFilterOptions,
            type: "color"
        },
        {
            key: "price",
            label: "Points",
            labelTh: "คะแนน",
            options: pointsOptions
        }
    ];

    const filteredRewards = useMemo(() => {
        let result = [...allRewards];

        if (activeFilters.category?.length) {
            result = result.filter(product => activeFilters.category.includes(product.category));
        }

        if (activeFilters.color?.length) {
            result = result.filter(product =>
                product.colors.some(color => activeFilters.color.includes(color.hex))
            );
        }

        if (activeFilters.price?.length) {
            result = result.filter(product => (
                activeFilters.price ?? []
            ).some(range => {
                switch (range) {
                    case "under-3000":
                        return product.price < 3000;
                    case "3000-5000":
                        return product.price >= 3000 && product.price <= 5000;
                    case "5000-10000":
                        return product.price > 5000 && product.price <= 10000;
                    case "over-10000":
                        return product.price > 10000;
                    default:
                        return true;
                }
            }));
        }

        switch (sortBy) {
            case "price-low":
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
                break;
            case "bestseller":
                result = result.filter(p => p.isBestseller).concat(result.filter(p => !p.isBestseller));
                break;
        }

        return result;
    }, [allRewards, activeFilters, sortBy]);

    const getSelectedColorIndex = (productId: string) => selectedColors[productId] || 0;

    const openRewardModal = (reward: RewardProduct) => {
        setSelectedReward(reward);
        setIsModalOpen(true);
    };

    const handleRewardConfirm = (reward: RewardProduct, colorIndex: number, size?: string) => {
        const color = reward.colors[colorIndex];

        // Use UserContext to redeem the reward
        const success = redeemReward({
            id: `${reward.id}-${color?.name ?? "default"}-${size ?? ""}`,
            name: reward.name,
            nameTh: reward.nameTh,
            categoryLabel: reward.categoryLabel,
            categoryLabelTh: reward.categoryLabelTh,
            colorName: color?.name,
            colorNameTh: color?.nameTh,
            sizeName: size,
            image: color?.image || reward.images[0],
            points: reward.price,
        });

        if (success) {
            router.push("/cart");
        }
    };

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: "HOME", labelTh: "หน้าแรก", href: "/" },
                            { label: "REWARDS", labelTh: "แลกของรางวัล" }
                        ]}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-4"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow mb-2">
                                    {language === "th" ? "แลกของรางวัล" : "Rewards"}
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    {language === "th"
                                        ? "เลือกใช้คะแนนสะสมแลกอุปกรณ์ที่ใช่"
                                        : "Use your points to redeem the gear you love"}
                                </p>
                            </div>

                            {/* User Points Banner */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-4 flex items-center gap-3"
                            >
                                <div className="p-2 bg-brand-yellow rounded-full">
                                    <Gift className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">
                                        {language === "th" ? "คะแนนสะสมของคุณ" : "Your Points"}
                                    </p>
                                    <p className="text-2xl font-bold text-brand-yellow">
                                        {availablePoints.toLocaleString()} <span className="text-sm font-normal">{pointsUnit}</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <ProductFilterBar
                filters={filters}
                sortOptions={rewardSortOptions}
                activeFilters={activeFilters}
                sortValue={sortBy}
                onFilterChange={toggleFilter}
                onSortChange={setSortBy}
                onClearAll={clearAllFilters}
                totalItems={filteredRewards.length}
            />

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading && (
                        <div className="text-center py-12 text-gray-500">
                            {language === "th" ? "กำลังโหลดของรางวัล..." : "Loading rewards..."}
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {filteredRewards.map((reward, index) => {
                            const selectedIndex = getSelectedColorIndex(reward.id);
                            const selectedColor = reward.colors[selectedIndex];
                            const displayImage = selectedColor?.image || reward.images[0];

                            return (
                                <motion.div
                                    key={reward.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openRewardModal(reward)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            openRewardModal(reward);
                                        }
                                    }}
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${displayImage}')` }}
                                        />

                                        {reward.badge && (
                                            <div className="absolute top-2 left-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1">
                                                {reward.badge}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-3 mb-3">
                                        {reward.colors.map((color, colorIndex) => (
                                            <button
                                                key={colorIndex}
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedColors(prev => ({ ...prev, [reward.id]: colorIndex }));
                                                }}
                                                className={`w-7 h-7 rounded-full border-2 transition-all ${colorIndex === selectedIndex
                                                    ? "border-black ring-2 ring-offset-1 ring-black"
                                                    : "border-gray-300 hover:border-gray-500"
                                                }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={language === "th" ? color.nameTh : color.name}
                                            />
                                        ))}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-black mb-0.5 group-hover:underline">
                                            {language === "th" ? reward.nameTh : reward.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {language === "th" ? reward.categoryLabelTh : reward.categoryLabel}
                                        </p>

                                        <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">
                                                {language === "th" ? selectedColor?.nameTh : selectedColor?.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {reward.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {reward.originalPrice.toLocaleString()} {pointsUnit}
                                                    </span>
                                                )}
                                                <span className="text-sm font-bold text-black">
                                                    {reward.price.toLocaleString()} {pointsUnit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {!isLoading && filteredRewards.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {language === "th" ? "ไม่พบของรางวัลที่ตรงกับตัวกรอง" : "No rewards found matching your filters"}
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-brand-yellow underline"
                            >
                                {language === "th" ? "ล้างตัวกรองทั้งหมด" : "Clear all filters"}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Reward Selection Modal */}
            <RewardSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reward={selectedReward}
                userPoints={availablePoints}
                onConfirm={handleRewardConfirm}
            />
        </main>
    );
}
