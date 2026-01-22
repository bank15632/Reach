"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser, PartnerCode } from "@/context/UserContext";
import { products as racketProducts, shoeProducts, sportswearProducts } from "@/data/productData";
import {
    ChevronLeft,
    Plus,
    Minus,
    Copy,
    Check,
    Trash2,
    Edit3,
    X,
    Calendar,
    ShoppingBag,
    Users,
    Percent,
    ToggleLeft,
    ToggleRight,
    Tag,
    Clock,
    CheckCircle,
} from "lucide-react";

// All products combined for selection
const allProducts = [
    ...racketProducts.map(p => ({ id: p.id, name: p.name, nameTh: p.nameTh, category: "rackets" })),
    ...shoeProducts.map(p => ({ id: p.id, name: p.name, nameTh: p.nameTh, category: "shoes" })),
    ...sportswearProducts.map(p => ({ id: p.id, name: p.name, nameTh: p.nameTh, category: "sportswear" })),
];

export default function PartnerCodesPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile, createPartnerCode, updatePartnerCode, deletePartnerCode } = useUser();
    const [copied, setCopied] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<PartnerCode | null>(null);

    const partnerInfo = userProfile?.partnerInfo;

    // Form state
    const [formDiscount, setFormDiscount] = useState(10);
    const [formExpiry, setFormExpiry] = useState<string>("");
    const [formMaxUses, setFormMaxUses] = useState<number | null>(null);
    const [formProducts, setFormProducts] = useState<"all" | string[]>("all");
    const [formIsActive, setFormIsActive] = useState(true);
    const [formPrefix, setFormPrefix] = useState<string>(""); // 2 character prefix

    // Redirect if not partner
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/codes");
            return;
        }
        if (!partnerInfo || partnerInfo.status !== "approved") {
            router.push("/affiliate/dashboard");
        }
    }, [isLoggedIn, partnerInfo, router]);

    const content = {
        en: {
            title: "Manage Discount Codes",
            subtitle: "Create and customize your affiliate discount codes",
            back: "Back to Dashboard",
            createNew: "Create New Code",
            noCode: "No discount codes yet",
            createFirst: "Create your first discount code",
            code: "Code",
            discount: "Discount",
            expiry: "Expiry",
            noExpiry: "No expiry",
            maxUses: "Max Uses",
            unlimited: "Unlimited",
            used: "Used",
            times: "times",
            products: "Products",
            allProducts: "All Products",
            selectedProducts: "Selected Products",
            status: "Status",
            active: "Active",
            inactive: "Inactive",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            copyCode: "Copy",
            copied: "Copied!",
            modal: {
                createTitle: "Create New Code",
                editTitle: "Edit Code",
                discountPercent: "Discount Percentage",
                adjustDiscount: "Adjust the discount percentage (1-20%)",
                codePrefix: "Code Prefix (Optional)",
                codePrefixHint: "Add 2 letters before discount number",
                commissionInfo: "You will receive",
                commissionPercent: "commission",
                duplicateCode: "This code already exists. Please use a different prefix.",
                expiryDate: "Expiry Date (Required)",
                expiryHint: "Maximum 1 month from today",
                maxUsesLabel: "Maximum Uses",
                maxUsesHint: "Leave empty for unlimited uses",
                applicableProducts: "Applicable Products",
                selectProducts: "Select specific products",
                isActive: "Code is Active",
                preview: "Code Preview",
                create: "Create Code",
                save: "Save Changes",
                cancel: "Cancel",
            },
            confirmDelete: "Are you sure you want to delete this code?",
        },
        th: {
            title: "จัดการโค้ดส่วนลด",
            subtitle: "สร้างและปรับแต่งโค้ดส่วนลดพาร์ทเนอร์ของคุณ",
            back: "กลับไปแดชบอร์ด",
            createNew: "สร้างโค้ดใหม่",
            noCode: "ยังไม่มีโค้ดส่วนลด",
            createFirst: "สร้างโค้ดส่วนลดแรกของคุณ",
            code: "โค้ด",
            discount: "ส่วนลด",
            expiry: "หมดอายุ",
            noExpiry: "ไม่มีวันหมดอายุ",
            maxUses: "ใช้ได้สูงสุด",
            unlimited: "ไม่จำกัด",
            used: "ใช้แล้ว",
            times: "ครั้ง",
            products: "สินค้า",
            allProducts: "สินค้าทั้งหมด",
            selectedProducts: "สินค้าที่เลือก",
            status: "สถานะ",
            active: "เปิดใช้งาน",
            inactive: "ปิดใช้งาน",
            actions: "จัดการ",
            edit: "แก้ไข",
            delete: "ลบ",
            copyCode: "คัดลอก",
            copied: "คัดลอกแล้ว!",
            modal: {
                createTitle: "สร้างโค้ดใหม่",
                editTitle: "แก้ไขโค้ด",
                discountPercent: "เปอร์เซ็นต์ส่วนลด",
                adjustDiscount: "ปรับเปอร์เซ็นต์ส่วนลด (1-20%)",
                codePrefix: "ตัวอักษรนำหน้า (ไม่บังคับ)",
                codePrefixHint: "เพิ่ม 2 ตัวอักษรหน้าตัวเลขส่วนลด",
                commissionInfo: "คุณจะได้รับ",
                commissionPercent: "คอมมิชชั่น",
                duplicateCode: "โค้ดนี้มีอยู่แล้ว กรุณาใช้ตัวอักษรนำหน้าอื่น",
                expiryDate: "วันหมดอายุ (จำเป็น)",
                expiryHint: "ไม่เกิน 1 เดือนจากวันนี้",
                maxUsesLabel: "จำนวนการใช้งานสูงสุด",
                maxUsesHint: "เว้นว่างไว้หากไม่จำกัด",
                applicableProducts: "สินค้าที่ใช้ได้",
                selectProducts: "เลือกสินค้าเฉพาะ",
                isActive: "เปิดใช้งานโค้ด",
                preview: "ตัวอย่างโค้ด",
                create: "สร้างโค้ด",
                save: "บันทึกการเปลี่ยนแปลง",
                cancel: "ยกเลิก",
            },
            confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบโค้ดนี้?",
        },
    };

    const t = language === "th" ? content.th : content.en;

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    // Get max expiry date (1 month from now)
    const getMaxExpiryDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
    };

    // Get default expiry date (1 month from now)
    const getDefaultExpiryDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
    };

    // Get min expiry date (today)
    const getMinExpiryDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const resetForm = () => {
        setFormDiscount(10);
        setFormExpiry(getDefaultExpiryDate());
        setFormMaxUses(null);
        setFormProducts("all");
        setFormIsActive(true);
        setFormPrefix("");
    };

    const openCreateModal = () => {
        resetForm();
        setEditingCode(null);
        setIsCreateModalOpen(true);
    };

    const openEditModal = (code: PartnerCode) => {
        setEditingCode(code);
        setFormDiscount(code.discountPercent);
        setFormExpiry(code.expiryDate || "");
        setFormMaxUses(code.maxUses);
        setFormProducts(code.applicableProducts);
        setFormIsActive(code.isActive);
        // Extract prefix from code (everything before the discount number)
        const baseCode = partnerInfo?.affiliateCode || "REACH";
        const codeWithoutBase = code.code.replace(baseCode, "");
        const prefix = codeWithoutBase.replace(/\d+$/, "");
        setFormPrefix(prefix);
        setIsCreateModalOpen(true);
    };

    // Generate full code with prefix
    const generateFullCode = () => {
        const baseCode = partnerInfo?.affiliateCode || "REACH";
        const prefix = formPrefix.toUpperCase().slice(0, 2); // Max 2 characters
        return `${baseCode}${prefix}${formDiscount}`;
    };

    // Check if code already exists
    const isCodeDuplicate = (newCode: string) => {
        const codes = partnerInfo?.codes || [];
        return codes.some(c => c.code === newCode && c.id !== editingCode?.id);
    };

    const handleSubmit = () => {
        // Validate expiry date is required
        if (!formExpiry) {
            alert(language === "th" ? "กรุณาตั้งวันหมดอายุ" : "Please set an expiry date");
            return;
        }

        // Validate expiry date is not more than 1 month
        const expiryDate = new Date(formExpiry);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        if (expiryDate > maxDate) {
            alert(language === "th" ? "วันหมดอายุต้องไม่เกิน 1 เดือน" : "Expiry date must not exceed 1 month");
            return;
        }

        const newCode = generateFullCode();

        // Check for duplicate code
        if (isCodeDuplicate(newCode)) {
            alert(t.modal.duplicateCode);
            return;
        }

        if (editingCode) {
            updatePartnerCode(editingCode.id, {
                code: newCode,
                discountPercent: formDiscount,
                expiryDate: formExpiry,
                maxUses: formMaxUses,
                applicableProducts: formProducts,
                isActive: formIsActive,
            });
        } else {
            createPartnerCode({
                code: newCode,
                discountPercent: formDiscount,
                expiryDate: formExpiry,
                maxUses: formMaxUses,
                applicableProducts: formProducts,
                isActive: formIsActive,
            });
        }

        setIsCreateModalOpen(false);
        resetForm();
    };

    const handleDelete = (codeId: string) => {
        if (confirm(t.confirmDelete)) {
            deletePartnerCode(codeId);
        }
    };

    const toggleProductSelection = (productId: string) => {
        if (formProducts === "all") {
            setFormProducts([productId]);
        } else {
            if (formProducts.includes(productId)) {
                const newProducts = formProducts.filter(id => id !== productId);
                if (newProducts.length === 0) {
                    setFormProducts("all");
                } else {
                    setFormProducts(newProducts);
                }
            } else {
                setFormProducts([...formProducts, productId]);
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

    const codes = partnerInfo.codes || [];

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
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {t.createNew}
                        </button>
                    </div>
                </div>

                {/* Codes List */}
                {codes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-12 text-center"
                    >
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{t.noCode}</h2>
                        <p className="text-gray-500 mb-6">{t.createFirst}</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {t.createNew}
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {codes.map((code, index) => (
                            <motion.div
                                key={code.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
                                    code.isActive ? "border-transparent" : "border-gray-200 opacity-60"
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Code Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl font-bold text-gray-900 font-mono">
                                                {code.code}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(code.code)}
                                                className="p-1.5 text-gray-400 hover:text-brand-yellow transition-colors"
                                            >
                                                {copied === code.code ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                code.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}>
                                                {code.isActive ? t.active : t.inactive}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">{t.discount}</p>
                                                <p className="font-bold text-brand-yellow">{code.discountPercent}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">{t.expiry}</p>
                                                <p className="font-medium text-gray-900">
                                                    {code.expiryDate
                                                        ? new Date(code.expiryDate).toLocaleDateString(language === "th" ? "th-TH" : "en-US")
                                                        : t.noExpiry}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">{t.maxUses}</p>
                                                <p className="font-medium text-gray-900">
                                                    {code.maxUses ? `${code.usedCount}/${code.maxUses}` : t.unlimited}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">{t.products}</p>
                                                <p className="font-medium text-gray-900">
                                                    {code.applicableProducts === "all"
                                                        ? t.allProducts
                                                        : `${(code.applicableProducts as string[]).length} ${t.selectedProducts}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(code)}
                                            className="p-2 text-gray-500 hover:text-brand-yellow hover:bg-gray-100 rounded-lg transition-colors"
                                            title={t.edit}
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(code.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title={t.delete}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setIsCreateModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingCode ? t.modal.editTitle : t.modal.createTitle}
                                    </h3>
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                                {/* Code Preview */}
                                <div className="bg-gradient-to-r from-brand-black to-gray-800 rounded-xl p-4 text-center">
                                    <p className="text-white/60 text-sm mb-1">{t.modal.preview}</p>
                                    <p className="text-3xl font-bold text-white font-mono">
                                        {generateFullCode()}
                                    </p>
                                </div>

                                {/* Code Prefix */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.modal.codePrefix}
                                    </label>
                                    <input
                                        type="text"
                                        value={formPrefix}
                                        onChange={(e) => setFormPrefix(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2))}
                                        maxLength={2}
                                        placeholder="AB"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-mono text-lg uppercase focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{t.modal.codePrefixHint}</p>
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t.modal.discountPercent}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setFormDiscount(Math.max(1, formDiscount - 1))}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border-2 border-gray-600"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="text-4xl font-bold text-brand-yellow">{formDiscount}</span>
                                            <span className="text-2xl text-gray-500">%</span>
                                        </div>
                                        <button
                                            onClick={() => setFormDiscount(Math.min(20, formDiscount + 1))}
                                            className="w-12 h-12 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border-2 border-gray-600"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={formDiscount}
                                        onChange={(e) => setFormDiscount(parseInt(e.target.value))}
                                        className="w-full mt-3 accent-brand-yellow"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{t.modal.adjustDiscount}</p>
                                    {/* Commission Info */}
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-700">
                                            <span className="font-medium">{t.modal.commissionInfo}</span>{" "}
                                            <span className="font-bold text-green-800">{20 - formDiscount}%</span>{" "}
                                            {t.modal.commissionPercent}
                                        </p>
                                    </div>
                                </div>

                                {/* Expiry Date - Required */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        {t.modal.expiryDate}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formExpiry}
                                        onChange={(e) => setFormExpiry(e.target.value)}
                                        min={getMinExpiryDate()}
                                        max={getMaxExpiryDate()}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{t.modal.expiryHint}</p>
                                </div>

                                {/* Max Uses */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        {t.modal.maxUsesLabel}
                                    </label>
                                    <input
                                        type="number"
                                        value={formMaxUses || ""}
                                        onChange={(e) => setFormMaxUses(e.target.value ? parseInt(e.target.value) : null)}
                                        min="1"
                                        placeholder={t.unlimited}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{t.modal.maxUsesHint}</p>
                                </div>

                                {/* Applicable Products */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <ShoppingBag className="w-4 h-4 inline mr-1" />
                                        {t.modal.applicableProducts}
                                    </label>
                                    <div className="flex items-center gap-3 mb-3">
                                        <button
                                            onClick={() => setFormProducts("all")}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                formProducts === "all"
                                                    ? "bg-brand-yellow text-black"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {t.allProducts}
                                        </button>
                                        <button
                                            onClick={() => setFormProducts([])}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                formProducts !== "all"
                                                    ? "bg-brand-yellow text-black"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {t.modal.selectProducts}
                                        </button>
                                    </div>
                                    {formProducts !== "all" && (
                                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                                            {allProducts.slice(0, 10).map((product) => (
                                                <label
                                                    key={product.id}
                                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formProducts.includes(product.id)}
                                                        onChange={() => toggleProductSelection(product.id)}
                                                        className="w-4 h-4 text-brand-yellow rounded focus:ring-brand-yellow"
                                                    />
                                                    <span className="text-sm text-gray-900">
                                                        {language === "th" ? product.nameTh : product.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Active Toggle */}
                                <div>
                                    <button
                                        onClick={() => setFormIsActive(!formIsActive)}
                                        className="flex items-center gap-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {formIsActive ? (
                                            <ToggleRight className="w-8 h-8 text-green-500" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900">{t.modal.isActive}</span>
                                        <span className={`ml-auto text-sm ${formIsActive ? "text-green-600" : "text-gray-500"}`}>
                                            {formIsActive ? t.active : t.inactive}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {t.modal.cancel}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    {editingCode ? t.modal.save : t.modal.create}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
