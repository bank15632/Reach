'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, Users, ChevronLeft, AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

interface Bid {
    id: string;
    amount: number;
    createdAt: string;
    isWinning: boolean;
    bidder: {
        id: string;
        name: string;
        avatar?: string;
    };
}

interface Auction {
    id: string;
    title: string;
    titleTh: string;
    description?: string;
    descriptionTh?: string;
    images: string[];
    startPrice: number;
    currentPrice: number;
    bidIncrement: number;
    reservePrice: boolean;
    startTime: string;
    endTime: string;
    status: string;
    bidCount: number;
    bids: Bid[];
    product?: {
        id: string;
        name: string;
        nameTh: string;
        description?: string;
        descriptionTh?: string;
        brand?: string;
    };
    winner?: {
        id: string;
        name: string;
    };
    winningBid?: number;
}

export default function AuctionDetailPage({ params }: { params: Promise<{ auctionId: string }> }) {
    const { auctionId } = use(params);
    const router = useRouter();
    const { language } = useLanguage();
    const { isLoggedIn, userProfile } = useUser();
    
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [timeLeft, setTimeLeft] = useState('');
    const [isEnding, setIsEnding] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [bidding, setBidding] = useState(false);
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState(false);

    useEffect(() => {
        async function fetchAuction() {
            try {
                const res = await fetch(`/api/auctions/${auctionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setAuction(data);
                    setBidAmount((data.currentPrice + data.bidIncrement).toString());
                } else {
                    router.push('/auctions');
                }
            } catch (error) {
                console.error('Error fetching auction:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAuction();
        
        // Poll for updates every 5 seconds
        const pollInterval = setInterval(fetchAuction, 5000);
        return () => clearInterval(pollInterval);
    }, [auctionId, router]);

    useEffect(() => {
        if (!auction) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const endTime = new Date(auction.endTime).getTime();
            const startTime = new Date(auction.startTime).getTime();

            if (auction.status === 'SCHEDULED' && startTime > now) {
                const diff = startTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                
                if (days > 0) {
                    setTimeLeft(`${days}d ${hours}h ${mins}m`);
                } else {
                    setTimeLeft(`${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                }
                setIsEnding(false);
            } else if (endTime > now) {
                const diff = endTime - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft(`${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                setIsEnding(diff < 1000 * 60 * 60);
            } else {
                setTimeLeft(language === 'th' ? 'สิ้นสุดแล้ว' : 'Ended');
                setIsEnding(false);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction, language]);

    const handleBid = async () => {
        if (!isLoggedIn) {
            router.push(`/login?redirect=/auctions/${auctionId}`);
            return;
        }

        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= 0) {
            setBidError(language === 'th' ? 'กรุณาใส่จำนวนเงินที่ถูกต้อง' : 'Please enter a valid amount');
            return;
        }

        setBidding(true);
        setBidError('');

        try {
            const res = await fetch(`/api/auctions/${auctionId}/bid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'AUTH_REQUIRED') {
                    router.push(`/login?redirect=/auctions/${auctionId}`);
                    return;
                }
                setBidError(data.error || 'Failed to place bid');
                return;
            }

            setBidSuccess(true);
            setAuction(prev => prev ? {
                ...prev,
                currentPrice: data.currentPrice,
                bidCount: prev.bidCount + 1
            } : null);
            setBidAmount((data.currentPrice + (auction?.bidIncrement || 100)).toString());

            setTimeout(() => setBidSuccess(false), 3000);
        } catch (error) {
            setBidError(language === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'An error occurred. Please try again.');
        } finally {
            setBidding(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="aspect-square bg-gray-200 rounded-2xl" />
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                                    <div className="h-12 bg-gray-200 rounded w-1/2" />
                                    <div className="h-24 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!auction) {
        return null;
    }

    const canBid = auction.status === 'ACTIVE' && new Date(auction.endTime) > new Date();
    const minimumBid = auction.currentPrice + auction.bidIncrement;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Back button */}
                    <Link
                        href="/auctions"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {language === 'th' ? 'กลับไปหน้าประมูล' : 'Back to Auctions'}
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Image Gallery */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src={auction.images[selectedImage] || '/placeholder.png'}
                                    alt={language === 'th' ? auction.titleTh : auction.title}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    {auction.status === 'ACTIVE' && (
                                        <span className={`px-3 py-1.5 text-sm font-bold rounded-lg ${isEnding ? 'bg-red-500 animate-pulse' : 'bg-green-500'} text-white`}>
                                            {language === 'th' ? 'กำลังประมูล' : 'LIVE'}
                                        </span>
                                    )}
                                    {auction.status === 'SCHEDULED' && (
                                        <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-blue-500 text-white">
                                            {language === 'th' ? 'เร็วๆ นี้' : 'UPCOMING'}
                                        </span>
                                    )}
                                    {(auction.status === 'ENDED' || auction.status === 'COMPLETED') && (
                                        <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gray-500 text-white">
                                            {language === 'th' ? 'สิ้นสุดแล้ว' : 'ENDED'}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Thumbnails */}
                            {auction.images.length > 1 && (
                                <div className="flex gap-3 mt-4">
                                    {auction.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === idx ? 'border-brand-yellow' : 'border-transparent'
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auction Info */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {language === 'th' ? auction.titleTh : auction.title}
                                </h1>

                                {/* Timer */}
                                <div className={`p-4 rounded-xl mb-6 ${isEnding ? 'bg-red-50 border border-red-200' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className={`w-5 h-5 ${isEnding ? 'text-red-500' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${isEnding ? 'text-red-600' : 'text-gray-500'}`}>
                                            {auction.status === 'SCHEDULED'
                                                ? (language === 'th' ? 'เริ่มประมูลใน' : 'Starts in')
                                                : (language === 'th' ? 'เหลือเวลา' : 'Time remaining')
                                            }
                                        </span>
                                    </div>
                                    <p className={`text-3xl font-mono font-bold ${isEnding ? 'text-red-600' : 'text-gray-900'}`}>
                                        {timeLeft}
                                    </p>
                                </div>

                                {/* Current Price */}
                                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {language === 'th' ? 'ราคาปัจจุบัน' : 'Current Bid'}
                                            </p>
                                            <p className="text-4xl font-bold text-brand-yellow">
                                                ฿{auction.currentPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Users className="w-5 h-5" />
                                                <span>{auction.bidCount} {language === 'th' ? 'ครั้ง' : 'bids'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {canBid && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-sm text-gray-500 mb-2">
                                                    {language === 'th' ? 'จำนวนเงินประมูล' : 'Your Bid'} (min: ฿{minimumBid.toLocaleString()})
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                                                        <input
                                                            type="number"
                                                            value={bidAmount}
                                                            onChange={(e) => setBidAmount(e.target.value)}
                                                            min={minimumBid}
                                                            step={auction.bidIncrement}
                                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleBid}
                                                        disabled={bidding}
                                                        className="px-8 py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                                    >
                                                        <Gavel className="w-5 h-5" />
                                                        {bidding 
                                                            ? (language === 'th' ? 'กำลังส่ง...' : 'Bidding...')
                                                            : (language === 'th' ? 'ประมูล' : 'Place Bid')
                                                        }
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quick bid buttons */}
                                            <div className="flex gap-2 mb-4">
                                                {[1, 2, 5, 10].map(multiplier => (
                                                    <button
                                                        key={multiplier}
                                                        onClick={() => setBidAmount((auction.currentPrice + auction.bidIncrement * multiplier).toString())}
                                                        className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        +฿{(auction.bidIncrement * multiplier).toLocaleString()}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Error/Success Messages */}
                                            <AnimatePresence>
                                                {bidError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                        {bidError}
                                                    </motion.div>
                                                )}
                                                {bidSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        {language === 'th' ? 'ประมูลสำเร็จ!' : 'Bid placed successfully!'}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}

                                    {!canBid && auction.status === 'SCHEDULED' && (
                                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
                                            <p>{language === 'th' ? 'การประมูลยังไม่เริ่ม กรุณารอ' : 'Auction has not started yet. Please wait.'}</p>
                                        </div>
                                    )}

                                    {!canBid && (auction.status === 'ENDED' || auction.status === 'COMPLETED') && auction.winner && (
                                        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                                            <p className="font-semibold">
                                                {language === 'th' ? 'ผู้ชนะ:' : 'Winner:'} {auction.winner.name}
                                            </p>
                                            <p>{language === 'th' ? 'ราคาชนะ:' : 'Winning bid:'} ฿{auction.winningBid?.toLocaleString()}</p>
                                        </div>
                                    )}

                                    {!isLoggedIn && canBid && (
                                        <div className="flex items-start gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg mt-4">
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium">
                                                    {language === 'th' ? 'ต้องเข้าสู่ระบบ' : 'Login Required'}
                                                </p>
                                                <p className="text-sm">
                                                    {language === 'th' 
                                                        ? 'กรุณาเข้าสู่ระบบและยืนยันอีเมลเพื่อเข้าร่วมประมูล'
                                                        : 'Please login and verify your email to participate in auctions.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                {(auction.description || auction.descriptionTh) && (
                                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                                        <h2 className="text-lg font-bold text-gray-900 mb-3">
                                            {language === 'th' ? 'รายละเอียด' : 'Description'}
                                        </h2>
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {language === 'th' ? auction.descriptionTh : auction.description}
                                        </p>
                                    </div>
                                )}

                                {/* Bid History */}
                                {auction.bids.length > 0 && (
                                    <div className="bg-white rounded-xl p-6 shadow-lg">
                                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                                            {language === 'th' ? 'ประวัติการประมูล' : 'Bid History'}
                                        </h2>
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {auction.bids.map((bid, idx) => (
                                                <div
                                                    key={bid.id}
                                                    className={`flex items-center justify-between py-2 ${
                                                        idx !== auction.bids.length - 1 ? 'border-b border-gray-100' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            {bid.bidder.avatar ? (
                                                                <img src={bid.bidder.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                                            ) : (
                                                                <User className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{bid.bidder.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(bid.createdAt).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${bid.isWinning ? 'text-green-600' : 'text-gray-600'}`}>
                                                            ฿{bid.amount.toLocaleString()}
                                                        </p>
                                                        {bid.isWinning && (
                                                            <span className="text-xs text-green-600">
                                                                {language === 'th' ? 'นำอยู่' : 'Leading'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
