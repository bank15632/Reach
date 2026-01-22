"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { ClipboardList, MessageCircle, PhoneCall } from "lucide-react";

export default function ReturnsPage() {
  const { language } = useLanguage();

  const steps = [
    {
      title: language === "th" ? "กรอกแบบคำร้อง" : "Submit Request",
      detail:
        language === "th"
          ? "กรอกหมายเลขคำสั่งซื้อ เลือกสินค้าที่ต้องการคืน พร้อมเหตุผล"
          : "Provide order number, select the items, and explain the reason"
    },
    {
      title: language === "th" ? "ยืนยันกับทีมงาน" : "Confirm With Support",
      detail:
        language === "th"
          ? "ทีมงานจะติดต่อกลับภายใน 24 ชม. เพื่อยืนยันเงื่อนไขและวิธีส่งคืน"
          : "Support will reach out within 24h to confirm the method"
    },
    {
      title: language === "th" ? "จัดส่งสินค้า" : "Ship Items",
      detail:
        language === "th"
          ? "แพ็กสินค้าและนำส่งตามที่ได้รับแจ้ง พร้อมแนบใบเสร็จ"
          : "Pack the product, ship via instructed carrier, and keep the receipt"
    },
    {
      title: language === "th" ? "รับเงินคืน" : "Receive Refund",
      detail:
        language === "th"
          ? "เงินคืนเข้าบัญชีภายใน 5-7 วันทำการหลังตรวจสอบ"
          : "Refund arrives within 5-7 business days"
    }
  ];

  const channels = [
    {
      icon: <MessageCircle className="text-brand-yellow" size={24} />,
      title: "LINE",
      handle: "@reachbadminton",
      description: language === "th"
        ? "แอดไลน์เพื่อส่งรูปสินค้าที่ต้องการคืน"
        : "Add us to share photos of the product",
      href: "https://line.me/R/ti/p/@reachbadminton"
    },
    {
      icon: <MessageCircle className="text-brand-yellow" size={24} />,
      title: "Messenger",
      handle: "Reach Badminton",
      description: language === "th"
        ? "แจ้งหมายเลขคำสั่งซื้อและสลิปส่งคืน"
        : "Send your order ID and shipping receipt",
      href: "https://facebook.com/reachbadminton"
    },
    {
      icon: <PhoneCall className="text-brand-yellow" size={24} />,
      title: language === "th" ? "ศูนย์บริการ" : "Call Center",
      handle: "+66 2 123 4567",
      description: language === "th"
        ? "เปิดทุกวัน 09:00-20:00 น."
        : "Open daily 09:00-20:00",
      href: "tel:+6621234567"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">
              {language === "th" ? "บริการลูกค้า" : "Customer Service"}
            </p>
            <h1 className="text-4xl font-bold text-black mb-4">
              {language === "th" ? "คืน / เปลี่ยนสินค้า" : "Returns & Exchanges"}
            </h1>
            <p className="text-gray-600 mb-10">
              {language === "th"
                ? "อ่านขั้นตอนด้านล่าง แล้วติดต่อทีมงานผ่านช่องทางโซเชียลเพื่อเริ่มการคืนสินค้า"
                : "Follow the steps below and reach our support channels to start a return."}
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <ClipboardList className="text-brand-yellow" size={32} />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                    {language === "th" ? "ขั้นตอน" : "Steps"}
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    {language === "th" ? "ขั้นตอนการคืนสินค้า" : "How to Request a Return"}
                  </h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="text-sm font-semibold text-gray-400 mb-2">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black mb-4">
                {language === "th" ? "ช่องทาง Social ติดต่อทีมงาน" : "Social Channels"}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
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
                    <p className="mt-3 text-sm text-gray-600">{channel.description}</p>
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
