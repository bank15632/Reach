"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser, Order, OrderStatus } from "@/context/UserContext";
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ShoppingBag,
    Gift,
    ChevronRight,
} from "lucide-react";

type TabType = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export default function OrdersPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, orders } = useUser();
    const [activeTab, setActiveTab] = useState<TabType>("all");

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router]);

    const content = {
        en: {
            title: "My Orders",
            tabs: {
                all: "All",
                pending: "Pending",
                processing: "Processing",
                shipped: "Shipped",
                delivered: "Delivered",
                cancelled: "Cancelled",
            },
            status: {
                pending: "Pending Payment",
                processing: "Processing",
                shipped: "Shipped",
                delivered: "Delivered",
                cancelled: "Cancelled",
            },
            orderType: {
                purchase: "Purchase",
                redemption: "Reward Redemption",
            },
            orderId: "Order ID",
            orderDate: "Order Date",
            trackingNumber: "Tracking",
            total: "Total",
            points: "points",
            items: "items",
            viewDetails: "View Details",
            noOrders: "No orders yet",
            noOrdersDesc: "Your order history will appear here",
            startShopping: "Start Shopping",
            back: "Back to Profile",
        },
        th: {
            title: "คำสั่งซื้อของฉัน",
            tabs: {
                all: "ทั้งหมด",
                pending: "รอชำระ",
                processing: "กำลังจัดเตรียม",
                shipped: "กำลังจัดส่ง",
                delivered: "ได้รับแล้ว",
                cancelled: "ยกเลิก",
            },
            status: {
                pending: "รอชำระเงิน",
                processing: "กำลังจัดเตรียม",
                shipped: "กำลังจัดส่ง",
                delivered: "ได้รับแล้ว",
                cancelled: "ยกเลิกแล้ว",
            },
            orderType: {
                purchase: "สั่งซื้อ",
                redemption: "แลกของรางวัล",
            },
            orderId: "รหัสคำสั่งซื้อ",
            orderDate: "วันที่สั่ง",
            trackingNumber: "เลขพัสดุ",
            total: "รวม",
            points: "คะแนน",
            items: "รายการ",
            viewDetails: "ดูรายละเอียด",
            noOrders: "ยังไม่มีคำสั่งซื้อ",
            noOrdersDesc: "ประวัติการสั่งซื้อจะแสดงที่นี่",
            startShopping: "เริ่มช้อปปิ้ง",
            back: "กลับไปโปรไฟล์",
        },
    };

    const t = language === "th" ? content.th : content.en;

    const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bgColor: string }> = {
        pending: { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
        processing: { icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" },
        shipped: { icon: Truck, color: "text-purple-600", bgColor: "bg-purple-100" },
        delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
        cancelled: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
    };

    const tabs: { key: TabType; label: string }[] = [
        { key: "all", label: t.tabs.all },
        { key: "pending", label: t.tabs.pending },
        { key: "processing", label: t.tabs.processing },
        { key: "shipped", label: t.tabs.shipped },
        { key: "delivered", label: t.tabs.delivered },
        { key: "cancelled", label: t.tabs.cancelled },
    ];

    const filteredOrders = activeTab === "all"
        ? orders
        : orders.filter(order => order.status === activeTab);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (language === "th") {
            return date.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        }
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getOrderCount = (status: TabType) => {
        if (status === "all") return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    if (!isLoggedIn) {
        return (
            <main className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-screen">
                    <div className="text-center text-gray-500">
                        {language === "th" ? "กำลังโหลด..." : "Loading..."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/profile"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
                    <div className="flex min-w-max">
                        {tabs.map((tab) => {
                            const count = getOrderCount(tab.key);
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium transition-colors relative ${
                                        activeTab === tab.key
                                            ? "text-brand-yellow"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                                            activeTab === tab.key
                                                ? "bg-brand-yellow text-black"
                                                : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                    {activeTab === tab.key && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => {
                            const StatusIcon = statusConfig[order.status].icon;
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${statusConfig[order.status].bgColor}`}>
                                                {order.type === "purchase" ? (
                                                    <ShoppingBag className={`w-4 h-4 ${statusConfig[order.status].color}`} />
                                                ) : (
                                                    <Gift className={`w-4 h-4 ${statusConfig[order.status].color}`} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {order.type === "purchase" ? t.orderType.purchase : t.orderType.redemption}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t.orderId}: {order.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig[order.status].bgColor}`}>
                                            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig[order.status].color}`} />
                                            <span className={`text-xs font-medium ${statusConfig[order.status].color}`}>
                                                {t.status[order.status]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {/* Item Images */}
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 overflow-hidden"
                                                    >
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-gray-500">
                                                            +{order.items.length - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {language === "th" ? order.items[0].nameTh : order.items[0].name}
                                                    {order.items.length > 1 && (
                                                        <span className="text-gray-500">
                                                            {" "}+{order.items.length - 1} {t.items}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {t.orderDate}: {formatDate(order.createdAt)}
                                                </p>
                                                {order.trackingNumber && (
                                                    <p className="text-xs text-gray-500">
                                                        {t.trackingNumber}: {order.trackingNumber}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div className="text-right">
                                                {order.totalPrice !== undefined && (
                                                    <p className="text-sm font-bold text-gray-900">
                                                        ฿{order.totalPrice.toLocaleString()}
                                                    </p>
                                                )}
                                                {order.totalPoints !== undefined && (
                                                    <p className="text-sm font-bold text-brand-yellow">
                                                        {order.totalPoints.toLocaleString()} {t.points}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className="px-4 py-2 bg-gray-50 flex items-center justify-end">
                                        <button className="flex items-center gap-1 text-sm text-brand-yellow font-medium hover:underline">
                                            {t.viewDetails}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t.noOrders}</h3>
                        <p className="text-gray-500 mb-6">{t.noOrdersDesc}</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {t.startShopping}
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
