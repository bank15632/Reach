'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Trash2, ImagePlus, X, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface Bid {
    id: string;
    amount: number;
    createdAt: string;
    isWinning: boolean;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface Auction {
    id: string;
    title: string;
    titleTh: string;
    description?: string;
    descriptionTh?: string;
    images: string[];
    startPrice: number;
    currentPrice: number;
    reservePrice?: number;
    bidIncrement: number;
    startTime: string;
    endTime: string;
    status: string;
    winnerId?: string;
    winningBid?: number;
    paymentStatus: string;
    bids: Bid[];
    winner?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
}

export default function EditAuctionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        titleTh: '',
        description: '',
        descriptionTh: '',
        images: [] as string[],
        startPrice: '',
        reservePrice: '',
        bidIncrement: '',
        startTime: '',
        endTime: '',
        status: ''
    });

    useEffect(() => {
        fetchAuction();
    }, [id]);

    const fetchAuction = async () => {
        try {
            const res = await fetch(`/api/admin/auctions/${id}`);
            if (!res.ok) {
                router.push('/admin/auctions');
                return;
            }
            const data = await res.json();
            setAuction(data);
            setForm({
                title: data.title,
                titleTh: data.titleTh,
                description: data.description || '',
                descriptionTh: data.descriptionTh || '',
                images: data.images,
                startPrice: data.startPrice.toString(),
                reservePrice: data.reservePrice?.toString() || '',
                bidIncrement: data.bidIncrement.toString(),
                startTime: new Date(data.startTime).toISOString().slice(0, 16),
                endTime: new Date(data.endTime).toISOString().slice(0, 16),
                status: data.status
            });
        } catch (error) {
            console.error('Error fetching auction:', error);
        } finally {
            setLoading(false);
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
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/auctions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update auction');
            }

            router.push('/admin/auctions');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('Delete or cancel this auction?', 'ต้องการลบ/ยกเลิกการประมูลนี้?'))) return;

        try {
            const res = await fetch(`/api/admin/auctions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/admin/auctions');
            }
        } catch (error) {
            console.error('Error deleting auction:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString(language === 'th' ? 'th-TH' : 'en-US');
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 h-64" />
                    <div className="bg-white rounded-xl p-6 h-48" />
                </div>
            </div>
        );
    }

    if (!auction) return null;

    const isActive = auction.status === 'ACTIVE';
    const isEnded = ['ENDED', 'COMPLETED', 'NO_BIDS', 'UNPAID'].includes(auction.status);

    return (
        <AdminGuard permission="MANAGE_AUCTIONS">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/auctions"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('Edit Auction', 'แก้ไขประมูล')}</h1>
                        <p className="text-gray-500">{language === 'th' ? auction.titleTh : auction.title}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                    {t('Delete', 'ลบ')}
                </button>
            </div>

            {/* Status Alert */}
            {isActive && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                        {t('Auction is active - only end time can be edited.', 'การประมูลกำลังดำเนินการ - สามารถแก้ไขได้เฉพาะเวลาสิ้นสุดเท่านั้น')}
                    </p>
                </div>
            )}
            {isEnded && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 font-medium">{t('Auction has ended.', 'การประมูลสิ้นสุดแล้ว')}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Product details', 'ข้อมูลสินค้า')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Product name (EN)', 'ชื่อสินค้า (EN)')}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            disabled={isActive || isEnded}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Product name (TH)', 'ชื่อสินค้า (TH)')}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.titleTh}
                                            onChange={(e) => setForm(prev => ({ ...prev, titleTh: e.target.value }))}
                                            disabled={isActive || isEnded}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Description (EN)', 'รายละเอียด (EN)')}
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                            disabled={isActive || isEnded}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Description (TH)', 'รายละเอียด (TH)')}
                                        </label>
                                        <textarea
                                            value={form.descriptionTh}
                                            onChange={(e) => setForm(prev => ({ ...prev, descriptionTh: e.target.value }))}
                                            disabled={isActive || isEnded}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Images */}
                            {!isActive && !isEnded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
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
                            )}

                            {/* Schedule */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Schedule', 'กำหนดเวลา')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Auction start time', 'เวลาเริ่มประมูล')}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.startTime}
                                            onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                                            disabled={isActive || isEnded}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('Auction end time', 'เวลาสิ้นสุด')}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.endTime}
                                            onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                                            disabled={isEnded}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow disabled:bg-gray-100"
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
                            {!isEnded && (
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
                                        {saving ? t('Saving...', 'กำลังบันทึก...') : t('Save', 'บันทึก')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Sidebar - Stats & Bids */}
                <div className="space-y-6">
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Stats', 'สถิติ')}</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">{t('Start price', 'ราคาเริ่มต้น')}</p>
                                <p className="text-lg font-semibold">฿{auction.startPrice.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('Current price', 'ราคาปัจจุบัน')}</p>
                                <p className="text-2xl font-bold text-brand-yellow">฿{auction.currentPrice.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('Bids', 'จำนวน Bids')}</p>
                                <p className="text-lg font-semibold">{auction.bids.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Winner (if ended) */}
                    {isEnded && auction.winner && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 rounded-xl p-6 border border-green-200"
                        >
                            <h2 className="text-lg font-semibold text-green-900 mb-4">{t('Winner', 'ผู้ชนะ')}</h2>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900">
                                        {auction.winner.firstName} {auction.winner.lastName}
                                    </p>
                                    <p className="text-sm text-green-700">{auction.winner.email}</p>
                                </div>
                            </div>
                            <div className="text-green-700">
                                <p>{t('Winning bid', 'ราคาชนะ')}: <span className="font-bold">฿{auction.winningBid?.toLocaleString()}</span></p>
                                {auction.winner.phone && <p>{t('Phone', 'โทร')}: {auction.winner.phone}</p>}
                            </div>
                        </motion.div>
                    )}

                    {/* Bid History */}
                    {auction.bids.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Bid history', 'ประวัติการประมูล')}</h2>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {auction.bids.map((bid) => (
                                    <div key={bid.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {bid.user.firstName} {bid.user.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{bid.user.email}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(bid.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${bid.isWinning ? 'text-green-600' : 'text-gray-600'}`}>
                                                ฿{bid.amount.toLocaleString()}
                                            </p>
                                            {bid.isWinning && (
                                                <span className="text-xs text-green-600">{t('Leading', 'นำอยู่')}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
        </AdminGuard>
    );
}
