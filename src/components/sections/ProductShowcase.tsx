"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { FloatingElement } from "@/components/animations/FloatingElements";

const products = [
    {
        id: 1,
        name: "Antigravity Pro X",
        price: 5990,
        originalPrice: 7490,
        image: "/products/racket-1.png",
        badge: "Best Seller",
        rating: 4.9,
        reviews: 128,
        featured: true,
    },
    {
        id: 2,
        name: "Zero-G Elite",
        price: 4490,
        image: "/products/racket-2.png",
        badge: "New",
        rating: 4.8,
        reviews: 64,
    },
    {
        id: 3,
        name: "Velocity Strike",
        price: 3990,
        image: "/products/racket-3.png",
        rating: 4.7,
        reviews: 89,
    },
    {
        id: 4,
        name: "Speed Demon",
        price: 4990,
        image: "/products/racket-4.png",
        badge: "Pro Choice",
        rating: 4.9,
        reviews: 156,
    },
];

export default function ProductShowcase() {
    return (
        <section className="relative py-24 bg-space-black overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-purple/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-neon-cyan uppercase tracking-widest text-sm font-medium">
                        Featured Collection
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        <span className="text-white">Engineered for </span>
                        <span className="gradient-text">Champions</span>
                    </h2>
                    <p className="text-silver max-w-2xl mx-auto">
                        Our cutting-edge rackets are designed with aerospace-grade materials
                        for maximum performance and minimal weight.
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                    {/* Featured Large Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2 md:row-span-2 relative group"
                    >
                        <div className="h-full glass rounded-3xl p-6 flex flex-col overflow-hidden hover:border-neon-cyan/30 transition-all duration-300">
                            {/* Badge */}
                            {products[0].badge && (
                                <span className="absolute top-6 left-6 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-neon-cyan to-deep-purple text-white">
                                    {products[0].badge}
                                </span>
                            )}

                            {/* Product Image Area */}
                            <div className="flex-1 flex items-center justify-center relative">
                                <FloatingElement amplitude={10} duration={4}>
                                    <div className="w-48 h-64 lg:w-64 lg:h-80 relative">
                                        {/* Placeholder for product image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-deep-purple/20 rounded-2xl flex items-center justify-center">
                                            <span className="text-6xl">🏸</span>
                                        </div>
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </FloatingElement>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-sm">{products[0].rating}</span>
                                    </div>
                                    <span className="text-silver/50 text-sm">
                                        ({products[0].reviews} reviews)
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    {products[0].name}
                                </h3>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold text-neon-cyan">
                                        ฿{products[0].price.toLocaleString()}
                                    </span>
                                    {products[0].originalPrice && (
                                        <span className="text-silver/50 line-through">
                                            ฿{products[0].originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-deep-purple text-white font-medium flex items-center justify-center gap-2 mt-4"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Regular Cards */}
                    {products.slice(1).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="h-full glass rounded-2xl p-5 flex flex-col hover:border-neon-cyan/30 transition-all duration-300 relative overflow-hidden">
                                {/* Badge */}
                                {product.badge && (
                                    <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full bg-deep-purple/50 text-white">
                                        {product.badge}
                                    </span>
                                )}

                                {/* Image */}
                                <div className="flex-1 flex items-center justify-center py-4">
                                    <div className="w-20 h-28 bg-gradient-to-br from-neon-cyan/10 to-deep-purple/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span className="text-3xl">🏸</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-xs text-silver">{product.rating}</span>
                                    </div>
                                    <h3 className="font-medium text-white text-sm">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-neon-cyan">
                                            ฿{product.price.toLocaleString()}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan/20 transition-colors"
                                        >
                                            <ShoppingCart size={16} className="text-neon-cyan" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="/products"
                        whileHover={{ gap: "12px" }}
                        className="inline-flex items-center gap-2 text-neon-cyan hover:text-white transition-colors group"
                    >
                        <span>View All Products</span>
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
