'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Eye,
    Users as UsersIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    User,
} from 'lucide-react';

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
    _count: {
        orders: number;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const ROLE_OPTIONS = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'USER', label: 'ผู้ใช้' },
    { value: 'PARTNER', label: 'พาร์ทเนอร์' },
    { value: 'ADMIN', label: 'แอดมิน' },
];

const ROLE_COLORS: Record<string, string> = {
    USER: 'bg-gray-100 text-gray-700',
    PARTNER: 'bg-blue-100 text-blue-700',
    ADMIN: 'bg-purple-100 text-purple-700',
};

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.set('search', search);
            if (role) params.set('role', role);

            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();

            if (res.ok) {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, role]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    };

    const getRoleLabel = (r: string) => {
        return ROLE_OPTIONS.find((opt) => opt.value === r)?.label || r;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">ผู้ใช้</h1>
                <p className="text-gray-500">จัดการผู้ใช้ทั้งหมดในระบบ</p>
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
                                placeholder="ค้นหาด้วยชื่อ หรืออีเมล..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                    </form>

                    {/* Role Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                        >
                            {ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
                        <p className="mt-2 text-gray-500">กำลังโหลด...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center">
                        <UsersIcon className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-gray-500">ไม่พบผู้ใช้</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        ผู้ใช้
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        อีเมล
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        คำสั่งซื้อ
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        สมัครเมื่อ
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {user.avatar ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.firstName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-brand-yellow text-black font-medium">
                                                            {user.firstName[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.rewardPoints} แต้ม
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-600">{user.email}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-600">
                                                {user._count.orders} รายการ
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(user.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
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
                            แสดง {(pagination.page - 1) * pagination.limit + 1} -{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} จาก{' '}
                            {pagination.total} รายการ
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
                                หน้า {pagination.page} / {pagination.totalPages}
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
    );
}
