"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, MessageCircle, PhoneCall, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const { language } = useLanguage();

  const channels = [
    {
      icon: <MessageCircle className="text-brand-yellow" size={24} />,
      title: language === "th" ? "LINE Official" : "LINE Official",
      handle: "@reachbadminton",
      detail: language === "th"
        ? "ตอบกลับภายใน 30 นาที ในเวลาทำการ"
        : "Replies within 30 minutes during business hours",
      href: "https://line.me/R/ti/p/@reachbadminton"
    },
    {
      icon: <MessageCircle className="text-brand-yellow" size={24} />,
      title: "Facebook Messenger",
      handle: "Reach Badminton",
      detail: language === "th"
        ? "เหมาะสำหรับส่งรูปหรือรายละเอียดสินค้า"
        : "Great for sharing photos or product details",
      href: "https://facebook.com/reachbadminton"
    },
    {
      icon: <MessageCircle className="text-brand-yellow" size={24} />,
      title: "Instagram DM",
      handle: "@reachbadminton",
      detail: language === "th"
        ? "แนะนำสินค้าและตอบคำถามเบื้องต้น"
        : "Quick recommendations and questions",
      href: "https://instagram.com/reachbadminton"
    },
    {
      icon: <PhoneCall className="text-brand-yellow" size={24} />,
      title: language === "th" ? "โทรหาเรา" : "Call Us",
      handle: "+66 2 123 4567",
      detail: language === "th"
        ? "สายตรงทีมบริการลูกค้า"
        : "Direct line to customer support",
      href: "tel:+6621234567"
    },
    {
      icon: <Mail className="text-brand-yellow" size={24} />,
      title: language === "th" ? "อีเมล" : "Email",
      handle: "support@reachbadminton.co",
      detail: language === "th"
        ? "เหมาะสำหรับการส่งใบเสร็จหรือเอกสาร"
        : "Best for receipts and documentation",
      href: "mailto:support@reachbadminton.co"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">
              {language === "th" ? "ศูนย์บริการ" : "Customer Care"}
            </p>
            <h1 className="text-4xl font-bold text-black mb-4">
              {language === "th" ? "ติดต่อเรา" : "Contact Us"}
            </h1>
            <p className="text-gray-600 mb-10">
              {language === "th"
                ? "ทีมงาน REACH พร้อมช่วยเลือกสินค้า ติดตามคำสั่งซื้อ และดูแลหลังการขาย"
                : "REACH team is ready to help with product selection, order tracking, and after-sales support."}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-gray-200 rounded-2xl p-5 hover:border-brand-yellow hover:-translate-y-1 transition"
                >
                  <div className="flex items-center gap-3">
                    {channel.icon}
                    <div>
                      <p className="text-sm font-semibold text-black">{channel.title}</p>
                      <p className="text-xs text-gray-500">{channel.handle}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{channel.detail}</p>
                </a>
              ))}
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-brand-yellow" size={22} />
                  <h2 className="text-lg font-semibold text-black">
                    {language === "th" ? "เวลาทำการ" : "Business Hours"}
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "th"
                    ? "ทุกวัน 09:00 - 20:00 น. (รวมวันหยุดนักขัตฤกษ์)"
                    : "Daily 09:00 - 20:00 (including public holidays)"}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="text-brand-yellow" size={22} />
                  <h2 className="text-lg font-semibold text-black">
                    {language === "th" ? "โชว์รูมและที่อยู่" : "Showroom Address"}
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "th"
                    ? "123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110"
                    : "123 Sukhumvit Rd., เขตวัฒนา, Bangkok 10110"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {language === "th"
                    ? "แนะนำให้จองคิวล่วงหน้าสำหรับการฟิตติ้งไม้แบด"
                    : "Book an appointment in advance for racket fitting."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
