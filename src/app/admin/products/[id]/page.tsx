'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

const CATEGORIES = [
    { value: 'RACKETS', labelEn: 'Rackets', labelTh: 'ไม้แบด' },
    { value: 'SHOES', labelEn: 'Shoes', labelTh: 'รองเท้า' },
    { value: 'SPORTSWEAR', labelEn: 'Sportswear', labelTh: 'เสื้อผ้ากีฬา' },
    { value: 'SUPPLEMENTS', labelEn: 'Supplements', labelTh: 'อาหารเสริม' },
    { value: 'ACCESSORIES', labelEn: 'Accessories', labelTh: 'อุปกรณ์เสริม' },
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

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
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

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Product not found');
                }

                const product = data.product;
                setForm({
                    sku: product.sku,
                    name: product.name,
                    nameTh: product.nameTh,
                    description: product.description || '',
                    descriptionTh: product.descriptionTh || '',
                    category: product.category,
                    brand: product.brand || '',
                    price: product.price.toString(),
                    salePrice: product.salePrice?.toString() || '',
                    stockCount: product.stockCount.toString(),
                    inStock: product.inStock,
                    featured: product.featured,
                    images: product.images || [],
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : t('Something went wrong.', 'เกิดข้อผิดพลาด'));
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Validation
            if (!form.sku || !form.name || !form.nameTh || !form.price) {
                throw new Error(t('Please fill in all required fields.', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'));
            }

            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
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
                throw new Error(data.error || t('Something went wrong.', 'เกิดข้อผิดพลาด'));
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : t('Something went wrong.', 'เกิดข้อผิดพลาด'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t('Something went wrong.', 'เกิดข้อผิดพลาด'));
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : t('Something went wrong.', 'เกิดข้อผิดพลาด'));
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
                    <p className="mt-2 text-gray-500">{t('Loading...', 'กำลังโหลด...')}</p>
                </div>
            </div>
        );
    }

    return (
        <AdminGuard permission="MANAGE_PRODUCTS">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('Edit Product', 'แก้ไขสินค้า')}</h1>
                        <p className="text-gray-500">{language === 'th' ? form.nameTh : form.name}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                    {t('Delete Product', 'ลบสินค้า')}
                </button>
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
                        {t('Basic Information', 'ข้อมูลพื้นฐาน')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, sku: e.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-gray-50"
                                readOnly
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Category', 'หมวดหมู่')} <span className="text-red-500">*</span>
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
                                        {language === 'th' ? cat.labelTh : cat.labelEn}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Product name (EN)', 'ชื่อสินค้า (EN)')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Name TH */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Product name (TH)', 'ชื่อสินค้า (TH)')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.nameTh}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, nameTh: e.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Brand */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Brand', 'แบรนด์')}
                            </label>
                            <input
                                type="text"
                                value={form.brand}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, brand: e.target.value }))
                                }
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>

                        {/* Description EN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Description (EN)', 'รายละเอียด (EN)')}
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                            />
                        </div>

                        {/* Description TH */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Description (TH)', 'รายละเอียด (TH)')}
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
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {t('Pricing & Stock', 'ราคาและสต็อก')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Price (THB)', 'ราคา (บาท)')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, price: e.target.value }))
                                }
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                required
                            />
                        </div>

                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Sale price (THB)', 'ราคาลด (บาท)')}
                            </label>
                            <input
                                type="number"
                                value={form.salePrice}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, salePrice: e.target.value }))
                                }
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('Stock quantity', 'จำนวนสต็อก')}
                            </label>
                            <input
                                type="number"
                                value={form.stockCount}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, stockCount: e.target.value }))
                                }
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
                            <span className="text-sm text-gray-700">{t('In stock', 'มีสินค้า')}</span>
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
                            <span className="text-sm text-gray-700">{t('Featured', 'สินค้าแนะนำ')}</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {t('Product Images', 'รูปภาพสินค้า')}
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
                        {t('Cancel', 'ยกเลิก')}
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t('Saving...', 'กำลังบันทึก...')}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {t('Save changes', 'บันทึกการเปลี่ยนแปลง')}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Delete Modal */}
            {showDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {t('Confirm product deletion', 'ยืนยันการลบสินค้า')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('Are you sure you want to delete', 'คุณแน่ใจหรือไม่ว่าต้องการลบ')}{' '}
                            <strong>{language === 'th' ? form.nameTh : form.name}</strong>?{' '}
                            {t('This action cannot be undone.', 'การกระทำนี้ไม่สามารถย้อนกลับได้')}
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDelete(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {t('Cancel', 'ยกเลิก')}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? t('Deleting...', 'กำลังลบ...') : t('Delete product', 'ลบสินค้า')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
        </AdminGuard>
    );
}
