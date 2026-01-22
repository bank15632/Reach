import React from 'react';
import { TournamentMatch } from '@/data/tournamentData';
import { CheckCircle, Clock, Play } from 'lucide-react';

// Helper function to calculate age from birthdate
function calculateAge(birthdate: string | undefined): number | null {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Helper function to display gender
function getGenderDisplay(gender: 'male' | 'female' | undefined, language: string): string {
    if (!gender) return '';
    if (gender === 'male') return language === 'th' ? 'ชาย' : 'M';
    return language === 'th' ? 'หญิง' : 'F';
}

// Enhanced Match Card Component - Refined Style
export default function EnhancedMatchCard({ match, language, onViewDetails }: { match: TournamentMatch; language: string; onViewDetails?: () => void }) {
    const isDoubles = !!match.player1Partner;
    const isPlayer1Loser = match.winner === 2;
    const isPlayer2Loser = match.winner === 1;

    const getRoundDisplay = (r: string) => {
        const round = r.toLowerCase();
        if (round.includes('quarter') || round.includes('ก่อนรอง')) return language === 'th' ? 'รอบที่ 3' : 'Round 3';
        if (round.includes('16')) return language === 'th' ? 'รอบที่ 2' : 'Round 2';
        if (round.includes('32')) return language === 'th' ? 'รอบที่ 1' : 'Round 1';
        return r;
    };

    // Status display
    const getStatusBadge = () => {
        if (match.status === 'completed') {
            return (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle size={12} />
                    {language === 'th' ? 'แข่งจบแล้ว' : 'Completed'}
                </span>
            );
        }
        if (match.status === 'live') {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {language === 'th' ? 'กำลังแข่ง' : 'LIVE'}
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                <Clock size={12} />
                {language === 'th' ? 'ยังไม่เริ่ม' : 'Not Started'}
            </span>
        );
    };

    return (
        <div className="relative group">
            {/* Card Container */}
            <div className="bg-[#f0f0f0] rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 relative z-10 shadow-xl">

                {/* Status Badge Row */}
                <div className="flex items-center justify-between mb-4">
                    {getStatusBadge()}
                    {match.status === 'live' && match.liveStreamUrl && (
                        <a
                            href={match.liveStreamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full flex items-center gap-1 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Play size={12} fill="currentColor" />
                            {language === 'th' ? 'ดูถ่ายทอดสด' : 'Watch Live'}
                        </a>
                    )}
                </div>

                {/* Content Grid */}
                <div className="space-y-5">

                    {/* Player 1 Side */}
                    <div className="flex items-center justify-between relative">
                        <div className={`flex ${isDoubles ? 'flex-col sm:flex-row gap-3 sm:gap-8' : 'flex-col gap-3'}`}>
                            {/* Player 1 Main */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300 overflow-hidden bg-white shrink-0">
                                    {match.player1Photo ? (
                                        <img src={match.player1Photo} alt={match.player1} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-sm sm:text-lg">👤</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-black text-base sm:text-xl uppercase tracking-tight ${isPlayer1Loser ? 'text-gray-400' : 'text-black'}`}>
                                        {match.player1Nickname || match.player1.split(' ')[0].toUpperCase()}
                                    </span>
                                    <span className={`text-xs sm:text-sm ${isPlayer1Loser ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {match.player1}
                                    </span>
                                    <div className={`flex items-center gap-2 text-xs ${isPlayer1Loser ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {match.player1Gender && (
                                            <span className={`px-1.5 py-0.5 rounded ${match.player1Gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                {getGenderDisplay(match.player1Gender, language)}
                                            </span>
                                        )}
                                        {match.player1Birthdate && (
                                            <span>{language === 'th' ? `${calculateAge(match.player1Birthdate)} ปี` : `${calculateAge(match.player1Birthdate)} yrs`}</span>
                                        )}
                                    </div>
                                    {match.player1Seed && <span className="text-xs font-semibold text-gray-500">[{match.player1Seed}]</span>}
                                </div>
                            </div>

                            {/* Player 1 Partner (Doubles Only) */}
                            {isDoubles && (
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300 overflow-hidden bg-white shrink-0">
                                        {match.player1PartnerPhoto ? (
                                            <img src={match.player1PartnerPhoto} alt={match.player1Partner} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-sm sm:text-lg">👤</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-base sm:text-xl uppercase tracking-tight ${isPlayer1Loser ? 'text-gray-400' : 'text-black'}`}>
                                            {match.player1PartnerNickname || match.player1Partner?.split(' ')[0].toUpperCase()}
                                        </span>
                                        <span className={`text-xs sm:text-sm ${isPlayer1Loser ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {match.player1Partner}
                                        </span>
                                        <div className={`flex items-center gap-2 text-xs ${isPlayer1Loser ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {match.player1PartnerGender && (
                                                <span className={`px-1.5 py-0.5 rounded ${match.player1PartnerGender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                    {getGenderDisplay(match.player1PartnerGender, language)}
                                                </span>
                                            )}
                                            {match.player1PartnerBirthdate && (
                                                <span>{language === 'th' ? `${calculateAge(match.player1PartnerBirthdate)} ปี` : `${calculateAge(match.player1PartnerBirthdate)} yrs`}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scores - Responsive for 3 sets */}
                        <div className="flex gap-2 sm:gap-5 text-2xl sm:text-4xl font-black tracking-tighter self-center">
                            {match.scores?.map((score, i) => (
                                <span
                                    key={i}
                                    className={`min-w-[28px] sm:min-w-[36px] text-center ${score.player1 > score.player2 ? 'text-[#F5C518]' : 'text-gray-400'}`}
                                >
                                    {score.player1}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* VS Label */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 -ml-2 z-0 hidden md:block opacity-5 pointer-events-none">
                        <span className="text-9xl font-black italic tracking-tighter">VS</span>
                    </div>

                    {/* Mobile/Card VS Label */}
                    <div className="active-vs-label flex justify-start pl-40 py-2 relative z-10">
                        <span className="text-3xl font-black text-[#F5C518] italic tracking-tight drop-shadow-sm">VS.</span>
                    </div>

                    {/* Player 2 Side */}
                    <div className="flex items-center justify-between relative">
                        <div className={`flex ${isDoubles ? 'flex-col sm:flex-row gap-3 sm:gap-8' : 'flex-col gap-3'}`}>
                            {/* Player 2 Main */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300 overflow-hidden bg-white shrink-0">
                                    {match.player2Photo ? (
                                        <img src={match.player2Photo} alt={match.player2} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-sm sm:text-lg">👤</div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-black text-base sm:text-xl uppercase tracking-tight ${isPlayer2Loser ? 'text-gray-400' : 'text-black'}`}>
                                        {match.player2Nickname || match.player2.split(' ')[0].toUpperCase()}
                                    </span>
                                    <span className={`text-xs sm:text-sm ${isPlayer2Loser ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {match.player2}
                                    </span>
                                    <div className={`flex items-center gap-2 text-xs ${isPlayer2Loser ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {match.player2Gender && (
                                            <span className={`px-1.5 py-0.5 rounded ${match.player2Gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                {getGenderDisplay(match.player2Gender, language)}
                                            </span>
                                        )}
                                        {match.player2Birthdate && (
                                            <span>{language === 'th' ? `${calculateAge(match.player2Birthdate)} ปี` : `${calculateAge(match.player2Birthdate)} yrs`}</span>
                                        )}
                                    </div>
                                    {match.player2Seed && <span className="text-xs font-semibold text-gray-500">[{match.player2Seed}]</span>}
                                </div>
                            </div>

                            {/* Player 2 Partner (Doubles Only) */}
                            {isDoubles && (
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300 overflow-hidden bg-white shrink-0">
                                        {match.player2PartnerPhoto ? (
                                            <img src={match.player2PartnerPhoto} alt={match.player2Partner} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-sm sm:text-lg">👤</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-black text-base sm:text-xl uppercase tracking-tight ${isPlayer2Loser ? 'text-gray-400' : 'text-black'}`}>
                                            {match.player2PartnerNickname || match.player2Partner?.split(' ')[0].toUpperCase()}
                                        </span>
                                        <span className={`text-xs sm:text-sm ${isPlayer2Loser ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {match.player2Partner}
                                        </span>
                                        <div className={`flex items-center gap-2 text-xs ${isPlayer2Loser ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {match.player2PartnerGender && (
                                                <span className={`px-1.5 py-0.5 rounded ${match.player2PartnerGender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                    {getGenderDisplay(match.player2PartnerGender, language)}
                                                </span>
                                            )}
                                            {match.player2PartnerBirthdate && (
                                                <span>{language === 'th' ? `${calculateAge(match.player2PartnerBirthdate)} ปี` : `${calculateAge(match.player2PartnerBirthdate)} yrs`}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scores - Responsive for 3 sets */}
                        <div className="flex gap-2 sm:gap-5 text-2xl sm:text-4xl font-black tracking-tighter self-center">
                            {match.scores?.map((score, i) => (
                                <span
                                    key={i}
                                    className={`min-w-[28px] sm:min-w-[36px] text-center ${score.player2 > score.player1 ? 'text-[#F5C518]' : 'text-gray-400'}`}
                                >
                                    {score.player2}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Line */}
                <div className="mt-5 pt-4 border-t border-gray-300 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-gray-700">{language === 'th' ? match.categoryTh : match.category}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-sm text-black">
                            {getRoundDisplay(language === 'th' ? match.roundTh : match.round)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {match.court} • {match.time}
                    </div>
                </div>
            </div>
        </div>
    );
}
