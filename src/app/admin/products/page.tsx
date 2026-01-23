'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    ChevronLeft,
    ChevronRight,
    Filter,
    X
} from 'lucide-react';

interface Product {
    id: string;
    sku: string;
    name: string;
    nameTh: string;
    price: number;
    salePrice: number | null;
    category: string;
    brand: string | null;
    images: string[];
    inStock: boolean;
    stockCount: number;
    featured: boolean;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const CATEGORIES = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'RACKETS', label: 'ไม้แบด' },
    { value: 'SHOES', label: 'รองเท้า' },
    { value: 'SPORTSWEAR', label: 'เสื้อผ้ากีฬา' },
    { value: 'SUPPLEMENTS', label: 'อาหารเสริม' },
    { value: 'ACCESSORIES', label: 'อุปกรณ์เสริม' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.set('search', search);
            if (category) params.set('category', category);

            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();

            if (res.ok) {
                setProducts(data.products);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [pagination.page, category]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchProducts();
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p.id !== deleteId));
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price);
    };

    const getCategoryLabel = (cat: string) => {
        return CATEGORIES.find((c) => c.value === cat)?.label || cat;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">สินค้า</h1>
                    <p className="text-gray-500">จัดการสินค้าทั้งหมดในร้าน</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    เพิ่มสินค้า
                </Link>
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
                                placeholder="ค้นหาสินค้า..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                            />
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full mx-auto" />
                        <p className="mt-2 text-gray-500">กำลังโหลด...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-gray-500">ไม่พบสินค้า</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        สินค้า
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        หมวดหมู่
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        ราคา
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        สต็อก
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        สถานะ
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product, index) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {product.images[0] ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {product.nameTh}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU: {product.sku}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                                                {getCategoryLabel(product.category)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {product.salePrice ? (
                                                <div>
                                                    <p className="font-medium text-red-600">
                                                        ฿{formatPrice(product.salePrice)}
                                                    </p>
                                                    <p className="text-sm text-gray-400 line-through">
                                                        ฿{formatPrice(product.price)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-900">
                                                    ฿{formatPrice(product.price)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`font-medium ${
                                                    product.stockCount < 5
                                                        ? 'text-red-600'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                {product.stockCount}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                {product.inStock ? (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs w-fit">
                                                        มีสินค้า
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs w-fit">
                                                        หมด
                                                    </span>
                                                )}
                                                {product.featured && (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs w-fit">
                                                        แนะนำ
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-gray-500 hover:text-brand-yellow hover:bg-yellow-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(product.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
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

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                ยืนยันการลบ
                            </h3>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'กำลังลบ...' : 'ลบสินค้า'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
