"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { HelpCircle, PackageSearch, Truck, ShieldCheck } from "lucide-react";

export default function FaqPage() {
  const { language } = useLanguage();

  const faqs = [
    {
      icon: <PackageSearch className="text-brand-yellow" size={24} />,
      title: language === "th" ? "เช็คสถานะคำสั่งซื้อ" : "Tracking Orders",
      detail:
        language === "th"
          ? "ใช้หมายเลขคำสั่งซื้อของคุณในหน้าติดตามคำสั่งซื้อ หรือทัก LINE เพื่อให้ทีมงานช่วยเช็คแบบเรียลไทม์"
          : "Use your order number on the track order page or message LINE for real-time assistance."
    },
    {
      icon: <Truck className="text-brand-yellow" size={24} />,
      title: language === "th" ? "ระยะเวลาการจัดส่ง" : "Shipping Timeline",
      detail:
        language === "th"
          ? "จัดส่งภายใน 1-3 วันทำการในเขตกรุงเทพฯ และ 2-5 วันทำการสำหรับต่างจังหวัด"
          : "Delivery takes 1-3 business days in Bangkok and 2-5 business days for other provinces."
    },
    {
      icon: <ShieldCheck className="text-brand-yellow" size={24} />,
      title: language === "th" ? "การรับประกันสินค้า" : "Product Warranty",
      detail:
        language === "th"
          ? "ไม้แบดและรองเท้ามีการรับประกัน 6 เดือน หากพบปัญหาจากการผลิตสามารถเปลี่ยนได้ทันที"
          : "Rackets and shoes include a 6-month warranty. Manufacturing defects are eligible for immediate replacement."
    },
    {
      icon: <HelpCircle className="text-brand-yellow" size={24} />,
      title: language === "th" ? "การเลือกอุปกรณ์ให้เหมาะ" : "Choosing the Right Gear",
      detail:
        language === "th"
          ? "หากไม่แน่ใจเรื่องระดับความแข็งของไม้หรือไซส์รองเท้า แนะนำดูบทความคู่มือ หรือทักทีมงานเพื่อให้แนะนำตามสไตล์การเล่น"
          : "Check our guides for stiffness and sizing tips, or chat with our team to match your play style."
    }
  ];

  const quickLinks = [
    {
      label: language === "th" ? "ติดตามคำสั่งซื้อ" : "Track Order",
      href: "/track-order"
    },
    {
      label: language === "th" ? "นโยบายคืนสินค้า" : "Returns Policy",
      href: "/returns"
    },
    {
      label: language === "th" ? "ติดต่อทีมงาน" : "Contact Support",
      href: "/contact"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">
              {language === "th" ? "ศูนย์ช่วยเหลือ" : "Help Center"}
            </p>
            <h1 className="text-4xl font-bold text-black mb-4">
              {language === "th" ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
            </h1>
            <p className="text-gray-600 mb-10">
              {language === "th"
                ? "รวมคำถามยอดนิยมสำหรับการซื้อสินค้า การจัดส่ง และการรับประกัน"
                : "Quick answers about orders, shipping, and warranty."}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <div key={faq.title} className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    {faq.icon}
                    <h3 className="text-lg font-semibold text-black">{faq.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-brand-black rounded-3xl p-6 md:p-8 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-yellow mb-3">
                {language === "th" ? "ต้องการความช่วยเหลือเพิ่ม" : "Need More Help"}
              </p>
              <h2 className="text-2xl font-bold mb-4">
                {language === "th" ? "ทีมงานพร้อมดูแลทุกคำถาม" : "Our team is ready to help"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="bg-white/10 hover:bg-white hover:text-black transition-colors px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
