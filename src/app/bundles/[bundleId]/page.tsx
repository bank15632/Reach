"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getBundleProductById, bundleProducts, BundleProduct } from "@/data/productData";
import { notFound } from "next/navigation";
import { use } from "react";
import { ChevronDown, Check, Package, Truck, Shield, AlertCircle, X, Info, Ruler, Play } from "lucide-react";

// Color options with corresponding images
const colorOptionsByCategory: Record<string, Array<{ name: string; nameTh: string; hex: string; image: string }>> = {
    racket: [
        { name: 'Black/Gold', nameTh: 'ดำ/ทอง', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400' },
        { name: 'White/Blue', nameTh: 'ขาว/น้ำเงิน', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=400' },
        { name: 'Red/Black', nameTh: 'แดง/ดำ', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400' },
    ],
    shoes: [
        { name: 'White', nameTh: 'ขาว', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400' },
        { name: 'Black', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400' },
        { name: 'Navy', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400' },
        { name: 'Red', nameTh: 'แดง', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=400' },
    ],
    bag: [
        { name: 'Black', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400' },
        { name: 'Navy', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=400' },
    ],
    apparel: [
        { name: 'Black', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
        { name: 'White', nameTh: 'ขาว', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=400' },
        { name: 'Navy', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?q=80&w=400' },
        { name: 'Gray', nameTh: 'เทา', hex: '#6b7280', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400' },
    ],
    accessory: [],
};

// Size options
const sizeOptionsByCategory: Record<string, string[]> = {
    racket: ['4U', '3U'],
    shoes: ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'],
    bag: ['One Size'],
    apparel: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    accessory: ['One Size'],
};

// Guide button labels
const guideLabels: Record<string, { label: string; labelTh: string }> = {
    racket: { label: 'How to Choose Racket', labelTh: 'วิธีเลือกไม้แบด' },
    shoes: { label: 'Size Guide', labelTh: 'Size Guide' },
    apparel: { label: 'Size Guide', labelTh: 'Size Guide' },
    bag: { label: 'Info', labelTh: 'ข้อมูล' },
    accessory: { label: 'Info', labelTh: 'ข้อมูล' },
};

// Community Videos
const communityVideos = [
    { url: '#', thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', username: '@reachbadminton' },
    { url: '#', thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=400', username: '@proplayerth' },
    { url: '#', thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400', username: '@badmintonlover' },
    { url: '#', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', username: '@courtmaster' },
];

// Product Gallery Component
function ProductGallery({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-100 overflow-hidden rounded-lg"
            >
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${images[selectedImage]}')` }}
                />
            </motion.div>
            {images.length > 1 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 bg-cover bg-center border-2 rounded-lg transition-colors ${idx === selectedImage ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                            style={{ backgroundImage: `url('${img}')` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Size Guide Modal - Racket Selection Guide
function RacketGuideModal({ isOpen, onClose, language }: { isOpen: boolean; onClose: () => void; language: string }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">
                                {language === 'th' ? 'วิธีเลือกไม้แบด' : 'How to Choose a Racket'}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Weight Section */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    {language === 'th' ? 'น้ำหนักไม้แบด' : 'Racket Weight'}
                                </h4>
                                <table className="w-full text-sm border">
                                    <thead className="bg-gray-800 text-white">
                                        <tr>
                                            <th className="p-3 text-left">{language === 'th' ? 'น้ำหนัก' : 'Weight'}</th>
                                            <th className="p-3 text-left">{language === 'th' ? 'กรัม' : 'Grams'}</th>
                                            <th className="p-3 text-left">{language === 'th' ? 'เหมาะกับ' : 'Best For'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        <tr className="border-b">
                                            <td className="p-3 font-medium">3U</td>
                                            <td className="p-3">85-89g</td>
                                            <td className="p-3">{language === 'th' ? 'ผู้เล่นพลังสูง, ขั้นสูง' : 'Power players, Advanced'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-3 font-medium">4U</td>
                                            <td className="p-3">80-84g</td>
                                            <td className="p-3">{language === 'th' ? 'รอบด้าน, เร็ว' : 'All-round, Speed'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-3 font-medium">5U</td>
                                            <td className="p-3">75-79g</td>
                                            <td className="p-3">{language === 'th' ? 'มือใหม่, คอนโทรล' : 'Beginners, Control'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Balance Section */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    {language === 'th' ? 'จุดบาลานซ์' : 'Balance Point'}
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                                        <span className="font-medium min-w-[100px]">{language === 'th' ? 'หัวหนัก' : 'Head Heavy'}</span>
                                        <span>{language === 'th' ? 'เหมาะสำหรับการตบและสแมช พลังสูง' : 'Best for smashing and power shots'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                                        <span className="font-medium min-w-[100px]">{language === 'th' ? 'สมดุล' : 'Even Balance'}</span>
                                        <span>{language === 'th' ? 'เหมาะสำหรับผู้เล่นรอบด้าน' : 'Versatile for all-round play'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                                        <span className="font-medium min-w-[100px]">{language === 'th' ? 'หัวเบา' : 'Head Light'}</span>
                                        <span>{language === 'th' ? 'เหมาะสำหรับเกมรับและความเร็ว' : 'Best for defense and quick returns'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Flex Section */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    {language === 'th' ? 'ความยืดหยุ่นของก้าน' : 'Shaft Flexibility'}
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{language === 'th' ? 'แข็ง (Stiff)' : 'Stiff'}</span>
                                        <span className="text-gray-500 ml-2">{language === 'th' ? '- ผู้เล่นขั้นสูง, พลังสูง' : '- Advanced players, more power'}</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{language === 'th' ? 'ปานกลาง (Medium)' : 'Medium'}</span>
                                        <span className="text-gray-500 ml-2">{language === 'th' ? '- ผู้เล่นระดับกลาง, ควบคุมดี' : '- Intermediate, good control'}</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{language === 'th' ? 'อ่อน (Flexible)' : 'Flexible'}</span>
                                        <span className="text-gray-500 ml-2">{language === 'th' ? '- มือใหม่, ช่วยดีดลูก' : '- Beginners, easier repulsion'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tip */}
                            <div className="bg-brand-yellow/20 p-4 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-1">💡 {language === 'th' ? 'คำแนะนำ' : 'Tip'}</p>
                                <p className="text-sm text-gray-700">
                                    {language === 'th'
                                        ? '4U หัวเบา ก้านปานกลาง เป็นตัวเลือกยอดนิยมสำหรับผู้เล่นทั่วไป'
                                        : '4U head-light with medium flex is the most popular choice for versatile players'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Shoe Size Guide Modal
function ShoeSizeGuideModal({ isOpen, onClose, language }: { isOpen: boolean; onClose: () => void; language: string }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">Size Guide</h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="p-3">US</th>
                                        <th className="p-3">UK</th>
                                        <th className="p-3">EU</th>
                                        <th className="p-3">CM</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center text-gray-700">
                                    <tr className="border-b"><td className="p-2">7</td><td className="p-2">6</td><td className="p-2">39</td><td className="p-2">25</td></tr>
                                    <tr className="border-b"><td className="p-2">7.5</td><td className="p-2">6.5</td><td className="p-2">40</td><td className="p-2">25.5</td></tr>
                                    <tr className="border-b"><td className="p-2">8</td><td className="p-2">7</td><td className="p-2">40.5</td><td className="p-2">26</td></tr>
                                    <tr className="border-b"><td className="p-2">8.5</td><td className="p-2">7.5</td><td className="p-2">41</td><td className="p-2">26.5</td></tr>
                                    <tr className="border-b"><td className="p-2">9</td><td className="p-2">8</td><td className="p-2">42</td><td className="p-2">27</td></tr>
                                    <tr className="border-b"><td className="p-2">9.5</td><td className="p-2">8.5</td><td className="p-2">42.5</td><td className="p-2">27.5</td></tr>
                                    <tr className="border-b"><td className="p-2">10</td><td className="p-2">9</td><td className="p-2">43</td><td className="p-2">28</td></tr>
                                    <tr className="border-b"><td className="p-2">10.5</td><td className="p-2">9.5</td><td className="p-2">44</td><td className="p-2">28.5</td></tr>
                                    <tr className="border-b"><td className="p-2">11</td><td className="p-2">10</td><td className="p-2">44.5</td><td className="p-2">29</td></tr>
                                    <tr className="border-b"><td className="p-2">12</td><td className="p-2">11</td><td className="p-2">46</td><td className="p-2">30</td></tr>
                                </tbody>
                            </table>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-900 mb-1">📏 {language === 'th' ? 'วิธีวัดเท้า' : 'How to Measure'}</p>
                                <p className="text-sm text-gray-700">
                                    {language === 'th'
                                        ? 'ยืนบนกระดาษ, วาดรอบเท้า, วัดจากส้นถึงนิ้วที่ยาวที่สุด'
                                        : 'Stand on paper, trace your foot, measure from heel to longest toe'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Apparel Size Guide Modal
function ApparelSizeGuideModal({ isOpen, onClose, language }: { isOpen: boolean; onClose: () => void; language: string }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">Size Guide</h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-sm border">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="p-3">{language === 'th' ? 'ไซส์' : 'Size'}</th>
                                        <th className="p-3">{language === 'th' ? 'อก (ซม.)' : 'Chest (cm)'}</th>
                                        <th className="p-3">{language === 'th' ? 'เอว (ซม.)' : 'Waist (cm)'}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center text-gray-700">
                                    <tr className="border-b"><td className="p-2">XS</td><td className="p-2">86-91</td><td className="p-2">71-76</td></tr>
                                    <tr className="border-b"><td className="p-2">S</td><td className="p-2">91-96</td><td className="p-2">76-81</td></tr>
                                    <tr className="border-b"><td className="p-2">M</td><td className="p-2">96-101</td><td className="p-2">81-86</td></tr>
                                    <tr className="border-b"><td className="p-2">L</td><td className="p-2">101-106</td><td className="p-2">86-91</td></tr>
                                    <tr className="border-b"><td className="p-2">XL</td><td className="p-2">106-111</td><td className="p-2">91-96</td></tr>
                                    <tr className="border-b"><td className="p-2">2XL</td><td className="p-2">111-116</td><td className="p-2">96-101</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Product Info Popup
function ProductInfoPopup({
    isOpen,
    onClose,
    item,
    currentImage,
    language
}: {
    isOpen: boolean;
    onClose: () => void;
    item: BundleProduct['items'][0];
    currentImage: string;
    language: string;
}) {
    const productInfo: Record<string, { features: string[]; featuresTh: string[] }> = {
        racket: {
            features: ['Carbon fiber frame', 'Head-light balance', 'Medium flex shaft', 'Recommended stringing: 22-28 lbs'],
            featuresTh: ['กรอบคาร์บอนไฟเบอร์', 'บาลานซ์หัวเบา', 'ก้านความยืดหยุ่นปานกลาง', 'แนะนำขึ้นเอ็น: 22-28 ปอนด์']
        },
        shoes: {
            features: ['Power Cushion+ technology', 'Non-marking rubber sole', 'Breathable mesh upper', 'Reinforced toe guard'],
            featuresTh: ['เทคโนโลยี Power Cushion+', 'พื้นยางไม่ทิ้งรอย', 'ผ้าตาข่ายระบายอากาศ', 'เสริมความแข็งแรงที่หัวรองเท้า']
        },
        bag: {
            features: ['Thermal protection compartment', 'Multiple pockets', 'Adjustable straps', 'Water-resistant material'],
            featuresTh: ['ช่องป้องกันความร้อน', 'กระเป๋าหลายช่อง', 'สายสะพายปรับได้', 'วัสดุกันน้ำ']
        },
        apparel: {
            features: ['Moisture-wicking fabric', 'Quick-dry technology', 'Stretch fit', 'Anti-odor treatment'],
            featuresTh: ['ผ้าดูดซับเหงื่อ', 'เทคโนโลยีแห้งเร็ว', 'ยืดหยุ่นดี', 'ป้องกันกลิ่น']
        },
        accessory: {
            features: ['Premium quality', 'Durable materials', 'Professional grade'],
            featuresTh: ['คุณภาพพรีเมียม', 'วัสดุทนทาน', 'ระดับมืออาชีพ']
        }
    };

    const info = productInfo[item.category] || productInfo.accessory;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-lg max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <div
                                className="h-48 bg-cover bg-center rounded-t-lg"
                                style={{ backgroundImage: `url('${currentImage}')` }}
                            />
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        <div className="p-4">
                            <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {language === 'th' ? item.nameTh : item.name}
                            </h3>
                            <p className="text-xl font-bold text-brand-yellow mb-4">
                                ฿{item.price.toLocaleString()}
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                    {language === 'th' ? 'คุณสมบัติหลัก:' : 'Key Features:'}
                                </p>
                                <ul className="space-y-1">
                                    {(language === 'th' ? info.featuresTh : info.features).map((f, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Bundle Item Card Component with Size and Color Selection
function BundleItemCard({
    item,
    language,
    selectedSize,
    selectedColor,
    onSizeChange,
    onColorChange,
    onInfoClick,
    onSizeGuideClick,
    currentImage,
    index
}: {
    item: BundleProduct['items'][0];
    language: string;
    selectedSize: string;
    selectedColor: string;
    onSizeChange: (size: string) => void;
    onColorChange: (color: string, image: string) => void;
    onInfoClick: () => void;
    onSizeGuideClick: () => void;
    currentImage: string;
    index: number;
}) {
    const sizes = sizeOptionsByCategory[item.category] || ['One Size'];
    const colors = colorOptionsByCategory[item.category] || [];
    const isSingleSize = sizes.length === 1 && sizes[0] === 'One Size';
    const hasColors = colors.length > 0;
    const guideLabel = guideLabels[item.category] || guideLabels.accessory;

    return (
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center gap-4">
                <button
                    onClick={onInfoClick}
                    className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0 relative group"
                    style={{ backgroundImage: `url('${currentImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
                        <Info className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>
                <div className="flex-1 min-w-0">
                    <button onClick={onInfoClick} className="text-left">
                        <h4 className="font-semibold text-gray-900 truncate hover:text-brand-yellow transition-colors">
                            {language === 'th' ? item.nameTh : item.name}
                        </h4>
                    </button>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <span className="font-bold text-gray-900">฿{item.price.toLocaleString()}</span>
                </div>
            </div>

            {/* Color Selection */}
            {hasColors && (
                <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                        {language === 'th' ? 'เลือกสี:' : 'Select Color:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => onColorChange(color.hex, color.image)}
                                className={`w-8 h-8 rounded-full border-2 transition-all relative ${selectedColor === color.hex
                                        ? 'border-black ring-2 ring-offset-2 ring-black'
                                        : 'border-gray-300 hover:border-gray-500'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                                title={language === 'th' ? color.nameTh : color.name}
                            >
                                {color.hex === '#ffffff' && (
                                    <span className="absolute inset-0 rounded-full border border-gray-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {!isSingleSize && (
                <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">
                            {language === 'th' ? 'เลือกไซส์:' : 'Select Size:'}
                        </p>
                        <button
                            onClick={onSizeGuideClick}
                            className="text-xs text-brand-yellow hover:underline flex items-center gap-1"
                        >
                            <Ruler className="w-3 h-3" />
                            {language === 'th' ? guideLabel.labelTh : guideLabel.label}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => onSizeChange(size)}
                                className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${selectedSize === size
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected indicator */}
            {selectedSize && (hasColors ? selectedColor : true) && (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="w-3 h-3" />
                    <span>
                        {language === 'th' ? 'เลือกแล้ว' : 'Selected'}:
                        {hasColors && colors.find(c => c.hex === selectedColor) && (
                            <span> {language === 'th' ? colors.find(c => c.hex === selectedColor)?.nameTh : colors.find(c => c.hex === selectedColor)?.name},</span>
                        )}
                        <span> {selectedSize}</span>
                    </span>
                </div>
            )}
        </div>
    );
}

// Community Video Section
function CommunityVideoSection({ language }: { language: string }) {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    {language === 'th' ? 'วิดีโอจากคอมมูนิตี้ของเรา' : 'Videos from Our Community'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {communityVideos.map((video, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-[9/16] rounded-lg overflow-hidden group cursor-pointer"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                style={{ backgroundImage: `url('${video.thumbnail}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-black ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="text-white text-sm font-medium">{video.username}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Collapsible Section
function CollapsibleSection({
    title,
    children,
    defaultOpen = false
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left"
            >
                <span className="font-semibold text-gray-900">{title}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Main Bundle Detail Page
export default function BundleDetailPage({
    params,
}: {
    params: Promise<{ bundleId: string }>;
}) {
    const resolvedParams = use(params);
    const { language } = useLanguage();
    const [quantity, setQuantity] = useState(1);
    const [showProductInfo, setShowProductInfo] = useState<number | null>(null);
    const [showSizeGuide, setShowSizeGuide] = useState<string | null>(null);

    const bundle = getBundleProductById(resolvedParams.bundleId);

    // Initialize size and color selections for each item
    const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(() => {
        if (!bundle) return {};
        const initial: Record<number, string> = {};
        bundle.items.forEach((item, index) => {
            const sizes = sizeOptionsByCategory[item.category] || ['One Size'];
            if (sizes.length === 1 && sizes[0] === 'One Size') {
                initial[index] = 'One Size';
            }
        });
        return initial;
    });

    const [selectedColors, setSelectedColors] = useState<Record<number, string>>(() => {
        if (!bundle) return {};
        const initial: Record<number, string> = {};
        bundle.items.forEach((item, index) => {
            const colors = colorOptionsByCategory[item.category] || [];
            if (colors.length === 0) {
                initial[index] = 'N/A';
            }
        });
        return initial;
    });

    // Track current images for each item (changes when color is selected)
    const [itemImages, setItemImages] = useState<Record<number, string>>(() => {
        if (!bundle) return {};
        const initial: Record<number, string> = {};
        bundle.items.forEach((item, index) => {
            initial[index] = item.image;
        });
        return initial;
    });

    if (!bundle) {
        notFound();
    }

    const skillLevelLabels: Record<string, { en: string; th: string }> = {
        beginner: { en: 'Beginner', th: 'เริ่มต้น' },
        intermediate: { en: 'Intermediate', th: 'ปานกลาง' },
        advanced: { en: 'Advanced', th: 'ขั้นสูง' },
        professional: { en: 'Professional', th: 'มืออาชีพ' },
    };

    const savings = bundle.originalPrice - bundle.price;

    // Check if all selections are complete
    const allSelectionsComplete = useMemo(() => {
        return bundle.items.every((item, index) => {
            const hasSize = selectedSizes[index] !== undefined && selectedSizes[index] !== '';
            const colors = colorOptionsByCategory[item.category] || [];
            const hasColor = colors.length === 0 || (selectedColors[index] !== undefined && selectedColors[index] !== '');
            return hasSize && hasColor;
        });
    }, [bundle.items, selectedSizes, selectedColors]);

    // Count missing selections
    const missingSelections = useMemo(() => {
        let count = 0;
        bundle.items.forEach((item, index) => {
            const sizes = sizeOptionsByCategory[item.category] || ['One Size'];
            const colors = colorOptionsByCategory[item.category] || [];
            const needsSize = !(sizes.length === 1 && sizes[0] === 'One Size') && !selectedSizes[index];
            const needsColor = colors.length > 0 && !selectedColors[index];
            if (needsSize || needsColor) count++;
        });
        return count;
    }, [bundle.items, selectedSizes, selectedColors]);

    const handleSizeChange = (index: number, size: string) => {
        setSelectedSizes(prev => ({ ...prev, [index]: size }));
    };

    const handleColorChange = (index: number, color: string, image: string) => {
        setSelectedColors(prev => ({ ...prev, [index]: color }));
        setItemImages(prev => ({ ...prev, [index]: image }));
    };

    const otherBundles = bundleProducts.filter(b => b.id !== bundle.id).slice(0, 3);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-4 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'BUNDLES', labelTh: 'เซ็ตสุดคุ้ม', href: '/bundles' },
                            { label: bundle.name, labelTh: bundle.nameTh },
                        ]}
                    />
                </div>
            </section>

            {/* Product Content */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Gallery */}
                        <div className="relative">
                            {bundle.badge && (
                                <div className="absolute top-4 left-4 z-10 bg-brand-yellow text-black px-3 py-1 font-bold text-sm rounded">
                                    {bundle.badge}
                                </div>
                            )}
                            <ProductGallery images={bundle.images} />
                        </div>

                        {/* Right: Info */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {language === 'th' ? bundle.nameTh : bundle.name}
                            </h1>

                            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4">
                                {language === 'th'
                                    ? skillLevelLabels[bundle.skillLevel].th
                                    : skillLevelLabels[bundle.skillLevel].en}
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    ฿{bundle.price.toLocaleString()}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    ฿{bundle.originalPrice.toLocaleString()}
                                </span>
                                <span className="px-3 py-1 bg-lime-400 text-black text-sm font-bold rounded">
                                    {language === 'th' ? `ประหยัด ${bundle.savingsPercent}%` : `SAVE ${bundle.savingsPercent}%`}
                                </span>
                            </div>

                            {/* Savings Info */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Check className="w-5 h-5" />
                                    <span className="font-semibold">
                                        {language === 'th'
                                            ? `คุณประหยัด ฿${savings.toLocaleString()} เมื่อซื้อเซ็ตนี้`
                                            : `You save ฿${savings.toLocaleString()} with this bundle`}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {language === 'th' ? bundle.descriptionTh : bundle.description}
                            </p>

                            {/* Items with Size and Color Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    {language === 'th' ? 'เลือกสีและไซส์สินค้าในเซ็ต' : 'Select color and size for bundle items'}
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({language === 'th' ? 'คลิกที่รูปเพื่อดูรายละเอียด' : 'Click image for details'})
                                    </span>
                                </h3>
                                <div className="space-y-3">
                                    {bundle.items.map((item, index) => (
                                        <BundleItemCard
                                            key={index}
                                            item={item}
                                            language={language}
                                            selectedSize={selectedSizes[index] || ''}
                                            selectedColor={selectedColors[index] || ''}
                                            onSizeChange={(size) => handleSizeChange(index, size)}
                                            onColorChange={(color, image) => handleColorChange(index, color, image)}
                                            onInfoClick={() => setShowProductInfo(index)}
                                            onSizeGuideClick={() => setShowSizeGuide(item.category)}
                                            currentImage={itemImages[index] || item.image}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Warning if selections incomplete */}
                            {!allSelectionsComplete && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-amber-700">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="font-medium">
                                            {language === 'th'
                                                ? `กรุณาเลือกสีและไซส์ให้ครบ ${missingSelections} รายการ`
                                                : `Please complete selection for ${missingSelections} item${missingSelections > 1 ? 's' : ''}`}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="flex gap-4 mb-8">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-3 font-semibold min-w-[50px] text-center text-gray-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-3 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    disabled={!allSelectionsComplete}
                                    className={`flex-1 py-3 px-8 font-semibold text-sm tracking-wider transition-colors rounded-lg ${allSelectionsComplete
                                            ? 'bg-black text-white hover:bg-brand-yellow hover:text-black'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {language === 'th' ? 'เพิ่มลงตะกร้า' : 'ADD TO CART'}
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Package className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                    <span className="text-xs text-gray-600">
                                        {language === 'th' ? 'ครบชุด' : 'Complete Set'}
                                    </span>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                    <span className="text-xs text-gray-600">
                                        {language === 'th' ? 'ส่งฟรี' : 'Free Shipping'}
                                    </span>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                    <span className="text-xs text-gray-600">
                                        {language === 'th' ? 'รับประกัน' : 'Warranty'}
                                    </span>
                                </div>
                            </div>

                            {/* Collapsible Sections */}
                            <div className="border-t border-gray-200">
                                <CollapsibleSection
                                    title={language === 'th' ? 'คุณสมบัติ' : 'Features'}
                                    defaultOpen={true}
                                >
                                    <ul className="space-y-2">
                                        {(language === 'th' ? bundle.featuresTh : bundle.features).map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleSection>

                                <CollapsibleSection title={language === 'th' ? 'การจัดส่ง' : 'Shipping'}>
                                    <div className="space-y-2 text-gray-600">
                                        <p>{language === 'th' ? '• จัดส่งฟรีทั่วประเทศ สำหรับเซ็ตสุดคุ้ม' : '• Free shipping nationwide for bundles'}</p>
                                        <p>{language === 'th' ? '• จัดส่งภายใน 1-3 วันทำการ' : '• Delivered within 1-3 business days'}</p>
                                        <p>{language === 'th' ? '• แพ็คอย่างดีเพื่อป้องกันความเสียหาย' : '• Carefully packed to prevent damage'}</p>
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection title={language === 'th' ? 'การคืนสินค้า' : 'Returns'}>
                                    <div className="space-y-2 text-gray-600">
                                        <p>{language === 'th' ? '• คืนสินค้าได้ภายใน 14 วัน หากไม่พอใจ' : '• 14-day return policy'}</p>
                                        <p>{language === 'th' ? '• สินค้าต้องอยู่ในสภาพใหม่ ไม่ผ่านการใช้งาน' : '• Items must be in new, unused condition'}</p>
                                        <p>{language === 'th' ? '• ต้องมีบรรจุภัณฑ์และแท็กครบถ้วน' : '• Must include all packaging and tags'}</p>
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Videos */}
            <CommunityVideoSection language={language} />

            {/* Other Bundles */}
            {otherBundles.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {language === 'th' ? 'เซ็ตอื่นๆ ที่น่าสนใจ' : 'Other Bundles You May Like'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {otherBundles.map((otherBundle) => (
                                <Link
                                    key={otherBundle.id}
                                    href={`/bundles/${otherBundle.id}`}
                                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {otherBundle.badge && (
                                            <div className="absolute top-3 left-3 z-10 bg-brand-yellow text-black px-2 py-1 text-xs font-bold rounded">
                                                {otherBundle.badge}
                                            </div>
                                        )}
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${otherBundle.images[0]}')` }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-brand-yellow transition-colors">
                                            {language === 'th' ? otherBundle.nameTh : otherBundle.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {otherBundle.items.length} {language === 'th' ? 'รายการ' : 'items'}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">฿{otherBundle.price.toLocaleString()}</span>
                                            <span className="text-sm text-gray-400 line-through">
                                                ฿{otherBundle.originalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Product Info Popup */}
            {showProductInfo !== null && (
                <ProductInfoPopup
                    isOpen={showProductInfo !== null}
                    onClose={() => setShowProductInfo(null)}
                    item={bundle.items[showProductInfo]}
                    currentImage={itemImages[showProductInfo] || bundle.items[showProductInfo].image}
                    language={language}
                />
            )}

            {/* Size Guide Modals */}
            {showSizeGuide === 'racket' && (
                <RacketGuideModal
                    isOpen={true}
                    onClose={() => setShowSizeGuide(null)}
                    language={language}
                />
            )}
            {showSizeGuide === 'shoes' && (
                <ShoeSizeGuideModal
                    isOpen={true}
                    onClose={() => setShowSizeGuide(null)}
                    language={language}
                />
            )}
            {showSizeGuide === 'apparel' && (
                <ApparelSizeGuideModal
                    isOpen={true}
                    onClose={() => setShowSizeGuide(null)}
                    language={language}
                />
            )}
        </main>
    );
}
