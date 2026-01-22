"use client";

import { useState, useEffect, useRef } from "react";
import confetti from 'canvas-confetti';
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar, MapPin, Trophy, Users, Clock,
    Globe, Building, Mail, Phone, ChevronRight,
    Play, CheckCircle, AlertCircle, Users2, X
} from "lucide-react";
import Link from "next/link";
import EnhancedMatchCard from "@/components/tournament/EnhancedMatchCard";
import WinnersSlider, { WinnersData, Winner } from "@/components/tournament/WinnersSlider";
import Navbar from "@/components/ui/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { getTournamentById, statusConfig, Tournament, TournamentMatch } from "@/data/tournamentData";

type TabType = 'info' | 'schedule' | 'register' | 'cards' | 'winners';

export default function TournamentDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const tournamentId = params.tournamentId as string;
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');


    // Read tab from URL query parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['info', 'schedule', 'register', 'cards', 'winners'].includes(tabParam)) {
            setActiveTab(tabParam as TabType);
        }
    }, [searchParams]);

    // Registration step: 1 = form, 2 = payment, 3 = confirmation
    const [registrationStep, setRegistrationStep] = useState<1 | 2 | 3>(1);

    // Registration form state
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        promoCode: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '' as '' | 'male' | 'female',
        category: '',
        photo: null as File | null,
        photoPreview: '',
        partnerName: '',
        partnerNickname: '',
        partnerEmail: '',
        partnerBirthdate: '',
        partnerGender: '' as '' | 'male' | 'female',
        partnerPhoto: null as File | null,
        partnerPhotoPreview: ''
    });

    // Payment form state
    const [paymentData, setPaymentData] = useState({
        transferDate: '',
        transferTime: '',
        amount: '',
        slipFile: null as File | null,
        slipPreview: ''
    });

    const tournament = getTournamentById(tournamentId);

    if (!tournament) {
        return (
            <main className="bg-white min-h-screen">
                <Navbar />
                <div className="pt-32 pb-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {language === 'th' ? 'ไม่พบทัวร์นาเมนต์' : 'Tournament Not Found'}
                    </h1>
                    <Link href="/tournament" className="text-brand-yellow underline">
                        {language === 'th' ? 'กลับไปหน้าทัวร์นาเมนต์' : 'Back to Tournaments'}
                    </Link>
                </div>
            </main>
        );
    }

    const statusDisplay = statusConfig[tournament.status];

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

    const formatSingleDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (language === 'th') {
            const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    };

    // Get tab based on tournament status
    const getAvailableTabs = (): TabType[] => {
        switch (tournament.status) {
            case 'registration_open':
                return ['info', 'schedule', 'register'];
            case 'registration_closed':
            case 'coming_soon':
                return ['info', 'schedule'];
            case 'in_progress':
                return ['info', 'schedule', 'cards', 'winners'];
            case 'completed':
                return ['info', 'cards', 'winners'];
            default:
                return ['info'];
        }
    };

    const availableTabs = getAvailableTabs();

    // Handle step 1: registration form submit with validation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = [
            { id: 'name', value: formData.name, label: language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name' },
            { id: 'nickname', value: formData.nickname, label: language === 'th' ? 'ชื่อเล่น/ฉายา' : 'Nickname/Alias' },
            { id: 'email', value: formData.email, label: language === 'th' ? 'อีเมล' : 'Email' },
            { id: 'phone', value: formData.phone, label: language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone' },
            { id: 'category', value: formData.category, label: language === 'th' ? 'ประเภทการแข่งขัน' : 'Category' },
        ];

        // Add photo validation
        if (!formData.photo) {
            const photoUpload = document.getElementById('photo-upload');
            if (photoUpload) {
                photoUpload.scrollIntoView({ behavior: 'smooth', block: 'center' });
                alert(language === 'th' ? 'กรุณาอัปโหลดรูปถ่ายผู้แข่งขัน' : 'Please upload competitor photo');
            }
            return;
        }

        // Check for empty required fields
        for (const field of requiredFields) {
            if (!field.value || field.value.trim() === '') {
                const element = document.getElementById(`field-${field.id}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
                alert(language === 'th'
                    ? `กรุณากรอก ${field.label}`
                    : `Please fill in ${field.label}`);
                return;
            }
        }

        // Validate doubles partner info
        if (formData.category && isDoublesCategory(formData.category)) {
            if (!formData.partnerName || formData.partnerName.trim() === '') {
                const element = document.getElementById('field-partnerName');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
                alert(language === 'th' ? 'กรุณากรอกชื่อคู่หู' : 'Please fill in partner name');
                return;
            }
            if (!formData.partnerPhoto) {
                const photoUpload = document.getElementById('partner-photo-upload');
                if (photoUpload) {
                    photoUpload.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                alert(language === 'th' ? 'กรุณาอัปโหลดรูปถ่ายคู่หู' : 'Please upload partner photo');
                return;
            }
        }

        // Go to payment step
        setRegistrationStep(2);
    };

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isPartner = false) => {
        const file = e.target.files?.[0];
        if (file) {
            if (isPartner) {
                setFormData({
                    ...formData,
                    partnerPhoto: file,
                    partnerPhotoPreview: URL.createObjectURL(file)
                });
            } else {
                setFormData({
                    ...formData,
                    photo: file,
                    photoPreview: URL.createObjectURL(file)
                });
            }
        }
    };

    // Handle slip file upload
    const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentData({
                ...paymentData,
                slipFile: file,
                slipPreview: URL.createObjectURL(file)
            });
        }
    };

    // Handle step 2: payment form submit - go to confirmation
    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Go to confirmation step
        setRegistrationStep(3);
    };

    // Reset all forms
    const resetAllForms = () => {
        setRegistrationStep(1);
        setFormData({
            name: '',
            nickname: '',
            promoCode: '',
            email: '',
            phone: '',
            birthdate: '',
            gender: '',
            category: '',
            photo: null,
            photoPreview: '',
            partnerName: '',
            partnerNickname: '',
            partnerEmail: '',
            partnerBirthdate: '',
            partnerGender: '',
            partnerPhoto: null,
            partnerPhotoPreview: ''
        });
        setPaymentData({
            transferDate: '',
            transferTime: '',
            amount: '',
            slipFile: null,
            slipPreview: ''
        });
    };

    const isDoublesCategory = (cat: string) => {
        return cat.toLowerCase().includes('doubles') || cat.includes('คู่');
    };

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-16">
                <div
                    className="h-64 md:h-96 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${tournament.image}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Status Badge */}
                    <div className={`absolute top-24 right-6 px-4 py-2 font-bold text-sm rounded ${statusDisplay.bgColor} ${statusDisplay.textColor}`}>
                        {language === 'th' ? statusDisplay.labelTh : statusDisplay.label}
                    </div>

                    {/* Tournament Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="max-w-7xl mx-auto">
                            <Breadcrumb
                                items={[
                                    { label: 'HOME', labelTh: 'หน้าแรก', href: '/' },
                                    { label: 'TOURNAMENT', labelTh: 'ทัวร์นาเมนต์', href: '/tournament' },
                                    { label: tournament.name.toUpperCase(), labelTh: tournament.nameTh }
                                ]}
                            />
                            <h1 className="text-3xl md:text-5xl font-bold text-white mt-2">
                                {language === 'th' ? tournament.nameTh : tournament.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Info Bar */}
            <section className="bg-gray-900 text-white py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-6 md:gap-12 items-center justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-brand-yellow" />
                            <span>{formatDate(tournament.dateStart, tournament.dateEnd)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-brand-yellow" />
                            <span>{tournament.timeStart} - {tournament.timeEnd}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-brand-yellow" />
                            <span>{language === 'th' ? tournament.location.venueTh : tournament.location.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-brand-yellow" />
                            <span>{tournament.prize}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="border-b border-gray-200 sticky top-16 bg-white z-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 mb-6">
                        {availableTabs.map((tab) => {
                            const label = {
                                info: language === 'th' ? 'รายละเอียด' : 'Details',
                                schedule: language === 'th' ? 'กำหนดการ' : 'Schedule',
                                register: language === 'th' ? 'สมัครเข้าร่วม' : 'Register',
                                cards: language === 'th' ? 'ผลคะแนน' : 'Match Cards',
                                winners: language === 'th' ? 'ประกาศผู้ชนะ' : 'Winners',
                            }[tab];

                            if (!label) return null;

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-brand-yellow text-brand-yellow'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-8">
                                {/* Description */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {language === 'th' ? 'เกี่ยวกับการแข่งขัน' : 'About the Tournament'}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {language === 'th' ? tournament.descriptionTh : tournament.description}
                                    </p>
                                </div>

                                {/* Categories */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {language === 'th' ? 'ประเภทการแข่งขัน' : 'Categories'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(language === 'th' ? tournament.categoriesTh : tournament.categories).map((cat, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Rules */}
                                {tournament.rules && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            {language === 'th' ? 'กฎและข้อบังคับ' : 'Rules & Regulations'}
                                        </h3>
                                        <ul className="space-y-2">
                                            {(language === 'th' ? tournament.rulesTh : tournament.rules)?.map((rule, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600">
                                                    <ChevronRight size={18} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div >
                                )}
                            </div >

                            {/* Sidebar */}
                            < div className="space-y-6" >
                                {/* Location Card */}
                                < div className="bg-gray-50 rounded-xl p-6" >
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin size={20} />
                                        {language === 'th' ? 'สถานที่จัดงาน' : 'Venue'}
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p className="font-semibold text-gray-900">
                                            {language === 'th' ? tournament.location.venueTh : tournament.location.venue}
                                        </p>
                                        <p className="text-sm">
                                            {language === 'th'
                                                ? `${tournament.location.cityTh}, ${tournament.location.countryTh}`
                                                : `${tournament.location.city}, ${tournament.location.country}`
                                            }
                                        </p>
                                        {tournament.location.address && (
                                            <p className="text-sm">
                                                {language === 'th' ? tournament.location.addressTh : tournament.location.address}
                                            </p>
                                        )}
                                        {tournament.location.mapUrl && (
                                            <a
                                                href={tournament.location.mapUrl}
                                                target="_blank"
                                                className="inline-block mt-2 text-brand-yellow text-sm font-medium hover:underline"
                                            >
                                                {language === 'th' ? 'ดูแผนที่' : 'View on Map'} →
                                            </a>
                                        )}
                                    </div>
                                </div >

                                {/* Participants */}
                                < div className="bg-gray-50 rounded-xl p-6" >
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users size={20} />
                                        {language === 'th' ? 'ผู้เข้าร่วม' : 'Participants'}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {language === 'th' ? 'ลงทะเบียนแล้ว' : 'Registered'}
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {tournament.registeredCount} / {tournament.participants}
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${tournament.registeredCount >= tournament.participants
                                                    ? 'bg-red-500'
                                                    : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min((tournament.registeredCount / tournament.participants) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {tournament.registeredCount >= tournament.participants
                                                ? (language === 'th' ? 'เต็มแล้ว' : 'Full')
                                                : (language === 'th'
                                                    ? `เหลือ ${tournament.participants - tournament.registeredCount} ที่`
                                                    : `${tournament.participants - tournament.registeredCount} spots left`
                                                )
                                            }
                                        </p>
                                    </div>
                                </div >

                                {/* Entry Fee */}
                                {
                                    tournament.entryFee && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h3 className="font-bold text-gray-900 mb-2">
                                                {language === 'th' ? 'ค่าสมัคร' : 'Entry Fee'}
                                            </h3>
                                            <p className="text-2xl font-bold text-brand-yellow">
                                                {tournament.entryFee}
                                            </p>
                                        </div>
                                    )
                                }

                                {/* Contact */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">
                                        {language === 'th' ? 'ติดต่อสอบถาม' : 'Contact'}
                                    </h3>
                                    <div className="space-y-3">
                                        {tournament.contactEmail && (
                                            <a href={`mailto:${tournament.contactEmail}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-yellow">
                                                <Mail size={16} />
                                                <span className="text-sm">{tournament.contactEmail}</span>
                                            </a>
                                        )}
                                        {tournament.contactPhone && (
                                            <a href={`tel:${tournament.contactPhone}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-yellow">
                                                <Phone size={16} />
                                                <span className="text-sm">{tournament.contactPhone}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div >
                        </motion.div >
                    )}

                    {/* Schedule Tab */}
                    {
                        activeTab === 'schedule' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {tournament.schedule && tournament.schedule.length > 0 ? (
                                    <div className="space-y-8">
                                        {tournament.schedule.map((day, dayIndex) => (
                                            <div key={dayIndex} className="bg-gray-50 rounded-xl overflow-hidden">
                                                <div className="bg-gray-900 text-white px-6 py-4">
                                                    <h3 className="font-bold text-lg">
                                                        {formatSingleDate(day.date)}
                                                    </h3>
                                                </div>
                                                <div className="divide-y divide-gray-200">
                                                    {day.events.map((event, eventIndex) => (
                                                        <div key={eventIndex} className="flex items-center gap-4 px-6 py-4">
                                                            <div className="w-20 flex-shrink-0">
                                                                <span className="text-brand-yellow font-bold">{event.time}</span>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <span className="text-gray-900">
                                                                    {language === 'th' ? event.eventTh : event.event}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        {language === 'th' ? 'ยังไม่มีกำหนดการ' : 'Schedule not available yet'}
                                    </div>
                                )}
                            </motion.div>
                        )
                    }

                    {/* Register Tab */}
                    {
                        activeTab === 'register' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-2xl mx-auto"
                            >
                                {/* Step Indicator */}
                                <div className="flex items-center justify-center mb-8">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${registrationStep >= 1 ? 'bg-brand-yellow text-black' : 'bg-gray-300 text-gray-600'
                                            }`}>
                                            1
                                        </div>
                                        <span className={`ml-2 mr-4 text-sm font-medium hidden sm:block ${registrationStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {language === 'th' ? 'ข้อมูล' : 'Info'}
                                        </span>
                                    </div>
                                    <div className={`w-8 sm:w-12 h-1 mx-1 rounded ${registrationStep >= 2 ? 'bg-brand-yellow' : 'bg-gray-300'}`} />
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${registrationStep >= 2 ? 'bg-brand-yellow text-black' : 'bg-gray-300 text-gray-600'
                                            }`}>
                                            2
                                        </div>
                                        <span className={`ml-2 mr-4 text-sm font-medium hidden sm:block ${registrationStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {language === 'th' ? 'ชำระเงิน' : 'Payment'}
                                        </span>
                                    </div>
                                    <div className={`w-8 sm:w-12 h-1 mx-1 rounded ${registrationStep >= 3 ? 'bg-brand-yellow' : 'bg-gray-300'}`} />
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${registrationStep >= 3 ? 'bg-brand-yellow text-black' : 'bg-gray-300 text-gray-600'
                                            }`}>
                                            3
                                        </div>
                                        <span className={`ml-2 text-sm font-medium hidden sm:block ${registrationStep >= 3 ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {language === 'th' ? 'เสร็จสิ้น' : 'Done'}
                                        </span>
                                    </div>
                                </div>

                                {/* Step 1: Registration Form */}
                                {registrationStep === 1 && (
                                    <div className="bg-gray-50 rounded-xl p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                            {language === 'th' ? 'ขั้นตอนที่ 1: กรอกข้อมูลผู้สมัคร' : 'Step 1: Registration Information'}
                                        </h2>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'ชื่อ-นามสกุล *' : 'Full Name *'}
                                                </label>
                                                <input
                                                    id="field-name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name'}
                                                />
                                            </div>

                                            {/* Nickname */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'ชื่อเล่น/ฉายา *' : 'Nickname/Alias *'}
                                                </label>
                                                <input
                                                    id="field-nickname"
                                                    type="text"
                                                    required
                                                    value={formData.nickname}
                                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    placeholder={language === 'th' ? 'กรอกชื่อเล่นหรือฉายา' : 'Enter nickname or alias'}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'อีเมล *' : 'Email *'}
                                                </label>
                                                <input
                                                    id="field-email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'เบอร์โทรศัพท์ *' : 'Phone Number *'}
                                                </label>
                                                <input
                                                    id="field-phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter your phone number'}
                                                />
                                            </div>

                                            {/* Birthdate */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'วันเกิด *' : 'Date of Birth *'}
                                                </label>
                                                <input
                                                    id="field-birthdate"
                                                    type="date"
                                                    required
                                                    value={formData.birthdate}
                                                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'เพศ *' : 'Gender *'}
                                                </label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={formData.gender === 'male'}
                                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                                                            className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                                                            required
                                                        />
                                                        <span className="text-gray-700">{language === 'th' ? 'ชาย' : 'Male'}</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={formData.gender === 'female'}
                                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                                                            className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                                                        />
                                                        <span className="text-gray-700">{language === 'th' ? 'หญิง' : 'Female'}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'ประเภทการแข่งขัน *' : 'Category *'}
                                                </label>
                                                <select
                                                    id="field-category"
                                                    required
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                >
                                                    <option value="">{language === 'th' ? 'เลือกประเภท' : 'Select category'}</option>
                                                    {tournament.categories.map((cat, i) => (
                                                        <option key={i} value={cat}>
                                                            {language === 'th' ? tournament.categoriesTh[i] : cat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Photo Upload */}
                                            <div id="photo-upload">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'รูปถ่ายผู้แข่งขัน *' : 'Competitor Photo *'}
                                                </label>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {language === 'th' ? '📸 ถ่ายแบบครึ่งตัวหรือเต็มตัว ให้เห็นหน้าชัดเจน' : '📸 Half-body or full-body photo with clear face'}
                                                </p>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brand-yellow transition-colors">
                                                    {formData.photoPreview ? (
                                                        <div className="space-y-3">
                                                            <img
                                                                src={formData.photoPreview}
                                                                alt="Preview"
                                                                className="max-h-48 mx-auto rounded-lg object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, photo: null, photoPreview: '' })}
                                                                className="text-red-600 text-sm hover:underline"
                                                            >
                                                                {language === 'th' ? 'ลบรูปภาพ' : 'Remove image'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="cursor-pointer">
                                                            <div className="space-y-2">
                                                                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-gray-600 text-sm">
                                                                    {language === 'th' ? 'คลิกเพื่อเลือกรูปภาพ' : 'Click to select photo'}
                                                                </p>
                                                                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handlePhotoUpload(e, false)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Partner Info (for doubles) */}
                                            {formData.category && isDoublesCategory(formData.category) && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <Users2 size={18} />
                                                        {language === 'th' ? 'ข้อมูลคู่หู' : 'Partner Information'}
                                                    </h4>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'th' ? 'ชื่อคู่หู *' : 'Partner Name *'}
                                                        </label>
                                                        <input
                                                            id="field-partnerName"
                                                            type="text"
                                                            required={isDoublesCategory(formData.category)}
                                                            value={formData.partnerName}
                                                            onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                                                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder={language === 'th' ? 'กรอกชื่อคู่หู' : 'Enter partner name'}
                                                        />
                                                    </div >
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'th' ? 'ชื่อเล่น/ฉายาคู่หู' : 'Partner Nickname/Alias'}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.partnerNickname}
                                                            onChange={(e) => setFormData({ ...formData, partnerNickname: e.target.value })}
                                                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder={language === 'th' ? 'กรอกชื่อเล่นคู่หู (ถ้ามี)' : 'Enter partner nickname (optional)'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'th' ? 'อีเมลคู่หู' : 'Partner Email'}
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={formData.partnerEmail}
                                                            onChange={(e) => setFormData({ ...formData, partnerEmail: e.target.value })}
                                                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder={language === 'th' ? 'กรอกอีเมลคู่หู' : 'Enter partner email'}
                                                        />
                                                    </div>
                                                    {/* Partner Photo Upload */}
                                                    <div id="partner-photo-upload">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            {language === 'th' ? 'รูปถ่ายคู่หู *' : 'Partner Photo *'}
                                                        </label>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {language === 'th' ? '📸 ถ่ายแบบครึ่งตัวหรือเต็มตัว ให้เห็นหน้าชัดเจน' : '📸 Half-body or full-body photo with clear face'}
                                                        </p>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brand-yellow transition-colors">
                                                            {formData.partnerPhotoPreview ? (
                                                                <div className="space-y-3">
                                                                    <img
                                                                        src={formData.partnerPhotoPreview}
                                                                        alt="Partner Preview"
                                                                        className="max-h-48 mx-auto rounded-lg object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData({ ...formData, partnerPhoto: null, partnerPhotoPreview: '' })}
                                                                        className="text-red-600 text-sm hover:underline"
                                                                    >
                                                                        {language === 'th' ? 'ลบรูปภาพ' : 'Remove image'}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <label className="cursor-pointer">
                                                                    <div className="space-y-2">
                                                                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-gray-600 text-sm">
                                                                            {language === 'th' ? 'คลิกเพื่อเลือกรูปภาพคู่หู' : 'Click to select partner photo'}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handlePhotoUpload(e, true)}
                                                                        className="hidden"
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div >
                                            )}

                                            {/* Entry Fee Notice */}
                                            {
                                                tournament.entryFee && (
                                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                                                        <span className="text-gray-700">
                                                            {language === 'th' ? 'ค่าสมัคร' : 'Entry Fee'}
                                                        </span>
                                                        <span className="font-bold text-lg text-gray-900">{tournament.entryFee}</span>
                                                    </div>
                                                )
                                            }

                                            {/* Promo Code */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {language === 'th' ? 'โค้ดสมัครฟรี (ถ้ามี)' : 'Promo Code (optional)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.promoCode}
                                                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    placeholder={language === 'th' ? 'กรอกโค้ดสมัครฟรี' : 'Enter promo code'}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {language === 'th'
                                                        ? 'ติดตามโค้ดฟรีได้ที่เพจ Reach Badminton'
                                                        : 'Follow free codes on the Reach Badminton page'}
                                                </p>
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                type="submit"
                                                className="w-full bg-brand-yellow text-black py-4 font-bold text-lg hover:bg-yellow-400 transition-colors"
                                            >
                                                {language === 'th' ? 'ถัดไป: ชำระเงิน' : 'Next: Payment'}
                                            </button>
                                        </form >
                                    </div >
                                )}

                                {/* Step 2: Payment Form */}
                                {
                                    registrationStep === 2 && (
                                        <div className="bg-gray-50 rounded-xl p-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                {language === 'th' ? 'ขั้นตอนที่ 2: ชำระเงินค่าสมัคร' : 'Step 2: Payment'}
                                            </h2>

                                            {/* Summary */}
                                            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    {language === 'th' ? 'สรุปข้อมูลการสมัคร' : 'Registration Summary'}
                                                </h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p><span className="font-medium">{language === 'th' ? 'ชื่อ:' : 'Name:'}</span> {formData.name}</p>
                                                    <p><span className="font-medium">{language === 'th' ? 'อีเมล:' : 'Email:'}</span> {formData.email}</p>
                                                    <p><span className="font-medium">{language === 'th' ? 'ประเภท:' : 'Category:'}</span> {formData.category}</p>
                                                    {formData.partnerName && (
                                                        <p><span className="font-medium">{language === 'th' ? 'คู่หู:' : 'Partner:'}</span> {formData.partnerName}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                                <h4 className="font-bold text-gray-900 mb-4 text-center">
                                                    {language === 'th' ? 'ข้อมูลการชำระเงิน' : 'Payment Information'}
                                                </h4>

                                                {/* QR Code */}
                                                <div className="flex justify-center mb-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded">
                                                            {/* Placeholder QR Code - In production, use real QR */}
                                                            <div className="text-center">
                                                                <svg viewBox="0 0 100 100" className="w-40 h-40">
                                                                    <rect fill="#000" x="10" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="20" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="30" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="40" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="50" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="60" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="10" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="20" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="20" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="30" width="10" height="10" />
                                                                    <rect fill="#000" x="30" y="30" width="10" height="10" />
                                                                    <rect fill="#000" x="40" y="30" width="10" height="10" />
                                                                    <rect fill="#000" x="50" y="30" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="30" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="40" width="10" height="10" />
                                                                    <rect fill="#000" x="30" y="40" width="10" height="10" />
                                                                    <rect fill="#000" x="40" y="40" width="10" height="10" />
                                                                    <rect fill="#000" x="50" y="40" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="40" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="50" width="10" height="10" />
                                                                    <rect fill="#000" x="30" y="50" width="10" height="10" />
                                                                    <rect fill="#000" x="40" y="50" width="10" height="10" />
                                                                    <rect fill="#000" x="50" y="50" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="50" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="60" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="60" width="10" height="10" />
                                                                    <rect fill="#000" x="10" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="20" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="30" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="40" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="50" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="60" y="70" width="10" height="10" />
                                                                    <rect fill="#000" x="70" y="70" width="10" height="10" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <p className="text-center text-xs text-gray-500 mt-2">
                                                            {language === 'th' ? 'สแกน QR Code เพื่อชำระเงิน' : 'Scan QR Code to pay'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bank Account */}
                                                <div className="bg-white rounded-lg p-4 text-center">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        {language === 'th' ? 'หรือโอนเงินไปยังบัญชี' : 'Or transfer to account'}
                                                    </p>
                                                    <p className="font-bold text-lg text-gray-900">ธนาคารกสิกรไทย (KBANK)</p>
                                                    <p className="text-2xl font-mono font-bold text-blue-600 my-2">123-4-56789-0</p>
                                                    <p className="text-gray-700">ชื่อบัญชี: บริษัท รีช สปอร์ต จำกัด</p>
                                                    <p className="text-gray-700">REACH SPORT CO., LTD.</p>
                                                </div>

                                                {/* Amount */}
                                                <div className="mt-4 text-center">
                                                    <p className="text-sm text-gray-600">
                                                        {language === 'th' ? 'จำนวนเงินที่ต้องชำระ' : 'Amount to pay'}
                                                    </p>
                                                    <p className="text-3xl font-bold text-green-600">{tournament.entryFee}</p>
                                                </div>
                                            </div>

                                            {/* Payment Proof Form */}
                                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                                <h4 className="font-bold text-gray-900">
                                                    {language === 'th' ? 'ส่งหลักฐานการชำระเงิน' : 'Submit Payment Proof'}
                                                </h4>

                                                {/* Transfer Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'th' ? 'วันที่โอนเงิน *' : 'Transfer Date *'}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={paymentData.transferDate}
                                                        onChange={(e) => setPaymentData({ ...paymentData, transferDate: e.target.value })}
                                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    />
                                                </div>

                                                {/* Transfer Time */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'th' ? 'เวลาที่โอนเงิน * (รูปแบบ 24 ชั่วโมง)' : 'Transfer Time * (24-hour format)'}
                                                    </label>
                                                    <input
                                                        type="time"
                                                        required
                                                        value={paymentData.transferTime}
                                                        onChange={(e) => setPaymentData({ ...paymentData, transferTime: e.target.value })}
                                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {language === 'th' ? 'เช่น 14:30 หมายถึง บ่าย 2 โมงครึ่ง' : 'e.g., 14:30 means 2:30 PM'}
                                                    </p>
                                                </div>

                                                {/* Amount */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'th' ? 'จำนวนเงินที่โอน (บาท) *' : 'Transfer Amount (THB) *'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={paymentData.amount}
                                                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        placeholder={language === 'th' ? 'กรอกจำนวนเงิน' : 'Enter amount'}
                                                    />
                                                </div>

                                                {/* Slip Upload */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {language === 'th' ? 'อัปโหลดสลิปการโอนเงิน *' : 'Upload Transfer Slip *'}
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-yellow transition-colors">
                                                        {paymentData.slipPreview ? (
                                                            <div className="space-y-4">
                                                                <img
                                                                    src={paymentData.slipPreview}
                                                                    alt="Slip preview"
                                                                    className="max-h-64 mx-auto rounded-lg"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPaymentData({ ...paymentData, slipFile: null, slipPreview: '' })}
                                                                    className="text-red-600 text-sm hover:underline"
                                                                >
                                                                    {language === 'th' ? 'ลบรูปภาพ' : 'Remove image'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className="cursor-pointer">
                                                                <div className="space-y-2">
                                                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                    <p className="text-gray-600">
                                                                        {language === 'th' ? 'คลิกเพื่อเลือกรูปสลิป' : 'Click to select slip image'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleSlipUpload}
                                                                    className="hidden"
                                                                    required={!paymentData.slipFile}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRegistrationStep(1)}
                                                        className="flex-1 bg-gray-200 text-gray-700 py-4 font-bold text-lg hover:bg-gray-300 transition-colors rounded-lg"
                                                    >
                                                        {language === 'th' ? 'ย้อนกลับ' : 'Back'}
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={!paymentData.slipFile}
                                                        className="flex-1 bg-brand-yellow text-black py-4 font-bold text-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                    >
                                                        {language === 'th' ? 'ส่งหลักฐานการชำระเงิน' : 'Submit Payment Proof'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                }

                                {/* Step 3: Confirmation */}
                                {
                                    registrationStep === 3 && (
                                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                                            {/* Animated Success Icon */}
                                            <motion.div
                                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 15,
                                                    delay: 0.2
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 200,
                                                        damping: 15,
                                                        delay: 0.5
                                                    }}
                                                >
                                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                                </motion.div>
                                            </motion.div >

                                            <motion.h2
                                                className="text-2xl font-bold text-gray-900 mb-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                {language === 'th' ? 'ส่งข้อมูลเรียบร้อยแล้ว!' : 'Submission Complete!'}
                                            </motion.h2>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                                                <h4 className="font-semibold text-blue-800 mb-2">
                                                    {language === 'th' ? '📧 โปรดรอการตรวจสอบ' : '📧 Please wait for verification'}
                                                </h4>
                                                <p className="text-blue-700 text-sm">
                                                    {language === 'th'
                                                        ? 'เราจะตรวจสอบหลักฐานการชำระเงินของคุณ และจะส่งบัตรการแข่งขันให้คุณทางอีเมล ' + formData.email + ' ที่คุณสมัครไว้'
                                                        : 'We will verify your payment proof and send your competition card to your registered email: ' + formData.email}
                                                </p>
                                            </div>

                                            <p className="text-gray-600 mb-6">
                                                {language === 'th'
                                                    ? 'ขอบคุณที่สมัครเข้าร่วมการแข่งขัน! หากมีข้อสงสัยสามารถติดต่อเราได้ทางอีเมลหรือโทรศัพท์'
                                                    : 'Thank you for registering! If you have any questions, please contact us via email or phone.'}
                                            </p>

                                            {/* Navigation Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button
                                                    onClick={() => {
                                                        resetAllForms();
                                                        setActiveTab('schedule');
                                                    }}
                                                    className="flex-1 bg-gray-200 text-gray-700 py-4 font-bold text-lg hover:bg-gray-300 transition-colors rounded-lg"
                                                >
                                                    {language === 'th' ? 'ดูกำหนดการ' : 'View Schedule'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        resetAllForms();
                                                        setActiveTab('info');
                                                    }}
                                                    className="flex-1 bg-brand-yellow text-black py-4 font-bold text-lg hover:bg-yellow-400 transition-colors rounded-lg"
                                                >
                                                    {language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                                                </button>
                                            </div>
                                        </div >
                                    )}
                            </motion.div >
                        )}



                    {/* Cards View */}
                    {
                        activeTab === 'cards' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Category Filter */}
                                <div className="mb-6 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setCategoryFilter('all')}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${categoryFilter === 'all'
                                            ? 'bg-brand-yellow text-black'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {language === 'th' ? 'ทั้งหมด' : 'All'}
                                    </button>
                                    {tournament.categories.map((cat, idx) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${categoryFilter === cat
                                                ? 'bg-brand-yellow text-black'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {language === 'th' ? tournament.categoriesTh[idx] : cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    {/* Group matches by round */}
                                    {(() => {
                                        const roundsOrder = ['Final', 'Semifinal', 'Quarterfinal', 'Round of 16', 'Round of 32'];
                                        const allMatches = tournament.matches || [];

                                        // Filter by category
                                        const filteredMatches = categoryFilter === 'all'
                                            ? allMatches
                                            : allMatches.filter(m => m.category === categoryFilter);

                                        const groupedMatches = filteredMatches.reduce((acc, match) => {
                                            const round = match.round;
                                            if (!acc[round]) acc[round] = [];
                                            acc[round].push(match);
                                            return acc;
                                        }, {} as Record<string, typeof tournament.matches>);

                                        // Sort rounds based on roundsOrder
                                        const sortedRounds = Object.keys(groupedMatches).sort((a, b) => {
                                            return roundsOrder.indexOf(a) - roundsOrder.indexOf(b);
                                        });

                                        if (sortedRounds.length === 0) {
                                            return (
                                                <div className="text-center py-12 text-gray-500">
                                                    {language === 'th' ? 'ไม่พบผลการแข่งขันในประเภทนี้' : 'No matches found in this category'}
                                                </div>
                                            );
                                        }

                                        return sortedRounds.map((round) => {
                                            const roundMatches = groupedMatches[round];
                                            if (!roundMatches) return null;
                                            // Get localized round name from the first match in the group
                                            const roundName = language === 'th' ? roundMatches[0].roundTh : roundMatches[0].round;

                                            return (
                                                <div key={round}>
                                                    <h3 className="text-2xl font-bold mb-4 text-gray-800 px-1">
                                                        {(() => {
                                                            const r = roundName.toLowerCase();
                                                            if (r.includes('quarter') || r.includes('ก่อนรอง')) return language === 'th' ? 'รอบที่ 3' : 'Round 3';
                                                            if (r.includes('16')) return language === 'th' ? 'รอบที่ 2' : 'Round 2';
                                                            if (r.includes('32')) return language === 'th' ? 'รอบที่ 1' : 'Round 1';
                                                            return roundName;
                                                        })()}
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {roundMatches.map((match) => (
                                                            <EnhancedMatchCard
                                                                key={match.id}
                                                                match={match}
                                                                language={language}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </motion.div>
                        )
                    }

                    {/* Winners View */}
                    {
                        activeTab === 'winners' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <WinnersView language={language} />
                            </motion.div>
                        )
                    }
                </div >
            </section >


        </main >
    );
}

// Sample Winners Data - In production, this would come from API/database
const sampleWinnersData: WinnersData = {
    champion: [
        {
            id: 'champ-ms',
            nickname: 'MAX',
            nicknameTh: 'แม็กซ์',
            fullName: 'Thanaporn Siriwan',
            fullNameTh: 'ธนพร ศิริวรรณ',
            age: 24,
            category: 'men_singles',
            playerImage: '/images/winners/players/champion-ms.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'champ-ws',
            nickname: 'MINT',
            nicknameTh: 'มิ้นท์',
            fullName: 'Siriporn Chaiyasit',
            fullNameTh: 'ศิริพร ชัยสิทธิ์',
            age: 22,
            category: 'women_singles',
            playerImage: '/images/winners/players/champion-ws.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'champ-md',
            nickname: 'BANK & BOY',
            nicknameTh: 'แบงค์ & บอย',
            fullName: 'Kittisak & Somchai',
            fullNameTh: 'กิตติศักดิ์ & สมชาย',
            age: 26,
            category: 'men_doubles',
            playerImage: '/images/winners/players/champion-md.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'champ-wd',
            nickname: 'PLOY & PAM',
            nicknameTh: 'พลอย & แพม',
            fullName: 'Ploypailin & Pamela',
            fullNameTh: 'พลอยไพลิน & พาเมล่า',
            age: 23,
            category: 'women_doubles',
            playerImage: '/images/winners/players/champion-wd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'champ-xd',
            nickname: 'FIRST & FERN',
            nicknameTh: 'เฟิร์ส & เฟิร์น',
            fullName: 'Pichaya & Fernanda',
            fullNameTh: 'พิชญา & เฟอร์นานด้า',
            age: 25,
            category: 'mixed_doubles',
            playerImage: '/images/winners/players/champion-xd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
    ],
    runnerUp1: [
        {
            id: 'ru1-ms',
            nickname: 'JAMES',
            nicknameTh: 'เจมส์',
            fullName: 'Jaturong Prasert',
            fullNameTh: 'จาตุรงค์ ประเสริฐ',
            age: 23,
            category: 'men_singles',
            playerImage: '/images/winners/players/runner1-ms.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru1-ws',
            nickname: 'JUNE',
            nicknameTh: 'จูน',
            fullName: 'Junetra Khampan',
            fullNameTh: 'จูนตรา คำปัน',
            age: 21,
            category: 'women_singles',
            playerImage: '/images/winners/players/runner1-ws.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru1-md',
            nickname: 'MARK & MIKE',
            nicknameTh: 'มาร์ค & ไมค์',
            fullName: 'Markus & Michael',
            fullNameTh: 'มาร์คัส & ไมเคิล',
            age: 27,
            category: 'men_doubles',
            playerImage: '/images/winners/players/runner1-md.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru1-wd',
            nickname: 'NAM & NOI',
            nicknameTh: 'น้ำ & น้อย',
            fullName: 'Namwan & Noinoi',
            fullNameTh: 'น้ำวรรณ & น้อยน้อย',
            age: 24,
            category: 'women_doubles',
            playerImage: '/images/winners/players/runner1-wd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru1-xd',
            nickname: 'TOP & TAN',
            nicknameTh: 'ท็อป & แทน',
            fullName: 'Topporn & Tanita',
            fullNameTh: 'ท็อปพร & ธนิตา',
            age: 26,
            category: 'mixed_doubles',
            playerImage: '/images/winners/players/runner1-xd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
    ],
    runnerUp2: [
        {
            id: 'ru2-ms',
            nickname: 'PETE',
            nicknameTh: 'พีท',
            fullName: 'Peerawat Somjai',
            fullNameTh: 'พีรวัฒน์ สมใจ',
            age: 22,
            category: 'men_singles',
            playerImage: '/images/winners/players/runner2-ms.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru2-ws',
            nickname: 'BEAM',
            nicknameTh: 'บีม',
            fullName: 'Beamrat Wongchai',
            fullNameTh: 'บีมรัตน์ วงศ์ชัย',
            age: 20,
            category: 'women_singles',
            playerImage: '/images/winners/players/runner2-ws.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru2-md',
            nickname: 'OAT & OAK',
            nicknameTh: 'โอ๊ต & โอ๊ค',
            fullName: 'Oatthakrit & Oakrit',
            fullNameTh: 'โอ๊ตฐกฤษ & โอ๊คฤทธิ์',
            age: 25,
            category: 'men_doubles',
            playerImage: '/images/winners/players/runner2-md.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru2-wd',
            nickname: 'CREAM & CAKE',
            nicknameTh: 'ครีม & เค้ก',
            fullName: 'Creampuff & Cakery',
            fullNameTh: 'ครีมพัฟ & เค้กเกอรี่',
            age: 22,
            category: 'women_doubles',
            playerImage: '/images/winners/players/runner2-wd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
        {
            id: 'ru2-xd',
            nickname: 'BOSS & BELLA',
            nicknameTh: 'บอส & เบลล่า',
            fullName: 'Bossapat & Bellarina',
            fullNameTh: 'บอสอภัสร์ & เบลลาริน่า',
            age: 24,
            category: 'mixed_doubles',
            playerImage: '/images/winners/players/runner2-xd.png',
            venue: 'Impact Arena',
            venueTh: 'อิมแพ็ค อารีน่า',
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            province: 'Bangkok',
            provinceTh: 'กรุงเทพฯ',
        },
    ],
};

// Winners View Component - New Slider Design
function WinnersView({ language }: { language: string }) {
    return (
        <div className="py-8">
            <WinnersSlider winnersData={sampleWinnersData} language={language} />
        </div>
    );
}
