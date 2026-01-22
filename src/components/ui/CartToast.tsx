"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface CartToastProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    nameTh: string;
    image: string;
    price: number;
    color?: {
      name: string;
      nameTh: string;
    };
    size?: string;
  } | null;
}

export default function CartToast({ isOpen, onClose, product }: CartToastProps) {
  const { language } = useLanguage();

  // Auto-close after 4 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!product) return null;

  const text = {
    addedToCart: language === "th" ? "เพิ่มลงตะกร้าแล้ว" : "Added to Cart",
    viewCart: language === "th" ? "ดูตะกร้า" : "View Cart",
    continueShopping: language === "th" ? "ช้อปต่อ" : "Continue",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-24 right-4 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-2 text-green-700">
              <div className="p-1 bg-green-500 rounded-full">
                <Check size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm">{text.addedToCart}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={language === "th" ? product.nameTh : product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {language === "th" ? product.nameTh : product.name}
                </h4>
                <div className="text-xs text-gray-500 mt-0.5">
                  {product.color && (
                    <span>
                      {language === "th" ? product.color.nameTh : product.color.name}
                    </span>
                  )}
                  {product.color && product.size && <span> • </span>}
                  {product.size && <span>{product.size}</span>}
                </div>
                <p className="font-bold text-gray-900 mt-1">
                  ฿{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {text.continueShopping}
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-semibold text-center text-black bg-brand-yellow rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingCart size={14} />
              {text.viewCart}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
