"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Pause, Play, X } from "lucide-react";

// Winner data structure
export interface Winner {
    id: string;
    nickname: string;
    nicknameTh: string;
    fullName: string;
    fullNameTh: string;
    age: number;
    category: 'men_singles' | 'women_singles' | 'men_doubles' | 'women_doubles' | 'mixed_doubles';
    playerImage: string; // PNG image of player
    venue: string;
    venueTh: string;
    country: string;
    countryTh: string;
    province: string;
    provinceTh: string;
}

export interface WinnersData {
    champion: Winner[];
    runnerUp1: Winner[];
    runnerUp2: Winner[];
}

// Category labels
const categoryLabels = {
    men_singles: { en: "Men's Singles", th: 'ชายเดี่ยว' },
    women_singles: { en: "Women's Singles", th: 'หญิงเดี่ยว' },
    men_doubles: { en: "Men's Doubles", th: 'ชายคู่' },
    women_doubles: { en: "Women's Doubles", th: 'หญิงคู่' },
    mixed_doubles: { en: "Mixed Doubles", th: 'คู่ผสม' },
};

// Background images for each rank
const backgroundImages = {
    champion: '/images/winners/bg-champion.jpg',
    runnerUp1: '/images/winners/bg-runner-up-1.jpg',
    runnerUp2: '/images/winners/bg-runner-up-2.jpg',
};

// Slide titles
const slideTitles = {
    champion: { en: 'CHAMPION', th: 'ผู้ชนะเลิศ' },
    runnerUp1: { en: '1ST RUNNER-UP', th: 'รองอันดับ 1' },
    runnerUp2: { en: '2ND RUNNER-UP', th: 'รองอันดับ 2' },
};

const orderedCategories: Winner['category'][] = [
    'men_singles',
    'women_singles',
    'men_doubles',
    'women_doubles',
    'mixed_doubles'
];

const topRowCategories: Winner['category'][] = ['men_singles', 'women_singles'];
const bottomRowCategories: Winner['category'][] = ['men_doubles', 'women_doubles', 'mixed_doubles'];

const getOrderedWinners = (winners: Winner[]) =>
    orderedCategories
        .map((category) => winners.find((winner) => winner.category === category))
        .filter((winner): winner is Winner => winner !== undefined);

interface WinnerCardProps {
    winner: Winner;
    rank: 'champion' | 'runnerUp1' | 'runnerUp2';
    language: string;
    onClick?: () => void;
    className?: string;
}

function WinnerCard({ winner, rank, language, onClick, className }: WinnerCardProps) {
    const categoryLabel = language === 'th' 
        ? categoryLabels[winner.category].th 
        : categoryLabels[winner.category].en;
    
    const location = language === 'th'
        ? `${winner.venueTh}, ${winner.provinceTh}, ${winner.countryTh}`
        : `${winner.venue}, ${winner.province}, ${winner.country}`;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative flex-shrink-0 aspect-[4/5] rounded-xl overflow-hidden shadow-lg group text-left cursor-pointer ${className ?? ''}`}
        >
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${backgroundImages[rank]}')` }}
            />
            
            {/* Player PNG Image */}
            {winner.playerImage && (
                <div className="absolute inset-0 flex items-end justify-center">
                    <img 
                        src={winner.playerImage} 
                        alt={language === 'th' ? winner.nicknameTh : winner.nickname}
                        className="w-full h-auto max-h-[85%] object-contain object-bottom"
                    />
                </div>
            )}
            
            {/* Info Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-16">
                {/* Nickname - Large */}
                <h3 className="text-white font-black text-lg md:text-xl leading-tight uppercase tracking-wide">
                    {language === 'th' ? winner.nicknameTh : winner.nickname}
                </h3>
                
                {/* Full Name - Small */}
                <p className="text-white/80 text-xs md:text-sm mt-0.5">
                    {language === 'th' ? winner.fullNameTh : winner.fullName}
                </p>
                
                {/* Age */}
                <p className="text-white/70 text-xs mt-1">
                    {language === 'th' ? `อายุ ${winner.age} ปี` : `Age ${winner.age}`}
                </p>
                
                {/* Category */}
                <p className="text-brand-yellow font-bold text-xs mt-2 uppercase tracking-wider">
                    {categoryLabel}
                </p>
                
                {/* Location */}
                <p className="text-white/60 text-[10px] md:text-xs mt-1 line-clamp-2">
                    {location}
                </p>
            </div>
        </button>
    );
}

interface WinnersSliderProps {
    winnersData: WinnersData;
    language: string;
}

export default function WinnersSlider({ winnersData, language }: WinnersSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedRank, setSelectedRank] = useState<'champion' | 'runnerUp1' | 'runnerUp2' | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isMainAutoPlay, setIsMainAutoPlay] = useState(true);
    const [isModalAutoPlay, setIsModalAutoPlay] = useState(true);
    const cardRef = useRef<HTMLDivElement | null>(null);
    
    const slides: { key: 'champion' | 'runnerUp1' | 'runnerUp2'; winners: Winner[] }[] = [
        { key: 'champion', winners: winnersData.champion },
        { key: 'runnerUp1', winners: winnersData.runnerUp1 },
        { key: 'runnerUp2', winners: winnersData.runnerUp2 },
    ];

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goToPrev = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const currentSlideData = slides[currentSlide];
    const title = language === 'th' 
        ? slideTitles[currentSlideData.key].th 
        : slideTitles[currentSlideData.key].en;

    const orderedWinners = getOrderedWinners(currentSlideData.winners);
    const winnerIndexMap = new Map(orderedWinners.map((winner, index) => [winner.id, index]));
    const topRowWinners = topRowCategories
        .map((category) => orderedWinners.find((winner) => winner.category === category))
        .filter((winner): winner is Winner => winner !== undefined);
    const bottomRowWinners = bottomRowCategories
        .map((category) => orderedWinners.find((winner) => winner.category === category))
        .filter((winner): winner is Winner => winner !== undefined);

    const selectedSlide = selectedRank ? slides.find((slide) => slide.key === selectedRank) : null;
    const modalWinners = selectedSlide ? getOrderedWinners(selectedSlide.winners) : [];
    const selectedWinner = selectedIndex !== null ? modalWinners[selectedIndex] : null;
    const isModalOpen = selectedRank !== null && selectedWinner !== null;

    const closeModal = () => {
        setSelectedRank(null);
        setSelectedIndex(null);
        setIsModalAutoPlay(false);
    };

    const openModal = (index: number) => {
        setSelectedRank(currentSlideData.key);
        setSelectedIndex(index);
        setIsModalAutoPlay(true);
    };

    useEffect(() => {
        if (!isMainAutoPlay || isModalOpen) return undefined;
        const interval = window.setInterval(() => {
            goToNext();
        }, 10000);
        return () => window.clearInterval(interval);
    }, [goToNext, isMainAutoPlay, isModalOpen]);

    useEffect(() => {
        if (!isModalOpen || !isModalAutoPlay || modalWinners.length === 0) return undefined;
        const interval = window.setInterval(() => {
            setSelectedIndex((prev) => {
                if (prev === null) return 0;
                return (prev + 1) % modalWinners.length;
            });
        }, 7000);
        return () => window.clearInterval(interval);
    }, [isModalAutoPlay, isModalOpen, modalWinners.length]);

    const handleDownload = async () => {
        if (!selectedWinner || !selectedRank) return;

        const fontFamily = language === 'th'
            ? "'Prompt', sans-serif"
            : "'Inter', 'Prompt', sans-serif";

        if (typeof document !== 'undefined' && document.fonts?.load) {
            await Promise.all([
                document.fonts.load(`800 64px ${fontFamily}`),
                document.fonts.load(`600 32px ${fontFamily}`),
                document.fonts.load(`500 28px ${fontFamily}`),
                document.fonts.load(`500 26px ${fontFamily}`),
            ]);
        }

        const loadImage = (src: string) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });

        const drawCover = (
            ctx: CanvasRenderingContext2D,
            img: HTMLImageElement,
            width: number,
            height: number
        ) => {
            const scale = Math.max(width / img.width, height / img.height);
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;
            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
        };

        const wrapText = (
            ctx: CanvasRenderingContext2D,
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            lineHeight: number,
            maxLines = 2
        ) => {
            const words = text.split(' ');
            let line = '';
            let lineCount = 0;

            for (let i = 0; i < words.length; i += 1) {
                const testLine = line ? `${line} ${words[i]}` : words[i];
                const { width } = ctx.measureText(testLine);
                if (width > maxWidth && line) {
                    ctx.fillText(line, x, y + lineCount * lineHeight);
                    line = words[i];
                    lineCount += 1;
                    if (lineCount >= maxLines - 1) {
                        break;
                    }
                } else {
                    line = testLine;
                }
            }

            ctx.fillText(line, x, y + lineCount * lineHeight);
        };

        const width = 1200;
        const height = 1500;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const [background, player] = await Promise.all([
            loadImage(backgroundImages[selectedRank]),
            selectedWinner.playerImage ? loadImage(selectedWinner.playerImage) : Promise.resolve(null),
        ]);

        drawCover(ctx, background, width, height);

        if (player) {
            const maxPlayerWidth = width * 0.95;
            const maxPlayerHeight = height * 0.88;
            const scale = Math.min(maxPlayerWidth / player.width, maxPlayerHeight / player.height);
            const drawWidth = player.width * scale;
            const drawHeight = player.height * scale;
            const x = (width - drawWidth) / 2;
            const y = height - drawHeight;
            ctx.drawImage(player, x, y, drawWidth, drawHeight);
        }

        const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.45, width, height * 0.55);

        const leftPadding = width * 0.08;
        let textY = height * 0.74;

        ctx.textBaseline = 'top';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `800 64px ${fontFamily}`;
        ctx.fillText(language === 'th' ? selectedWinner.nicknameTh : selectedWinner.nickname, leftPadding, textY);

        textY += 76;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = `500 30px ${fontFamily}`;
        ctx.fillText(language === 'th' ? selectedWinner.fullNameTh : selectedWinner.fullName, leftPadding, textY);

        textY += 42;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = `500 28px ${fontFamily}`;
        ctx.fillText(
            language === 'th' ? `อายุ ${selectedWinner.age} ปี` : `Age ${selectedWinner.age}`,
            leftPadding,
            textY
        );

        textY += 44;
        ctx.fillStyle = '#D4AF37';
        ctx.font = `700 28px ${fontFamily}`;
        ctx.fillText(
            language === 'th'
                ? categoryLabels[selectedWinner.category].th
                : categoryLabels[selectedWinner.category].en,
            leftPadding,
            textY
        );

        textY += 40;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.font = `500 26px ${fontFamily}`;
        const locationText = language === 'th'
            ? `${selectedWinner.venueTh}, ${selectedWinner.provinceTh}, ${selectedWinner.countryTh}`
            : `${selectedWinner.venue}, ${selectedWinner.province}, ${selectedWinner.country}`;
        wrapText(ctx, locationText, leftPadding, textY, width * 0.84, 34, 2);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `winner-${selectedRank}-${selectedWinner.category}.jpg`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
    };

    return (
        <div className="relative">
            {/* Title */}
            <AnimatePresence mode="wait">
                <motion.h2
                    key={currentSlide}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-8 md:mb-12 tracking-tight"
                    style={{
                        color: currentSlideData.key === 'champion' ? '#D4AF37' 
                             : currentSlideData.key === 'runnerUp1' ? '#C0C0C0' 
                             : '#CD7F32'
                    }}
                >
                    {title}
                </motion.h2>
            </AnimatePresence>

            {/* Cards Container */}
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="space-y-4 px-4"
                    >
                        <div className="flex flex-wrap justify-center gap-4">
                            {topRowWinners.map((winner) => (
                                <WinnerCard
                                    key={winner.id}
                                    winner={winner}
                                    rank={currentSlideData.key}
                                    language={language}
                                    className="w-[calc(50%-12px)] max-w-[260px] min-w-[170px]"
                                    onClick={() => openModal(winnerIndexMap.get(winner.id) ?? 0)}
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {bottomRowWinners.map((winner) => (
                                <WinnerCard
                                    key={winner.id}
                                    winner={winner}
                                    rank={currentSlideData.key}
                                    language={language}
                                    className="w-[calc(50%-12px)] max-w-[260px] min-w-[170px]"
                                    onClick={() => openModal(winnerIndexMap.get(winner.id) ?? 0)}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal Popup */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="relative w-full max-w-5xl px-4"
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-black shadow hover:bg-yellow-400"
                                    >
                                        <Download size={18} />
                                        {language === 'th' ? 'ดาวน์โหลด JPG' : 'Download JPG'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalAutoPlay((prev) => !prev)}
                                        className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
                                    >
                                        {isModalAutoPlay ? <Pause size={18} /> : <Play size={18} />}
                                        {language === 'th'
                                            ? isModalAutoPlay ? 'หยุดเลื่อน' : 'เลื่อนอัตโนมัติ'
                                            : isModalAutoPlay ? 'Pause Auto' : 'Auto Slide'}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
                                >
                                    <X size={18} />
                                    {language === 'th' ? 'ปิด' : 'Close'}
                                </button>
                            </div>

                            <div
                                ref={cardRef}
                                className="relative w-[90vw] max-w-3xl mx-auto aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${backgroundImages[selectedRank]}')` }}
                                />

                                {selectedWinner?.playerImage && (
                                    <div className="absolute inset-0 flex items-end justify-center">
                                        <img
                                            src={selectedWinner.playerImage}
                                            alt={language === 'th' ? selectedWinner.nicknameTh : selectedWinner.nickname}
                                            crossOrigin="anonymous"
                                            className="w-full h-auto max-h-[88%] object-contain object-bottom"
                                        />
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-6 pt-20">
                                    <h3 className="text-white font-black text-2xl md:text-3xl uppercase tracking-wide">
                                        {language === 'th' ? selectedWinner.nicknameTh : selectedWinner.nickname}
                                    </h3>
                                    <p className="text-white/80 text-sm md:text-base mt-1">
                                        {language === 'th' ? selectedWinner.fullNameTh : selectedWinner.fullName}
                                    </p>
                                    <p className="text-white/70 text-sm mt-2">
                                        {language === 'th' ? `อายุ ${selectedWinner.age} ปี` : `Age ${selectedWinner.age}`}
                                    </p>
                                    <p className="text-brand-yellow font-bold text-sm mt-3 uppercase tracking-wider">
                                        {language === 'th'
                                            ? categoryLabels[selectedWinner.category].th
                                            : categoryLabels[selectedWinner.category].en}
                                    </p>
                                    <p className="text-white/70 text-sm mt-2">
                                        {language === 'th'
                                            ? `${selectedWinner.venueTh}, ${selectedWinner.provinceTh}, ${selectedWinner.countryTh}`
                                            : `${selectedWinner.venue}, ${selectedWinner.province}, ${selectedWinner.country}`}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Navigation Arrows */}
            <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:translate-x-0 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft size={28} className="text-gray-800" />
            </button>
            
            <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-0 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight size={28} className="text-gray-800" />
            </button>

            {/* Slide Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <div className="flex justify-center gap-3">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.key}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentSlide 
                                    ? 'bg-brand-yellow scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setIsMainAutoPlay((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
                >
                    {isMainAutoPlay ? <Pause size={18} /> : <Play size={18} />}
                    {language === 'th'
                        ? isMainAutoPlay ? 'หยุดเลื่อน' : 'เลื่อนอัตโนมัติ'
                        : isMainAutoPlay ? 'Pause Auto' : 'Auto Slide'}
                </button>
            </div>

            {/* Slide Labels */}
            <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                {slides.map((slide, index) => (
                    <button
                        key={slide.key}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-colors ${
                            index === currentSlide 
                                ? 'text-gray-900' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {language === 'th' ? slideTitles[slide.key].th : slideTitles[slide.key].en}
                    </button>
                ))}
            </div>
        </div>
    );
}
