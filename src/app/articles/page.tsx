"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { articles } from "@/data/articleData";

export default function ArticlesPage() {
    const { language } = useLanguage();

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'ARTICLES', labelTh: 'บทความ' }]} />
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {language === 'th' ? 'บทความ' : 'Articles'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {language === 'th' ? 'เคล็ดลับ เทคนิค และข่าวสารจากโลกแบดมินตัน' : 'Tips, techniques, and news from the badminton world'}
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <Link href={`/articles/${article.id}`} className="group block">
                                    {/* 9:16 Image */}
                                    <div className="relative aspect-[9/16] overflow-hidden bg-gray-100">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${article.image}')` }}
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        {/* Category badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-brand-yellow text-black px-2 py-1 text-xs font-bold uppercase">
                                                {language === 'th' ? article.categoryTh : article.category}
                                            </span>
                                        </div>
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-2 group-hover:text-brand-yellow transition-colors">
                                                {language === 'th' ? article.title : article.titleEn}
                                            </h3>
                                            <p className="text-gray-300 text-xs line-clamp-2 hidden md:block">
                                                {language === 'th' ? article.excerpt : article.excerptEn}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
