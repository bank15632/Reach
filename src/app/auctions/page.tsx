'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

interface Auction {
    id: string;
    title: string;
    titleTh: string;
    images: string[];
    startPrice: number;
    currentPrice: number;
    startTime: string;
    endTime: string;
    status: string;
    bidCount: number;
}

function AuctionCard({ auction, language }: { auction: Auction; language: 'en' | 'th' }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isEnding, setIsEnding] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const endTime = new Date(auction.endTime).getTime();
            const startTime = new Date(auction.startTime).getTime();

            if (auction.status === 'SCHEDULED' && startTime > now) {
                // Not started yet
                const diff = startTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                if (days > 0) {
                    setTimeLeft(language === 'th' ? `เริ่มใน ${days} วัน` : `Starts in ${days}d`);
                } else {
                    setTimeLeft(language === 'th' ? `เริ่มใน ${hours}ชม. ${mins}น.` : `Starts in ${hours}h ${mins}m`);
                }
                setIsEnding(false);
            } else if (endTime > now) {
                // Active
                const diff = endTime - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                if (hours > 0) {
                    setTimeLeft(`${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                } else {
                    setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
                }
                setIsEnding(diff < 1000 * 60 * 60); // Less than 1 hour
            } else {
                setTimeLeft(language === 'th' ? 'สิ้นสุดแล้ว' : 'Ended');
                setIsEnding(false);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction, language]);

    const statusBadge = () => {
        switch (auction.status) {
            case 'ACTIVE':
                return (
                    <span className={`px-2 py-1 text-xs font-bold rounded ${isEnding ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'}`}>
                        {language === 'th' ? 'กำลังประมูล' : 'LIVE'}
                    </span>
                );
            case 'SCHEDULED':
                return (
                    <span className="px-2 py-1 text-xs font-bold rounded bg-blue-500 text-white">
                        {language === 'th' ? 'เร็วๆ นี้' : 'UPCOMING'}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <Link href={`/auctions/${auction.id}`}>
            <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                    <img
                        src={auction.images[0] || '/placeholder.png'}
                        alt={language === 'th' ? auction.titleTh : auction.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                        {statusBadge()}
                    </div>
                    {auction.status === 'ACTIVE' && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className={`text-center ${isEnding ? 'text-red-400' : 'text-white'}`}>
                                <div className="flex items-center justify-center gap-1 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-mono font-bold text-lg">{timeLeft}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                        {language === 'th' ? auction.titleTh : auction.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-gray-500">
                                {language === 'th' ? 'ราคาปัจจุบัน' : 'Current Bid'}
                            </p>
                            <p className="text-xl font-bold text-brand-yellow">
                                ฿{auction.currentPrice.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{auction.bidCount}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            {language === 'th' ? 'เริ่มต้น' : 'Start'}: ฿{auction.startPrice.toLocaleString()}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function AuctionsPage() {
    const { language } = useLanguage();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

    useEffect(() => {
        async function fetchAuctions() {
            try {
                const params = filter !== 'all' ? `?status=${filter}` : '';
                const res = await fetch(`/api/auctions${params}`);
                if (res.ok) {
                    const data = await res.json();
                    setAuctions(data.auctions);
                }
            } catch (error) {
                console.error('Error fetching auctions:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAuctions();
    }, [filter]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Gavel className="w-10 h-10 text-brand-yellow" />
                            <h1 className="text-4xl font-bold text-gray-900">
                                {language === 'th' ? 'ประมูลสินค้า' : 'Auctions'}
                            </h1>
                        </div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {language === 'th'
                                ? 'ร่วมประมูลสินค้าพิเศษในราคาที่คุณต้องการ ลงทะเบียนและยืนยันตัวตนเพื่อเริ่มประมูล'
                                : 'Bid on exclusive items at your price. Register and verify to start bidding.'}
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {(['all', 'active', 'upcoming'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    filter === f
                                        ? 'bg-brand-yellow text-black'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {f === 'all' && (language === 'th' ? 'ทั้งหมด' : 'All')}
                                {f === 'active' && (language === 'th' ? 'กำลังประมูล' : 'Live')}
                                {f === 'upcoming' && (language === 'th' ? 'เร็วๆ นี้' : 'Upcoming')}
                            </button>
                        ))}
                    </div>

                    {/* Auctions Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                                    <div className="aspect-square bg-gray-200" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : auctions.length === 0 ? (
                        <div className="text-center py-16">
                            <Gavel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">
                                {language === 'th' ? 'ไม่มีการประมูลในขณะนี้' : 'No auctions at the moment'}
                            </p>
                            <p className="text-gray-400">
                                {language === 'th' ? 'กลับมาเช็คใหม่เร็วๆ นี้!' : 'Check back soon!'}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {auctions.map((auction, index) => (
                                <motion.div
                                    key={auction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AuctionCard auction={auction} language={language} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
