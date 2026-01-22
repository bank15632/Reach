"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import {
    ChevronLeft,
    ShoppingCart,
    CreditCard,
    TrendingUp,
    Filter,
    Download,
    Calendar,
} from "lucide-react";

// Transaction type
interface Transaction {
    id: string;
    date: string;
    type: "sale" | "payout";
    amount: number;
    status: "completed" | "pending";
    description?: string;
    orderId?: string;
}

export default function TransactionsPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile } = useUser();

    const partnerInfo = userProfile?.partnerInfo;

    // Redirect if not partner
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/transactions");
            return;
        }
        if (!partnerInfo || partnerInfo.status !== "approved") {
            router.push("/affiliate/dashboard");
        }
    }, [isLoggedIn, partnerInfo, router]);

    const content = {
        en: {
            title: "Transaction History",
            subtitle: "View all your commission earnings and payouts",
            back: "Back to Dashboard",
            filter: "Filter",
            export: "Export",
            all: "All",
            sales: "Sales",
            payouts: "Payouts",
            noTransactions: "No transactions yet",
            noTransactionsDesc: "Your commission earnings and payouts will appear here",
            transaction: {
                sale: "Commission Earned",
                payout: "Payout",
                completed: "Completed",
                pending: "Pending",
                order: "Order",
            },
            summary: {
                totalEarned: "Total Earned",
                totalPaid: "Total Paid",
                pending: "Pending",
            },
        },
        th: {
            title: "ประวัติรายการ",
            subtitle: "ดูรายการคอมมิชชั่นและการถอนเงินทั้งหมดของคุณ",
            back: "กลับไปแดชบอร์ด",
            filter: "กรอง",
            export: "ส่งออก",
            all: "ทั้งหมด",
            sales: "การขาย",
            payouts: "การถอน",
            noTransactions: "ยังไม่มีรายการ",
            noTransactionsDesc: "รายการคอมมิชชั่นและการถอนเงินจะแสดงที่นี่",
            transaction: {
                sale: "รับคอมมิชชั่น",
                payout: "ถอนเงิน",
                completed: "สำเร็จ",
                pending: "รอดำเนินการ",
                order: "ออเดอร์",
            },
            summary: {
                totalEarned: "รายได้ทั้งหมด",
                totalPaid: "จ่ายแล้ว",
                pending: "รอจ่าย",
            },
        },
    };

    const t = language === "th" ? content.th : content.en;

    // Demo transactions - in real app this would come from API
    const demoTransactions: Transaction[] = [
        { id: "TXN001", date: "2024-01-15", type: "sale", amount: 450, status: "completed", orderId: "ORD-12345" },
        { id: "TXN002", date: "2024-01-14", type: "sale", amount: 320, status: "completed", orderId: "ORD-12344" },
        { id: "TXN003", date: "2024-01-12", type: "payout", amount: 2500, status: "completed" },
        { id: "TXN004", date: "2024-01-10", type: "sale", amount: 180, status: "pending", orderId: "ORD-12340" },
        { id: "TXN005", date: "2024-01-08", type: "sale", amount: 560, status: "completed", orderId: "ORD-12335" },
        { id: "TXN006", date: "2024-01-05", type: "sale", amount: 890, status: "completed", orderId: "ORD-12330" },
        { id: "TXN007", date: "2024-01-03", type: "payout", amount: 1500, status: "completed" },
        { id: "TXN008", date: "2024-01-01", type: "sale", amount: 220, status: "completed", orderId: "ORD-12320" },
    ];

    if (!isLoggedIn || !partnerInfo || partnerInfo.status !== "approved") {
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

    // Calculate summary
    const totalSales = demoTransactions
        .filter(tx => tx.type === "sale" && tx.status === "completed")
        .reduce((sum, tx) => sum + tx.amount, 0);
    const totalPayouts = demoTransactions
        .filter(tx => tx.type === "payout" && tx.status === "completed")
        .reduce((sum, tx) => sum + tx.amount, 0);
    const pendingAmount = demoTransactions
        .filter(tx => tx.status === "pending")
        .reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/affiliate/dashboard"
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-brand-yellow transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {t.back}
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                            <p className="text-gray-600 mt-1">{t.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-4"
                    >
                        <p className="text-sm text-gray-500">{t.summary.totalEarned}</p>
                        <p className="text-xl font-bold text-green-600">฿{totalSales.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white rounded-xl shadow-sm p-4"
                    >
                        <p className="text-sm text-gray-500">{t.summary.totalPaid}</p>
                        <p className="text-xl font-bold text-gray-900">฿{totalPayouts.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-4"
                    >
                        <p className="text-sm text-gray-500">{t.summary.pending}</p>
                        <p className="text-xl font-bold text-yellow-600">฿{pendingAmount.toLocaleString()}</p>
                    </motion.div>
                </div>

                {/* Transactions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                    {/* List Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">{t.title}</h2>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                                {t.filter}
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                                {t.export}
                            </button>
                        </div>
                    </div>

                    {/* Transactions */}
                    {demoTransactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.noTransactions}</h3>
                            <p className="text-gray-500">{t.noTransactionsDesc}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {demoTransactions.map((tx, index) => (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            tx.type === "sale" ? "bg-green-100" : "bg-blue-100"
                                        }`}>
                                            {tx.type === "sale" ? (
                                                <ShoppingCart className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <CreditCard className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {tx.type === "sale" ? t.transaction.sale : t.transaction.payout}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {new Date(tx.date).toLocaleDateString(
                                                        language === "th" ? "th-TH" : "en-US",
                                                        { year: "numeric", month: "short", day: "numeric" }
                                                    )}
                                                </span>
                                                {tx.orderId && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{t.transaction.order}: {tx.orderId}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${
                                            tx.type === "sale" ? "text-green-600" : "text-gray-900"
                                        }`}>
                                            {tx.type === "sale" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            tx.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {tx.status === "completed" ? t.transaction.completed : t.transaction.pending}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
