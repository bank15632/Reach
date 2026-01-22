"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Gift } from "lucide-react";

export default function CartPage() {
  const { language } = useLanguage();
  const { items, itemCount, subtotal, discount, total, updateQuantity, removeItem, clearCart } = useCart();
  const { totalPoints, availablePoints, usedPoints, redeemedRewards, unredeemReward, removeReward } = useUser();

  const content = {
    en: {
      title: "Shopping Cart",
      itemCount: "items",
      empty: {
        title: "Your cart is empty",
        subtitle: "Looks like you haven't added anything to your cart yet.",
        cta: "Continue Shopping",
      },
      item: {
        color: "Color",
        size: "Size",
        remove: "Remove",
      },
      summary: {
        title: "Order Summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        shippingFree: "FREE",
        shippingNote: "Free shipping on orders over ฿2,000",
        discount: "Discount",
        total: "Total",
        checkout: "Proceed to Checkout",
        continueShopping: "Continue Shopping",
      },
      promoCode: {
        placeholder: "Enter promo code",
        apply: "Apply",
      },
      loyalty: {
        title: "Loyalty Points",
        available: "Available Points",
        earned: "Points earned from this order",
        used: "Points redeemed",
        remaining: "Points after redemption",
        rewardsTitle: "Redeem Rewards",
        rewardsSubtitle: "Use points to redeem free items from your cart",
        pointsUnit: "pts",
        redeem: "Redeem",
        redeemed: "Redeemed",
        notEnough: "Not enough points",
        redeemPage: "Go to Rewards Page",
      },
      clearCart: "Clear Cart",
    },
    th: {
      title: "ตะกร้าสินค้า",
      itemCount: "รายการ",
      empty: {
        title: "ตะกร้าของคุณว่างเปล่า",
        subtitle: "ดูเหมือนคุณยังไม่ได้เพิ่มสินค้าในตะกร้า",
        cta: "เลือกซื้อสินค้า",
      },
      item: {
        color: "สี",
        size: "ไซส์",
        remove: "ลบ",
      },
      summary: {
        title: "สรุปคำสั่งซื้อ",
        subtotal: "ยอดรวม",
        shipping: "ค่าจัดส่ง",
        shippingFree: "ฟรี",
        shippingNote: "จัดส่งฟรีเมื่อสั่งซื้อครบ ฿2,000",
        discount: "ส่วนลด",
        total: "ยอดสุทธิ",
        checkout: "ดำเนินการชำระเงิน",
        continueShopping: "เลือกซื้อต่อ",
      },
      promoCode: {
        placeholder: "ใส่รหัสส่วนลด",
        apply: "ใช้โค้ด",
      },
      loyalty: {
        title: "คะแนนสะสม",
        available: "คะแนนที่มี",
        earned: "คะแนนที่จะได้รับจากออเดอร์นี้",
        used: "คะแนนที่ใช้แลก",
        remaining: "คะแนนคงเหลือหลังแลก",
        rewardsTitle: "แลกของรางวัล",
        rewardsSubtitle: "ใช้คะแนนแลกรับสินค้าแถมที่เลือกได้",
        pointsUnit: "คะแนน",
        redeem: "แลกของรางวัล",
        redeemed: "แลกแล้ว",
        notEnough: "คะแนนไม่พอ",
        redeemPage: "ไปหน้าแลกของรางวัล",
      },
      clearCart: "ล้างตะกร้า",
    },
  };

  const t = language === "th" ? content.th : content.en;

  // Shipping calculation
  const shipping = subtotal >= 2000 ? 0 : 100;
  const finalTotal = total + shipping;

  // Loyalty points - using UserContext
  const pointsEarned = Math.floor(subtotal / 100);

  // Toggle reward redemption status
  const toggleRewardSelection = (rewardId: string) => {
    const reward = redeemedRewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (reward.redeemed) {
      // Un-redeem it
      unredeemReward(rewardId);
    } else {
      // Can't re-redeem from cart - need to go to rewards page
      // This maintains consistency with the flow
    }
  };

  // Get category href
  const getCategoryHref = (category: string, id: string) => {
    return `/${category}/${id}`;
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <section className="pt-24 pb-8 bg-brand-black">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: "Cart", labelTh: "ตะกร้าสินค้า" }]} />
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t.title}
              {itemCount > 0 && (
                <span className="ml-3 text-lg font-normal text-gray-400">
                  ({itemCount} {t.itemCount})
                </span>
              )}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                {t.clearCart}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              /* Empty Cart State */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.empty.title}</h2>
                <p className="text-gray-600 mb-8">{t.empty.subtitle}</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  {t.empty.cta}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${item.color?.name}-${item.size}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-sm p-4 md:p-6"
                      >
                        <div className="flex gap-4 md:gap-6">
                          {/* Product Image */}
                          <Link href={getCategoryHref(item.category, item.id)} className="shrink-0">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={language === "th" ? item.nameTh : item.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 96px, 128px"
                              />
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link href={getCategoryHref(item.category, item.id)}>
                              <h3 className="font-bold text-gray-900 hover:text-brand-yellow transition-colors">
                                {language === "th" ? item.nameTh : item.name}
                              </h3>
                            </Link>

                            <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                              {item.color && (
                                <p className="flex items-center gap-2">
                                  <span>{t.item.color}:</span>
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: item.color.hex }}
                                  />
                                  <span>{language === "th" ? item.color.nameTh : item.color.name}</span>
                                </p>
                              )}
                              {item.size && (
                                <p>
                                  {t.item.size}: {item.size}
                                </p>
                              )}
                            </div>

                            {/* Price - Mobile */}
                            <div className="mt-2 md:hidden">
                              <span className="font-bold text-gray-900">
                                ฿{(item.price * item.quantity).toLocaleString()}
                              </span>
                              {item.originalPrice && (
                                <span className="ml-2 text-sm text-gray-400 line-through">
                                  ฿{(item.originalPrice * item.quantity).toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="mt-3 flex items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity - 1,
                                      item.color?.name,
                                      item.size
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus
                                    size={16}
                                    className={item.quantity <= 1 ? "text-gray-300" : "text-gray-600"}
                                  />
                                </button>
                                <span className="w-10 text-center font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.quantity + 1,
                                      item.color?.name,
                                      item.size
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} className="text-gray-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id, item.color?.name, item.size)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">{t.item.remove}</span>
                              </button>
                            </div>
                          </div>

                          {/* Price - Desktop */}
                          <div className="hidden md:block text-right">
                            <p className="font-bold text-lg text-gray-900">
                              ฿{(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.originalPrice && (
                              <>
                                <p className="text-sm text-gray-400 line-through">
                                  ฿{(item.originalPrice * item.quantity).toLocaleString()}
                                </p>
                                <p className="text-sm text-red-500 font-medium">
                                  -
                                  {Math.round(
                                    ((item.originalPrice - item.price) / item.originalPrice) * 100
                                  )}
                                  %
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Redeem Rewards */}
                  <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-brand-yellow font-semibold">
                          <Gift size={18} />
                          <span>{t.loyalty.rewardsTitle}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{t.loyalty.rewardsSubtitle}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {t.loyalty.available}:{" "}
                        <span className="font-semibold text-gray-900">
                          {availablePoints.toLocaleString()} {t.loyalty.pointsUnit}
                        </span>
                      </div>
                    </div>

                    {redeemedRewards.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-3 mt-4">
                        {redeemedRewards.map((reward) => {
                          const isRedeemed = reward.redeemed;
                          const colorLabel =
                            language === "th" ? reward.colorNameTh : reward.colorName;
                          const categoryLabel =
                            language === "th" ? reward.categoryLabelTh : reward.categoryLabel;
                          const sizePart = reward.sizeName ? `${reward.sizeName}` : null;
                          const metaLine = [categoryLabel, colorLabel, sizePart].filter(Boolean).join(" • ");

                          return (
                            <div
                              key={reward.id}
                              className={`border rounded-lg p-4 transition ${
                                isRedeemed
                                  ? "border-brand-yellow bg-yellow-50"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {reward.image && (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                      src={reward.image}
                                      alt={reward.name}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {language === "th" ? reward.nameTh : reward.name}
                                  </h4>
                                  {metaLine && (
                                    <p className="text-xs text-gray-500 mt-1">{metaLine}</p>
                                  )}
                                  <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <span className={`inline-flex items-center gap-2 text-sm ${
                                      isRedeemed ? "text-green-600" : "text-gray-400"
                                    }`}>
                                      {isRedeemed ? t.loyalty.redeemed : t.loyalty.notEnough}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeReward(reward.id)}
                                      className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                      {language === "th" ? "ลบของรางวัลนี้" : "Remove reward"}
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {reward.points.toLocaleString()} {t.loyalty.pointsUnit}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mt-4 text-sm text-gray-500">
                        {language === "th"
                          ? "ยังไม่มีของรางวัลที่เลือก เพิ่มจากหน้าแลกของรางวัลได้เลย"
                          : "No rewards selected yet. Browse the rewards page to add some goodies."}
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <Link
                        href="/rewards"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        {t.loyalty.redeemPage}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Continue Shopping Link */}
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-yellow transition-colors mt-4"
                  >
                    <ArrowRight size={16} className="rotate-180" />
                    {t.summary.continueShopping}
                  </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
                  >
                    <h2 className="text-lg font-bold text-gray-900 mb-4">{t.summary.title}</h2>

                    {/* Loyalty Points */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-brand-yellow font-semibold mb-3">
                        <Sparkles size={16} />
                        <span>{t.loyalty.title}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>{t.loyalty.available}</span>
                          <span className="font-semibold text-gray-900">
                            {totalPoints.toLocaleString()} {t.loyalty.pointsUnit}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>{t.loyalty.earned}</span>
                          <span className="font-semibold text-green-600">
                            +{pointsEarned.toLocaleString()} {t.loyalty.pointsUnit}
                          </span>
                        </div>
                        {usedPoints > 0 && (
                          <div className="flex justify-between text-brand-yellow">
                            <span>{t.loyalty.used}</span>
                            <span className="font-semibold">
                              -{usedPoints.toLocaleString()} {t.loyalty.pointsUnit}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-900 font-semibold border-t border-gray-200 pt-2">
                          <span>{t.loyalty.remaining}</span>
                          <span>
                            {(availablePoints + pointsEarned).toLocaleString()} {t.loyalty.pointsUnit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        placeholder={t.promoCode.placeholder}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                      />
                      <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        {t.promoCode.apply}
                      </button>
                    </div>

                    {/* Summary Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.summary.subtotal}</span>
                        <span className="text-gray-900">฿{subtotal.toLocaleString()}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-red-500">
                          <span>{t.summary.discount}</span>
                          <span>-฿{discount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.summary.shipping}</span>
                        <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                          {shipping === 0 ? t.summary.shippingFree : `฿${shipping}`}
                        </span>
                      </div>

                      {shipping > 0 && (
                        <p className="text-xs text-gray-500">{t.summary.shippingNote}</p>
                      )}

                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-900">{t.summary.total}</span>
                          <span className="text-gray-900">฿{finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                      href="/checkout"
                      className="w-full mt-6 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {t.summary.checkout}
                      <ArrowRight size={18} />
                    </Link>

                    {/* Payment Methods */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center mb-3">
                        {language === "th" ? "ชำระเงินได้ด้วย" : "We accept"}
                      </p>
                      <div className="flex justify-center gap-2">
                        <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                          VISA
                        </div>
                        <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                          MC
                        </div>
                        <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                          PP
                        </div>
                        <div className="w-10 h-6 bg-green-500 rounded flex items-center justify-center text-xs font-bold text-white">
                          K+
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
