// Reach Pro-Store Translations Dictionary
// Supports English (en) and Thai (th)

export type Language = 'en' | 'th';

export type TranslationKey = keyof typeof translations.en;

export const translations = {
    en: {
        // Navbar
        nav_rackets: 'RACKETS',
        nav_shoes: 'SHOES',
        nav_sportswear: 'SPORTSWEAR',
        nav_bundles: 'BUNDLES',
        nav_supplements: 'SUPPLEMENTS',
        nav_courts: 'COURTS',
        nav_articles: 'ARTICLES',
        nav_auctions: 'AUCTIONS',
        nav_affiliate: 'AFFILIATE',
        nav_sale: 'SALE',

        // Hero Section
        hero_title: 'DOMINATE THE COURT',
        hero_subtitle: 'Professional grade equipment engineered for champions. Experience the perfect blend of power, precision, and performance.',
        hero_cta: 'SHOP NOW',

        // Bundles Section
        bundles_title: 'TOURNAMENT SETS',
        bundles_subtitle: 'Complete packages for the competitive player',
        bundle_save: 'SAVE 20%',
        bundle_pro_title: 'Pro Tournament Set',
        bundle_pro_desc: 'Racket + Bag + Shoes',
        bundle_elite_title: 'Elite Competition Set',
        bundle_elite_desc: 'Racket + Bag + Shoes + Accessories',
        bundle_starter_title: 'Starter Bundle',
        bundle_starter_desc: 'Racket + Bag + Grip Set',

        // Programs Section
        programs_title: 'PROFESSIONAL TRAINING',
        program_technical: 'Technical Drills',
        program_technical_desc: 'Master fundamental strokes and advanced techniques through structured, repetitive training sessions designed to build muscle memory and precision.',
        program_physical: 'Physical Conditioning',
        program_physical_desc: 'Build explosive power, agility, and endurance with sport-specific fitness programs tailored to the demands of competitive badminton.',
        program_tactical: 'Tactical Analysis',
        program_tactical_desc: 'Develop match intelligence through video analysis, opponent study, and strategic game planning to outthink your competition.',
        program_tournament: 'Tournament Preparation',
        program_tournament_desc: 'Prepare for competition with simulated match scenarios, mental conditioning, and performance optimization techniques.',

        // Contact Section
        contact_title: 'CONTACT US',
        contact_address: 'Address',
        contact_phone: 'Telephone',
        contact_email: 'Email',
        contact_message: 'LEAVE A MESSAGE',
        contact_name: 'Name',
        contact_send: 'SEND',

        // Footer
        footer_rights: 'All rights reserved.',

        // UI Elements
        search: 'Search',
        cart: 'Cart',
        profile: 'Profile',
        loyalty_points: 'Points',
    },

    th: {
        // Navbar
        nav_rackets: 'ไม้แบด',
        nav_shoes: 'รองเท้า',
        nav_sportswear: 'ชุดกีฬา',
        nav_bundles: 'เซ็ทสุดคุ้ม',
        nav_supplements: 'อาหารเสริม',
        nav_courts: 'สนามแบด',
        nav_articles: 'บทความ',
        nav_auctions: 'ประมูล',
        nav_affiliate: 'พาร์ทเนอร์',
        nav_sale: 'สินค้าลดกระหน่ำ',

        // Hero Section
        hero_title: 'ครองทุกเกมการแข่งขัน',
        hero_subtitle: 'อุปกรณ์เกรดนักกีฬามืออาชีพ ออกแบบมาเพื่อแชมป์ สัมผัสความสมบูรณ์แบบของพลัง ความแม่นยำ และประสิทธิภาพ',
        hero_cta: 'ช้อปเลย',

        // Bundles Section
        bundles_title: 'ชุดพร้อมแข่ง',
        bundles_subtitle: 'แพ็คเกจครบครันสำหรับนักกีฬาระดับแข่งขัน',
        bundle_save: 'ประหยัด 20%',
        bundle_pro_title: 'เซ็ตโปรทัวร์นาเมนต์',
        bundle_pro_desc: 'ไม้แบด + กระเป๋า + รองเท้า',
        bundle_elite_title: 'เซ็ตอีลิทแข่งขัน',
        bundle_elite_desc: 'ไม้แบด + กระเป๋า + รองเท้า + อุปกรณ์เสริม',
        bundle_starter_title: 'เซ็ตเริ่มต้น',
        bundle_starter_desc: 'ไม้แบด + กระเป๋า + ชุดกริป',

        // Programs Section
        programs_title: 'การฝึกซ้อมระดับมืออาชีพ',
        program_technical: 'ฝึกเทคนิค',
        program_technical_desc: 'เรียนรู้การตีพื้นฐานและเทคนิคขั้นสูงผ่านการฝึกซ้อมแบบมีโครงสร้าง ออกแบบมาเพื่อสร้างความจำของกล้ามเนื้อและความแม่นยำ',
        program_physical: 'ฝึกร่างกาย',
        program_physical_desc: 'สร้างพลังระเบิด ความว่องไว และความอึดทนด้วยโปรแกรมฟิตเนสเฉพาะกีฬาที่ออกแบบมาสำหรับแบดมินตันระดับแข่งขัน',
        program_tactical: 'วิเคราะห์กลยุทธ์',
        program_tactical_desc: 'พัฒนาสติปัญญาการแข่งขันผ่านการวิเคราะห์วิดีโอ ศึกษาคู่แข่ง และวางแผนเกมเชิงกลยุทธ์เพื่อเอาชนะคู่ต่อสู้',
        program_tournament: 'เตรียมแข่ง',
        program_tournament_desc: 'เตรียมพร้อมสำหรับการแข่งขันด้วยสถานการณ์จำลอง การฝึกจิตใจ และเทคนิคการเพิ่มประสิทธิภาพ',

        // Contact Section
        contact_title: 'ติดต่อเรา',
        contact_address: 'ที่อยู่',
        contact_phone: 'โทรศัพท์',
        contact_email: 'อีเมล',
        contact_message: 'ฝากข้อความ',
        contact_name: 'ชื่อ',
        contact_send: 'ส่ง',

        // Footer
        footer_rights: 'สงวนลิขสิทธิ์',

        // UI Elements
        search: 'ค้นหา',
        cart: 'ตะกร้า',
        profile: 'โปรไฟล์',
        loyalty_points: 'แต้ม',
    }
} as const;

export function getTranslation(lang: Language, key: TranslationKey): string {
    return translations[lang][key];
}
