'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Plus
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockProducts: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-4 h-4" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">ยินดีต้อนรับสู่ Reach Admin</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    เพิ่มสินค้า
                </Link>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="รายได้ทั้งหมด"
                        value={formatCurrency(stats.totalRevenue)}
                        icon={DollarSign}
                        color="bg-green-100 text-green-600"
                    />
                    <StatCard
                        title="คำสั่งซื้อทั้งหมด"
                        value={stats.totalOrders}
                        icon={ShoppingCart}
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        title="สินค้าทั้งหมด"
                        value={stats.totalProducts}
                        icon={Package}
                        color="bg-purple-100 text-purple-600"
                    />
                    <StatCard
                        title="ผู้ใช้ทั้งหมด"
                        value={stats.totalUsers}
                        icon={Users}
                        color="bg-orange-100 text-orange-600"
                    />
                </div>
            )}

            {/* Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">คำสั่งซื้อรอดำเนินการ</h2>
                        <Link href="/admin/orders?status=PENDING" className="text-sm text-brand-yellow hover:underline">
                            ดูทั้งหมด
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                            <p className="text-sm text-gray-500">คำสั่งซื้อรอยืนยัน</p>
                        </div>
                    </div>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">สินค้าใกล้หมด</h2>
                        <Link href="/admin/products?lowStock=true" className="text-sm text-brand-yellow hover:underline">
                            ดูทั้งหมด
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stats.lowStockProducts}</p>
                            <p className="text-sm text-gray-500">สินค้าที่มีสต็อก {'<'} 5</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/products/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <Package className="w-8 h-8 text-gray-600" />
                        <span className="text-sm text-gray-700">เพิ่มสินค้า</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <ShoppingCart className="w-8 h-8 text-gray-600" />
                        <span className="text-sm text-gray-700">ดู Orders</span>
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <Users className="w-8 h-8 text-gray-600" />
                        <span className="text-sm text-gray-700">จัดการผู้ใช้</span>
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <TrendingUp className="w-8 h-8 text-gray-600" />
                        <span className="text-sm text-gray-700">ดูหน้าเว็บ</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
