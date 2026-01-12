"use client";

import { motion } from "framer-motion";
import {
    FloatingRacket,
    FloatingShuttle,
    ParticleField,
} from "@/components/animations/FloatingElements";
import { ChevronDown, Zap } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient">
            {/* Particle Background */}
            <ParticleField />

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Main Racket - Right Side */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
                    <FloatingRacket className="transform -rotate-12 scale-75" />
                </div>

                {/* Shuttlecocks */}
                <FloatingShuttle
                    className="absolute left-1/4 top-1/4 opacity-60"
                    delay={0}
                />
                <FloatingShuttle
                    className="absolute right-1/3 top-1/3 opacity-40 scale-75"
                    delay={1.5}
                />
                <FloatingShuttle
                    className="absolute left-1/6 bottom-1/3 opacity-50 scale-90"
                    delay={3}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/30 mb-6"
                        >
                            <Zap size={16} className="text-neon-cyan" />
                            <span className="text-silver text-sm">Zero-G Technology</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-white">Break The</span>
                            <br />
                            <span className="gradient-text text-glow-cyan">Gravity</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            className="text-lg md:text-xl text-silver mb-8 max-w-lg mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Experience the future of badminton. Our Antigravity series
                            delivers unmatched speed, precision, and power.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 242, 255, 0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-neon-cyan to-deep-purple text-white font-semibold text-lg glow-cyan"
                            >
                                Shop Collection
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 rounded-full glass border border-white/20 text-white font-medium text-lg hover:border-neon-cyan/50 transition-colors"
                            >
                                Watch Video
                            </motion.button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {[
                                { value: "68g", label: "Ultralight" },
                                { value: "30lbs", label: "Max Tension" },
                                { value: "#1", label: "In Thailand" },
                            ].map((stat, index) => (
                                <div key={index} className="text-center lg:text-left">
                                    <div className="text-2xl md:text-3xl font-bold gradient-text">
                                        {stat.value}
                                    </div>
                                    <div className="text-silver text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right - Visual Element (Hidden on smaller screens as racket is positioned absolutely) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="hidden lg:flex items-center justify-center"
                    >
                        {/* Decorative Ring */}
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-[400px] h-[400px] rounded-full border border-neon-cyan/20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 rounded-full border border-deep-purple/20"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-16 rounded-full border border-neon-cyan/10"
                            />
                            {/* Center Glow */}
                            <div className="absolute inset-24 rounded-full bg-gradient-to-br from-neon-cyan/10 to-deep-purple/10 blur-2xl" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="flex flex-col items-center gap-2 text-silver/50">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={20} />
                </div>
            </motion.div>
        </section>
    );
}
