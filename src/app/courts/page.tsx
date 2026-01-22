"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { courtServices, CourtServiceType } from "@/data/productData";
import { Phone, MessageCircle, Mail, ChevronRight, Check, Layers, Lightbulb, Wrench, Users } from "lucide-react";

export default function CourtsPage() {
    const { language } = useLanguage();
    const [selectedType, setSelectedType] = useState<CourtServiceType | "all">("all");

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

    const filteredServices = selectedType === "all"
        ? courtServices
        : courtServices.filter(s => s.serviceType === selectedType);

    const getTypeIcon = (type: CourtServiceType) => {
        switch (type) {
            case "flooring": return <Layers className="w-5 h-5" />;
            case "lighting": return <Lightbulb className="w-5 h-5" />;
            case "renovation": return <Wrench className="w-5 h-5" />;
            case "consultation": return <Users className="w-5 h-5" />;
        }
    };

    const getTypeLabel = (type: CourtServiceType) => {
        switch (type) {
            case "flooring": return language === "th" ? "พื้นสนาม" : "Flooring";
            case "lighting": return language === "th" ? "ระบบไฟ" : "Lighting";
            case "renovation": return language === "th" ? "ปรับปรุง" : "Renovation";
            case "consultation": return language === "th" ? "ที่ปรึกษา" : "Consultation";
        }
    };

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

            {/* Filter Tabs */}
            <section className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
                        {[
                            { value: "all", label: t.filterAll },
                            { value: "flooring", label: t.filterFlooring },
                            { value: "lighting", label: t.filterLighting },
                            { value: "renovation", label: t.filterRenovation },
                            { value: "consultation", label: t.filterConsultation },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedType(filter.value as CourtServiceType | "all")}
                                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                                    selectedType === filter.value
                                        ? "bg-brand-yellow text-black"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/courts/${service.id}`}>
                                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                                        {/* Image */}
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={service.images[0]}
                                                alt={language === "th" ? service.nameTh : service.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Type Badge */}
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-brand-yellow text-black text-xs font-bold rounded-full flex items-center gap-1">
                                                {getTypeIcon(service.serviceType)}
                                                {getTypeLabel(service.serviceType)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {language === "th" ? service.nameTh : service.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                {language === "th" ? service.descriptionTh : service.description}
                                            </p>

                                            {/* Features Preview */}
                                            <div className="space-y-1 mb-4">
                                                {(language === "th" ? service.featuresTh : service.features).slice(0, 3).map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                                        <span className="truncate">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Warranty */}
                                            {service.warranty && (
                                                <div className="mb-4 p-2 bg-green-50 rounded-lg">
                                                    <p className="text-sm text-green-700 font-medium">
                                                        {t.warranty}: {language === "th" ? service.warrantyTh : service.warranty}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Contact CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="text-lg font-bold text-brand-yellow">
                                                    {t.contactUs}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm font-medium text-gray-600 group-hover:text-brand-yellow transition-colors">
                                                    {t.viewDetails}
                                                    <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black">
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
