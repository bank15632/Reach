"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  Building2,
  Truck,
  ShieldCheck,
  Check,
  AlertCircle,
} from "lucide-react";

// Step Indicator Component
function StepIndicator({
  currentStep,
  language,
}: {
  currentStep: number;
  language: string;
}) {
  const steps = [
    { en: "Shipping", th: "ที่อยู่จัดส่ง" },
    { en: "Payment", th: "ชำระเงิน" },
    { en: "Review", th: "ยืนยัน" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
              index + 1 <= currentStep
                ? "bg-brand-yellow text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1 < currentStep ? <Check size={16} /> : index + 1}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              index + 1 <= currentStep ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {language === "th" ? step.th : step.en}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-4 ${
                index + 1 < currentStep ? "bg-brand-yellow" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Shipping Form Component
function ShippingForm({
  formData,
  onChange,
  errors,
  language,
}: {
  formData: ShippingData;
  onChange: (data: ShippingData) => void;
  errors: Record<string, string>;
  language: string;
}) {
  const text = {
    firstName: language === "th" ? "ชื่อ" : "First Name",
    lastName: language === "th" ? "นามสกุล" : "Last Name",
    email: language === "th" ? "อีเมล" : "Email",
    phone: language === "th" ? "เบอร์โทรศัพท์" : "Phone Number",
    address: language === "th" ? "ที่อยู่" : "Address",
    district: language === "th" ? "แขวง/ตำบล" : "District",
    subdistrict: language === "th" ? "เขต/อำเภอ" : "Sub-district",
    province: language === "th" ? "จังหวัด" : "Province",
    postalCode: language === "th" ? "รหัสไปรษณีย์" : "Postal Code",
    note: language === "th" ? "หมายเหตุ (ถ้ามี)" : "Note (optional)",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {language === "th" ? "ข้อมูลการจัดส่ง" : "Shipping Information"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.firstName} *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.lastName} *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.email} *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.phone} *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            placeholder="0XX-XXX-XXXX"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {text.address} *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
          placeholder={language === "th" ? "บ้านเลขที่ ซอย ถนน" : "House number, Street"}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.district} *
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => onChange({ ...formData, district: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.district ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.district && (
            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.subdistrict} *
          </label>
          <input
            type="text"
            value={formData.subdistrict}
            onChange={(e) => onChange({ ...formData, subdistrict: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.subdistrict ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.subdistrict && (
            <p className="text-red-500 text-xs mt-1">{errors.subdistrict}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.province} *
          </label>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => onChange({ ...formData, province: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.province ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.province && (
            <p className="text-red-500 text-xs mt-1">{errors.province}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {text.postalCode} *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => onChange({ ...formData, postalCode: e.target.value })}
            maxLength={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {text.note}
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => onChange({ ...formData, note: e.target.value })}
          rows={3}
          placeholder={
            language === "th"
              ? "เช่น ให้วางของหน้าบ้าน หรือ โทรก่อนจัดส่ง"
              : "e.g., Leave at front door, Call before delivery"
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none resize-none"
        />
      </div>
    </div>
  );
}

// Payment Method Component
function PaymentMethod({
  selectedMethod,
  onSelect,
  language,
}: {
  selectedMethod: string;
  onSelect: (method: string) => void;
  language: string;
}) {
  const methods = [
    {
      id: "promptpay",
      name: language === "th" ? "พร้อมเพย์ / QR Code" : "PromptPay / QR Code",
      desc: language === "th" ? "สแกน QR Code ชำระเงินทันที" : "Scan QR Code for instant payment",
      icon: Smartphone,
      recommended: true,
    },
    {
      id: "credit_card",
      name: language === "th" ? "บัตรเครดิต / เดบิต" : "Credit / Debit Card",
      desc: language === "th" ? "Visa, Mastercard, JCB" : "Visa, Mastercard, JCB",
      icon: CreditCard,
    },
    {
      id: "bank_transfer",
      name: language === "th" ? "โอนเงินผ่านธนาคาร" : "Bank Transfer",
      desc: language === "th" ? "โอนเงินและแจ้งชำระ" : "Transfer and notify payment",
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {language === "th" ? "เลือกวิธีชำระเงิน" : "Select Payment Method"}
      </h2>

      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 text-left ${
              selectedMethod === method.id
                ? "border-brand-yellow bg-yellow-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`p-3 rounded-full ${
                selectedMethod === method.id ? "bg-brand-yellow" : "bg-gray-100"
              }`}
            >
              <method.icon
                size={24}
                className={selectedMethod === method.id ? "text-black" : "text-gray-600"}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{method.name}</span>
                {method.recommended && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {language === "th" ? "แนะนำ" : "Recommended"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{method.desc}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id
                  ? "border-brand-yellow bg-brand-yellow"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === method.id && <Check size={12} className="text-black" />}
            </div>
          </button>
        ))}
      </div>

      {/* PromptPay QR Display */}
      {selectedMethod === "promptpay" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-6 bg-gray-50 rounded-lg text-center"
        >
          <p className="text-sm text-gray-600 mb-4">
            {language === "th"
              ? "QR Code จะแสดงหลังจากยืนยันคำสั่งซื้อ"
              : "QR Code will be displayed after order confirmation"}
          </p>
          <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">QR Code</span>
          </div>
        </motion.div>
      )}

      {/* Credit Card Form Placeholder */}
      {selectedMethod === "credit_card" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-6 bg-gray-50 rounded-lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "th" ? "หมายเลขบัตร" : "Card Number"}
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "th" ? "วันหมดอายุ" : "Expiry Date"}
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bank Transfer Info */}
      {selectedMethod === "bank_transfer" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-6 bg-gray-50 rounded-lg"
        >
          <h3 className="font-semibold text-gray-900 mb-3">
            {language === "th" ? "บัญชีธนาคาร" : "Bank Account"}
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">
                {language === "th" ? "ธนาคาร:" : "Bank:"}
              </span>{" "}
              <span className="font-medium">กสิกรไทย (KBANK)</span>
            </p>
            <p>
              <span className="text-gray-500">
                {language === "th" ? "เลขบัญชี:" : "Account:"}
              </span>{" "}
              <span className="font-medium">XXX-X-XXXXX-X</span>
            </p>
            <p>
              <span className="text-gray-500">
                {language === "th" ? "ชื่อบัญชี:" : "Name:"}
              </span>{" "}
              <span className="font-medium">บจก. รีช สปอร์ต</span>
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            {language === "th"
              ? "* หลังโอนเงิน กรุณาแจ้งชำระเงินผ่าน LINE @reachstore"
              : "* After transfer, please notify via LINE @reachstore"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Order Review Component
function OrderReview({
  shippingData,
  paymentMethod,
  language,
}: {
  shippingData: ShippingData;
  paymentMethod: string;
  language: string;
}) {
  const { items, subtotal, total } = useCart();
  const shipping = subtotal >= 2000 ? 0 : 100;

  const paymentNames: Record<string, { en: string; th: string }> = {
    promptpay: { en: "PromptPay / QR Code", th: "พร้อมเพย์ / QR Code" },
    credit_card: { en: "Credit / Debit Card", th: "บัตรเครดิต / เดบิต" },
    bank_transfer: { en: "Bank Transfer", th: "โอนเงินผ่านธนาคาร" },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        {language === "th" ? "ตรวจสอบคำสั่งซื้อ" : "Review Your Order"}
      </h2>

      {/* Shipping Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            {language === "th" ? "ที่อยู่จัดส่ง" : "Shipping Address"}
          </h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p>{shippingData.phone}</p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.district}, {shippingData.subdistrict}
          </p>
          <p>
            {shippingData.province} {shippingData.postalCode}
          </p>
          {shippingData.note && (
            <p className="text-gray-500 italic mt-2">
              {language === "th" ? "หมายเหตุ:" : "Note:"} {shippingData.note}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            {language === "th" ? "วิธีชำระเงิน" : "Payment Method"}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {language === "th"
            ? paymentNames[paymentMethod]?.th
            : paymentNames[paymentMethod]?.en}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">
          {language === "th" ? "สินค้าในคำสั่งซื้อ" : "Order Items"} ({items.length})
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.color?.name}-${item.size}`}
              className="flex gap-3"
            >
              <div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={language === "th" ? item.nameTh : item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {language === "th" ? item.nameTh : item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.color && (language === "th" ? item.color.nameTh : item.color.name)}
                  {item.color && item.size && " • "}
                  {item.size}
                </p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900 text-sm">
                ฿{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Order Summary Sidebar
function OrderSummary({
  language,
  onPlaceOrder,
  isProcessing,
  currentStep,
}: {
  language: string;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  currentStep: number;
}) {
  const { items, subtotal, discount, total } = useCart();
  const shipping = subtotal >= 2000 ? 0 : 100;
  const finalTotal = total + shipping;

  const text = {
    summary: language === "th" ? "สรุปคำสั่งซื้อ" : "Order Summary",
    subtotal: language === "th" ? "ยอดรวมสินค้า" : "Subtotal",
    shipping: language === "th" ? "ค่าจัดส่ง" : "Shipping",
    free: language === "th" ? "ฟรี" : "FREE",
    discount: language === "th" ? "ส่วนลด" : "Discount",
    total: language === "th" ? "ยอดชำระทั้งหมด" : "Total",
    placeOrder: language === "th" ? "ยืนยันคำสั่งซื้อ" : "Place Order",
    processing: language === "th" ? "กำลังดำเนินการ..." : "Processing...",
    secure: language === "th" ? "การชำระเงินปลอดภัย 100%" : "100% Secure Payment",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{text.summary}</h2>

      {/* Items Preview */}
      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.color?.name}-${item.size}`}
            className="flex gap-3"
          >
            <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={language === "th" ? item.nameTh : item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {language === "th" ? item.nameTh : item.name}
              </p>
              <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ฿{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{text.subtotal}</span>
          <span className="text-gray-900">฿{subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-red-500">
            <span>{text.discount}</span>
            <span>-฿{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{text.shipping}</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
            {shipping === 0 ? text.free : `฿${shipping}`}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">{text.total}</span>
            <span className="text-gray-900">฿{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {currentStep === 3 && (
        <button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full mt-6 py-4 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
              {text.processing}
            </>
          ) : (
            text.placeOrder
          )}
        </button>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck size={14} />
        <span>{text.secure}</span>
      </div>
    </div>
  );
}

// Types
interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  subdistrict: string;
  province: string;
  postalCode: string;
  note: string;
}

// Main Checkout Page
export default function CheckoutPage() {
  const { language } = useLanguage();
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    subdistrict: "",
    province: "",
    postalCode: "",
    note: "",
  });

  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("promptpay");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Validate shipping form
  const validateShipping = (): boolean => {
    const errors: Record<string, string> = {};
    const required = language === "th" ? "กรุณากรอกข้อมูล" : "This field is required";

    if (!shippingData.firstName) errors.firstName = required;
    if (!shippingData.lastName) errors.lastName = required;
    if (!shippingData.email) {
      errors.email = required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      errors.email = language === "th" ? "รูปแบบอีเมลไม่ถูกต้อง" : "Invalid email format";
    }
    if (!shippingData.phone) {
      errors.phone = required;
    } else if (!/^0\d{8,9}$/.test(shippingData.phone.replace(/-/g, ""))) {
      errors.phone = language === "th" ? "เบอร์โทรไม่ถูกต้อง" : "Invalid phone number";
    }
    if (!shippingData.address) errors.address = required;
    if (!shippingData.district) errors.district = required;
    if (!shippingData.subdistrict) errors.subdistrict = required;
    if (!shippingData.province) errors.province = required;
    if (!shippingData.postalCode) {
      errors.postalCode = required;
    } else if (!/^\d{5}$/.test(shippingData.postalCode)) {
      errors.postalCode = language === "th" ? "รหัสไปรษณีย์ต้องเป็น 5 หลัก" : "Postal code must be 5 digits";
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateShipping()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Clear cart and redirect to confirmation
    clearCart();
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) {
    return null;
  }

  const text = {
    title: language === "th" ? "ชำระเงิน" : "Checkout",
    back: language === "th" ? "ย้อนกลับ" : "Back",
    continue: language === "th" ? "ดำเนินการต่อ" : "Continue",
    backToCart: language === "th" ? "กลับไปตะกร้า" : "Back to Cart",
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <section className="pt-24 pb-8 bg-brand-black">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb
            items={[
              { label: "Cart", labelTh: "ตะกร้า", href: "/cart" },
              { label: "Checkout", labelTh: "ชำระเงิน" },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white">{text.title}</h1>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} language={language} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ShippingForm
                        formData={shippingData}
                        onChange={setShippingData}
                        errors={shippingErrors}
                        language={language}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <PaymentMethod
                        selectedMethod={paymentMethod}
                        onSelect={setPaymentMethod}
                        language={language}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <OrderReview
                        shippingData={shippingData}
                        paymentMethod={paymentMethod}
                        language={language}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={currentStep === 1 ? () => router.push("/cart") : handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft size={18} />
                    {currentStep === 1 ? text.backToCart : text.back}
                  </button>

                  {currentStep < 3 && (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      {text.continue}
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                language={language}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
                currentStep={currentStep}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
