'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Eye,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    items: Array<{
        id: string;
        quantity: number;
        product?: { name: string; images: string[] };
    }>;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const STATUS_OPTIONS = [
    { value: '', labelEn: 'All', labelTh: 'ทั้งหมด' },
    { value: 'PENDING', labelEn: 'Pending', labelTh: 'รอดำเนินการ' },
    { value: 'CONFIRMED', labelEn: 'Confirmed', labelTh: 'ยืนยันแล้ว' },
    { value: 'PROCESSING', labelEn: 'Processing', labelTh: 'กำลังจัดเตรียม' },
    { value: 'SHIPPED', labelEn: 'Shipped', labelTh: 'จัดส่งแล้ว' },
    { value: 'DELIVERED', labelEn: 'Delivered', labelTh: 'ส่งถึงแล้ว' },
    { value: 'CANCELLED', labelEn: 'Cancelled', labelTh: 'ยกเลิก' },
];

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.set('search', search);
            if (status) params.set('status', status);

            const res = await fetch(`/api/admin/orders?${params}`);
            const data = await res.json();

            if (res.ok) {
                setOrders(data.orders);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchOrders();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US').format(price);
    };

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const getStatusLabel = (s: string) => {
        const match = STATUS_OPTIONS.find((opt) => opt.value === s);
        if (!match) return s;
        return language === 'th' ? match.labelTh : match.labelEn;
    };

    return (
        <AdminGuard permission="MANAGE_ORDERS">
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('Orders', 'คำสั่งซื้อ')}</h1>
                <p className="text-gray-500">{t('Manage all orders.', 'จัดการคำสั่งซื้อทั้งหมด')}</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('Search by order number or customer name...', 'ค้นหาด้วยเลขที่คำสั่งซื้อ หรือชื่อลูกค้า...')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                    </form>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {language === 'th' ? opt.labelTh : opt.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
                        <p className="mt-2 text-gray-500">{t('Loading...', 'กำลังโหลด...')}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-gray-500">{t('No orders found.', 'ไม่พบคำสั่งซื้อ')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        {t('Order #', 'เลขที่')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        {t('Customer', 'ลูกค้า')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        {t('Date', 'วันที่')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        {t('Status', 'สถานะ')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        {t('Total', 'ยอดรวม')}
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                        {t('Actions', 'จัดการ')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-medium text-gray-900">
                                                {order.orderNumber}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.user.firstName} {order.user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.user.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-900">
                                                ฿{formatPrice(order.total)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 text-gray-500 hover:text-brand-yellow hover:bg-yellow-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
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
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            {t('Showing', 'แสดง')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('of', 'จาก')}{' '}
                            {pagination.total} {t('items', 'รายการ')}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        page: prev.page - 1,
                                    }))
                                }
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 text-sm">
                                {t('Page', 'หน้า')} {pagination.page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }))
                                }
                                disabled={pagination.page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </AdminGuard>
    );
}
