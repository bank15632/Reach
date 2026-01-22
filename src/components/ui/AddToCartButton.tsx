"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  variant?: "primary" | "secondary" | "icon";
  size?: "sm" | "md" | "lg";
  showQuantitySelector?: boolean;
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = "primary",
  size = "md",
  showQuantitySelector = false,
  className = "",
}: AddToCartButtonProps) {
  const { language } = useLanguage();
  const { addItem, isInCart, getItemQuantity, updateQuantity, removeItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const inCart = isInCart(product.id, product.color?.name, product.size);
  const cartQuantity = getItemQuantity(product.id, product.color?.name, product.size);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setQuantity(1);

    // Reset animation after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleIncrement = () => {
    if (inCart) {
      updateQuantity(product.id, cartQuantity + 1, product.color?.name, product.size);
    } else {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (inCart) {
      if (cartQuantity > 1) {
        updateQuantity(product.id, cartQuantity - 1, product.color?.name, product.size);
      } else {
        removeItem(product.id, product.color?.name, product.size);
      }
    } else {
      setQuantity((q) => Math.max(1, q - 1));
    }
  };

  const text = {
    addToCart: language === "th" ? "เพิ่มลงตะกร้า" : "Add to Cart",
    added: language === "th" ? "เพิ่มแล้ว!" : "Added!",
    inCart: language === "th" ? "อยู่ในตะกร้า" : "In Cart",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary:
      "bg-brand-yellow text-black hover:bg-yellow-400 focus:ring-brand-yellow",
    secondary:
      "bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black",
    icon: "bg-brand-yellow text-black hover:bg-yellow-400 p-3 rounded-full focus:ring-brand-yellow",
  };

  // Icon-only variant
  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses.icon} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${className}`}
        aria-label={text.addToCart}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <ShoppingCart size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // With quantity selector
  if (showQuantitySelector && inCart) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center border-2 border-black rounded-lg">
          <button
            onClick={handleDecrement}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-bold">{cartQuantity}</span>
          <button
            onClick={handleIncrement}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </button>
        </div>
        <span className="text-sm text-gray-600">{text.inCart}</span>
      </div>
    );
  }

  // Standard button
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showQuantitySelector && !inCart && (
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isAdded}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          font-semibold rounded-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-all duration-200
          flex items-center justify-center gap-2
          disabled:opacity-80
          flex-1
        `}
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
  );
}
