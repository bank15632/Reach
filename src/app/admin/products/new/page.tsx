'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

const CATEGORIES = [
    { value: 'RACKETS', label: 'ไม้แบด' },
    { value: 'SHOES', label: 'รองเท้า' },
    { value: 'SPORTSWEAR', label: 'เสื้อผ้ากีฬา' },
    { value: 'SUPPLEMENTS', label: 'อาหารเสริม' },
    { value: 'ACCESSORIES', label: 'อุปกรณ์เสริม' },
];

interface ProductForm {
    sku: string;
    name: string;
    nameTh: string;
    description: string;
    descriptionTh: string;
    category: string;
    brand: string;
    price: string;
    salePrice: string;
    stockCount: string;
    inStock: boolean;
    featured: boolean;
    images: string[];
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<ProductForm>({
        sku: '',
        name: '',
        nameTh: '',
        description: '',
        descriptionTh: '',
        category: 'RACKETS',
        brand: '',
        price: '',
        salePrice: '',
        stockCount: '0',
        inStock: true,
        featured: false,
        images: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validation
            if (!form.sku || !form.name || !form.nameTh || !form.price) {
                throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบ');
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
                    stockCount: parseInt(form.stockCount) || 0,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาด');
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    const generateSku = () => {
        const prefix = form.category.substring(0, 3).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        setForm((prev) => ({ ...prev, sku: `${prefix}-${random}` }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">เพิ่มสินค้าใหม่</h1>
                    <p className="text-gray-500">กรอกข้อมูลสินค้าด้านล่าง</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        ข้อมูลพื้นฐาน
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={form.sku}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, sku: e.target.value }))
                                    }
                                    placeholder="RAC-A1B2"
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateSku}
                                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    สร้างอัตโนมัติ
                                </button>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                หมวดหมู่ <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, category: e.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อสินค้า (EN) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                placeholder="Product Name"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Name TH */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อสินค้า (TH) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.nameTh}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, nameTh: e.target.value }))
                                }
                                placeholder="ชื่อสินค้า"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Brand */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                แบรนด์
                            </label>
                            <input
                                type="text"
                                value={form.brand}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, brand: e.target.value }))
                                }
                                placeholder="Yonex, Victor, Li-Ning..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>

                        {/* Description EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                รายละเอียด (EN)
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                placeholder="Product description..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                            />
                        </div>

                        {/* Description TH */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                รายละเอียด (TH)
                            </label>
                            <textarea
                                value={form.descriptionTh}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        descriptionTh: e.target.value,
                                    }))
                                }
                                rows={4}
                                placeholder="รายละเอียดสินค้า..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        ราคาและสต็อก
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ราคา (บาท) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, price: e.target.value }))
                                }
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ราคาลด (บาท)
                            </label>
                            <input
                                type="number"
                                value={form.salePrice}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, salePrice: e.target.value }))
                                }
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                จำนวนสต็อก
                            </label>
                            <input
                                type="number"
                                value={form.stockCount}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, stockCount: e.target.value }))
                                }
                                placeholder="0"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center gap-6 mt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.inStock}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, inStock: e.target.checked }))
                                }
                                className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                            />
                            <span className="text-sm text-gray-700">มีสินค้า</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, featured: e.target.checked }))
                                }
                                className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                            />
                            <span className="text-sm text-gray-700">สินค้าแนะนำ</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        รูปภาพสินค้า
                    </h2>
                    <ImageUploader
                        images={form.images}
                        onChange={(images) => setForm((prev) => ({ ...prev, images }))}
                        maxImages={10}
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/products"
                        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        ยกเลิก
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                บันทึกสินค้า
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
