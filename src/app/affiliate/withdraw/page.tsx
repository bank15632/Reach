"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import {
    ChevronLeft,
    Wallet,
    CreditCard,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Loader2,
    History,
} from "lucide-react";

// Thai banks list
const thaiBanks = [
    { code: "BBL", name: "Bangkok Bank", nameTh: "ธนาคารกรุงเทพ" },
    { code: "KBANK", name: "Kasikornbank", nameTh: "ธนาคารกสิกรไทย" },
    { code: "KTB", name: "Krungthai Bank", nameTh: "ธนาคารกรุงไทย" },
    { code: "SCB", name: "Siam Commercial Bank", nameTh: "ธนาคารไทยพาณิชย์" },
    { code: "BAY", name: "Bank of Ayudhya (Krungsri)", nameTh: "ธนาคารกรุงศรีอยุธยา" },
    { code: "TMB", name: "TMBThanachart Bank", nameTh: "ธนาคารทหารไทยธนชาต" },
    { code: "GSB", name: "Government Savings Bank", nameTh: "ธนาคารออมสิน" },
    { code: "CIMB", name: "CIMB Thai", nameTh: "ธนาคารซีไอเอ็มบีไทย" },
];

export default function WithdrawPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile, requestWithdrawal } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [amount, setAmount] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");

    const partnerInfo = userProfile?.partnerInfo;
    const minWithdraw = 500;
    const availableCommission = partnerInfo?.availableCommission || 0;

    // Redirect if not partner
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/withdraw");
            return;
        }
        if (!partnerInfo || partnerInfo.status !== "approved") {
            router.push("/affiliate/dashboard");
        }
    }, [isLoggedIn, partnerInfo, router]);

    // Pre-fill bank info if available
    useEffect(() => {
        if (partnerInfo?.bankInfo) {
            setBankName(partnerInfo.bankInfo.bankName);
            setAccountNumber(partnerInfo.bankInfo.accountNumber);
            setAccountName(partnerInfo.bankInfo.accountName);
        }
    }, [partnerInfo]);

    const content = {
        en: {
            title: "Withdraw Commission",
            subtitle: "Withdraw your available commission",
            back: "Back to Dashboard",
            available: "Available Commission",
            minWithdraw: "Minimum withdrawal",
            amount: "Withdrawal Amount",
            amountPlaceholder: "Enter amount",
            withdrawAll: "Withdraw All",
            bankDetails: "Bank Details",
            selectBank: "Select Bank",
            accountNumber: "Account Number",
            accountNumberPlaceholder: "Enter your account number",
            accountName: "Account Name",
            accountNamePlaceholder: "Enter account holder name",
            submit: "Submit Request",
            submitting: "Processing...",
            history: "Withdrawal History",
            noHistory: "No withdrawal history yet",
            status: {
                pending: "Pending",
                approved: "Approved",
                rejected: "Rejected",
                completed: "Completed",
            },
            success: {
                title: "Request Submitted!",
                message: "Your withdrawal request has been submitted. We'll process it within 1-3 business days.",
                backToDashboard: "Back to Dashboard",
            },
            errors: {
                required: "This field is required",
                minAmount: `Minimum withdrawal is ฿${minWithdraw}`,
                maxAmount: "Amount exceeds available balance",
                invalidAccount: "Please enter a valid account number",
            },
            commissionInfo: "Commission from sales + Level rewards",
        },
        th: {
            title: "ถอนคอมมิชชั่น",
            subtitle: "ถอนคอมมิชชั่นที่มีอยู่ของคุณ",
            back: "กลับไปแดชบอร์ด",
            available: "คอมมิชชั่นคงเหลือ",
            minWithdraw: "ยอดถอนขั้นต่ำ",
            amount: "จำนวนเงินที่ต้องการถอน",
            amountPlaceholder: "ใส่จำนวนเงิน",
            withdrawAll: "ถอนทั้งหมด",
            bankDetails: "ข้อมูลบัญชีธนาคาร",
            selectBank: "เลือกธนาคาร",
            accountNumber: "เลขที่บัญชี",
            accountNumberPlaceholder: "ใส่เลขที่บัญชีของคุณ",
            accountName: "ชื่อบัญชี",
            accountNamePlaceholder: "ใส่ชื่อเจ้าของบัญชี",
            submit: "ส่งคำขอ",
            submitting: "กำลังดำเนินการ...",
            history: "ประวัติการถอนเงิน",
            noHistory: "ยังไม่มีประวัติการถอนเงิน",
            status: {
                pending: "รอดำเนินการ",
                approved: "อนุมัติแล้ว",
                rejected: "ถูกปฏิเสธ",
                completed: "สำเร็จ",
            },
            success: {
                title: "ส่งคำขอแล้ว!",
                message: "คำขอถอนเงินของคุณถูกส่งแล้ว เราจะดำเนินการภายใน 1-3 วันทำการ",
                backToDashboard: "กลับไปแดชบอร์ด",
            },
            errors: {
                required: "กรุณากรอกข้อมูลนี้",
                minAmount: `ยอดถอนขั้นต่ำคือ ฿${minWithdraw}`,
                maxAmount: "จำนวนเงินเกินยอดคงเหลือ",
                invalidAccount: "กรุณาใส่เลขบัญชีที่ถูกต้อง",
            },
            commissionInfo: "คอมมิชชั่นจากการขาย + รางวัล Level",
        },
    };

    const t = language === "th" ? content.th : content.en;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const amountNum = parseFloat(amount);

        if (!amount) {
            newErrors.amount = t.errors.required;
        } else if (amountNum < minWithdraw) {
            newErrors.amount = t.errors.minAmount;
        } else if (amountNum > availableCommission) {
            newErrors.amount = t.errors.maxAmount;
        }

        if (!bankName) {
            newErrors.bankName = t.errors.required;
        }

        if (!accountNumber) {
            newErrors.accountNumber = t.errors.required;
        } else if (!/^\d{10,15}$/.test(accountNumber.replace(/-/g, ""))) {
            newErrors.accountNumber = t.errors.invalidAccount;
        }

        if (!accountName) {
            newErrors.accountName = t.errors.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        requestWithdrawal(parseFloat(amount), {
            bankName,
            accountNumber,
            accountName,
        });

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleWithdrawAll = () => {
        if (availableCommission >= minWithdraw) {
            setAmount(availableCommission.toString());
        }
    };

    const statusConfig = {
        pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
        approved: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-100" },
        rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
        completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
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

    if (isSubmitted) {
        return (
            <main className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
                    >
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {t.success.title}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {t.success.message}
                        </p>
                        <Link
                            href="/affiliate/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            {t.success.backToDashboard}
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
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

                {/* Available Balance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="w-6 h-6" />
                        <span className="text-white/80">{t.available}</span>
                    </div>
                    <p className="text-4xl font-bold">
                        ฿{availableCommission.toLocaleString()}
                    </p>
                    <p className="text-white/60 text-sm mt-2">
                        {t.minWithdraw}: ฿{minWithdraw.toLocaleString()}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                        {t.commissionInfo}
                    </p>
                </motion.div>

                {/* Withdrawal Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    {/* Amount */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.amount}
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={t.amountPlaceholder}
                                    min={minWithdraw}
                                    max={availableCommission}
                                    className={`w-full pl-8 pr-3 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                        errors.amount ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleWithdrawAll}
                                disabled={availableCommission < minWithdraw}
                                className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.withdrawAll}
                            </button>
                        </div>
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    {/* Bank Details */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-brand-yellow" />
                            {t.bankDetails}
                        </h3>

                        <div className="space-y-4">
                            {/* Bank Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.selectBank}
                                </label>
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className={`w-full px-3 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                        errors.bankName ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">{language === "th" ? "เลือกธนาคาร..." : "Select bank..."}</option>
                                    {thaiBanks.map((bank) => (
                                        <option key={bank.code} value={bank.code}>
                                            {language === "th" ? bank.nameTh : bank.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.bankName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                                )}
                            </div>

                            {/* Account Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.accountNumber}
                                </label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                    placeholder={t.accountNumberPlaceholder}
                                    maxLength={15}
                                    className={`w-full px-3 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                        errors.accountNumber ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.accountNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                                )}
                            </div>

                            {/* Account Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.accountName}
                                </label>
                                <input
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder={t.accountNamePlaceholder}
                                    className={`w-full px-3 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
                                        errors.accountName ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.accountName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || availableCommission < minWithdraw}
                        className="w-full mt-6 py-4 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.submitting}
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                {t.submit}
                            </>
                        )}
                    </button>
                </motion.form>

                {/* Withdrawal History */}
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

                    {partnerInfo.withdrawals && partnerInfo.withdrawals.length > 0 ? (
                        <div className="space-y-3">
                            {partnerInfo.withdrawals.map((withdrawal) => {
                                const status = statusConfig[withdrawal.status];
                                const StatusIcon = status.icon;
                                return (
                                    <div
                                        key={withdrawal.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${status.bg} flex items-center justify-center`}>
                                                <StatusIcon className={`w-5 h-5 ${status.color}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    ฿{withdrawal.amount.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(withdrawal.requestedAt).toLocaleDateString(
                                                        language === "th" ? "th-TH" : "en-US"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                                            {t.status[withdrawal.status]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">{t.noHistory}</p>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
