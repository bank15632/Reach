"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface RewardColor {
    name: string;
    nameTh: string;
    hex: string;
    image: string;
}

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
    colors: RewardColor[];
    images: string[];
}

interface RewardSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: RewardProduct | null;
    userPoints: number;
    onConfirm: (reward: RewardProduct, colorIndex: number, size?: string) => void;
}

export default function RewardSelectionModal({
    isOpen,
    onClose,
    reward,
    userPoints,
    onConfirm
}: RewardSelectionModalProps) {
    const { language } = useLanguage();
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!reward) return null;

    const pointsUnit = language === "th" ? "คะแนน" : "pts";
    const hasEnoughPoints = userPoints >= reward.price;
    const selectedColor = reward.colors[selectedColorIndex];
    const displayImage = selectedColor?.image || reward.images[0];

    // Size options based on category
    const getSizeOptions = () => {
        switch (reward.category) {
            case "rackets":
                return ["3UG5", "4UG5", "4UG6", "5UG5"];
            case "shoes":
                return ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11"];
            case "apparel":
                return ["XS", "S", "M", "L", "XL", "2XL"];
            default:
                return null;
        }
    };

    const sizeOptions = getSizeOptions();
    const needsSize = sizeOptions !== null;

    const handleConfirm = () => {
        if (!hasEnoughPoints) return;
        if (needsSize && !selectedSize) return;

        setIsConfirmed(true);
        setTimeout(() => {
            onConfirm(reward, selectedColorIndex, selectedSize || undefined);
            setIsConfirmed(false);
            setSelectedColorIndex(0);
            setSelectedSize(null);
            onClose();
        }, 1000);
    };

    const handleClose = () => {
        setSelectedColorIndex(0);
        setSelectedSize(null);
        setIsConfirmed(false);
        onClose();
    };

    const text = {
        title: language === "th" ? "เลือกของรางวัล" : "Select Reward",
        color: language === "th" ? "สี" : "Color",
        size: language === "th" ? "ไซส์" : "Size",
        yourPoints: language === "th" ? "คะแนนของคุณ" : "Your Points",
        required: language === "th" ? "ใช้คะแนน" : "Points Required",
        remaining: language === "th" ? "คะแนนคงเหลือ" : "Points Remaining",
        notEnough: language === "th" ? "คะแนนไม่เพียงพอ" : "Not enough points",
        selectSize: language === "th" ? "กรุณาเลือกไซส์" : "Please select a size",
        confirm: language === "th" ? "ยืนยันแลกของรางวัล" : "Confirm Redemption",
        confirmed: language === "th" ? "แลกสำเร็จ!" : "Redeemed!",
        gripSize: language === "th" ? "ขนาดกริป" : "Grip Size",
    };

    const getSizeLabel = () => {
        if (reward.category === "rackets") return text.gripSize;
        return text.size;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-brand-yellow" />
                                <h2 className="text-lg font-bold text-gray-900">{text.title}</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Image */}
                                <div className="md:w-1/2">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <motion.img
                                            key={displayImage}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            src={displayImage}
                                            alt={language === "th" ? reward.nameTh : reward.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="md:w-1/2 space-y-4">
                                    {/* Name & Category */}
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {language === "th" ? reward.categoryLabelTh : reward.categoryLabel}
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {language === "th" ? reward.nameTh : reward.name}
                                        </h3>
                                    </div>

                                    {/* Color Selection */}
                                    {reward.colors.length > 1 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                {text.color}: <span className="text-gray-900">{language === "th" ? selectedColor?.nameTh : selectedColor?.name}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {reward.colors.map((color, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedColorIndex(index)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                            index === selectedColorIndex
                                                                ? "border-black ring-2 ring-offset-2 ring-black"
                                                                : "border-gray-300 hover:border-gray-500"
                                                        }`}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={language === "th" ? color.nameTh : color.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Selection */}
                                    {needsSize && sizeOptions && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                {getSizeLabel()}: <span className={selectedSize ? "text-gray-900" : "text-gray-400"}>{selectedSize || (language === "th" ? "ยังไม่ได้เลือก" : "Not selected")}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {sizeOptions.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            selectedSize === size
                                                                ? "bg-black text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Points Summary */}
                                    <div className="bg-gray-100 rounded-xl p-4 space-y-3 border border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700 font-medium">{text.yourPoints}</span>
                                            <span className="font-bold text-green-600">
                                                {userPoints.toLocaleString()} {pointsUnit}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700 font-medium">{text.required}</span>
                                            <span className="font-bold text-red-500">
                                                -{reward.price.toLocaleString()} {pointsUnit}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3 flex justify-between">
                                            <span className="font-semibold text-gray-800">{text.remaining}</span>
                                            <span className={`font-bold ${hasEnoughPoints ? "text-gray-900" : "text-red-500"}`}>
                                                {(userPoints - reward.price).toLocaleString()} {pointsUnit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t bg-gray-50">
                            {!hasEnoughPoints ? (
                                <div className="text-center py-2 text-red-500 font-medium">
                                    {text.notEnough}
                                </div>
                            ) : needsSize && !selectedSize ? (
                                <div className="text-center py-2 text-gray-500 font-medium">
                                    {text.selectSize}
                                </div>
                            ) : (
                                <motion.button
                                    onClick={handleConfirm}
                                    disabled={isConfirmed}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                                        isConfirmed
                                            ? "bg-green-500 text-white"
                                            : "bg-brand-yellow text-black hover:bg-yellow-400"
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {isConfirmed ? (
                                            <motion.span
                                                key="confirmed"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={20} />
                                                {text.confirmed}
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="confirm"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Gift size={20} />
                                                {text.confirm}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
