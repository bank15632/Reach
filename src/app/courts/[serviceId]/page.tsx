"use client";

import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function CourtServicePage() {
    const { language } = useLanguage();

    const text = {
        title: language === "th" ? "รายละเอียดบริการสนาม" : "Court Service Details",
        subtitle:
            language === "th"
                ? "บริการของเราจะออกแบบตามพื้นที่และงบประมาณ กรุณาติดต่อเพื่อรับคำปรึกษาและใบเสนอราคา"
                : "Our court services are tailored to your space and budget. Contact us for consultation and a custom quote.",
        contact: language === "th" ? "ติดต่อทีมงาน" : "Contact Our Team",
        phone: language === "th" ? "โทรศัพท์" : "Phone",
        line: language === "th" ? "ไลน์" : "LINE",
        email: language === "th" ? "อีเมล" : "Email",
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{text.title}</h1>
                    <p className="text-gray-600">{text.subtitle}</p>
                </div>
            </section>

            <section className="pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{text.contact}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="tel:+66812345678"
                                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <Phone className="w-5 h-5 text-brand-yellow" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-500">{text.phone}</p>
                                    <p className="font-bold">081-234-5678</p>
                                </div>
                            </a>
                            <a
                                href="https://line.me/ti/p/@reachbadminton"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5 text-green-500" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-500">{text.line}</p>
                                    <p className="font-bold">@reachbadminton</p>
                                </div>
                            </a>
                            <a
                                href="mailto:hello@reachprostore.com"
                                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <Mail className="w-5 h-5 text-blue-500" />
                                <div className="text-left">
                                    <p className="text-sm text-gray-500">{text.email}</p>
                                    <p className="font-bold">hello@reachprostore.com</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
