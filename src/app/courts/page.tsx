"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function CourtsPage() {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Badminton Court Services",
            subtitle: "Professional court flooring and construction services",
            filterAll: "All Services",
            filterFlooring: "Flooring",
            filterLighting: "Lighting",
            filterRenovation: "Renovation",
            filterConsultation: "Consultation",
            contactUs: "Contact Us",
            viewDetails: "View Details",
            warranty: "Warranty",
            contactCta: "Contact for Quote",
            contactSubtitle: "Get in touch with our team for pricing and consultation",
            phone: "Phone",
            line: "LINE",
            email: "Email",
        },
        th: {
            title: "บริการสนามแบดมินตัน",
            subtitle: "บริการทำพื้นสนามและก่อสร้างสนามระดับมืออาชีพ",
            filterAll: "ทั้งหมด",
            filterFlooring: "พื้นสนาม",
            filterLighting: "ระบบไฟ",
            filterRenovation: "ปรับปรุง",
            filterConsultation: "ที่ปรึกษา",
            contactUs: "ติดต่อเรา",
            viewDetails: "ดูรายละเอียด",
            warranty: "รับประกัน",
            contactCta: "ติดต่อขอใบเสนอราคา",
            contactSubtitle: "ติดต่อทีมงานเพื่อสอบถามราคาและรับคำปรึกษา",
            phone: "โทรศัพท์",
            line: "LINE",
            email: "อีเมล",
        },
    };

    const t = language === "th" ? content.th : content.en;


    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-8 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {t.title}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            {t.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Summary */}
            <section className="py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {language === "th" ? "บริการสนามตามสเปคของคุณ" : "Custom Court Services"}
                        </h2>
                        <p className="text-gray-600">
                            {language === "th"
                                ? "เรารับออกแบบ ปรับปรุง และติดตั้งสนามตามงบประมาณและความต้องการ กรุณาติดต่อเพื่อรับคำปรึกษาและใบเสนอราคา"
                                : "We design, renovate, and install courts tailored to your space and budget. Contact us for consultation and a custom quote."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-3">{t.contactCta}</h2>
                        <p className="text-gray-400 mb-8">{t.contactSubtitle}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Phone */}
                            <a
                                href="tel:+66812345678"
                                className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                <Phone className="w-6 h-6 text-brand-yellow" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-400">{t.phone}</p>
                                    <p className="font-bold">081-234-5678</p>
                                </div>
                            </a>

                            {/* LINE */}
                            <a
                                href="https://line.me/ti/p/@reachbadminton"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                <MessageCircle className="w-6 h-6 text-green-400" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-400">{t.line}</p>
                                    <p className="font-bold">@reachbadminton</p>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:courts@reach.co.th"
                                className="flex items-center justify-center gap-3 p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                            >
                                <Mail className="w-6 h-6 text-blue-400" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-400">{t.email}</p>
                                    <p className="font-bold">courts@reach.co.th</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
