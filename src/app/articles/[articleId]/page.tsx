"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ArticleSection {
    title: string;
    titleEn: string;
    content: string;
    contentEn: string;
    image: string;
}

interface Article {
    id: string;
    title: string;
    titleEn: string;
    excerpt: string;
    excerptEn: string;
    heroImage: string;
    image?: string;
    category: string;
    categoryTh: string;
    date: string;
    sections: ArticleSection[];
}

export default function ArticleDetailPage() {
    const params = useParams();
    const articleId = params.articleId as string;
    const { language } = useLanguage();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const [articleRes, listRes] = await Promise.all([
                    fetch(`/api/articles/${articleId}`),
                    fetch("/api/articles"),
                ]);

                if (!articleRes.ok) {
                    if (isMounted) {
                        setArticle(null);
                        setLoading(false);
                    }
                    return;
                }

                const articleData = await articleRes.json();
                const listData = await listRes.json();

                if (isMounted) {
                    setArticle(articleData.article);
                    const list = (listData.articles || []) as Article[];
                    setRelatedArticles(list.filter((a) => a.id !== articleId).slice(0, 3));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching article:", error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [articleId]);

    if (!loading && !article) {
        notFound();
    }

    if (loading || !article) {
        return (
            <main className="bg-brand-black min-h-screen">
                <Navbar />
                <div className="pt-32 text-center text-gray-400">กำลังโหลด...</div>
            </main>
        );
    }

    return (
        <main className="bg-brand-black min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${article.heroImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block bg-brand-yellow text-black px-4 py-1 text-sm font-bold uppercase mb-6"
                        >
                            {language === 'th' ? article.categoryTh : article.category}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                        >
                            {language === 'th' ? article.title : article.titleEn}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                        >
                            {language === 'th' ? article.excerpt : article.excerptEn}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <section className="py-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb
                        items={[
                            { label: 'ARTICLES', labelTh: 'บทความ', href: '/articles' },
                            { label: article.titleEn.substring(0, 30) + '...', labelTh: article.title.substring(0, 30) + '...' }
                        ]}
                    />
                </div>
            </section>

            {/* Zigzag Content Sections */}
            <section id="content" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {article.sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 mb-20 last:mb-0`}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('${section.image}')` }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    {language === 'th' ? section.title : section.titleEn}
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    {language === 'th' ? section.content : section.contentEn}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Portfolio / Related Articles Section */}
            <section className="py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {language === 'th' ? 'บทความที่เกี่ยวข้อง' : 'Related Articles'}
                        </h2>
                        <div className="w-16 h-1 bg-brand-yellow mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((related, index) => (
                            <motion.div
                                key={related.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/articles/${related.id}`} className="group block bg-brand-dark">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${related.heroImage}')` }}
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div className="p-4">
                                        <span className="text-brand-yellow text-xs font-bold uppercase">
                                            {language === 'th' ? related.categoryTh : related.category}
                                        </span>
                                        <h3 className="text-white font-bold mt-2 group-hover:text-brand-yellow transition-colors line-clamp-2">
                                            {language === 'th' ? related.title : related.titleEn}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                            {language === 'th' ? related.excerpt : related.excerptEn}
                                        </p>
                                        <div className="flex items-center gap-1 text-brand-yellow text-sm mt-4 group-hover:gap-2 transition-all">
                                            <span>{language === 'th' ? 'อ่านเพิ่มเติม' : 'Read More'}</span>
                                            <ChevronRight size={16} />
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
