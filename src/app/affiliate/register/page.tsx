"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import {
    ChevronLeft,
    Users,
    Instagram,
    Youtube,
    Facebook,
    Globe,
    CheckCircle,
    AlertCircle,
    Loader2,
    Sparkles,
    X,
} from "lucide-react";

type SocialPlatform = "instagram" | "facebook" | "youtube" | "tiktok" | "website" | "other";

interface AffiliateApplication {
    fullName: string;
    email: string;
    phone: string;
    socialPlatforms: SocialPlatform[];
    socialHandles: Record<SocialPlatform, string>;
    followerCount: string;
    contentType: string[];
    preferredCode: string;
    whyJoin: string;
    agreeToTerms: boolean;
}

export default function AffiliateRegisterPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, userProfile, applyForPartner } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<AffiliateApplication>({
        fullName: "",
        email: "",
        phone: "",
        socialPlatforms: [],
        socialHandles: {
            instagram: "",
            facebook: "",
            youtube: "",
            tiktok: "",
            website: "",
            other: "",
        },
        followerCount: "",
        contentType: [],
        preferredCode: "",
        whyJoin: "",
        agreeToTerms: false,
    });

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/affiliate/register");
        }
    }, [isLoggedIn, router]);

    // Pre-fill form with user profile data
    useEffect(() => {
        if (userProfile) {
            setFormData((prev) => ({
                ...prev,
                fullName: userProfile.name || "",
                email: userProfile.email || "",
                phone: userProfile.phone || "",
            }));
        }
    }, [userProfile]);

    const content = {
        en: {
            title: "Partner Application",
            subtitle: "Fill out the form below to apply for our affiliate program",
            back: "Back to Affiliate Info",
            form: {
                personalInfo: "Personal Information",
                fullName: "Full Name",
                email: "Email Address",
                phone: "Phone Number",
                socialPresence: "Social Media Presence",
                socialPlatforms: "Which platforms do you use?",
                instagram: "Instagram",
                facebook: "Facebook",
                youtube: "YouTube",
                tiktok: "TikTok",
                website: "Website/Blog",
                other: "Other",
                socialHandles: "Your profile links/handles",
                followerCount: "Total follower count (approximate)",
                followerOptions: [
                    { value: "1k-5k", label: "1,000 - 5,000" },
                    { value: "5k-10k", label: "5,000 - 10,000" },
                    { value: "10k-50k", label: "10,000 - 50,000" },
                    { value: "50k-100k", label: "50,000 - 100,000" },
                    { value: "100k+", label: "100,000+" },
                ],
                contentType: "What type of content do you create?",
                contentOptions: [
                    { value: "badminton-tips", label: "Badminton Tips & Tutorials" },
                    { value: "match-reviews", label: "Match Reviews & Analysis" },
                    { value: "equipment-reviews", label: "Equipment Reviews" },
                    { value: "fitness", label: "Fitness & Training" },
                    { value: "lifestyle", label: "Lifestyle & Vlogs" },
                    { value: "other", label: "Other" },
                ],
                affiliateCode: "Preferred Affiliate Code",
                codeHint: "Enter your preferred code (3-15 characters, English letters only). We'll check availability.",
                codeExample: "Example: JOHND, BADPRO, etc.",
                whyJoin: "Why do you want to join our affiliate program?",
                whyJoinPlaceholder: "Tell us about yourself, your audience, and why you'd be a great partner...",
                terms: "I agree to the affiliate program terms and conditions",
                viewTerms: "View Terms",
                submit: "Submit Application",
                submitting: "Submitting...",
            },
            success: {
                title: "Application Submitted!",
                message: "Thank you for applying to our affiliate program. We'll review your application and get back to you within 48 hours.",
                checkEmail: "Please check your email for confirmation.",
                backToProfile: "Back to Profile",
            },
            errors: {
                required: "This field is required",
                invalidEmail: "Please enter a valid email address",
                selectPlatform: "Please select at least one platform",
                selectContentType: "Please select at least one content type",
                codeLength: "Code must be 3-15 characters",
                codeFormat: "Only English letters (A-Z) allowed",
                agreeToTerms: "You must agree to the terms",
            },
        },
        th: {
            title: "สมัครเป็นพาร์ทเนอร์",
            subtitle: "กรอกข้อมูลด้านล่างเพื่อสมัครโปรแกรมพาร์ทเนอร์ของเรา",
            back: "กลับไปข้อมูลพาร์ทเนอร์",
            form: {
                personalInfo: "ข้อมูลส่วนตัว",
                fullName: "ชื่อ-นามสกุล",
                email: "อีเมล",
                phone: "เบอร์โทรศัพท์",
                socialPresence: "ช่องทางโซเชียลมีเดีย",
                socialPlatforms: "คุณใช้แพลตฟอร์มไหนบ้าง?",
                instagram: "Instagram",
                facebook: "Facebook",
                youtube: "YouTube",
                tiktok: "TikTok",
                website: "เว็บไซต์/บล็อก",
                other: "อื่นๆ",
                socialHandles: "ลิงก์โปรไฟล์ของคุณ",
                followerCount: "จำนวนผู้ติดตามโดยประมาณ",
                followerOptions: [
                    { value: "1k-5k", label: "1,000 - 5,000" },
                    { value: "5k-10k", label: "5,000 - 10,000" },
                    { value: "10k-50k", label: "10,000 - 50,000" },
                    { value: "50k-100k", label: "50,000 - 100,000" },
                    { value: "100k+", label: "100,000+" },
                ],
                contentType: "คุณสร้างคอนเทนต์ประเภทไหน?",
                contentOptions: [
                    { value: "badminton-tips", label: "เทคนิค & สอนแบดมินตัน" },
                    { value: "match-reviews", label: "วิเคราะห์การแข่งขัน" },
                    { value: "equipment-reviews", label: "รีวิวอุปกรณ์" },
                    { value: "fitness", label: "ฟิตเนส & การฝึกซ้อม" },
                    { value: "lifestyle", label: "ไลฟ์สไตล์ & Vlog" },
                    { value: "other", label: "อื่นๆ" },
                ],
                affiliateCode: "โค้ดพาร์ทเนอร์ที่ต้องการ",
                codeHint: "ใส่โค้ดที่คุณต้องการ (3-15 ตัวอักษรภาษาอังกฤษเท่านั้น) เราจะตรวจสอบความพร้อมใช้งาน",
                codeExample: "ตัวอย่าง: JOHND, BADPRO ฯลฯ",
                whyJoin: "ทำไมคุณถึงอยากเข้าร่วมโปรแกรมพาร์ทเนอร์?",
                whyJoinPlaceholder: "บอกเราเกี่ยวกับตัวคุณ ผู้ติดตามของคุณ และทำไมคุณจะเป็นพาร์ทเนอร์ที่ดี...",
                terms: "ฉันยอมรับข้อกำหนดและเงื่อนไขของโปรแกรมพาร์ทเนอร์",
                viewTerms: "ดูข้อกำหนด",
                submit: "ส่งใบสมัคร",
                submitting: "กำลังส่ง...",
            },
            success: {
                title: "ส่งใบสมัครแล้ว!",
                message: "ขอบคุณที่สมัครโปรแกรมพาร์ทเนอร์ของเรา เราจะพิจารณาใบสมัครและติดต่อกลับภายใน 48 ชั่วโมง",
                checkEmail: "กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยัน",
                backToProfile: "กลับไปโปรไฟล์",
            },
            errors: {
                required: "กรุณากรอกข้อมูลนี้",
                invalidEmail: "กรุณากรอกอีเมลที่ถูกต้อง",
                selectPlatform: "กรุณาเลือกแพลตฟอร์มอย่างน้อย 1 ช่องทาง",
                selectContentType: "กรุณาเลือกประเภทคอนเทนต์อย่างน้อย 1 ประเภท",
                codeLength: "โค้ดต้องมี 3-15 ตัวอักษร",
                codeFormat: "ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ (A-Z) เท่านั้น",
                agreeToTerms: "คุณต้องยอมรับข้อกำหนด",
            },
        },
    };

    const t = language === "th" ? content.th : content.en;

    const socialPlatforms: { key: SocialPlatform; label: string; icon: React.ReactNode; placeholder: string }[] = [
        { key: "instagram", label: t.form.instagram, icon: <Instagram className="w-5 h-5" />, placeholder: "@username" },
        { key: "facebook", label: t.form.facebook, icon: <Facebook className="w-5 h-5" />, placeholder: "facebook.com/yourpage" },
        { key: "youtube", label: t.form.youtube, icon: <Youtube className="w-5 h-5" />, placeholder: "youtube.com/@channel" },
        { key: "tiktok", label: t.form.tiktok, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>, placeholder: "@username" },
        { key: "website", label: t.form.website, icon: <Globe className="w-5 h-5" />, placeholder: "https://yourwebsite.com" },
        { key: "other", label: t.form.other, icon: <Users className="w-5 h-5" />, placeholder: language === "th" ? "ลิงก์อื่นๆ" : "Other links" },
    ];

    const handlePlatformToggle = (platform: SocialPlatform) => {
        setFormData((prev) => {
            const platforms = prev.socialPlatforms.includes(platform)
                ? prev.socialPlatforms.filter((p) => p !== platform)
                : [...prev.socialPlatforms, platform];
            return { ...prev, socialPlatforms: platforms };
        });
        if (errors.socialPlatforms) {
            setErrors((prev) => ({ ...prev, socialPlatforms: "" }));
        }
    };

    const handleContentTypeToggle = (type: string) => {
        setFormData((prev) => {
            const types = prev.contentType.includes(type)
                ? prev.contentType.filter((t) => t !== type)
                : [...prev.contentType, type];
            return { ...prev, contentType: types };
        });
        if (errors.contentType) {
            setErrors((prev) => ({ ...prev, contentType: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = t.errors.required;
        }
        if (!formData.email.trim()) {
            newErrors.email = t.errors.required;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.errors.invalidEmail;
        }
        if (!formData.phone.trim()) {
            newErrors.phone = t.errors.required;
        }
        if (formData.socialPlatforms.length === 0) {
            newErrors.socialPlatforms = t.errors.selectPlatform;
        }
        if (!formData.followerCount) {
            newErrors.followerCount = t.errors.required;
        }
        if (formData.contentType.length === 0) {
            newErrors.contentType = t.errors.selectContentType;
        }
        if (formData.preferredCode) {
            if (formData.preferredCode.length < 3 || formData.preferredCode.length > 15) {
                newErrors.preferredCode = t.errors.codeLength;
            } else if (!/^[a-zA-Z]+$/.test(formData.preferredCode)) {
                newErrors.preferredCode = t.errors.codeFormat;
            }
        }
        if (!formData.whyJoin.trim()) {
            newErrors.whyJoin = t.errors.required;
        }
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = t.errors.agreeToTerms;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Apply for partner with the preferred code
        applyForPartner(formData.preferredCode || `REACH${Date.now().toString().slice(-6)}`);

        setIsSubmitting(false);
        setIsSubmitted(true);
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
                        <p className="text-gray-600 mb-4">
                            {t.success.message}
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            {t.success.checkEmail}
                        </p>
                        <Link
                            href="/affiliate/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            {language === "th" ? "ไปยังแดชบอร์ด" : "Go to Dashboard"}
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
                    <Breadcrumb
                        items={[
                            { label: "Partner", labelTh: "พาร์ทเนอร์", href: "/affiliate" },
                            { label: "Apply", labelTh: "สมัคร" },
                        ]}
                    />
                    <Link
                        href="/affiliate"
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-brand-yellow transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {t.back}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-600 mt-1">{t.subtitle}</p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-yellow" />
                            {t.form.personalInfo}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.fullName} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.fullName ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.email} *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.phone} *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.phone ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Presence */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-yellow" />
                            {t.form.socialPresence}
                        </h2>

                        {/* Platform Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {t.form.socialPlatforms} *
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {socialPlatforms.map((platform) => (
                                    <button
                                        key={platform.key}
                                        type="button"
                                        onClick={() => handlePlatformToggle(platform.key)}
                                        className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${formData.socialPlatforms.includes(platform.key)
                                            ? "border-brand-yellow bg-brand-yellow/10"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <span className={formData.socialPlatforms.includes(platform.key) ? "text-brand-yellow" : "text-gray-500"}>
                                            {platform.icon}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {platform.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {errors.socialPlatforms && (
                                <p className="text-red-500 text-sm mt-2">{errors.socialPlatforms}</p>
                            )}
                        </div>

                        {/* Social Handles */}
                        {formData.socialPlatforms.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t.form.socialHandles}
                                </label>
                                {formData.socialPlatforms.map((platformKey) => {
                                    const platform = socialPlatforms.find((p) => p.key === platformKey);
                                    if (!platform) return null;
                                    return (
                                        <div key={platformKey} className="flex items-center gap-2">
                                            <span className="text-gray-500">{platform.icon}</span>
                                            <input
                                                type="text"
                                                value={formData.socialHandles[platformKey]}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        socialHandles: {
                                                            ...formData.socialHandles,
                                                            [platformKey]: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder={platform.placeholder}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Follower Count */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.form.followerCount} *
                            </label>
                            <select
                                value={formData.followerCount}
                                onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.followerCount ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                <option value="">{language === "th" ? "เลือก..." : "Select..."}</option>
                                {t.form.followerOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.followerCount && (
                                <p className="text-red-500 text-sm mt-1">{errors.followerCount}</p>
                            )}
                        </div>

                        {/* Content Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {t.form.contentType} *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {t.form.contentOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleContentTypeToggle(option.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.contentType.includes(option.value)
                                            ? "bg-brand-yellow text-black"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            {errors.contentType && (
                                <p className="text-red-500 text-sm mt-2">{errors.contentType}</p>
                            )}
                        </div>
                    </div>

                    {/* Affiliate Code */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {t.form.affiliateCode}
                        </h2>
                        <input
                            type="text"
                            value={formData.preferredCode}
                            onChange={(e) => {
                                // Only allow English letters (A-Z, a-z)
                                const filtered = e.target.value.replace(/[^a-zA-Z]/g, '');
                                setFormData({ ...formData, preferredCode: filtered.toUpperCase() });
                            }}
                            maxLength={15}
                            placeholder={t.form.codeExample}
                            className={`w-full px-3 py-2 border rounded-lg text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.preferredCode ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        <p className="text-sm text-gray-500 mt-2">{t.form.codeHint}</p>
                        {errors.preferredCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.preferredCode}</p>
                        )}
                    </div>

                    {/* Why Join */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {t.form.whyJoin} *
                        </h2>
                        <textarea
                            value={formData.whyJoin}
                            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                            rows={4}
                            placeholder={t.form.whyJoinPlaceholder}
                            className={`w-full px-3 py-2 border rounded-lg text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-brand-yellow ${errors.whyJoin ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.whyJoin && (
                            <p className="text-red-500 text-sm mt-1">{errors.whyJoin}</p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                className="mt-1 w-5 h-5 text-brand-yellow border-gray-300 rounded focus:ring-brand-yellow"
                            />
                            <span className="text-sm text-gray-700">
                                {t.form.terms}{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsTermsModalOpen(true)}
                                    className="text-brand-yellow hover:underline"
                                >
                                    ({t.form.viewTerms})
                                </button>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.agreeToTerms}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.form.submitting}
                            </>
                        ) : (
                            t.form.submit
                        )}
                    </button>
                </motion.form>

                {/* Terms Modal */}
                <AnimatePresence>
                    {isTermsModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                            onClick={() => setIsTermsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {language === "th" ? "ข้อกำหนดและเงื่อนไขพาร์ทเนอร์" : "Partner Terms & Conditions"}
                                        </h3>
                                        <button
                                            onClick={() => setIsTermsModalOpen(false)}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[60vh] text-gray-700 text-sm space-y-4">
                                    {language === "th" ? (
                                        <>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">1. ค่าคอมมิชชั่น</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>พาร์ทเนอร์จะได้รับค่าคอมมิชชั่น 10% จากยอดขายที่เกิดจากโค้ดส่วนลดของคุณ</li>
                                                    <li>ลูกค้าที่ใช้โค้ดจะได้รับส่วนลด 5% สำหรับการสั่งซื้อ</li>
                                                    <li>ค่าคอมมิชชั่นจะคำนวณจากยอดสุทธิหลังหักส่วนลดและค่าจัดส่ง</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">2. การจ่ายเงิน</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>การจ่ายเงินจะดำเนินการทุกวันที่ 1 และ 15 ของเดือน</li>
                                                    <li>ยอดขั้นต่ำในการถอนคือ 500 บาท</li>
                                                    <li>รองรับการโอนผ่านบัญชีธนาคารไทย</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">3. สิ่งที่ห้ามทำ</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>ห้ามใช้โค้ดส่วนลดเพื่อซื้อสินค้าให้ตัวเอง</li>
                                                    <li>ห้ามโฆษณาเท็จหรือสร้างความเข้าใจผิดเกี่ยวกับสินค้า</li>
                                                    <li>ห้ามใช้วิธีการสแปมหรือส่งข้อความไม่พึงประสงค์</li>
                                                    <li>ห้ามละเมิดลิขสิทธิ์หรือเครื่องหมายการค้าของ REACH</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">4. การยกเลิก</h4>
                                                <p>REACH ขอสงวนสิทธิ์ในการยกเลิกบัญชีพาร์ทเนอร์หากพบการละเมิดข้อกำหนดใดๆ โดยไม่ต้องแจ้งล่วงหน้า</p>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">5. การเปลี่ยนแปลงข้อกำหนด</h4>
                                                <p>REACH อาจเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลา การใช้งานต่อหลังจากมีการเปลี่ยนแปลงถือว่าคุณยอมรับข้อกำหนดใหม่</p>
                                            </section>
                                        </>
                                    ) : (
                                        <>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">1. Commission</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Partners earn 10% commission on sales made using their discount code</li>
                                                    <li>Customers using the code receive a 5% discount on their order</li>
                                                    <li>Commission is calculated on the net amount after discounts and shipping</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">2. Payment</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Payments are processed on the 1st and 15th of each month</li>
                                                    <li>Minimum withdrawal amount is 500 THB</li>
                                                    <li>Transfers are made to Thai bank accounts</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">3. Prohibited Activities</h4>
                                                <ul className="list-disc pl-5 space-y-1">
                                                    <li>Using your own discount code for personal purchases</li>
                                                    <li>False advertising or misrepresenting products</li>
                                                    <li>Spamming or sending unsolicited messages</li>
                                                    <li>Infringing on REACH's copyrights or trademarks</li>
                                                </ul>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">4. Termination</h4>
                                                <p>REACH reserves the right to terminate partner accounts for any violation of these terms without prior notice.</p>
                                            </section>
                                            <section>
                                                <h4 className="font-bold text-gray-900 mb-2">5. Changes to Terms</h4>
                                                <p>REACH may modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
                                            </section>
                                        </>
                                    )}
                                </div>
                                <div className="p-6 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsTermsModalOpen(false)}
                                        className="w-full py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                    >
                                        {language === "th" ? "เข้าใจแล้ว" : "I Understand"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
