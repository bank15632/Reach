'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Handshake,
    Gavel,
    Instagram,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { AdminPermissionKey, hasAdminPermission } from '@/lib/adminAccess';

const navItems: Array<{
    href: string;
    label: string;
    labelTh: string;
    icon: React.ElementType;
    permission: AdminPermissionKey;
}> = [
    { href: '/admin', label: 'Dashboard', labelTh: 'แดชบอร์ด', icon: LayoutDashboard, permission: 'VIEW_DASHBOARD' },
    { href: '/admin/products', label: 'Products', labelTh: 'สินค้า', icon: Package, permission: 'MANAGE_PRODUCTS' },
    { href: '/admin/orders', label: 'Orders', labelTh: 'คำสั่งซื้อ', icon: ShoppingCart, permission: 'MANAGE_ORDERS' },
    { href: '/admin/users', label: 'Users', labelTh: 'ผู้ใช้', icon: Users, permission: 'MANAGE_USERS' },
    { href: '/admin/partners', label: 'Partners', labelTh: 'พาร์ทเนอร์', icon: Handshake, permission: 'MANAGE_PARTNERS' },
    { href: '/admin/articles', label: 'Articles', labelTh: 'บทความ', icon: FileText, permission: 'MANAGE_ARTICLES' },
    { href: '/admin/instagram', label: 'Instagram', labelTh: 'อินสตาแกรม', icon: Instagram, permission: 'MANAGE_ARTICLES' },
    { href: '/admin/auctions', label: 'Auctions', labelTh: 'ประมูล', icon: Gavel, permission: 'MANAGE_AUCTIONS' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const { userProfile, isLoading, logout } = useUser();
    const router = useRouter();
    const t = (en: string, th: string) => (language === 'th' ? th : en);

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-xl">R</span>
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{t('Reach Admin', 'แอดมิน Reach')}</div>
                        <div className="text-xs text-gray-500">{t('Management Panel', 'แผงควบคุมระบบ')}</div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const canAccess = isLoading
                        ? true
                        : hasAdminPermission(
                            userProfile?.role,
                            userProfile?.adminPermissions,
                            item.permission
                        );

                    if (!canAccess) return null;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                active
                                    ? 'bg-brand-yellow text-black font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{t(item.label, item.labelTh)}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Language Switch */}
            <div className="px-4 pb-2">
                <button
                    type="button"
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <span>{t('Language', 'ภาษา')}</span>
                    <span className="font-semibold text-gray-900">{language.toUpperCase()}</span>
                </button>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('Log out', 'ออกจากระบบ')}</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Mobile Menu */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="lg:hidden fixed left-0 top-0 w-64 h-screen bg-white z-50 flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
