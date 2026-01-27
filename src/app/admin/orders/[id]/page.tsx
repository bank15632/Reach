'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Save,
    Loader2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AdminGuard from '@/components/admin/AdminGuard';

interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: {
        id: string;
        name: string;
        nameTh: string;
        images: string[];
    };
    variant?: {
        name: string;
        value: string;
    };
    bundle?: {
        name: string;
        nameTh: string;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    trackingNumber: string | null;
    notes: string | null;
    createdAt: string;
    shippedAt: string | null;
    deliveredAt: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
    };
    address: {
        fullName: string;
        phone: string;
        address: string;
        subDistrict: string;
        district: string;
        province: string;
        postalCode: string;
    } | null;
    items: OrderItem[];
}

const STATUS_OPTIONS = [
    { value: 'PENDING', labelEn: 'Pending', labelTh: 'รอดำเนินการ', icon: Clock, color: 'yellow' },
    { value: 'CONFIRMED', labelEn: 'Confirmed', labelTh: 'ยืนยันแล้ว', icon: CheckCircle, color: 'blue' },
    { value: 'PROCESSING', labelEn: 'Processing', labelTh: 'กำลังจัดเตรียม', icon: Package, color: 'purple' },
    { value: 'SHIPPED', labelEn: 'Shipped', labelTh: 'จัดส่งแล้ว', icon: Truck, color: 'indigo' },
    { value: 'DELIVERED', labelEn: 'Delivered', labelTh: 'ส่งถึงแล้ว', icon: CheckCircle, color: 'green' },
    { value: 'CANCELLED', labelEn: 'Cancelled', labelTh: 'ยกเลิก', icon: XCircle, color: 'red' },
];

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-700 border-purple-200',
    SHIPPED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/orders/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Order not found');
                }

                setOrder(data.order);
                setNewStatus(data.order.status);
                setTrackingNumber(data.order.trackingNumber || '');
            } catch (err) {
                setError(err instanceof Error ? err.message : t('Something went wrong.', 'เกิดข้อผิดพลาด'));
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [id]);

    const handleUpdate = async () => {
        if (!order) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    trackingNumber: trackingNumber || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t('Something went wrong.', 'เกิดข้อผิดพลาด'));
            }

            setOrder(data.order);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('Something went wrong.', 'เกิดข้อผิดพลาด'));
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US').format(price);
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'long',
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

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{t('Order not found.', 'ไม่พบคำสั่งซื้อ')}</p>
                <Link href="/admin/orders" className="text-brand-yellow hover:underline mt-2 inline-block">
                    {t('Back to orders', 'กลับไปหน้ารายการ')}
                </Link>
            </div>
        );
    }

    return (
        <AdminGuard permission="MANAGE_ORDERS">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/orders"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {t('Order', 'คำสั่งซื้อ')} #{order.orderNumber}
                    </h1>
                    <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${STATUS_COLORS[order.status]}`}>
                    {getStatusLabel(order.status)}
                </span>
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                >
                    {error}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('Order items', 'รายการสินค้า')}
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {item.product?.images[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.nameTh}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {language === 'th'
                                                ? item.product?.nameTh || item.bundle?.nameTh || t('Unknown', 'ไม่ทราบชื่อ')
                                                : item.product?.name || item.bundle?.name || t('Unknown', 'ไม่ทราบชื่อ')}
                                        </p>
                                        {item.variant && (
                                            <p className="text-sm text-gray-500">
                                                {item.variant.name}: {item.variant.value}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {t('Qty', 'จำนวน')}: {item.quantity} x ฿{formatPrice(item.unitPrice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ฿{formatPrice(item.totalPrice)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('Subtotal', 'ยอดรวมสินค้า')}</span>
                                <span>฿{formatPrice(order.subtotal)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">{t('Discount', 'ส่วนลด')}</span>
                                    <span className="text-red-600">-฿{formatPrice(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('Shipping', 'ค่าจัดส่ง')}</span>
                                <span>{order.shippingFee > 0 ? `฿${formatPrice(order.shippingFee)}` : t('Free', 'ฟรี')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                                <span>{t('Total', 'ยอดรวมทั้งหมด')}</span>
                                <span className="text-brand-yellow">฿{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('Customer information', 'ข้อมูลลูกค้า')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('Name', 'ชื่อ')}</p>
                                <p className="font-medium">{order.user.firstName} {order.user.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('Email', 'อีเมล')}</p>
                                <p className="font-medium">{order.user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t('Phone', 'เบอร์โทร')}</p>
                                <p className="font-medium">{order.user.phone || '-'}</p>
                            </div>
                        </div>

                        {order.address && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">{t('Shipping address', 'ที่อยู่จัดส่ง')}</p>
                                <p className="font-medium">{order.address.fullName}</p>
                                <p className="text-gray-600">
                                    {order.address.address}, {order.address.subDistrict}, {order.address.district},{' '}
                                    {order.address.province} {order.address.postalCode}
                                </p>
                                <p className="text-gray-600">{t('Phone', 'โทร')}: {order.address.phone}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('Update status', 'อัพเดทสถานะ')}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Status', 'สถานะ')}
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {language === 'th' ? opt.labelTh : opt.labelEn}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('Tracking number', 'เลข Tracking')}
                                </label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="TH123456789"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('Saving...', 'กำลังบันทึก...')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        {t('Save', 'บันทึก')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('Timeline', 'ไทม์ไลน์')}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{t('Order created', 'สร้างคำสั่งซื้อ')}</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            {order.shippedAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Truck className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                    <p className="font-medium text-gray-900">{t('Shipped', 'จัดส่งแล้ว')}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.shippedAt)}</p>
                                    </div>
                                </div>
                            )}
                            {order.deliveredAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                <p className="font-medium text-gray-900">{t('Delivered', 'ส่งถึงแล้ว')}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('Payment', 'การชำระเงิน')}
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('Method', 'วิธีชำระ')}</span>
                                <span className="font-medium">{order.paymentMethod || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('Status', 'สถานะ')}</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    order.paymentStatus === 'PAID'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.paymentStatus === 'PAID'
                                        ? t('Paid', 'ชำระแล้ว')
                                        : t('Pending payment', 'รอชำระ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </AdminGuard>
    );
}
