'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    ShoppingCart,
    Award,
    User,
} from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
}

interface PartnerInfo {
    id: string;
    affiliateCode: string;
    status: string;
    totalCommission: number;
    totalSales: number;
    totalOrders: number;
}

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    role: string;
    rewardPoints: number;
    createdAt: string;
    orders: Order[];
    partnerInfo: PartnerInfo | null;
    _count: {
        orders: number;
    };
}

const ROLE_OPTIONS = [
    { value: 'USER', label: 'ผู้ใช้' },
    { value: 'PARTNER', label: 'พาร์ทเนอร์' },
    { value: 'ADMIN', label: 'แอดมิน' },
];

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

export default function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'User not found');
                }

                setUser(data.user);
                setNewRole(data.user.role);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [id]);

    const handleUpdateRole = async () => {
        if (!user || newRole === user.role) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาด');
            }

            setUser((prev) => prev ? { ...prev, role: newRole } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price);
    };

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
                    <p className="mt-2 text-gray-500">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">ไม่พบผู้ใช้</p>
                <Link href="/admin/users" className="text-brand-yellow hover:underline mt-2 inline-block">
                    กลับไปหน้ารายการ
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/users"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
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
                    {/* User Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            ข้อมูลผู้ใช้
                        </h2>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                                {user.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.avatar}
                                        alt={user.firstName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-brand-yellow text-black text-2xl font-bold">
                                        {user.firstName[0]}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-gray-500">{user.email}</p>
                                <p className="text-sm text-gray-400">
                                    สมาชิกตั้งแต่ {formatDate(user.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="text-sm">คำสั่งซื้อทั้งหมด</span>
                                </div>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {user._count.orders}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Award className="w-4 h-4" />
                                    <span className="text-sm">แต้มสะสม</span>
                                </div>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatPrice(user.rewardPoints)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            คำสั่งซื้อล่าสุด
                        </h2>
                        {user.orders.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">ยังไม่มีคำสั่งซื้อ</p>
                        ) : (
                            <div className="space-y-3">
                                {user.orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-mono text-sm font-medium text-gray-900">
                                                #{order.orderNumber}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                ฿{formatPrice(order.total)}
                                            </p>
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Partner Info */}
                    {user.partnerInfo && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                ข้อมูลพาร์ทเนอร์
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 mb-1">รหัสพาร์ทเนอร์</p>
                                    <p className="font-mono font-semibold text-blue-900">
                                        {user.partnerInfo.affiliateCode}
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-600 mb-1">ค่าคอมมิชชั่น</p>
                                    <p className="font-semibold text-green-900">
                                        ฿{formatPrice(user.partnerInfo.totalCommission)}
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-600 mb-1">ยอดขายทั้งหมด</p>
                                    <p className="font-semibold text-purple-900">
                                        ฿{formatPrice(user.partnerInfo.totalSales)}
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-orange-600 mb-1">จำนวน Orders</p>
                                    <p className="font-semibold text-orange-900">
                                        {user.partnerInfo.totalOrders}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Change Role */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            เปลี่ยน Role
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                >
                                    {ROLE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleUpdateRole}
                                disabled={saving || newRole === user.role}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        บันทึก
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            ข้อมูลติดต่อ
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">อีเมล</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">เบอร์โทร</p>
                                <p className="font-medium">{user.phone || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
