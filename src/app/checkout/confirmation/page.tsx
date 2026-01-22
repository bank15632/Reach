"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Package, Truck, Mail, ArrowRight, Copy, CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Generate order number
  const orderNumber = `REACH-${Date.now().toString(36).toUpperCase()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const formatDate = (date: Date) => {
    if (language === "th") {
      const thMonths = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
      ];
      return `${date.getDate()} ${thMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const text = {
    title: language === "th" ? "ขอบคุณสำหรับคำสั่งซื้อ!" : "Thank You for Your Order!",
    subtitle: language === "th"
      ? "เราได้รับคำสั่งซื้อของคุณแล้ว และกำลังเตรียมจัดส่ง"
      : "We've received your order and are preparing it for shipment.",
    orderNumber: language === "th" ? "หมายเลขคำสั่งซื้อ" : "Order Number",
    copy: language === "th" ? "คัดลอก" : "Copy",
    copied: language === "th" ? "คัดลอกแล้ว!" : "Copied!",
    estimatedDelivery: language === "th" ? "คาดว่าจะจัดส่งภายใน" : "Estimated Delivery",
    whatHappensNext: language === "th" ? "ขั้นตอนต่อไป" : "What Happens Next",
    steps: [
      {
        icon: Mail,
        title: language === "th" ? "ยืนยันทางอีเมล" : "Email Confirmation",
        desc: language === "th"
          ? "คุณจะได้รับอีเมลยืนยันพร้อมรายละเอียดคำสั่งซื้อ"
          : "You will receive an email confirmation with your order details.",
      },
      {
        icon: Package,
        title: language === "th" ? "เตรียมสินค้า" : "Order Processing",
        desc: language === "th"
          ? "ทีมงานของเรากำลังเตรียมสินค้าของคุณ"
          : "Our team is preparing your items for shipment.",
      },
      {
        icon: Truck,
        title: language === "th" ? "จัดส่งสินค้า" : "Shipping",
        desc: language === "th"
          ? "คุณจะได้รับเลขติดตามพัสดุทางอีเมลเมื่อจัดส่ง"
          : "You'll receive a tracking number via email when your order ships.",
      },
    ],
    continueShopping: language === "th" ? "ช้อปต่อ" : "Continue Shopping",
    trackOrder: language === "th" ? "ติดตามคำสั่งซื้อ" : "Track Order",
    needHelp: language === "th" ? "ต้องการความช่วยเหลือ?" : "Need Help?",
    contactUs: language === "th" ? "ติดต่อเรา" : "Contact Us",
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {text.title}
            </h1>
            <p className="text-gray-600">{text.subtitle}</p>
          </motion.div>

          {/* Order Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{text.orderNumber}</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">
                  {orderNumber}
                </p>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} />
                    {text.copied}
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    {text.copy}
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Estimated Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-yellow rounded-full">
                <Truck className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{text.estimatedDelivery}</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(estimatedDelivery)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {text.whatHappensNext}
            </h2>
            <div className="space-y-6">
              {text.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/shop"
              className="flex-1 py-4 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              {text.continueShopping}
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/track-order"
              className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-lg hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              {text.trackOrder}
            </Link>
          </motion.div>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500">
              {text.needHelp}{" "}
              <Link
                href="/contact"
                className="text-brand-yellow hover:underline font-medium"
              >
                {text.contactUs}
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
