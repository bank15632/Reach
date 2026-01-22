"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser, PARTNER_LEVELS } from "@/context/UserContext";
import {
    ChevronLeft,
    Star,
    Gift,
    CheckCircle,
    Clock,
    Lock,
    Award,
    History,
    Check,
    X,
} from "lucide-react";

export default function PartnerRewardsPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile, getPartnerLevelInfo, claimPartnerReward } = useUser();
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const partnerInfo = userProfile?.partnerInfo;

    // Redirect if not partner
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/rewards");
            return;
        }
        if (!partnerInfo || partnerInfo.status !== "approved") {
            router.push("/affiliate/dashboard");
        }
    }, [isLoggedIn, partnerInfo, router]);

    const content = {
        en: {
            title: "Partner Rewards",
            subtitle: "Claim rewards based on your partner level",
            back: "Back to Dashboard",
            yourPoints: "Your Partner Points",
            currentLevel: "Current Level",
            pointsInfo: "Every ฿1 in sales = 0.01 points",
            rewards: "Available Rewards",
            level: "Level",
            required: "Required",
            reward: "Reward",
            claimReward: "Claim",
            claimed: "Claimed",
            locked: "Locked",
            history: "Claim History",
            noHistory: "No claim history yet",
            status: {
                pending: "Processing",
                approved: "Approved",
                completed: "Completed",
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
            title: "รางวัลพาร์ทเนอร์",
            subtitle: "แลกรางวัลตามระดับพาร์ทเนอร์ของคุณ",
            back: "กลับไปแดชบอร์ด",
            yourPoints: "คะแนนพาร์ทเนอร์ของคุณ",
            currentLevel: "ระดับปัจจุบัน",
            pointsInfo: "ทุกยอดขาย ฿1 = 0.01 คะแนน",
            rewards: "รางวัลที่สามารถแลกได้",
            level: "ระดับ",
            required: "ต้องการ",
            reward: "รางวัล",
            claimReward: "แลก",
            claimed: "แลกแล้ว",
            locked: "ล็อก",
            history: "ประวัติการแลก",
            noHistory: "ยังไม่มีประวัติการแลก",
            status: {
                pending: "กำลังดำเนินการ",
                approved: "อนุมัติแล้ว",
                completed: "สำเร็จ",
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

    const levelInfo = getPartnerLevelInfo();
    const partnerPoints = partnerInfo.partnerPoints || 0;
    const claimedLevels = partnerInfo.claimedLevels || [];
    const rewardClaims = partnerInfo.rewardClaims || [];

    // Calculate total rewards claimed
    const totalRewardsClaimed = rewardClaims.reduce((sum, claim) => sum + claim.rewardAmount, 0);

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
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>

                {/* Points Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-brand-yellow to-yellow-500 rounded-xl p-6 text-black mb-6"
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-5 h-5" />
                                <span className="text-black/70">{t.yourPoints}</span>
                            </div>
                            <p className="text-3xl font-bold">{partnerPoints.toFixed(2)}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-5 h-5" />
                                <span className="text-black/70">{t.currentLevel}</span>
                            </div>
                            <p className="text-3xl font-bold">Level {levelInfo.currentLevel}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Gift className="w-5 h-5" />
                                <span className="text-black/70">{language === "th" ? "รางวัลที่แลกแล้ว" : "Total Claimed"}</span>
                            </div>
                            <p className="text-3xl font-bold">฿{totalRewardsClaimed.toLocaleString()}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-black/60 text-sm">
                        💡 {t.pointsInfo}
                    </p>
                </motion.div>

                {/* Rewards List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-brand-yellow" />
                        {t.rewards}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">{t.level}</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">{t.required}</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">{t.reward}</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {PARTNER_LEVELS.map((level) => {
                                    const isUnlocked = partnerPoints >= level.pointsRequired;
                                    const isClaimed = claimedLevels.includes(level.level);
                                    const canClaim = isUnlocked && !isClaimed;

                                    return (
                                        <tr
                                            key={level.level}
                                            className={`border-b border-gray-100 ${!isUnlocked ? "opacity-50" : ""}`}
                                        >
                                            <td className="py-4 px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        isClaimed
                                                            ? "bg-green-100 text-green-600"
                                                            : isUnlocked
                                                            ? "bg-brand-yellow/20 text-brand-yellow"
                                                            : "bg-gray-100 text-gray-400"
                                                    }`}>
                                                        {isClaimed ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : isUnlocked ? (
                                                            <span className="font-bold text-sm">{level.level}</span>
                                                        ) : (
                                                            <Lock className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-gray-900">Level {level.level}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-gray-600">
                                                {level.pointsRequired.toLocaleString()} {language === "th" ? "คะแนน" : "points"}
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className="font-bold text-brand-yellow">
                                                    ฿{level.reward.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                {canClaim ? (
                                                    <button
                                                        onClick={() => handleClaimReward(level.level)}
                                                        className="px-4 py-2 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                                                    >
                                                        {t.claimReward}
                                                    </button>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        isClaimed
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                        {isClaimed ? t.claimed : t.locked}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Claim History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-brand-yellow" />
                        {t.history}
                    </h3>

                    {rewardClaims.length > 0 ? (
                        <div className="space-y-3">
                            {rewardClaims.map((claim) => (
                                <div
                                    key={claim.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            claim.status === "completed"
                                                ? "bg-green-100"
                                                : "bg-yellow-100"
                                        }`}>
                                            {claim.status === "completed" ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Level {claim.level}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(claim.claimedAt).toLocaleDateString(
                                                    language === "th" ? "th-TH" : "en-US",
                                                    { year: "numeric", month: "short", day: "numeric" }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            ฿{claim.rewardAmount.toLocaleString()}
                                        </p>
                                        <span className={`text-xs ${
                                            claim.status === "completed"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}>
                                            {t.status[claim.status as keyof typeof t.status] || t.status.pending}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">{t.noHistory}</p>
                    )}
                </motion.div>
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
