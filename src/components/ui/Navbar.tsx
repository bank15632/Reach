"use client";

import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import {
    products as racketProducts,
    shoeProducts,
    sportswearProducts,
    bundleProducts,
    supplementProducts
} from "@/data/productData";
import { articles } from "@/data/articleData";
import { tournaments, statusConfig } from "@/data/tournamentData";

type SearchResultType = 'product' | 'article' | 'tournament';

interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    titleTh: string;
    primary: string;
    primaryTh: string;
    secondary?: string;
    secondaryTh?: string;
    href: string;
    thumbnail: string;
    price?: number;
    badge?: string;
    meta?: string;
    metaTh?: string;
    metaBadgeClasses?: string;
}

const typeLabels: Record<SearchResultType, { en: string; th: string }> = {
    product: { en: 'Product', th: 'สินค้า' },
    article: { en: 'Article', th: 'บทความ' },
    tournament: { en: 'Tournament', th: 'ทัวร์นาเมนต์' }
};

const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function formatSingleDateLabel(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return {
        en: `${monthsEn[monthIndex]} ${day}, ${year}`,
        th: `${day} ${monthsTh[monthIndex]} ${year + 543}`
    };
}

function formatDateRangeLabel(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();

    const en = sameMonth
        ? `${monthsEn[startDate.getMonth()]} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
        : `${monthsEn[startDate.getMonth()]} ${startDate.getDate()} - ${monthsEn[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;

    const th = sameMonth
        ? `${startDate.getDate()}-${endDate.getDate()} ${monthsTh[startDate.getMonth()]} ${startDate.getFullYear() + 543}`
        : `${startDate.getDate()} ${monthsTh[startDate.getMonth()]} - ${endDate.getDate()} ${monthsTh[endDate.getMonth()]} ${endDate.getFullYear() + 543}`;

    return { en, th };
}

export default function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { language, setLanguage, t } = useLanguage();
    const { itemCount: cartItemCount } = useCart();
    const { availablePoints, isLoggedIn, userProfile } = useUser();

    // Use availablePoints from UserContext
    const loyaltyPoints = availablePoints;

    const allResults = useMemo<SearchResult[]>(() => {
        const result: SearchResult[] = [];

        racketProducts.forEach(product => {
            result.push({
                id: product.id,
                type: 'product',
                title: product.name,
                titleTh: product.nameTh,
                primary: "Badminton Racket",
                primaryTh: "ไม้แบดมินตัน",
                secondary: product.badge ? `Tag: ${product.badge}` : undefined,
                secondaryTh: product.badge ? `ป้าย: ${product.badge}` : undefined,
                href: `/rackets/${product.id}`,
                thumbnail: product.images[0] ?? product.colors[0]?.image ?? "/placeholder.png",
                price: product.price,
                badge: product.badge
            });
        });

        shoeProducts.forEach(product => {
            result.push({
                id: product.id,
                type: 'product',
                title: product.name,
                titleTh: product.nameTh,
                primary: "Shoes",
                primaryTh: "รองเท้า",
                secondary: product.badge ? `Tag: ${product.badge}` : undefined,
                secondaryTh: product.badge ? `ป้าย: ${product.badge}` : undefined,
                href: `/shoes/${product.id}`,
                thumbnail: product.images[0] ?? product.colors[0]?.image ?? "/placeholder.png",
                price: product.price,
                badge: product.badge
            });
        });

        sportswearProducts.forEach(product => {
            result.push({
                id: product.id,
                type: 'product',
                title: product.name,
                titleTh: product.nameTh,
                primary: "Sportswear",
                primaryTh: "ชุดกีฬา",
                secondary: product.badge ? `Tag: ${product.badge}` : undefined,
                secondaryTh: product.badge ? `ป้าย: ${product.badge}` : undefined,
                href: `/sportswear/${product.id}`,
                thumbnail: product.images[0] ?? product.colors[0]?.image ?? "/placeholder.png",
                price: product.price,
                badge: product.badge
            });
        });

        bundleProducts.forEach(product => {
            result.push({
                id: product.id,
                type: 'product',
                title: product.name,
                titleTh: product.nameTh,
                primary: "Bundle",
                primaryTh: "เซ็ตสุดคุ้ม",
                secondary: product.badge ? `Tag: ${product.badge}` : undefined,
                secondaryTh: product.badge ? `ป้าย: ${product.badge}` : undefined,
                href: `/bundles/${product.id}`,
                thumbnail: product.images[0] ?? "/placeholder.png",
                price: product.price,
                badge: product.badge
            });
        });

        supplementProducts.forEach(product => {
            result.push({
                id: product.id,
                type: 'product',
                title: product.name,
                titleTh: product.nameTh,
                primary: "Supplements",
                primaryTh: "อาหารเสริม",
                secondary: product.badge ? `Tag: ${product.badge}` : undefined,
                secondaryTh: product.badge ? `ป้าย: ${product.badge}` : undefined,
                href: `/supplements/${product.id}`,
                thumbnail: product.images[0] ?? "/placeholder.png",
                price: product.price,
                badge: product.badge
            });
        });

        articles.forEach(article => {
            const dateLabel = formatSingleDateLabel(article.date);
            result.push({
                id: article.id,
                type: 'article',
                title: article.titleEn,
                titleTh: article.title,
                primary: article.category,
                primaryTh: article.categoryTh,
                secondary: article.excerptEn,
                secondaryTh: article.excerpt,
                href: `/articles/${article.id}`,
                thumbnail: article.image ?? article.heroImage,
                meta: dateLabel.en,
                metaTh: dateLabel.th
            });
        });

        tournaments.forEach(tournament => {
            const dateLabel = formatDateRangeLabel(tournament.dateStart, tournament.dateEnd);
            const status = statusConfig[tournament.status];
            result.push({
                id: tournament.id,
                type: 'tournament',
                title: tournament.name,
                titleTh: tournament.nameTh,
                primary: dateLabel.en,
                primaryTh: dateLabel.th,
                secondary: `${tournament.location.city}, ${tournament.location.country}`,
                secondaryTh: `${tournament.location.cityTh}, ${tournament.location.countryTh}`,
                href: `/tournament/${tournament.id}`,
                thumbnail: tournament.image,
                meta: status.label,
                metaTh: status.labelTh,
                metaBadgeClasses: `${status.bgColor} ${status.textColor}`
            });
        });

        return result;
    }, []);

    const featuredResults = useMemo(() => allResults.slice(0, 8), [allResults]);

    const filteredResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];
        return allResults
            .filter(result => {
                const textEn = `${result.title} ${result.primary} ${result.secondary ?? ''} ${result.meta ?? ''}`.toLowerCase();
                const textTh = `${result.titleTh} ${result.primaryTh} ${result.secondaryTh ?? ''} ${result.metaTh ?? ''}`.toLowerCase();
                return textEn.includes(query) || textTh.includes(query);
            })
            .slice(0, 12);
    }, [allResults, searchQuery]);

    const hasQuery = searchQuery.trim().length > 0;
    const resultsToRender = hasQuery ? filteredResults : featuredResults;

    const handleOpenSearch = () => setIsSearchOpen(true);
    const handleCloseSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const handleResultClick = (href: string) => {
        handleCloseSearch();
        router.push(href);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!hasQuery || filteredResults.length === 0) return;
        handleResultClick(filteredResults[0].href);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isSearchOpen) {
            document.body.style.overflow = "";
            return;
        }

        const timeout = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 150);

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCloseSearch();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.clearTimeout(timeout);
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSearchOpen]);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

    const shopSubLinks = [
        { key: 'nav_rackets' as const, href: "/rackets" },
        { key: 'nav_shoes' as const, href: "/shoes" },
        { key: 'nav_sportswear' as const, href: "/sportswear" },
        { key: 'nav_bundles' as const, href: "/bundles" },
        { key: 'nav_supplements' as const, href: "/supplements" },
        { key: 'nav_courts' as const, href: "/courts" },
    ];

    const navLinks = [
        { key: 'nav_tournament' as const, href: "/tournament" },
        { key: 'nav_articles' as const, href: "/articles" },
        { key: 'nav_sale' as const, href: "/sale" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-brand-black/95 backdrop-blur-xl ${isScrolled ? "py-3 shadow-lg" : "py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.jpg"
                            alt="REACH"
                            className="h-10 w-auto"
                        />
                    </a>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Shop Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsShopDropdownOpen(true)}
                            onMouseLeave={() => setIsShopDropdownOpen(false)}
                        >
                            <a
                                href="/shop"
                                className="relative text-sm font-medium tracking-widest transition-colors py-2 group text-white hover:text-brand-yellow flex items-center gap-1"
                            >
                                <span>{language === 'th' ? 'สินค้าทั้งหมด' : 'SHOP'}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span
                                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-brand-yellow"
                                />
                            </a>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isShopDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-brand-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden"
                                    >
                                        {shopSubLinks.map((link) => (
                                            <a
                                                key={link.key}
                                                href={link.href}
                                                className="block px-4 py-3 text-sm font-medium text-white hover:bg-brand-yellow hover:text-black transition-colors"
                                            >
                                                {t(link.key)}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Other Nav Links */}
                        {navLinks.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className={`relative text-sm font-medium tracking-widest transition-colors py-2 group ${link.key === 'nav_sale'
                                    ? 'text-red-500 hover:text-red-400'
                                    : 'text-white hover:text-brand-yellow'
                                    }`}
                                style={link.key === 'nav_sale' ? { textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)' } : undefined}
                            >
                                <span className="flex items-center gap-1.5">
                                    {t(link.key)}
                                    {link.key === 'nav_sale' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </span>
                                <span
                                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${link.key === 'nav_sale' ? 'bg-red-500' : 'bg-brand-yellow'
                                        }`}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center gap-5">
                        {/* Language Toggle */}
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-2 py-1 transition-colors ${language === 'th' ? 'text-brand-yellow' : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                TH
                            </button>
                            <span className="text-white/30">|</span>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-1 transition-colors ${language === 'en' ? 'text-brand-yellow' : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Search */}
                        <button
                            className="p-2 text-white/80 hover:text-white transition-colors"
                            aria-label={t('search')}
                            onClick={handleOpenSearch}
                        >
                            <Search size={20} />
                        </button>

                        {/* Loyalty Points */}
                        <div className="flex items-center gap-1.5 text-brand-yellow font-medium">
                            <span className="text-lg">💎</span>
                            <span>{loyaltyPoints.toLocaleString()}</span>
                        </div>

                        {/* Cart */}
                        <a
                            href="/cart"
                            className="relative p-2 text-white/80 hover:text-white transition-colors"
                            aria-label={t('cart')}
                        >
                            <ShoppingBag size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-yellow text-brand-black text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </a>

                        {/* Login/Register Button or Profile */}
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <a
                                    href="/profile"
                                    className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-brand-yellow transition-colors"
                                >
                                    {userProfile?.avatar ? (
                                        <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/70">
                                            <User size={18} />
                                        </div>
                                    )}
                                </a>
                                <a
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
                                >
                                    <span className="max-w-[100px] truncate">
                                        {userProfile?.nickname || userProfile?.name || (language === 'th' ? 'โปรไฟล์' : 'Profile')}
                                    </span>
                                </a>
                            </div>
                        ) : (
                            <a
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
                            >
                                <User size={16} />
                                <span>{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</span>
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        {/* Language Toggle - Mobile */}
                        <div className="flex items-center gap-1 text-xs font-medium">
                            <button
                                onClick={() => setLanguage('th')}
                                className={`px-1.5 py-0.5 transition-colors ${language === 'th' ? 'text-brand-yellow' : 'text-white/60'
                                    }`}
                            >
                                TH
                            </button>
                            <span className="text-white/30">|</span>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-1.5 py-0.5 transition-colors ${language === 'en' ? 'text-brand-yellow' : 'text-white/60'
                                    }`}
                            >
                                EN
                            </button>
                        </div>

                        <button
                            className="p-2 text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-brand-black/95 backdrop-blur-xl border-t border-white/5"
                        >
                            <div className="px-6 py-6 flex flex-col gap-4">
                                {/* Shop Section Header */}
                                <div className="text-brand-yellow text-xs font-bold tracking-widest uppercase mb-1">
                                    {language === 'th' ? 'สินค้าทั้งหมด' : 'SHOP'}
                                </div>

                                {/* Shop Sub Links */}
                                {shopSubLinks.map((link, index) => (
                                    <motion.a
                                        key={link.key}
                                        href={link.href}
                                        onClick={handleLinkClick}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="text-lg tracking-widest py-2 pl-4 border-b border-white/10 transition-colors text-white hover:text-brand-yellow"
                                    >
                                        {t(link.key)}
                                    </motion.a>
                                ))}

                                {/* Divider */}
                                <div className="border-t border-white/20 my-2"></div>

                                {/* Other Nav Links */}
                                {navLinks.map((link, index) => (
                                    <motion.a
                                        key={link.key}
                                        href={link.href}
                                        onClick={handleLinkClick}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (shopSubLinks.length + index) * 0.05 }}
                                        className={`text-lg tracking-widest py-2 border-b border-white/10 transition-colors ${link.key === 'nav_sale'
                                            ? 'text-red-500 hover:text-red-400 flex items-center gap-2'
                                            : 'text-white hover:text-brand-yellow'
                                            }`}
                                    >
                                        {t(link.key)}
                                        {link.key === 'nav_sale' && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </motion.a>
                                ))}

                                {/* Mobile Bottom Bar */}
                                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                                    {/* Loyalty */}
                                    <div className="flex items-center gap-1.5 text-brand-yellow font-medium">
                                        <span>💎</span>
                                        <span>{loyaltyPoints.toLocaleString()}</span>
                                    </div>

                                    {/* Icons */}
                                    <div className="flex items-center gap-4">
                                        <button className="p-2 text-white/80" onClick={handleOpenSearch}>
                                            <Search size={20} />
                                        </button>
                                        <a href="/cart" onClick={handleLinkClick} className="relative p-2 text-white/80">
                                            <ShoppingBag size={20} />
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-yellow text-brand-black text-xs font-bold rounded-full flex items-center justify-center">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </a>
                                    </div>
                                </div>

                                {/* Login Button Mobile or Profile */}
                                {isLoggedIn ? (
                                    <div className="flex items-center justify-center gap-4 mt-6">
                                        <a
                                            href="/profile"
                                            onClick={handleLinkClick}
                                            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 hover:border-brand-yellow transition-colors"
                                        >
                                            {userProfile?.avatar ? (
                                                <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/70">
                                                    <User size={24} />
                                                </div>
                                            )}
                                        </a>
                                        <a
                                            href="/profile"
                                            onClick={handleLinkClick}
                                            className="px-6 py-2 bg-brand-yellow text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
                                        >
                                            <span>
                                                {userProfile?.nickname || userProfile?.name || (language === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile')}
                                            </span>
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href="/login"
                                        onClick={handleLinkClick}
                                        className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-3 bg-brand-yellow text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
                                    >
                                        <User size={18} />
                                        <span>{language === 'th' ? 'เข้าสู่ระบบ / สมัครสมาชิก' : 'Login / Register'}</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            key="search-overlay-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                            onClick={handleCloseSearch}
                        />

                        <motion.div
                            key="search-overlay-panel"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed left-1/2 top-24 z-[70] w-[95vw] max-w-3xl -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                                        {language === 'th' ? 'ค้นหาอย่างรวดเร็ว' : 'Quick search'}
                                    </p>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {language === 'th' ? 'ค้นหาสินค้า บทความ หรือทัวร์นาเมนต์' : 'Search products, articles, tournaments'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseSearch}
                                    className="rounded-full border border-gray-200 p-2 text-gray-600 transition hover:border-black hover:text-black"
                                    aria-label={language === 'th' ? 'ปิดการค้นหา' : 'Close search'}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-inner">
                                <Search className="text-gray-500" size={20} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={language === 'th' ? 'พิมพ์ชื่อสินค้า บทความ หรือทัวร์นาเมนต์...' : 'Type a product, story, or tournament...'}
                                    className="flex-1 border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                    aria-label={language === 'th' ? 'ค้นหาสินค้า' : 'Search products'}
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-brand-black px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-yellow hover:text-black"
                                >
                                    {language === 'th' ? 'ไป' : 'Go'}
                                </button>
                            </form>

                            <div className="mt-6 rounded-2xl border border-gray-100 bg-white/70 p-6 text-center text-gray-500">
                                <p className="text-sm">
                                    {language === 'th'
                                        ? 'ระบบค้นหาพร้อมแล้ว กรอกคำที่ต้องการแล้วกด "Go"'
                                        : 'Search is ready—enter a keyword and hit "Go"'}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
