'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Gavel, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface Auction {
    id: string;
    title: string;
    titleTh: string;
    images: string[];
    startPrice: number;
    currentPrice: number;
    startTime: string;
    endTime: string;
    status: string;
    _count: { bids: number };
    winner?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

const statusColors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    ACTIVE: 'bg-green-100 text-green-700',
    ENDED: 'bg-gray-100 text-gray-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
    NO_BIDS: 'bg-yellow-100 text-yellow-700',
    UNPAID: 'bg-orange-100 text-orange-700'
};

const statusLabels: Record<string, { en: string; th: string }> = {
    SCHEDULED: { en: 'Scheduled', th: 'กำหนดเวลาแล้ว' },
    ACTIVE: { en: 'Active', th: 'กำลังประมูล' },
    ENDED: { en: 'Ended', th: 'สิ้นสุด' },
    COMPLETED: { en: 'Completed', th: 'สำเร็จ' },
    CANCELLED: { en: 'Cancelled', th: 'ยกเลิก' },
    NO_BIDS: { en: 'No bids', th: 'ไม่มีผู้ประมูล' },
    UNPAID: { en: 'Unpaid', th: 'ไม่ชำระเงิน' }
};

export default function AdminAuctionsPage() {
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

    useEffect(() => {
        fetchAuctions();
    }, [search, statusFilter, pagination.page]);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter !== 'all') params.set('status', statusFilter);
            params.set('page', pagination.page.toString());

            const res = await fetch(`/api/admin/auctions?${params}`);
            if (res.ok) {
                const data = await res.json();
                setAuctions(data.auctions);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages
                }));
            }
        } catch (error) {
            console.error('Error fetching auctions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('Delete or cancel this auction?', 'ต้องการลบ/ยกเลิกการประมูลนี้?'))) return;

        try {
            const res = await fetch(`/api/admin/auctions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAuctions();
            }
        } catch (error) {
            console.error('Error deleting auction:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminGuard permission="MANAGE_AUCTIONS">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('Manage Auctions', 'จัดการประมูล')}</h1>
                    <p className="text-gray-500">{t('Create and manage product auctions.', 'สร้างและจัดการการประมูลสินค้า')}</p>
                </div>
                <Link
                    href="/admin/auctions/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    {t('Create Auction', 'สร้างประมูลใหม่')}
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('Search product name...', 'ค้นหาชื่อสินค้า...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                >
                    <option value="all">{t('All statuses', 'ทุกสถานะ')}</option>
                    <option value="SCHEDULED">{t('Scheduled', 'กำหนดเวลาแล้ว')}</option>
                    <option value="ACTIVE">{t('Active', 'กำลังประมูล')}</option>
                    <option value="ENDED">{t('Ended', 'สิ้นสุด')}</option>
                    <option value="COMPLETED">{t('Completed', 'สำเร็จ')}</option>
                    <option value="CANCELLED">{t('Cancelled', 'ยกเลิก')}</option>
                    <option value="NO_BIDS">{t('No bids', 'ไม่มีผู้ประมูล')}</option>
                    <option value="UNPAID">{t('Unpaid', 'ไม่ชำระเงิน')}</option>
                </select>
            </div>

            {/* Auctions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">{t('Loading...', 'กำลังโหลด...')}</div>
                ) : auctions.length === 0 ? (
                    <div className="p-8 text-center">
                        <Gavel className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">{t('No auctions found.', 'ไม่พบรายการประมูล')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Product', 'สินค้า')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Start price', 'ราคาเริ่มต้น')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Current price', 'ราคาปัจจุบัน')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Bids', 'จำนวน Bids')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Time', 'เวลา')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Status', 'สถานะ')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">{t('Actions', 'จัดการ')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {auctions.map((auction) => (
                                    <motion.tr
                                        key={auction.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                    {auction.images[0] ? (
                                                        <img src={auction.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Gavel className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">
                                                        {language === 'th' ? auction.titleTh : auction.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        {language === 'th' ? auction.title : auction.titleTh}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            ฿{auction.startPrice.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-brand-yellow">
                                                ฿{auction.currentPrice.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {auction._count.bids}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {t('Start:', 'เริ่ม:')} {formatDate(auction.startTime)}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {t('End:', 'สิ้นสุด:')} {formatDate(auction.endTime)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[auction.status] || 'bg-gray-100'}`}>
                                                {statusLabels[auction.status]
                                                    ? t(statusLabels[auction.status].en, statusLabels[auction.status].th)
                                                    : auction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/auctions/${auction.id}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title={t('View auction page', 'ดูหน้าประมูล')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/auctions/${auction.id}`}
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title={t('Edit', 'แก้ไข')}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(auction.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    title={t('Delete', 'ลบ')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {t('Showing', 'แสดง')} {auctions.length} {t('of', 'จาก')} {pagination.total} {t('items', 'รายการ')}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                {t('Previous', 'ก่อนหน้า')}
                            </button>
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                {t('Next', 'ถัดไป')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </AdminGuard>
    );
}
