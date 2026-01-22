"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useUser, ShippingAddress } from "@/context/UserContext";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
    getAllProvinces,
    getDistrictsByProvince,
    getSubdistrictsByDistrict,
    getPostalCode,
    countries,
} from "@/data/thaiAddressData";
import {
    User,
    Mail,
    Phone,
    Award,
    Gift,
    ShoppingBag,
    LogOut,
    ChevronRight,
    Crown,
    Camera,
    MapPin,
    Edit3,
    X,
    Check,
    Handshake,
} from "lucide-react";

export default function ProfilePage() {
    const { language } = useLanguage();
    const router = useRouter();
    const {
        isLoggedIn,
        userProfile,
        logout,
        updateProfile,
        updateAvatar,
        updateShippingAddress,
        totalPoints,
        availablePoints,
        usedPoints,
        redeemedRewards,
    } = useUser();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editNickname, setEditNickname] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editSubdistrict, setEditSubdistrict] = useState("");
    const [editAddress, setEditAddress] = useState<ShippingAddress>({
        fullName: "",
        phone: "",
        address: "",
        district: "",
        province: "",
        postalCode: "",
        country: "Thailand",
    });

    // Get province/district/subdistrict options
    const provinceOptions = getAllProvinces().map((p) => ({
        value: p.nameTh,
        label: p.name,
        labelTh: p.nameTh,
    }));

    const districtOptions = editAddress.province
        ? getDistrictsByProvince(editAddress.province).map((d) => ({
              value: d.nameTh,
              label: d.name,
              labelTh: d.nameTh,
          }))
        : [];

    const subdistrictOptions = editAddress.province && editAddress.district
        ? getSubdistrictsByDistrict(editAddress.province, editAddress.district).map((s) => ({
              value: s.nameTh,
              label: s.name,
              labelTh: s.nameTh,
              postalCode: s.postalCode,
          }))
        : [];

    const countryOptions = countries.map((c) => ({
        value: c.nameTh,
        label: c.name,
        labelTh: c.nameTh,
    }));

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router]);

    // Initialize edit fields when userProfile changes
    useEffect(() => {
        if (userProfile) {
            setEditNickname(userProfile.nickname || "");
            setEditPhone(userProfile.phone || "");
            if (userProfile.shippingAddress) {
                setEditAddress(userProfile.shippingAddress);
            } else {
                setEditAddress({
                    fullName: userProfile.name,
                    phone: userProfile.phone || "",
                    address: "",
                    district: "",
                    province: "",
                    postalCode: "",
                    country: "Thailand",
                });
            }
        }
    }, [userProfile]);

    const content = {
        en: {
            title: "My Profile",
            memberSince: "Member since",
            tier: "Member Tier",
            points: {
                title: "My Points",
                total: "Total Points",
                used: "Used Points",
                available: "Available Points",
            },
            menu: {
                orders: "My Orders",
                ordersDesc: "View your order history",
                rewards: "My Rewards",
                rewardsDesc: "Redeem your points",
                logout: "Log Out",
            },
            recentRewards: "Recent Rewards",
            noRewards: "No rewards redeemed yet",
            viewAll: "View All",
            editNickname: "Edit Nickname",
            nickname: "Nickname",
            noNickname: "No nickname set",
            editPhone: "Edit Phone",
            savePhone: "Save",
            cancelEdit: "Cancel",
            shippingAddress: "Shipping Address",
            addAddress: "Add shipping address",
            editAddress: "Edit Address",
            noAddress: "No shipping address yet",
            addressForm: {
                fullName: "Full Name",
                phone: "Phone",
                address: "Address",
                subdistrict: "Subdistrict",
                district: "District",
                province: "Province",
                postalCode: "Postal Code",
                country: "Country",
                save: "Save Address",
            },
            changePhoto: "Change Photo",
            affiliate: "Become a Partner",
        },
        th: {
            title: "โปรไฟล์ของฉัน",
            memberSince: "สมาชิกตั้งแต่",
            tier: "ระดับสมาชิก",
            points: {
                title: "คะแนนของฉัน",
                total: "คะแนนทั้งหมด",
                used: "คะแนนที่ใช้แล้ว",
                available: "คะแนนคงเหลือ",
            },
            menu: {
                orders: "คำสั่งซื้อของฉัน",
                ordersDesc: "ดูประวัติการสั่งซื้อ",
                rewards: "ของรางวัลของฉัน",
                rewardsDesc: "แลกคะแนนสะสม",
                logout: "ออกจากระบบ",
            },
            recentRewards: "ของรางวัลที่แลกล่าสุด",
            noRewards: "ยังไม่มีของรางวัลที่แลก",
            viewAll: "ดูทั้งหมด",
            editNickname: "แก้ไขชื่อเล่น",
            nickname: "ชื่อเล่น",
            noNickname: "ยังไม่ตั้งชื่อเล่น",
            editPhone: "แก้ไขเบอร์โทร",
            savePhone: "บันทึก",
            cancelEdit: "ยกเลิก",
            shippingAddress: "ที่อยู่จัดส่ง",
            addAddress: "เพิ่มที่อยู่จัดส่ง",
            editAddress: "แก้ไขที่อยู่",
            noAddress: "ยังไม่มีที่อยู่จัดส่ง",
            addressForm: {
                fullName: "ชื่อ-นามสกุล",
                phone: "เบอร์โทร",
                address: "ที่อยู่",
                subdistrict: "แขวง/ตำบล",
                district: "เขต/อำเภอ",
                province: "จังหวัด",
                postalCode: "รหัสไปรษณีย์",
                country: "ประเทศ",
                save: "บันทึกที่อยู่",
            },
            changePhoto: "เปลี่ยนรูป",
            affiliate: "สมัครเป็นพาร์ทเนอร์",
        },
    };

    const t = language === "th" ? content.th : content.en;

    const tierColors = {
        Bronze: "from-amber-600 to-amber-800",
        Silver: "from-gray-400 to-gray-600",
        Gold: "from-yellow-400 to-yellow-600",
        Platinum: "from-purple-400 to-purple-600",
    };

    const tierColorsTh: Record<string, string> = {
        Bronze: "บรอนซ์",
        Silver: "ซิลเวอร์",
        Gold: "โกลด์",
        Platinum: "แพลทินัม",
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveNickname = () => {
        updateProfile({ nickname: editNickname });
        setIsEditingNickname(false);
    };

    const handleSavePhone = () => {
        updateProfile({ phone: editPhone });
        setIsEditingPhone(false);
    };

    const handleSaveAddress = () => {
        updateShippingAddress(editAddress);
        setIsEditingAddress(false);
    };

    if (!isLoggedIn || !userProfile) {
        return (
            <main className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-screen">
                    <div className="text-center text-gray-500">
                        {language === "th" ? "กำลังโหลด..." : "Loading..."}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
                >
                    {/* Cover / Tier Banner */}
                    <div
                        className={`h-24 bg-gradient-to-r ${tierColors[userProfile.memberTier]}`}
                    />

                    <div className="px-6 pb-6">
                        {/* Avatar with edit button */}
                        <div className="-mt-12 mb-4 relative inline-block">
                            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
                                {userProfile.avatar ? (
                                    <img
                                        src={userProfile.avatar}
                                        alt={userProfile.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <button
                                onClick={handleAvatarClick}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
                                title={t.changePhoto}
                            >
                                <Camera className="w-4 h-4 text-black" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        {/* User Info */}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {userProfile.name}
                        </h1>

                        {/* Editable Nickname */}
                        <div className="flex items-center gap-2 mt-1">
                            {isEditingNickname ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="text"
                                        value={editNickname}
                                        onChange={(e) => setEditNickname(e.target.value)}
                                        className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow text-gray-900"
                                        placeholder={language === "th" ? "ตั้งชื่อเล่น" : "Set nickname"}
                                    />
                                    <button
                                        onClick={handleSaveNickname}
                                        className="p-1 text-green-600 hover:text-green-700"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingNickname(false);
                                            setEditNickname(userProfile.nickname || "");
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-500">
                                        {userProfile.nickname
                                            ? `"${userProfile.nickname}"`
                                            : t.noNickname}
                                    </span>
                                    <button
                                        onClick={() => setIsEditingNickname(true)}
                                        className="p-1 text-gray-400 hover:text-brand-yellow"
                                        title={t.editNickname}
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{userProfile.email}</span>
                            </div>

                            {/* Editable Phone */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="tel"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-yellow text-gray-900"
                                            placeholder="08X-XXX-XXXX"
                                        />
                                        <button
                                            onClick={handleSavePhone}
                                            className="p-1 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingPhone(false);
                                                setEditPhone(userProfile.phone || "");
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm">
                                            {userProfile.phone || (language === "th" ? "ยังไม่ระบุ" : "Not set")}
                                        </span>
                                        <button
                                            onClick={() => setIsEditingPhone(true)}
                                            className="p-1 text-gray-400 hover:text-brand-yellow"
                                            title={t.editPhone}
                                        >
                                            <Edit3 className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Member Tier Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${tierColors[userProfile.memberTier]} text-white text-sm font-medium`}
                            >
                                <Crown className="w-4 h-4" />
                                {language === "th"
                                    ? tierColorsTh[userProfile.memberTier]
                                    : userProfile.memberTier}
                            </div>
                            <span className="text-sm text-gray-500">
                                {t.memberSince} {userProfile.memberSince}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-yellow" />
                            {t.shippingAddress}
                        </h2>
                        <button
                            onClick={() => setIsEditingAddress(true)}
                            className="text-sm text-brand-yellow font-medium hover:underline flex items-center gap-1"
                        >
                            <Edit3 className="w-3 h-3" />
                            {userProfile.shippingAddress ? t.editAddress : t.addAddress}
                        </button>
                    </div>

                    {userProfile.shippingAddress ? (
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                            <p className="font-medium text-gray-900">{userProfile.shippingAddress.fullName}</p>
                            <p>{userProfile.shippingAddress.phone}</p>
                            <p>{userProfile.shippingAddress.address}</p>
                            <p>
                                {userProfile.shippingAddress.district}, {userProfile.shippingAddress.province} {userProfile.shippingAddress.postalCode}
                            </p>
                            <p>{userProfile.shippingAddress.country}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">{t.noAddress}</p>
                    )}
                </motion.div>

                {/* Address Edit Modal */}
                <AnimatePresence>
                    {isEditingAddress && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">{t.editAddress}</h3>
                                        <button
                                            onClick={() => setIsEditingAddress(false)}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.addressForm.fullName}
                                            </label>
                                            <input
                                                type="text"
                                                value={editAddress.fullName}
                                                onChange={(e) => setEditAddress({ ...editAddress, fullName: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.addressForm.phone}
                                            </label>
                                            <input
                                                type="tel"
                                                value={editAddress.phone}
                                                onChange={(e) => setEditAddress({ ...editAddress, phone: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.addressForm.address}
                                            </label>
                                            <textarea
                                                value={editAddress.address}
                                                onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none"
                                            />
                                        </div>

                                        {/* Province */}
                                        <SearchableSelect
                                            label={t.addressForm.province}
                                            options={provinceOptions}
                                            value={editAddress.province}
                                            onChange={(value) => {
                                                setEditAddress({
                                                    ...editAddress,
                                                    province: value,
                                                    district: "",
                                                    postalCode: "",
                                                });
                                                setEditSubdistrict("");
                                            }}
                                            placeholder={language === "th" ? "เลือกจังหวัด" : "Select province"}
                                            language={language}
                                        />

                                        {/* District */}
                                        <SearchableSelect
                                            label={t.addressForm.district}
                                            options={districtOptions}
                                            value={editAddress.district}
                                            onChange={(value) => {
                                                setEditAddress({
                                                    ...editAddress,
                                                    district: value,
                                                    postalCode: "",
                                                });
                                                setEditSubdistrict("");
                                            }}
                                            placeholder={language === "th" ? "เลือกเขต/อำเภอ" : "Select district"}
                                            language={language}
                                            disabled={!editAddress.province}
                                        />

                                        {/* Subdistrict & Postal Code */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <SearchableSelect
                                                label={language === "th" ? "แขวง/ตำบล" : "Subdistrict"}
                                                options={subdistrictOptions}
                                                value={editSubdistrict}
                                                onChange={(value) => {
                                                    setEditSubdistrict(value);
                                                    // Auto-fill postal code
                                                    const postalCode = getPostalCode(
                                                        editAddress.province,
                                                        editAddress.district,
                                                        value
                                                    );
                                                    setEditAddress({
                                                        ...editAddress,
                                                        postalCode,
                                                    });
                                                }}
                                                placeholder={language === "th" ? "เลือกแขวง/ตำบล" : "Select subdistrict"}
                                                language={language}
                                                disabled={!editAddress.district}
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t.addressForm.postalCode}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editAddress.postalCode}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 focus:outline-none"
                                                    placeholder={language === "th" ? "รหัสไปรษณีย์" : "Postal code"}
                                                />
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <SearchableSelect
                                            label={t.addressForm.country}
                                            options={countryOptions}
                                            value={editAddress.country}
                                            onChange={(value) => setEditAddress({ ...editAddress, country: value })}
                                            placeholder={language === "th" ? "เลือกประเทศ" : "Select country"}
                                            language={language}
                                        />

                                        <button
                                            onClick={handleSaveAddress}
                                            className="w-full py-3 bg-brand-yellow text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                        >
                                            {t.addressForm.save}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Points Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-brand-yellow" />
                        {t.points.title}
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-gray-900">
                                {totalPoints.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{t.points.total}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-red-500">
                                {usedPoints.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{t.points.used}</p>
                        </div>
                        <div className="text-center p-3 bg-brand-yellow/10 rounded-xl">
                            <p className="text-2xl font-bold text-brand-yellow">
                                {availablePoints.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{t.points.available}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Rewards */}
                {redeemedRewards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-brand-yellow" />
                                {t.recentRewards}
                            </h2>
                            <Link
                                href="/rewards"
                                className="text-sm text-brand-yellow font-medium hover:underline"
                            >
                                {t.viewAll}
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {redeemedRewards.slice(0, 3).map((reward) => (
                                <div
                                    key={reward.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                >
                                    {reward.image && (
                                        <img
                                            src={reward.image}
                                            alt={reward.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {language === "th" ? reward.nameTh : reward.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {reward.points.toLocaleString()}{" "}
                                            {language === "th" ? "คะแนน" : "points"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Menu Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <Link
                        href="/profile/orders"
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{t.menu.orders}</p>
                            <p className="text-sm text-gray-500">{t.menu.ordersDesc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        href="/rewards"
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{t.menu.rewards}</p>
                            <p className="text-sm text-gray-500">{t.menu.rewardsDesc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left border-b border-gray-100"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-red-600">{t.menu.logout}</p>
                        </div>
                    </button>

                    {/* Affiliate Partner Link - Different based on partner status */}
                    {userProfile?.partnerInfo?.isPartner ? (
                        <Link
                            href="/affiliate/dashboard"
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                                <Handshake className="w-5 h-5 text-brand-yellow" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {language === "th" ? "แดชบอร์ดพาร์ทเนอร์" : "Partner Dashboard"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {userProfile.partnerInfo.status === "approved"
                                        ? (language === "th" ? "ดูยอดขายและคอมมิชชั่น" : "View sales & commissions")
                                        : (language === "th" ? "รอการอนุมัติ" : "Pending approval")}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    ) : (
                        <Link
                            href="/affiliate/register"
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors opacity-60 hover:opacity-100"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                <Handshake className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-500 text-sm">{t.affiliate}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </Link>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
