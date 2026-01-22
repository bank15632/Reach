"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Users, Clock, Globe, Building } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { tournaments, statusConfig, TournamentStatus, Tournament } from "@/data/tournamentData";

export default function TournamentPage() {
    const { language } = useLanguage();
    const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    // All available categories
    const allCategories = [
        { value: 'all', label: 'All Categories', labelTh: 'ทุกประเภท' },
        { value: 'singles', label: 'Singles', labelTh: 'ประเภทเดี่ยว' },
        { value: 'doubles', label: 'Doubles', labelTh: 'ประเภทคู่' },
        { value: 'mixed', label: 'Mixed Doubles', labelTh: 'คู่ผสม' },
        { value: 'team', label: 'Team Event', labelTh: 'ประเภททีม' },
        { value: 'junior', label: 'Junior', labelTh: 'รุ่นเยาวชน' },
    ];

    // Format date for display
    const formatDate = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (language === 'th') {
            const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
            return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear() + 543}`;
        } else {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
        }
    };

    // Format time for display
    const formatTime = (timeStart: string, timeEnd: string) => {
        return `${timeStart} - ${timeEnd}`;
    };

    // Get status config
    const getStatusDisplay = (status: TournamentStatus) => {
        const config = statusConfig[status];
        return {
            label: language === 'th' ? config.labelTh : config.label,
            bgColor: config.bgColor,
            textColor: config.textColor
        };
    };

    // Filter tournaments by status, category, and month
    const filteredTournaments = useMemo(() => {
        let result = [...tournaments];

        // Filter by status
        if (selectedStatus !== 'all') {
            result = result.filter(t => t.status === selectedStatus);
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(t => {
                const cats = t.categories.join(' ').toLowerCase();
                switch (selectedCategory) {
                    case 'singles':
                        return cats.includes('singles') || cats.includes('เดี่ยว');
                    case 'doubles':
                        return (cats.includes('doubles') || cats.includes('คู่')) && !cats.includes('mixed');
                    case 'mixed':
                        return cats.includes('mixed') || cats.includes('ผสม');
                    case 'team':
                        return cats.includes('team') || cats.includes('ทีม');
                    case 'junior':
                        return cats.includes('junior') || cats.includes('u15') || cats.includes('u18');
                    default:
                        return true;
                }
            });
        }

        // Filter by date range
        if (dateFrom) {
            result = result.filter(t => t.dateStart >= dateFrom);
        }
        if (dateTo) {
            result = result.filter(t => t.dateStart <= dateTo);
        }

        return result;
    }, [selectedStatus, selectedCategory, dateFrom, dateTo, tournaments]);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-8 bg-brand-black">
                <div className="max-w-7xl mx-auto px-6">
                    <Breadcrumb items={[{ label: 'TOURNAMENT', labelTh: 'ทัวร์นาเมนต์' }]} />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-yellow mb-2">
                            {language === 'th' ? 'ทัวร์นาเมนต์' : 'TOURNAMENTS'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {language === 'th'
                                ? 'การแข่งขันแบดมินตันที่ REACH สนับสนุน'
                                : 'Badminton competitions sponsored by REACH'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Status Filter */}
            <section className="py-6 border-b border-gray-200 sticky top-16 bg-white z-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-500 font-medium mr-2">
                            {language === 'th' ? 'กรองตามสถานะ:' : 'Filter by status:'}
                        </span>

                        {/* All Button */}
                        <button
                            onClick={() => setSelectedStatus('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStatus === 'all'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {language === 'th' ? 'ทั้งหมด' : 'All'}
                        </button>

                        {/* Status Buttons */}
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedStatus(key as TournamentStatus)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStatus === key
                                    ? `${config.bgColor} ${config.textColor}`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full ${selectedStatus === key ? 'bg-current' : config.bgColor}`} />
                                <span>
                                    {language === 'th' ? config.labelTh : config.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Second row: Category and Date filters */}
                    <div className="flex flex-wrap gap-4 items-center mt-4 pt-4 border-t border-gray-100">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500 font-medium">
                                {language === 'th' ? 'ประเภท:' : 'Category:'}
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                            >
                                {allCategories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {language === 'th' ? cat.labelTh : cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500 font-medium">
                                {language === 'th' ? 'วันที่:' : 'Date:'}
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                placeholder={language === 'th' ? 'จาก' : 'From'}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                placeholder={language === 'th' ? 'ถึง' : 'To'}
                            />
                        </div>

                        {/* Clear All Filters */}
                        {(selectedStatus !== 'all' || selectedCategory !== 'all' || dateFrom || dateTo) && (
                            <button
                                onClick={() => {
                                    setSelectedStatus('all');
                                    setSelectedCategory('all');
                                    setDateFrom('');
                                    setDateTo('');
                                }}
                                className="text-sm text-red-600 hover:text-red-700 underline"
                            >
                                {language === 'th' ? 'ล้างตัวกรอง' : 'Clear filters'}
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Tournaments List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Results count */}
                    <div className="mb-6 text-sm text-gray-500">
                        {language === 'th'
                            ? `พบ ${filteredTournaments.length} รายการ`
                            : `${filteredTournaments.length} tournaments found`
                        }
                    </div>

                    <div className="space-y-8">
                        {filteredTournaments.map((tournament, index) => {
                            const statusDisplay = getStatusDisplay(tournament.status);

                            return (
                                <motion.div
                                    key={tournament.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    {/* Tournament Image */}
                                    <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${tournament.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                        {/* Status Badge */}
                                        <div className={`absolute top-4 right-4 px-4 py-2 font-bold text-sm rounded ${statusDisplay.bgColor} ${statusDisplay.textColor}`}>
                                            {statusDisplay.label}
                                        </div>

                                        {/* Prize Badge */}
                                        <div className="absolute bottom-4 left-4">
                                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded">
                                                <Trophy size={16} className="text-yellow-600" />
                                                <span className="font-bold text-gray-900">{tournament.prize}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tournament Details */}
                                    <div className="flex flex-col justify-center">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {language === 'th' ? tournament.nameTh : tournament.name}
                                        </h2>

                                        <div className="space-y-4 mb-6">
                                            {/* Date & Time */}
                                            <div className="flex items-start gap-3">
                                                <Calendar size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {formatDate(tournament.dateStart, tournament.dateEnd)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Clock size={14} />
                                                        <span>{formatTime(tournament.timeStart, tournament.timeEnd)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location - Full Details */}
                                            <div className="flex items-start gap-3">
                                                <MapPin size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {language === 'th' ? tournament.location.venueTh : tournament.location.venue}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                        <Building size={14} />
                                                        <span>
                                                            {language === 'th'
                                                                ? `${tournament.location.cityTh}, ${tournament.location.countryTh}`
                                                                : `${tournament.location.city}, ${tournament.location.country}`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Participants */}
                                            <div className="flex items-start gap-3">
                                                <Users size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {tournament.registeredCount} / {tournament.participants} {language === 'th' ? 'ทีม' : 'teams'}
                                                    </div>
                                                    {/* Progress Bar */}
                                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${tournament.registeredCount >= tournament.participants
                                                                ? 'bg-red-500'
                                                                : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${Math.min((tournament.registeredCount / tournament.participants) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {tournament.registeredCount >= tournament.participants
                                                            ? (language === 'th' ? 'เต็มแล้ว' : 'Full')
                                                            : (language === 'th'
                                                                ? `เหลือ ${tournament.participants - tournament.registeredCount} ที่`
                                                                : `${tournament.participants - tournament.registeredCount} spots left`
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div className="flex items-start gap-3">
                                                <Globe size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-600">
                                                        {language === 'th' ? 'ประเภทการแข่งขัน:' : 'Categories:'}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {(language === 'th' ? tournament.categoriesTh : tournament.categories).map((cat, i) => (
                                                            <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {tournament.status === 'registration_open' && (
                                                <Link
                                                    href={`/tournament/${tournament.id}?tab=register`}
                                                    className="flex-1 bg-brand-yellow text-black px-6 py-3 font-bold text-sm tracking-wider hover:bg-yellow-400 transition-colors text-center"
                                                >
                                                    {language === 'th' ? 'สมัครเข้าร่วม' : 'REGISTER NOW'}
                                                </Link>
                                            )}
                                            {tournament.status === 'in_progress' && (
                                                <Link
                                                    href={`/tournament/${tournament.id}?tab=cards`}
                                                    className="flex-1 bg-yellow-500 text-black px-6 py-3 font-bold text-sm tracking-wider hover:bg-yellow-400 transition-colors text-center"
                                                >
                                                    {language === 'th' ? 'ดูผลการแข่งขัน' : 'VIEW LIVE RESULTS'}
                                                </Link>
                                            )}
                                            {tournament.status === 'completed' && (
                                                <Link
                                                    href={`/tournament/${tournament.id}?tab=cards`}
                                                    className="flex-1 bg-gray-800 text-white px-6 py-3 font-bold text-sm tracking-wider hover:bg-gray-700 transition-colors text-center"
                                                >
                                                    {language === 'th' ? 'ดูผลการแข่งขัน' : 'VIEW RESULTS'}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/tournament/${tournament.id}`}
                                                className="flex-1 bg-white border-2 border-black text-black px-6 py-3 font-bold text-sm tracking-wider hover:bg-black hover:text-white transition-colors text-center"
                                            >
                                                {language === 'th' ? 'ดูรายละเอียด' : 'VIEW DETAILS'}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        {language === 'th' ? 'อยากจัดทัวร์นาเมนต์กับ REACH?' : 'Want to host a tournament with REACH?'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {language === 'th'
                            ? 'ติดต่อเราเพื่อสร้างการแข่งขันที่ยิ่งใหญ่ร่วมกัน'
                            : 'Contact us to create an amazing competition together'}
                    </p>
                    <button className="bg-brand-yellow text-black px-8 py-4 font-bold text-sm tracking-wider hover:bg-yellow-400 transition-colors">
                        {language === 'th' ? 'ติดต่อเรา' : 'CONTACT US'}
                    </button>
                </div>
            </section>
        </main>
    );
}
