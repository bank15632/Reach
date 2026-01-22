"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { PackageSearch, MessageCircle, LineChart } from "lucide-react";

export default function TrackOrderPage() {
  const { language } = useLanguage();
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<null | { stage: string; detail: string }>(null);

  const mockStatus = {
    stage: language === "th" ? "กำลังจัดส่ง" : "In Transit",
    detail: language === "th"
      ? "พัสดุกำลังเดินทางไปยังศูนย์คัดแยกหลัก"
      : "Parcel is en route to the main sorting facility"
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setStatus(mockStatus);
  };

  const channels = [
    {
      title: language === "th" ? "LINE Official" : "LINE Official",
      handle: "@reachbadminton",
      description: language === "th"
        ? "แชทกับเจ้าหน้าที่เพื่ออัปเดตสถานะล่าสุด"
        : "Chat with our staff for live updates",
      href: "https://line.me/R/ti/p/@reachbadminton"
    },
    {
      title: language === "th" ? "Facebook Messenger" : "Facebook Messenger",
      handle: "Reach Badminton",
      description: language === "th"
        ? "ส่งข้อความพร้อมหมายเลข Tracking"
        : "Send us your tracking number",
      href: "https://facebook.com/reachbadminton"
    },
    {
      title: language === "th" ? "Instagram DM" : "Instagram DM",
      handle: "@reachbadminton",
      description: language === "th"
        ? "ทีมงานตอบกลับภายใน 1 ชั่วโมง"
        : "Responses within 1 hour",
      href: "https://instagram.com/reachbadminton"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">
              {language === "th" ? "บริการหลังการขาย" : "After-Sales Support"}
            </p>
            <h1 className="text-4xl font-bold text-black mb-4">
              {language === "th" ? "ติดตามคำสั่งซื้อ" : "Track Your Order"}
            </h1>
            <p className="text-gray-600 mb-10">
              {language === "th"
                ? "กรอกหมายเลข Tracking เพื่อดูสถานะล่าสุด หรือเลือกช่องทางติดต่อทีมบริการลูกค้า"
                : "Enter your tracking ID to view the latest status or contact our support team."}
            </p>

            <form onSubmit={handleTrack} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
              <label className="text-sm font-semibold text-gray-700">
                {language === "th" ? "หมายเลขพัสดุ" : "Tracking ID"}
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder={language === "th" ? "เช่น TH123456789" : "Ex. TH123456789"}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-white text-black placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-yellow text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors"
                >
                  {language === "th" ? "ติดตามพัสดุ" : "Track Now"}
                </button>
              </div>

              {status ? (
                <div className="mt-4 flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                  <LineChart className="text-brand-yellow" size={28} />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500">
                      {language === "th" ? "สถานะล่าสุด" : "Current Status"}
                    </p>
                    <p className="text-lg font-semibold text-black">{status.stage}</p>
                    <p className="text-gray-500 text-sm">{status.detail}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                  <PackageSearch size={18} />
                  {language === "th" ? "รองรับทุกบริษัทขนส่งภายในประเทศ" : "Supports all domestic couriers"}
                </div>
              )}
            </form>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-black mb-4">
                {language === "th" ? "ติดต่อทีมบริการลูกค้า" : "Talk to Support"}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <a
                    key={channel.title}
                    href={channel.href}
                    className="border border-gray-200 rounded-2xl p-5 hover:border-brand-yellow hover:-translate-y-1 transition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="text-brand-yellow" />
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
