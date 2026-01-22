"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser, PARTNER_LEVELS } from "@/context/UserContext";
import {
    TrendingUp,
    MousePointer,
    ShoppingCart,
    Clock,
    ChevronRight,
    Award,
    BarChart3,
    ArrowUpRight,
    CreditCard,
    Tag,
    MessageCircle,
    Star,
    Gift,
    Check,
    X,
    Wallet,
    Info,
    DollarSign,
} from "lucide-react";

// Stat Card Component
function StatCard({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    suffix,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: "up" | "down" | "neutral";
    suffix?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {typeof value === "number" ? value.toLocaleString() : value}
                        {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
                    </p>
                    {change && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${
                            changeType === "up" ? "text-green-600" :
                            changeType === "down" ? "text-red-600" : "text-gray-500"
                        }`}>
                            {changeType === "up" && <ArrowUpRight className="w-4 h-4" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-yellow" />
                </div>
            </div>
        </motion.div>
    );
}

// Recent Transaction Row
function TransactionRow({
    date,
    type,
    amount,
    status,
    language,
}: {
    date: string;
    type: "sale" | "payout";
    amount: number;
    status: "completed" | "pending";
    language: "en" | "th";
}) {
    const typeLabel = type === "sale"
        ? (language === "th" ? "ยอดขาย" : "Sale")
        : (language === "th" ? "แลกรางวัล" : "Reward Claim");

    const statusLabel = status === "completed"
        ? (language === "th" ? "สำเร็จ" : "Completed")
        : (language === "th" ? "รอดำเนินการ" : "Pending");

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    type === "sale" ? "bg-green-100" : "bg-blue-100"
                }`}>
                    {type === "sale" ? (
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                    ) : (
                        <Gift className="w-5 h-5 text-blue-600" />
                    )}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{typeLabel}</p>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold ${type === "sale" ? "text-green-600" : "text-blue-600"}`}>
                    {type === "sale" ? "+" : ""}฿{amount.toLocaleString()}
                </p>
                <p className={`text-xs ${status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                    {statusLabel}
                </p>
            </div>
        </div>
    );
}

export default function PartnerDashboardPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile, approvePartner, getPartnerLevelInfo, claimPartnerReward } = useUser();
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const partnerInfo = userProfile?.partnerInfo;

    // Redirect if not logged in or not a partner
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/dashboard");
            return;
        }
        if (!partnerInfo) {
            router.push("/affiliate/register");
            return;
        }
        // Auto-approve for demo purposes after 2 seconds
        if (partnerInfo.status === "pending") {
            const timer = setTimeout(() => {
                approvePartner();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, partnerInfo, router, approvePartner]);

    const content = {
        en: {
            title: "Partner Dashboard",
            welcome: "Welcome back",
            pendingTitle: "Application Under Review",
            pendingMessage: "Your partner application is being reviewed. This usually takes 24-48 hours.",
            yourCode: "Your Affiliate Code",
            stats: {
                totalSales: "Total Sales",
                partnerPoints: "Partner Points",
                availableCommission: "Available Commission",
                clicks: "Total Clicks",
                conversions: "Conversions",
            },
            level: {
                title: "Partner Level & Rewards",
                currentLevel: "Current Level",
                points: "points",
                nextLevel: "Next Level",
                pointsToNext: "points to Level",
                claimReward: "Claim Reward",
                claimed: "Claimed",
                locked: "Locked",
                reward: "Reward",
                required: "Required",
            },
            transactions: {
                title: "Recent Activity",
                viewAll: "View All",
                noTransactions: "No activity yet",
            },
            quickActions: {
                title: "Quick Actions",
                withdraw: "Withdraw Commission",
                rewards: "Claim Rewards",
                manageCodes: "Manage Codes",
                support: "Contact Support",
            },
            modal: {
                title: "Claim Level Reward",
                confirmMessage: "You are about to claim the reward for Level",
                rewardAmount: "Reward Amount",
                confirm: "Confirm Claim",
                cancel: "Cancel",
                successTitle: "Reward Claimed!",
                successMessage: "Your reward request has been submitted and will be processed shortly.",
                close: "Close",
            },
        },
        th: {
            title: "แดชบอร์ดพาร์ทเนอร์",
            welcome: "ยินดีต้อนรับกลับ",
            pendingTitle: "กำลังรอการอนุมัติ",
            pendingMessage: "ใบสมัครพาร์ทเนอร์ของคุณกำลังอยู่ระหว่างการพิจารณา โดยปกติจะใช้เวลา 24-48 ชั่วโมง",
            yourCode: "โค้ดพาร์ทเนอร์ของคุณ",
            stats: {
                totalSales: "ยอดขายทั้งหมด",
                partnerPoints: "คะแนนพาร์ทเนอร์",
                availableCommission: "คอมมิชชั่นคงเหลือ",
                clicks: "จำนวนคลิก",
                conversions: "การซื้อ",
            },
            level: {
                title: "ระดับพาร์ทเนอร์ & รางวัล",
                currentLevel: "ระดับปัจจุบัน",
                points: "คะแนน",
                nextLevel: "ระดับถัดไป",
                pointsToNext: "คะแนนสู่ Level",
                claimReward: "แลกรางวัล",
                claimed: "แลกแล้ว",
                locked: "ยังไม่ปลดล็อก",
                reward: "รางวัล",
                required: "ต้องการ",
            },
            transactions: {
                title: "กิจกรรมล่าสุด",
                viewAll: "ดูทั้งหมด",
                noTransactions: "ยังไม่มีกิจกรรม",
            },
            quickActions: {
                title: "การดำเนินการด่วน",
                withdraw: "ถอนคอมมิชชั่น",
                rewards: "แลกรางวัล",
                manageCodes: "จัดการโค้ด",
                support: "ติดต่อซัพพอร์ต",
            },
            modal: {
                title: "แลกรางวัลระดับ",
                confirmMessage: "คุณกำลังจะแลกรางวัลสำหรับ Level",
                rewardAmount: "จำนวนเงินรางวัล",
                confirm: "ยืนยันการแลก",
                cancel: "ยกเลิก",
                successTitle: "แลกรางวัลสำเร็จ!",
                successMessage: "คำขอแลกรางวัลของคุณถูกส่งแล้วและจะดำเนินการในเร็วๆ นี้",
                close: "ปิด",
            },
        },
    };

    const t = language === "th" ? content.th : content.en;

    // Demo transactions
    const demoTransactions = [
        { date: "2024-01-15", type: "sale" as const, amount: 4500, status: "completed" as const },
        { date: "2024-01-14", type: "sale" as const, amount: 3200, status: "completed" as const },
        { date: "2024-01-12", type: "payout" as const, amount: 300, status: "completed" as const },
        { date: "2024-01-10", type: "sale" as const, amount: 1800, status: "pending" as const },
    ];

    const handleClaimReward = (level: number) => {
        setSelectedLevel(level);
        setShowClaimModal(true);
        setClaimSuccess(false);
    };

    const confirmClaim = () => {
        if (selectedLevel) {
            const success = claimPartnerReward(selectedLevel);
            if (success) {
                setClaimSuccess(true);
            }
        }
    };

    if (!isLoggedIn || !partnerInfo) {
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

    // Pending status view
    if (partnerInfo.status === "pending") {
        return (
            <main className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
                    >
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                            <Clock className="w-10 h-10 text-yellow-600 animate-pulse" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {t.pendingTitle}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {t.pendingMessage}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-500 mb-1">{t.yourCode}</p>
                            <p className="text-2xl font-bold text-brand-yellow">
                                {partnerInfo.affiliateCode}
                            </p>
                        </div>
                        <Link
                            href="/profile"
                            className="text-brand-yellow hover:underline text-sm"
                        >
                            {language === "th" ? "กลับไปโปรไฟล์" : "Back to Profile"}
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    const levelInfo = getPartnerLevelInfo();
    const partnerPoints = partnerInfo.partnerPoints || 0;
    const claimedLevels = partnerInfo.claimedLevels || [];
    const conversionRate = partnerInfo.clicks > 0
        ? ((partnerInfo.conversions / partnerInfo.clicks) * 100).toFixed(1)
        : "0";

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-gray-500">{t.welcome},</p>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {userProfile?.nickname || userProfile?.name}
                    </h1>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title={t.stats.totalSales}
                        value={`฿${partnerInfo.totalSales.toLocaleString()}`}
                        icon={TrendingUp}
                        change="+12%"
                        changeType="up"
                    />
                    <StatCard
                        title={t.stats.availableCommission}
                        value={`฿${(partnerInfo.availableCommission || 0).toLocaleString()}`}
                        icon={Wallet}
                        changeType="up"
                    />
                    <StatCard
                        title={t.stats.partnerPoints}
                        value={partnerPoints.toFixed(2)}
                        icon={Star}
                        suffix={t.level.points}
                    />
                    <StatCard
                        title={t.stats.conversions}
                        value={partnerInfo.conversions}
                        icon={ShoppingCart}
                        change={`${conversionRate}%`}
                        changeType="neutral"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Partner Level & Rewards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-brand-yellow" />
                                {t.level.title}
                            </h2>

                            {/* Current Level Display */}
                            <div className="bg-gradient-to-r from-brand-yellow to-yellow-500 rounded-xl p-4 text-black mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-black/70 text-sm">{t.level.currentLevel}</p>
                                        <p className="text-3xl font-bold">
                                            Level {levelInfo.currentLevel}
                                        </p>
                                        <p className="text-black/70 text-sm mt-1">
                                            {partnerPoints.toFixed(2)} {t.level.points}
                                        </p>
                                    </div>
                                    {levelInfo.nextLevel && (
                                        <div className="text-right">
                                            <p className="text-black/70 text-sm">{t.level.nextLevel}</p>
                                            <p className="font-bold">Level {levelInfo.nextLevel.level}</p>
                                            <p className="text-black/70 text-sm">
                                                {(levelInfo.nextLevel.pointsRequired - partnerPoints).toFixed(2)} {t.level.pointsToNext} {levelInfo.nextLevel.level}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {levelInfo.nextLevel && (
                                    <div className="mt-4 bg-black/20 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-white h-full rounded-full transition-all"
                                            style={{ width: `${levelInfo.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Level Rewards Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {PARTNER_LEVELS.map((level) => {
                                    const isUnlocked = partnerPoints >= level.pointsRequired;
                                    const isClaimed = claimedLevels.includes(level.level);
                                    const canClaim = isUnlocked && !isClaimed;

                                    return (
                                        <div
                                            key={level.level}
                                            className={`relative rounded-lg p-3 border-2 transition-all ${
                                                isUnlocked
                                                    ? isClaimed
                                                        ? "border-green-300 bg-green-50"
                                                        : "border-brand-yellow bg-brand-yellow/5"
                                                    : "border-gray-200 bg-gray-50 opacity-60"
                                            }`}
                                        >
                                            {isClaimed && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <p className="font-bold text-gray-900">Lv.{level.level}</p>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {level.pointsRequired} {t.level.points}
                                                </p>
                                                <p className="text-sm font-bold text-brand-yellow">
                                                    ฿{level.reward.toLocaleString()}
                                                </p>
                                                {canClaim ? (
                                                    <button
                                                        onClick={() => handleClaimReward(level.level)}
                                                        className="mt-2 w-full py-1 text-xs font-bold bg-brand-yellow text-black rounded hover:bg-yellow-400 transition-colors"
                                                    >
                                                        {t.level.claimReward}
                                                    </button>
                                                ) : (
                                                    <p className={`mt-2 text-xs ${isClaimed ? "text-green-600" : "text-gray-400"}`}>
                                                        {isClaimed ? t.level.claimed : t.level.locked}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Points Info - small icon tooltip */}
                            <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-400">
                                <button
                                    onClick={() => alert(language === "th"
                                        ? "ทุกยอดขาย ฿1 = 0.01 คะแนนพาร์ทเนอร์\nทุกยอดขาย ฿1 = ฿0.10 คอมมิชชั่น (10%)"
                                        : "Every ฿1 in sales = 0.01 partner points\nEvery ฿1 in sales = ฿0.10 commission (10%)"
                                    )}
                                    className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                                >
                                    <Info className="w-3 h-3" />
                                    <span>{language === "th" ? "วิธีคำนวณ" : "How it works"}</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Transactions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-brand-yellow" />
                                    {t.transactions.title}
                                </h2>
                                <Link
                                    href="/affiliate/transactions"
                                    className="text-sm text-brand-yellow hover:underline flex items-center gap-1"
                                >
                                    {t.transactions.viewAll}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div>
                                {demoTransactions.map((tx, i) => (
                                    <TransactionRow
                                        key={i}
                                        date={tx.date}
                                        type={tx.type}
                                        amount={tx.amount}
                                        status={tx.status}
                                        language={language}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                {t.quickActions.title}
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    href="/affiliate/withdraw"
                                    className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-gray-900">{t.quickActions.withdraw}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                                <Link
                                    href="/affiliate/rewards"
                                    className="w-full flex items-center justify-between p-3 bg-brand-yellow/10 rounded-lg hover:bg-brand-yellow/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Gift className="w-5 h-5 text-brand-yellow" />
                                        <span className="font-medium text-gray-900">{t.quickActions.rewards}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                                <Link
                                    href="/affiliate/codes"
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">{t.quickActions.manageCodes}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">{t.quickActions.support}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Reward Claims History */}
                        {partnerInfo.rewardClaims && partnerInfo.rewardClaims.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-brand-yellow" />
                                    {language === "th" ? "ประวัติแลกรางวัล" : "Reward History"}
                                </h2>
                                <div className="space-y-3">
                                    {partnerInfo.rewardClaims.slice(0, 3).map((claim) => (
                                        <div key={claim.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">Level {claim.level}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(claim.claimedAt).toLocaleDateString(language === "th" ? "th-TH" : "en-US")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">฿{claim.rewardAmount.toLocaleString()}</p>
                                                <p className={`text-xs ${claim.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                                                    {claim.status === "completed"
                                                        ? (language === "th" ? "สำเร็จ" : "Completed")
                                                        : (language === "th" ? "รอดำเนินการ" : "Pending")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Claim Reward Modal */}
            <AnimatePresence>
                {showClaimModal && selectedLevel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowClaimModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!claimSuccess ? (
                                <>
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {t.modal.title} {selectedLevel}
                                            </h3>
                                            <button
                                                onClick={() => setShowClaimModal(false)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-center mb-6">
                                            <div className="w-20 h-20 mx-auto bg-brand-yellow/10 rounded-full flex items-center justify-center mb-4">
                                                <Gift className="w-10 h-10 text-brand-yellow" />
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                {t.modal.confirmMessage} {selectedLevel}
                                            </p>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500">{t.modal.rewardAmount}</p>
                                                <p className="text-3xl font-bold text-green-600">
                                                    ฿{PARTNER_LEVELS.find(l => l.level === selectedLevel)?.reward.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-gray-100 flex gap-3">
                                        <button
                                            onClick={() => setShowClaimModal(false)}
                                            className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            {t.modal.cancel}
                                        </button>
                                        <button
                                            onClick={confirmClaim}
                                            className="flex-1 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                        >
                                            {t.modal.confirm}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 text-center">
                                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Check className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {t.modal.successTitle}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t.modal.successMessage}
                                    </p>
                                    <button
                                        onClick={() => setShowClaimModal(false)}
                                        className="w-full py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                    >
                                        {t.modal.close}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
