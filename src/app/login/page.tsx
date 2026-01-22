"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

export default function LoginPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const { isLoggedIn, login } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push("/profile");
        }
    }, [isLoggedIn, router]);

    const content = {
        en: {
            login: {
                title: 'Welcome Back',
                subtitle: 'Sign in to your account',
                email: 'Email Address',
                password: 'Password',
                remember: 'Remember me',
                forgot: 'Forgot password?',
                submit: 'Sign In',
                noAccount: "Don't have an account?",
                register: 'Register now'
            },
            register: {
                title: 'Create Account',
                subtitle: 'Join REACH today',
                name: 'Full Name',
                email: 'Email Address',
                phone: 'Phone Number',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                terms: 'I agree to the',
                termsLink: 'Terms & Conditions',
                submit: 'Create Account',
                hasAccount: 'Already have an account?',
                login: 'Sign in'
            },
            termsModal: {
                title: 'Terms & Conditions',
                intro: 'Please review the following terms before creating your account:',
                items: [
                    'Your information will be used to manage your account and orders.',
                    'We may contact you with updates about your order or membership.',
                    'All purchases are subject to availability and store policies.',
                    'You are responsible for keeping your account credentials secure.'
                ]
            },
            social: {
                or: 'or continue with',
                google: 'Google',
                facebook: 'Facebook',
                line: 'LINE'
            }
        },
        th: {
            login: {
                title: 'ยินดีต้อนรับกลับ',
                subtitle: 'เข้าสู่ระบบบัญชีของคุณ',
                email: 'อีเมล',
                password: 'รหัสผ่าน',
                remember: 'จดจำฉัน',
                forgot: 'ลืมรหัสผ่าน?',
                submit: 'เข้าสู่ระบบ',
                noAccount: 'ยังไม่มีบัญชี?',
                register: 'สมัครสมาชิก'
            },
            register: {
                title: 'สร้างบัญชี',
                subtitle: 'เข้าร่วม REACH วันนี้',
                name: 'ชื่อ-นามสกุล',
                email: 'อีเมล',
                phone: 'เบอร์โทรศัพท์',
                password: 'รหัสผ่าน',
                confirmPassword: 'ยืนยันรหัสผ่าน',
                terms: 'ฉันยอมรับ',
                termsLink: 'ข้อกำหนดและเงื่อนไข',
                submit: 'สร้างบัญชี',
                hasAccount: 'มีบัญชีอยู่แล้ว?',
                login: 'เข้าสู่ระบบ'
            },
            termsModal: {
                title: 'ข้อกำหนดและเงื่อนไข',
                intro: 'โปรดอ่านข้อตกลงก่อนสร้างบัญชี:',
                items: [
                    'ข้อมูลของคุณจะถูกใช้เพื่อจัดการบัญชีและคำสั่งซื้อ',
                    'เราอาจติดต่อคุณเกี่ยวกับคำสั่งซื้อหรือการเป็นสมาชิก',
                    'การสั่งซื้อทั้งหมดเป็นไปตามเงื่อนไขของร้านค้าและสต็อกสินค้า',
                    'คุณมีหน้าที่รักษาความปลอดภัยของรหัสผ่านและบัญชีของคุณ'
                ]
            },
            social: {
                or: 'หรือเข้าสู่ระบบด้วย',
                google: 'Google',
                facebook: 'Facebook',
                line: 'LINE'
            }
        }
    };

    const t = language === 'th' ? content.th : content.en;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate
        if (!formData.email || !formData.password) {
            setError(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill in all fields");
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError(language === "th" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match");
            return;
        }

        // Attempt login/register
        const success = login(
            formData.email,
            formData.password,
            isLogin ? undefined : formData.name,
            isLogin ? undefined : formData.phone
        );

        if (success) {
            router.push("/profile");
        } else {
            setError(language === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed");
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md mx-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-8"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-block mb-6">
                                <img src="/logo.jpg" alt="REACH" className="h-12 mx-auto" />
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isLogin ? t.login.title : t.register.title}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isLogin ? t.login.subtitle : t.register.subtitle}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t.register.name}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                            placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {isLogin ? t.login.email : t.register.email}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                        placeholder={language === 'th' ? 'example@email.com' : 'example@email.com'}
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t.register.phone}
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                            placeholder={language === 'th' ? '08X-XXX-XXXX' : '08X-XXX-XXXX'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {isLogin ? t.login.password : t.register.password}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                        placeholder={language === 'th' ? 'กรอกรหัสผ่าน' : 'Enter password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t.register.confirmPassword}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                            placeholder={language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm password'}
                                        />
                                    </div>
                                </div>
                            )}

                            {isLogin ? (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 accent-brand-yellow" />
                                        <span className="text-sm text-gray-600">{t.login.remember}</span>
                                    </label>
                                    <a href="#" className="text-sm text-brand-yellow hover:underline">
                                        {t.login.forgot}
                                    </a>
                                </div>
                            ) : (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" required className="w-4 h-4 accent-brand-yellow" />
                                    <span className="text-sm text-gray-600">
                                        {t.register.terms}{' '}
                                        <button
                                            type="button"
                                            onClick={() => setIsTermsOpen(true)}
                                            className="text-brand-yellow hover:underline"
                                        >
                                            {t.register.termsLink}
                                        </button>
                                    </span>
                                </label>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                            >
                                {isLogin ? t.login.submit : t.register.submit}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">{t.social.or}</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-[#00B900]">
                                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                            </button>
                        </div>

                        {/* Switch Form */}
                        <p className="text-center mt-6 text-gray-600">
                            {isLogin ? t.login.noAccount : t.register.hasAccount}{' '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-brand-yellow font-semibold hover:underline"
                            >
                                {isLogin ? t.login.register : t.register.login}
                            </button>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Terms Modal */}
            {isTermsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setIsTermsOpen(false)}
                        aria-label="Close terms modal"
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{t.termsModal.title}</h2>
                                <p className="text-sm text-gray-600 mt-1">{t.termsModal.intro}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsTermsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
                            {t.termsModal.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsTermsOpen(false)}
                                className="px-4 py-2 bg-brand-yellow text-black rounded-lg font-semibold hover:bg-yellow-400"
                            >
                                {language === 'th' ? 'ปิด' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
