"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Tournament", href: "/tournament" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "glass-dark py-3" : "py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="/"
                    className="flex items-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-deep-purple flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan to-deep-purple opacity-50 blur-md group-hover:opacity-80 transition-opacity" />
                    </div>
                    <span className="text-xl font-bold gradient-text">REACH</span>
                </motion.a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            className="relative text-silver hover:text-white transition-colors py-2"
                            whileHover={{ y: -2 }}
                        >
                            <span>{link.name}</span>
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-deep-purple origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-silver hover:text-neon-cyan transition-colors relative"
                    >
                        <ShoppingCart size={20} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-deep-purple rounded-full text-xs flex items-center justify-center">
                            0
                        </span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 rounded-full glass border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center gap-2"
                    >
                        <User size={16} />
                        <span>Login</span>
                    </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-dark mt-2 mx-4 rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-lg text-silver hover:text-white transition-colors py-2 border-b border-white/5"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 px-4 py-2 rounded-full glass border border-neon-cyan/30 text-neon-cyan">
                                    Login
                                </button>
                                <button className="p-2 text-silver">
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
