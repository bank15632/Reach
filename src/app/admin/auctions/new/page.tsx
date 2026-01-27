'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, ImagePlus, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface Product {
    id: string;
    name: string;
    nameTh: string;
    sku: string;
    price: number;
    images: string[];
}

export default function NewAuctionPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [products, setProducts] = useState<Product[]>([]);

    const [form, setForm] = useState({
        productId: '',
        title: '',
        titleTh: '',
        description: '',
        descriptionTh: '',
        images: [] as string[],
        startPrice: '',
        reservePrice: '',
        bidIncrement: '100',
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        // Fetch products for selection
        fetch('/api/products?limit=100')
            .then(res => res.json())
            .then(data => setProducts(data.products || []))
            .catch(console.error);
    }, []);

    const handleProductSelect = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setForm(prev => ({
                ...prev,
                productId,
                title: product.name,
                titleTh: product.nameTh,
                images: product.images,
                startPrice: product.price.toString()
            }));
        }
    };

    const handleAddImage = () => {
        const url = prompt(t('Image URL:', 'ใส่ URL รูปภาพ:'));
        if (url) {
            setForm(prev => ({ ...prev, images: [...prev.images, url] }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.title || !form.titleTh || !form.startPrice || !form.startTime || !form.endTime) {
            setError(t('Please fill in all required fields.', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'));
            return;
        }

        const startDate = new Date(form.startTime);
        const endDate = new Date(form.endTime);
        if (endDate <= startDate) {
            setError(t('End time must be after start time.', 'เวลาสิ้นสุดต้องหลังจากเวลาเริ่ม'));
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/admin/auctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    productId: form.productId || null
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create auction');
            }

            router.push('/admin/auctions');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminGuard permission="MANAGE_AUCTIONS">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/auctions"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('Create Auction', 'สร้างประมูลใหม่')}</h1>
                    <p className="text-gray-500">{t('Set up an auction for a product.', 'ตั้งค่าการประมูลสินค้า')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Product Selection (Optional) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Select product (optional)', 'เลือกสินค้า (ไม่จำเป็น)')}</h2>
                        <select
                            value={form.productId}
                            onChange={(e) => handleProductSelect(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                        >
                            <option value="">{t('-- Choose a product or fill in manually --', '-- เลือกสินค้าจากคลัง หรือกรอกข้อมูลเอง --')}</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {language === 'th' ? product.nameTh : product.name} ({product.sku}) - ฿{product.price.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Product details', 'ข้อมูลสินค้า')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Product name (EN) *', 'ชื่อสินค้า (EN) *')}
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Product name (TH) *', 'ชื่อสินค้า (TH) *')}
                                </label>
                                <input
                                    type="text"
                                    value={form.titleTh}
                                    onChange={(e) => setForm(prev => ({ ...prev, titleTh: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Description (EN)', 'รายละเอียด (EN)')}
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Description (TH)', 'รายละเอียด (TH)')}
                                </label>
                                <textarea
                                    value={form.descriptionTh}
                                    onChange={(e) => setForm(prev => ({ ...prev, descriptionTh: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Images */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Images', 'รูปภาพ')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {form.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-brand-yellow hover:text-brand-yellow transition-colors"
                            >
                                <ImagePlus className="w-8 h-8 mb-2" />
                                <span className="text-sm">{t('Add image', 'เพิ่มรูป')}</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Pricing', 'ราคา')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Starting price (THB) *', 'ราคาเริ่มต้น (THB) *')}
                                </label>
                                <input
                                    type="number"
                                    value={form.startPrice}
                                    onChange={(e) => setForm(prev => ({ ...prev, startPrice: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Reserve price', 'ราคาขั้นต่ำ (Reserve)')}
                                </label>
                                <input
                                    type="number"
                                    value={form.reservePrice}
                                    onChange={(e) => setForm(prev => ({ ...prev, reservePrice: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    placeholder={t('Optional', 'ไม่จำเป็น')}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {t('Minimum acceptable price (hidden from customers).', 'ราคาต่ำสุดที่ยอมขาย (ไม่แสดงให้ลูกค้าเห็น)')}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Bid increment', 'ขั้นต่ำในการเพิ่มราคา')}
                                </label>
                                <input
                                    type="number"
                                    value={form.bidIncrement}
                                    onChange={(e) => setForm(prev => ({ ...prev, bidIncrement: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    min="1"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Schedule */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Schedule', 'กำหนดเวลา')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Auction start time *', 'เวลาเริ่มประมูล *')}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.startTime}
                                    onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Auction end time *', 'เวลาสิ้นสุด *')}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.endTime}
                                    onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/auctions"
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t('Cancel', 'ยกเลิก')}
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? t('Saving...', 'กำลังบันทึก...') : t('Create Auction', 'สร้างประมูล')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </AdminGuard>
    );
}
