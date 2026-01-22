"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CartToast from "@/components/ui/CartToast";

interface ProductAddToCartProps {
  product: {
    id: string;
    name: string;
    nameTh: string;
    price: number;
    originalPrice?: number;
    images: string[];
  };
  selectedColor?: {
    name: string;
    nameTh: string;
    hex: string;
    image?: string;
  };
  selectedSize?: string;
  category: "rackets" | "shoes" | "sportswear" | "supplements" | "bundles";
}

export default function ProductAddToCart({
  product,
  selectedColor,
  selectedSize,
  category,
}: ProductAddToCartProps) {
  const { language } = useLanguage();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        nameTh: product.nameTh,
        price: product.price,
        originalPrice: product.originalPrice,
        image: selectedColor?.image || product.images[0],
        color: selectedColor
          ? {
              name: selectedColor.name,
              nameTh: selectedColor.nameTh,
              hex: selectedColor.hex,
            }
          : undefined,
        size: selectedSize,
        category,
      },
      quantity
    );

    setIsAdded(true);
    setShowToast(true);

    // Reset after animation
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 2000);
  };

  const text = {
    quantity: language === "th" ? "จำนวน" : "Quantity",
    addToCart: language === "th" ? "เพิ่มลงตะกร้า" : "Add to Cart",
    added: language === "th" ? "เพิ่มแล้ว!" : "Added!",
  };

  return (
    <>
      <div className="space-y-3">
        <p className="text-sm text-gray-700 font-medium">{text.quantity}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 bg-white">
            <button
              onClick={decrease}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <span className="text-2xl font-light text-gray-700">−</span>
            </button>
            <span className="w-14 h-12 flex items-center justify-center text-center text-lg font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={increase}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300"
              aria-label="Increase quantity"
            >
              <span className="text-2xl font-light text-gray-700">+</span>
            </button>
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdded}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isAdded
                ? "bg-green-500 text-white border-2 border-green-500"
                : "bg-white border-2 border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check size={18} />
                  {text.added}
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {text.addToCart}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Cart Toast Notification */}
      <CartToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        product={
          showToast
            ? {
                name: product.name,
                nameTh: product.nameTh,
                image: selectedColor?.image || product.images[0],
                price: product.price,
                color: selectedColor
                  ? {
                      name: selectedColor.name,
                      nameTh: selectedColor.nameTh,
                    }
                  : undefined,
                size: selectedSize,
              }
            : null
        }
      />
    </>
  );
}
