"use client";

export interface ProductVideo {
    url: string;
    thumbnail: string;
    username: string;
}

export interface ProductSpecs {
    weightGrip: string;
    performance: string;
    series: string;
    playerType: string;
    sport: string;
    stringingAdvice: string;
    balance: string;
    material: string;
    racquetLength: string;
    shaftFlex: string;
    productTier: string;
    stringPattern: string;
    parentSku: string;
}

export interface PerformanceRatings {
    power: number;      // 1-10
    speed: number;      // 1-10
    control: number;    // 1-10
    durability: number; // 1-10
    shaftFlex: number;  // 1-10 (1=stiff, 10=flexible)
}

export interface RacketColor {
    name: string;
    nameTh: string;
    hex: string;
    image: string;
}

export interface Product {
    id: string;
    name: string;
    nameTh: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    stockCount?: number; // จำนวนสินค้าคงเหลือ
    images: string[];
    videos?: ProductVideo[];
    description: string;
    descriptionTh: string;
    note?: string;
    noteTh?: string;
    specs: ProductSpecs;
    performanceRatings: PerformanceRatings;
    techSpecs: string[];
    colors: RacketColor[];
    relatedProducts: string[];
}

export const products: Product[] = [
    {
        id: 'nf1000t',
        name: 'NANOFLARE 1000 TOUR',
        nameTh: 'นาโนแฟลร์ 1000 ทัวร์',
        price: 8990,
        badge: 'NEW',
        stockCount: 15,
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', username: '@reachbadminton' },
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=400', username: '@proplayerth' },
        ],
        description: 'Enhance swing speed and maneuverability with the NANOFLARE 1000 TOUR. Designed for intermediate to advanced players, this head-light racquet offers explosive power and shuttle acceleration. The SONIC FLARE SYSTEM places high-modulus graphite at key points for superior repulsion and performance.',
        descriptionTh: 'เพิ่มความเร็วในการสวิงและความคล่องตัวด้วย NANOFLARE 1000 TOUR ออกแบบมาสำหรับผู้เล่นระดับกลางถึงขั้นสูง ไม้หัวเบานี้ให้พลังระเบิดและการเร่งลูกขนไก่ ระบบ SONIC FLARE SYSTEM วางกราไฟท์โมดูลัสสูงที่จุดสำคัญเพื่อการดีดกลับและประสิทธิภาพที่เหนือกว่า',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '4UG5',
            performance: 'Speed',
            series: 'NANOFLARE',
            playerType: 'Intermediate / Advanced',
            sport: 'Badminton',
            stringingAdvice: '20-28lbs',
            balance: 'Head Light',
            material: 'HM Graphite, Nanocell NEO, EX-HYPER MG',
            racquetLength: '10mm Longer',
            shaftFlex: 'Medium',
            productTier: 'TOUR',
            stringPattern: '22 X 21',
            parentSku: 'NF1000T',
        },
        performanceRatings: {
            power: 7,
            speed: 9,
            control: 7,
            durability: 8,
            shaftFlex: 5,
        },
        techSpecs: [
            'NANOCELL NEO',
            'ISOMETRIC™',
            'SPEED-ASSIST BUMPER',
            'SONIC FLARE SYSTEM',
            'AERO FRAME',
            'COMPACT FRAME',
            'SUPER SLIM SHAFT',
            'REXIS SHAFT',
            'ENERGY BOOST CAP PLUS',
            'EX-HYPER MG',
        ],
        colors: [
            { name: 'BLUE/BLACK', nameTh: 'น้ำเงิน/ดำ', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
            { name: 'RED/BLACK', nameTh: 'แดง/ดำ', hex: '#ef4444', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800' },
        ],
        relatedProducts: ['nf800', 'ax100zz', 'as11'],
    },
    {
        id: 'nf800',
        name: 'NANOFLARE 800',
        nameTh: 'นาโนแฟลร์ 800',
        price: 6990,
        originalPrice: 8990,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        ],
        description: 'The NANOFLARE 800 delivers quick handling and explosive power for players seeking speed in their game. A head-light balance combined with a stiff shaft creates fast swing speeds.',
        descriptionTh: 'NANOFLARE 800 มอบการจับที่รวดเร็วและพลังระเบิดสำหรับผู้เล่นที่ต้องการความเร็ว ความสมดุลหัวเบาร่วมกับก้านแข็งสร้างความเร็วในการสวิง',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '4UG5',
            performance: 'Speed',
            series: 'NANOFLARE',
            playerType: 'Intermediate / Advanced',
            sport: 'Badminton',
            stringingAdvice: '20-28lbs',
            balance: 'Head Light',
            material: 'HM Graphite, Nanocell NEO',
            racquetLength: 'Standard',
            shaftFlex: 'Stiff',
            productTier: 'PRO',
            stringPattern: '22 X 21',
            parentSku: 'NF800',
        },
        performanceRatings: {
            power: 6,
            speed: 9,
            control: 7,
            durability: 7,
            shaftFlex: 3,
        },
        techSpecs: [
            'NANOCELL NEO',
            'ISOMETRIC™',
            'SONIC FLARE SYSTEM',
            'AERO FRAME',
            'SUPER SLIM SHAFT',
        ],
        colors: [
            { name: 'BLACK/GOLD', nameTh: 'ดำ/ทอง', hex: '#fbbf24', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800' },
            { name: 'BLUE/SILVER', nameTh: 'น้ำเงิน/เงิน', hex: '#60a5fa', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
        ],
        relatedProducts: ['nf1000t', 'ax100zz', 'as11'],
    },
    {
        id: 'ax100zz',
        name: 'ASTROX 100 ZZ',
        nameTh: 'แอสทร็อกซ์ 100 ZZ',
        price: 9490,
        badge: 'BEST SELLER',
        stockCount: 25,
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'The ASTROX 100 ZZ is designed for aggressive players who want steep attack angles and maximum power. The Rotational Generator System distributes weight throughout the frame for devastating smashes.',
        descriptionTh: 'ASTROX 100 ZZ ออกแบบมาสำหรับผู้เล่นที่ต้องการมุมโจมตีชันและพลังสูงสุด ระบบ Rotational Generator กระจายน้ำหนักทั่วเฟรมเพื่อการตบที่ทำลายล้าง',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '4UG5',
            performance: 'Power',
            series: 'ASTROX',
            playerType: 'Advanced',
            sport: 'Badminton',
            stringingAdvice: '21-29lbs',
            balance: 'Head Heavy',
            material: 'HM Graphite, Namd, Tungsten',
            racquetLength: '10mm Longer',
            shaftFlex: 'Stiff',
            productTier: 'GAME',
            stringPattern: '24 X 21',
            parentSku: 'AX100ZZ',
        },
        performanceRatings: {
            power: 10,
            speed: 6,
            control: 7,
            durability: 9,
            shaftFlex: 2,
        },
        techSpecs: [
            'ROTATIONAL GENERATOR SYSTEM',
            'NAMD',
            'ISOMETRIC™',
            'NANOMESH NEO',
            'VOLUME CUT RESIN',
            'SUPER SLIM SHAFT',
            'ENERGY BOOST CAP PLUS',
        ],
        colors: [
            { name: 'BLACK/RED', nameTh: 'ดำ/แดง', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
        ],
        relatedProducts: ['nf1000t', 'nf800', 'as11'],
    },
    {
        id: 'as11',
        name: 'ARCSABER 11',
        nameTh: 'อาร์คเซเบอร์ 11',
        price: 7990,
        stockCount: 10,
        images: [
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        ],
        description: 'The ARCSABER 11 provides excellent control and precision for all-round players. The CSR (Counter Spin Rubber) allows for better shuttle hold and placement accuracy.',
        descriptionTh: 'ARCSABER 11 มอบการควบคุมและความแม่นยำยอดเยี่ยมสำหรับผู้เล่นรอบด้าน CSR (Counter Spin Rubber) ช่วยให้จับลูกได้ดีและวางลูกแม่นยำ',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '3UG5',
            performance: 'Control',
            series: 'ARCSABER',
            playerType: 'Intermediate / Advanced',
            sport: 'Badminton',
            stringingAdvice: '20-27lbs',
            balance: 'Even',
            material: 'HM Graphite, CSR, Pocketing Booster',
            racquetLength: 'Standard',
            shaftFlex: 'Medium',
            productTier: 'PRO',
            stringPattern: '24 X 22',
            parentSku: 'AS11',
        },
        performanceRatings: {
            power: 7,
            speed: 7,
            control: 9,
            durability: 8,
            shaftFlex: 5,
        },
        techSpecs: [
            'POCKETING BOOSTER',
            'CSR (COUNTER SPIN RUBBER)',
            'ISOMETRIC™',
            'T-ANCHOR',
            'SUPER SLIM SHAFT',
            'CONTROL ASSIST BUMPER',
        ],
        colors: [
            { name: 'GREEN/BLACK', nameTh: 'เขียว/ดำ', hex: '#22c55e', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800' },
            { name: 'PURPLE/BLACK', nameTh: 'ม่วง/ดำ', hex: '#a855f7', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
        ],
        relatedProducts: ['nf1000t', 'nf800', 'ax100zz'],
    },
    {
        id: 'nf700',
        name: 'NANOFLARE 700',
        nameTh: 'นาโนแฟลร์ 700',
        price: 5490,
        originalPrice: 6990,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        ],
        description: 'Fast and lightweight, the NANOFLARE 700 is perfect for players developing their speed game.',
        descriptionTh: 'เร็วและเบา NANOFLARE 700 เหมาะสำหรับผู้เล่นที่พัฒนาเกมความเร็ว',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '4UG5',
            performance: 'Speed',
            series: 'NANOFLARE',
            playerType: 'Intermediate',
            sport: 'Badminton',
            stringingAdvice: '19-27lbs',
            balance: 'Head Light',
            material: 'HM Graphite, Nanocell NEO',
            racquetLength: 'Standard',
            shaftFlex: 'Medium',
            productTier: 'GAME',
            stringPattern: '22 X 21',
            parentSku: 'NF700',
        },
        performanceRatings: {
            power: 5,
            speed: 8,
            control: 7,
            durability: 7,
            shaftFlex: 5,
        },
        techSpecs: [
            'NANOCELL NEO',
            'ISOMETRIC™',
            'SONIC FLARE SYSTEM',
        ],
        colors: [
            { name: 'WHITE/BLUE', nameTh: 'ขาว/น้ำเงิน', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
            { name: 'YELLOW/BLACK', nameTh: 'เหลือง/ดำ', hex: '#facc15', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800' },
        ],
        relatedProducts: ['nf800', 'nf1000t'],
    },
    {
        id: 'ax88dp',
        name: 'ASTROX 88D PRO',
        nameTh: 'แอสทร็อกซ์ 88D โปร',
        price: 8490,
        badge: 'NEW',
        stockCount: 12,
        images: [
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'The ASTROX 88D PRO is built for doubles players seeking powerful smashes from the back court.',
        descriptionTh: 'ASTROX 88D PRO สร้างมาสำหรับผู้เล่นคู่ที่ต้องการการตบที่ทรงพลังจากหลังคอร์ท',
        note: 'Unstrung Racquet',
        noteTh: 'ไม่รวมเอ็น',
        specs: {
            weightGrip: '4UG5',
            performance: 'Power',
            series: 'ASTROX',
            playerType: 'Advanced',
            sport: 'Badminton',
            stringingAdvice: '21-29lbs',
            balance: 'Head Heavy',
            material: 'HM Graphite, Namd, Volume Cut Resin',
            racquetLength: '10mm Longer',
            shaftFlex: 'Stiff',
            productTier: 'PRO',
            stringPattern: '24 X 21',
            parentSku: 'AX88DP',
        },
        performanceRatings: {
            power: 9,
            speed: 6,
            control: 7,
            durability: 9,
            shaftFlex: 2,
        },
        techSpecs: [
            'ROTATIONAL GENERATOR SYSTEM',
            'NAMD',
            'ISOMETRIC™',
            'VOLUME CUT RESIN',
            'POWER ASSIST BUMPER',
        ],
        colors: [
            { name: 'NAVY/GOLD', nameTh: 'กรม/ทอง', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800' },
            { name: 'BLACK/RED', nameTh: 'ดำ/แดง', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800' },
        ],
        relatedProducts: ['ax100zz', 'nf1000t'],
    },
];

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getRelatedProducts(productIds: string[]): Product[] {
    return products.filter(p => productIds.includes(p.id));
}

// ========== SHOE PRODUCTS ==========

export interface ShoeSize {
    size: string;      // US Size
    available: boolean;
}

export interface ShoeSpecs {
    weight: string;
    upperMaterial: string;
    soleMaterial: string;
    closureType: string;
    cushioning: string;
    sport: string;
    playerType: string;
    productTier: string;
    parentSku: string;
}

export interface ShoePerformanceRatings {
    cushioning: number;    // 1-10
    stability: number;     // 1-10
    grip: number;          // 1-10
    breathability: number; // 1-10
    durability: number;    // 1-10
}

export interface ShoeColor {
    name: string;
    nameTh: string;
    hex: string;
    image: string;
}

export interface ShoeProduct {
    id: string;
    name: string;
    nameTh: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    stockCount?: number; // จำนวนสินค้าคงเหลือ
    images: string[];
    videos?: ProductVideo[];
    description: string;
    descriptionTh: string;
    note?: string;
    noteTh?: string;
    specs: ShoeSpecs;
    performanceRatings: ShoePerformanceRatings;
    sizes: ShoeSize[];
    colors: ShoeColor[];
    techSpecs: string[];
    relatedProducts: string[];
}

// Size Guide Data
export interface SizeGuideRow {
    us: string;
    uk: string;
    eu: string;
    cm: string;
}

export const shoeSizeGuide: SizeGuideRow[] = [
    { us: '7', uk: '6', eu: '39', cm: '25' },
    { us: '7.5', uk: '6.5', eu: '40', cm: '25.5' },
    { us: '8', uk: '7', eu: '40.5', cm: '26' },
    { us: '8.5', uk: '7.5', eu: '41', cm: '26.5' },
    { us: '9', uk: '8', eu: '42', cm: '27' },
    { us: '9.5', uk: '8.5', eu: '42.5', cm: '27.5' },
    { us: '10', uk: '9', eu: '43', cm: '28' },
    { us: '10.5', uk: '9.5', eu: '44', cm: '28.5' },
    { us: '11', uk: '10', eu: '44.5', cm: '29' },
    { us: '11.5', uk: '10.5', eu: '45', cm: '29.5' },
    { us: '12', uk: '11', eu: '46', cm: '30' },
    { us: '12.5', uk: '11.5', eu: '46.5', cm: '30.5' },
    { us: '13', uk: '12', eu: '47', cm: '31' },
    { us: '14', uk: '13', eu: '48.5', cm: '32' },
    { us: '15', uk: '14', eu: '49.5', cm: '33' },
    { us: '16', uk: '15', eu: '50.5', cm: '34' },
];

export const shoeProducts: ShoeProduct[] = [
    {
        id: 'power-cushion-65z3',
        name: 'POWER CUSHION 65 Z3',
        nameTh: 'พาวเวอร์คุชชั่น 65 Z3',
        price: 5990,
        badge: 'NEW',
        stockCount: 12,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', username: '@reachbadminton' },
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400', username: '@proplayerth' },
        ],
        description: 'The POWER CUSHION 65 Z3 features advanced cushioning technology for explosive footwork. Designed for competitive players seeking optimal court feel and stability during intense rallies.',
        descriptionTh: 'POWER CUSHION 65 Z3 มาพร้อมเทคโนโลยีรองรับแรงกระแทกขั้นสูงสำหรับการเคลื่อนไหวที่รวดเร็ว ออกแบบมาสำหรับผู้เล่นระดับแข่งขันที่ต้องการความรู้สึกสัมผัสคอร์ทที่ดีและความมั่นคงระหว่างการเล่น',
        note: 'Standard Width',
        noteTh: 'ความกว้างมาตรฐาน',
        specs: {
            weight: '310g (Size 9)',
            upperMaterial: 'Synthetic Leather, Double Russell Mesh',
            soleMaterial: 'Rubber, Power Cushion+',
            closureType: 'Lace-up',
            cushioning: 'Power Cushion+',
            sport: 'Badminton',
            playerType: 'Intermediate / Advanced',
            productTier: 'Z Series',
            parentSku: 'SHB65Z3',
        },
        performanceRatings: {
            cushioning: 9,
            stability: 8,
            grip: 9,
            breathability: 7,
            durability: 8,
        },
        sizes: [
            { size: '7', available: true },
            { size: '7.5', available: true },
            { size: '8', available: true },
            { size: '8.5', available: true },
            { size: '9', available: true },
            { size: '9.5', available: true },
            { size: '10', available: true },
            { size: '10.5', available: true },
            { size: '11', available: false },
            { size: '11.5', available: false },
            { size: '12', available: false },
            { size: '12.5', available: false },
            { size: '13', available: false },
            { size: '14', available: true },
            { size: '15', available: false },
            { size: '16', available: false },
        ],
        colors: [
            { name: 'WHITE/BLACK', nameTh: 'ขาว/ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
            { name: 'BLACK/RED', nameTh: 'ดำ/แดง', hex: '#ef4444', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
            { name: 'NAVY/YELLOW', nameTh: 'กรม/เหลือง', hex: '#facc15', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
        ],
        techSpecs: [
            'POWER CUSHION+',
            'TOUGH BRID LIGHT',
            'DOUBLE RUSSELL MESH',
            'RADIAL BLADE SOLE',
            'ROUND SOLE',
            'LATERAL SHELL',
        ],
        relatedProducts: ['aerus-z2', 'eclipsion-z3'],
    },
    {
        id: 'aerus-z2',
        name: 'AERUS Z2',
        nameTh: 'แอรัส Z2',
        price: 6490,
        originalPrice: 7990,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Ultra-lightweight at just 260g, the AERUS Z2 delivers incredible speed without compromising stability. Perfect for players who rely on quick footwork and agility.',
        descriptionTh: 'น้ำหนักเบาสุดเพียง 260g AERUS Z2 มอบความเร็วที่ไม่น่าเชื่อโดยไม่ลดทอนความมั่นคง เหมาะสำหรับผู้เล่นที่พึ่งพาการเคลื่อนไหวเท้าที่รวดเร็วและความคล่องแคล่ว',
        note: 'Wide Fit Available',
        noteTh: 'มีแบบเท้ากว้าง',
        specs: {
            weight: '260g (Size 9)',
            upperMaterial: 'Synthetic, Durable Skin Light',
            soleMaterial: 'Rubber, Power Cushion',
            closureType: 'Lace-up',
            cushioning: 'Power Cushion',
            sport: 'Badminton',
            playerType: 'Advanced',
            productTier: 'Z Series',
            parentSku: 'SHBAZ2',
        },
        performanceRatings: {
            cushioning: 7,
            stability: 7,
            grip: 8,
            breathability: 9,
            durability: 7,
        },
        sizes: [
            { size: '7', available: true },
            { size: '7.5', available: true },
            { size: '8', available: true },
            { size: '8.5', available: false },
            { size: '9', available: true },
            { size: '9.5', available: true },
            { size: '10', available: true },
            { size: '10.5', available: true },
            { size: '11', available: true },
            { size: '11.5', available: true },
            { size: '12', available: true },
            { size: '12.5', available: false },
            { size: '13', available: true },
            { size: '14', available: false },
            { size: '15', available: false },
            { size: '16', available: false },
        ],
        colors: [
            { name: 'WHITE/MINT', nameTh: 'ขาว/มินท์', hex: '#10b981', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800' },
            { name: 'BLACK/PURPLE', nameTh: 'ดำ/ม่วง', hex: '#8b5cf6', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800' },
        ],
        techSpecs: [
            'POWER CUSHION',
            'DURABLE SKIN LIGHT',
            'FEATHER BOUNCE FOAM',
            'ERGOSHAPE',
            'TPU POWER GRAPHITE',
        ],
        relatedProducts: ['power-cushion-65z3', 'eclipsion-z3'],
    },
    {
        id: 'eclipsion-z3',
        name: 'ECLIPSION Z3',
        nameTh: 'อีคลิปชั่น Z3',
        price: 5490,
        badge: 'BEST SELLER',
        stockCount: 25,
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400', username: '@reachbadminton' },
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', username: '@proplayerth' },
        ],
        description: 'Maximum stability meets responsive cushioning. The ECLIPSION Z3 is built for players who demand rock-solid footing during aggressive lateral movements.',
        descriptionTh: 'ความมั่นคงสูงสุดพบกับการรองรับแรงกระแทกที่ตอบสนองดี ECLIPSION Z3 สร้างมาสำหรับผู้เล่นที่ต้องการการยืนหยัดที่มั่นคงระหว่างการเคลื่อนไหวด้านข้างอย่างรุนแรง',
        note: 'Standard Width',
        noteTh: 'ความกว้างมาตรฐาน',
        specs: {
            weight: '330g (Size 9)',
            upperMaterial: 'Synthetic Leather, Mesh',
            soleMaterial: 'Rubber, Power Cushion+',
            closureType: 'Lace-up',
            cushioning: 'Power Cushion+',
            sport: 'Badminton',
            playerType: 'Intermediate / Advanced',
            productTier: 'Z Series',
            parentSku: 'SHBEZ3',
        },
        performanceRatings: {
            cushioning: 8,
            stability: 10,
            grip: 9,
            breathability: 7,
            durability: 9,
        },
        sizes: [
            { size: '7', available: true },
            { size: '7.5', available: false },
            { size: '8', available: true },
            { size: '8.5', available: true },
            { size: '9', available: true },
            { size: '9.5', available: false },
            { size: '10', available: true },
            { size: '10.5', available: true },
            { size: '11', available: true },
            { size: '11.5', available: false },
            { size: '12', available: true },
            { size: '12.5', available: true },
            { size: '13', available: true },
            { size: '14', available: true },
            { size: '15', available: true },
            { size: '16', available: false },
        ],
        colors: [
            { name: 'BLUE/ORANGE', nameTh: 'น้ำเงิน/ส้ม', hex: '#f97316', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' },
            { name: 'BLACK/LIME', nameTh: 'ดำ/ไลม์', hex: '#84cc16', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' },
        ],
        techSpecs: [
            'POWER CUSHION+',
            'POWER GRAPHITE LITE',
            'HEXAGRIP',
            'LATERAL CLAW',
            'TOE ASSIST SHAPE',
        ],
        relatedProducts: ['power-cushion-65z3', 'aerus-z2'],
    },
    {
        id: 'comfort-z',
        name: 'COMFORT Z',
        nameTh: 'คอมฟอร์ท Z',
        price: 3990,
        stockCount: 20,
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'All-day comfort for recreational players. The COMFORT Z provides excellent cushioning and breathability at an accessible price point.',
        descriptionTh: 'สบายตลอดวันสำหรับผู้เล่นทั่วไป COMFORT Z มอบการรองรับแรงกระแทกและการระบายอากาศที่ยอดเยี่ยมในราคาที่เข้าถึงได้',
        note: 'Standard Width',
        noteTh: 'ความกว้างมาตรฐาน',
        specs: {
            weight: '290g (Size 9)',
            upperMaterial: 'Mesh, Synthetic',
            soleMaterial: 'Rubber, EVA',
            closureType: 'Lace-up',
            cushioning: 'EVA Midsole',
            sport: 'Badminton',
            playerType: 'Beginner / Intermediate',
            productTier: 'Comfort Series',
            parentSku: 'SHBCZ',
        },
        performanceRatings: {
            cushioning: 8,
            stability: 7,
            grip: 7,
            breathability: 9,
            durability: 7,
        },
        sizes: [
            { size: '7', available: true },
            { size: '7.5', available: true },
            { size: '8', available: true },
            { size: '8.5', available: true },
            { size: '9', available: true },
            { size: '9.5', available: true },
            { size: '10', available: true },
            { size: '10.5', available: true },
            { size: '11', available: true },
            { size: '11.5', available: true },
            { size: '12', available: true },
            { size: '12.5', available: false },
            { size: '13', available: false },
            { size: '14', available: false },
            { size: '15', available: false },
            { size: '16', available: false },
        ],
        colors: [
            { name: 'GRAY/BLACK', nameTh: 'เทา/ดำ', hex: '#6b7280', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
            { name: 'WHITE/BLUE', nameTh: 'ขาว/น้ำเงิน', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800' },
        ],
        techSpecs: [
            'EVA MIDSOLE',
            'BREATHABLE MESH',
            'RUBBER OUTSOLE',
            'CUSHIONED INSOLE',
        ],
        relatedProducts: ['power-cushion-65z3', 'starter-ace'],
    },
    {
        id: 'starter-ace',
        name: 'STARTER ACE',
        nameTh: 'สตาร์ทเตอร์ เอซ',
        price: 2490,
        badge: 'VALUE',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Perfect entry-level badminton shoes for beginners. The STARTER ACE offers essential features without breaking the bank.',
        descriptionTh: 'รองเท้าแบดมินตันระดับเริ่มต้นที่สมบูรณ์แบบสำหรับผู้เริ่มต้น STARTER ACE มอบคุณสมบัติที่จำเป็นในราคาประหยัด',
        note: 'Standard Width',
        noteTh: 'ความกว้างมาตรฐาน',
        specs: {
            weight: '300g (Size 9)',
            upperMaterial: 'Synthetic Mesh',
            soleMaterial: 'Rubber',
            closureType: 'Lace-up',
            cushioning: 'Basic EVA',
            sport: 'Badminton',
            playerType: 'Beginner',
            productTier: 'Entry',
            parentSku: 'SHBSA',
        },
        performanceRatings: {
            cushioning: 6,
            stability: 6,
            grip: 7,
            breathability: 7,
            durability: 6,
        },
        sizes: [
            { size: '7', available: true },
            { size: '7.5', available: true },
            { size: '8', available: true },
            { size: '8.5', available: true },
            { size: '9', available: true },
            { size: '9.5', available: true },
            { size: '10', available: true },
            { size: '10.5', available: true },
            { size: '11', available: true },
            { size: '11.5', available: true },
            { size: '12', available: true },
            { size: '12.5', available: true },
            { size: '13', available: true },
            { size: '14', available: true },
            { size: '15', available: true },
            { size: '16', available: true },
        ],
        colors: [
            { name: 'BLACK/WHITE', nameTh: 'ดำ/ขาว', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800' },
            { name: 'WHITE/RED', nameTh: 'ขาว/แดง', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800' },
        ],
        techSpecs: [
            'BASIC EVA',
            'SYNTHETIC UPPER',
            'RUBBER OUTSOLE',
        ],
        relatedProducts: ['comfort-z'],
    },
];

export function getShoeProductById(id: string): ShoeProduct | undefined {
    return shoeProducts.find(p => p.id === id);
}

export function getRelatedShoeProducts(productIds: string[]): ShoeProduct[] {
    return shoeProducts.filter(p => productIds.includes(p.id));
}

// ========== SPORTSWEAR PRODUCTS ==========

// Sportswear Category Types
export type SportswearCategory =
    | 'long-sleeve'      // เสื้อแขนยาว
    | 'short-sleeve'     // เสื้อแขนสั้น
    | 'jacket'           // เสื้อคลุม/ฮู้ดดี้
    | 'shorts'           // กางเกงขาสั้น
    | 'pants'            // กางเกงขายาว
    | 'socks'            // ถุงเท้า
    | 'underwear'        // ชุดชั้นใน
    | 'set';             // ชุดเซ็ท

export const sportswearCategoryNames: Record<SportswearCategory, { en: string; th: string }> = {
    'long-sleeve': { en: 'Long Sleeve', th: 'เสื้อแขนยาว' },
    'short-sleeve': { en: 'Short Sleeve', th: 'เสื้อแขนสั้น' },
    'jacket': { en: 'Jacket / Hoodie', th: 'เสื้อคลุม / ฮู้ดดี้' },
    'shorts': { en: 'Shorts', th: 'กางเกงขาสั้น' },
    'pants': { en: 'Pants', th: 'กางเกงขายาว' },
    'socks': { en: 'Socks', th: 'ถุงเท้า' },
    'underwear': { en: 'Sports Bra', th: 'สปอร์ตบรา' },
    'set': { en: 'Set', th: 'ชุดเซ็ท' },
};

export interface SportswearSize {
    size: string;      // XS, S, M, L, XL, 2XL, 3XL or sock sizes
    available: boolean;
}

export interface SportswearSpecs {
    material: string;
    fit: string;
    care: string;
    sport: string;
    playerType: string;
    productTier: string;
    parentSku: string;
}

export interface SportswearPerformanceRatings {
    comfort: number;       // 1-10
    breathability: number; // 1-10
    durability: number;    // 1-10
    fit: number;           // 1-10
    flexibility: number;   // 1-10
}

export interface SportswearColor {
    name: string;
    nameTh: string;
    hex: string;
    image: string;
}

export interface SportswearProduct {
    id: string;
    name: string;
    nameTh: string;
    category: SportswearCategory;  // ประเภทสินค้า
    price: number;
    originalPrice?: number;
    badge?: string;
    stockCount?: number; // จำนวนสินค้าคงเหลือ
    images: string[];
    videos?: ProductVideo[];
    description: string;
    descriptionTh: string;
    note?: string;
    noteTh?: string;
    specs: SportswearSpecs;
    performanceRatings: SportswearPerformanceRatings;
    sizes: SportswearSize[];
    colors: SportswearColor[];
    relatedProducts: string[];
}

// ========== SIZE GUIDES BY CATEGORY ==========

// Size Guide for Tops (เสื้อ - แขนยาว/แขนสั้น/เสื้อคลุม)
export interface TopsSizeGuideRow {
    size: string;
    chest: string;
    shoulder: string;
    length: string;
    sleeve: string;
}

export const topsSizeGuide: TopsSizeGuideRow[] = [
    { size: 'XS', chest: '86-91', shoulder: '42', length: '66', sleeve: '58' },
    { size: 'S', chest: '91-96', shoulder: '44', length: '68', sleeve: '60' },
    { size: 'M', chest: '96-101', shoulder: '46', length: '70', sleeve: '62' },
    { size: 'L', chest: '101-107', shoulder: '48', length: '72', sleeve: '64' },
    { size: 'XL', chest: '107-112', shoulder: '50', length: '74', sleeve: '66' },
    { size: '2XL', chest: '112-117', shoulder: '52', length: '76', sleeve: '68' },
    { size: '3XL', chest: '117-122', shoulder: '54', length: '78', sleeve: '70' },
];

// Size Guide for Bottoms (กางเกง - ขาสั้น/ขายาว)
export interface BottomsSizeGuideRow {
    size: string;
    waist: string;
    hip: string;
    inseam: string;
    outseam: string;
}

export const shortsSizeGuide: BottomsSizeGuideRow[] = [
    { size: 'XS', waist: '66-71', hip: '86-91', inseam: '15', outseam: '38' },
    { size: 'S', waist: '71-76', hip: '91-96', inseam: '16', outseam: '40' },
    { size: 'M', waist: '76-81', hip: '96-101', inseam: '17', outseam: '42' },
    { size: 'L', waist: '81-86', hip: '101-107', inseam: '18', outseam: '44' },
    { size: 'XL', waist: '86-91', hip: '107-112', inseam: '19', outseam: '46' },
    { size: '2XL', waist: '91-96', hip: '112-117', inseam: '20', outseam: '48' },
    { size: '3XL', waist: '96-102', hip: '117-122', inseam: '21', outseam: '50' },
];

export const pantsSizeGuide: BottomsSizeGuideRow[] = [
    { size: 'XS', waist: '66-71', hip: '86-91', inseam: '76', outseam: '100' },
    { size: 'S', waist: '71-76', hip: '91-96', inseam: '78', outseam: '102' },
    { size: 'M', waist: '76-81', hip: '96-101', inseam: '80', outseam: '104' },
    { size: 'L', waist: '81-86', hip: '101-107', inseam: '82', outseam: '106' },
    { size: 'XL', waist: '86-91', hip: '107-112', inseam: '84', outseam: '108' },
    { size: '2XL', waist: '91-96', hip: '112-117', inseam: '86', outseam: '110' },
    { size: '3XL', waist: '96-102', hip: '117-122', inseam: '88', outseam: '112' },
];

// Size Guide for Socks
export interface SocksSizeGuideRow {
    size: string;
    usSize: string;
    euSize: string;
    footLength: string;
}

export const socksSizeGuide: SocksSizeGuideRow[] = [
    { size: 'S', usSize: '5-7', euSize: '35-38', footLength: '22-24' },
    { size: 'M', usSize: '7-9', euSize: '38-42', footLength: '24-26' },
    { size: 'L', usSize: '9-11', euSize: '42-45', footLength: '26-28' },
    { size: 'XL', usSize: '11-13', euSize: '45-48', footLength: '28-30' },
];

// Size Guide for Underwear
export interface UnderwearSizeGuideRow {
    size: string;
    waist: string;
    hip: string;
}

export const underwearSizeGuide: UnderwearSizeGuideRow[] = [
    { size: 'XS', waist: '66-71', hip: '86-91' },
    { size: 'S', waist: '71-76', hip: '91-96' },
    { size: 'M', waist: '76-81', hip: '96-101' },
    { size: 'L', waist: '81-86', hip: '101-107' },
    { size: 'XL', waist: '86-91', hip: '107-112' },
    { size: '2XL', waist: '91-96', hip: '112-117' },
    { size: '3XL', waist: '96-102', hip: '117-122' },
];

// Helper function to get size guide by category
export function getSizeGuideByCategory(category: SportswearCategory) {
    switch (category) {
        case 'long-sleeve':
        case 'short-sleeve':
        case 'jacket':
            return { type: 'tops' as const, data: topsSizeGuide };
        case 'shorts':
            return { type: 'shorts' as const, data: shortsSizeGuide };
        case 'pants':
            return { type: 'pants' as const, data: pantsSizeGuide };
        case 'socks':
            return { type: 'socks' as const, data: socksSizeGuide };
        case 'underwear':
            return { type: 'underwear' as const, data: underwearSizeGuide };
        case 'set':
            return { type: 'tops' as const, data: topsSizeGuide }; // Default to tops for sets
        default:
            return { type: 'tops' as const, data: topsSizeGuide };
    }
}


export const sportswearProducts: SportswearProduct[] = [
    {
        id: 'pro-hoodie',
        name: 'PRO HOODIE',
        nameTh: 'เสื้อฮู้ดดี้ Pro',
        category: 'jacket',
        price: 2100,
        badge: 'MATCHING SET',
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
            'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=800',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Premium performance hoodie designed for warmups and casual wear. Features moisture-wicking fabric and athletic fit for maximum comfort during training sessions.',
        descriptionTh: 'เสื้อฮู้ดดี้เกรดพรีเมียมออกแบบมาสำหรับวอร์มอัพและใส่ทั่วไป มีผ้าระบายเหงื่อและทรง athletic fit เพื่อความสบายสูงสุดระหว่างซ้อม',
        note: 'Regular Fit',
        noteTh: 'ทรงปกติ',
        specs: {
            material: '80% Cotton, 20% Polyester',
            fit: 'Regular Fit',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Pro Series',
            parentSku: 'APR-HOODIE',
        },
        performanceRatings: {
            comfort: 9,
            breathability: 7,
            durability: 8,
            fit: 8,
            flexibility: 7,
        },
        sizes: [
            { size: 'XS', available: true },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: false },
            { size: '3XL', available: false },
        ],
        colors: [
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
            { name: 'GRAY', nameTh: 'เทา', hex: '#6b7280', image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=800' },
            { name: 'NAVY', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
        ],
        relatedProducts: ['performance-tee', 'training-shorts'],
    },
    {
        id: 'performance-tee',
        name: 'PERFORMANCE TEE',
        nameTh: 'เสื้อยืด Performance',
        category: 'short-sleeve',
        price: 790,
        originalPrice: 990,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Lightweight performance tee with advanced moisture management. Quick-dry technology keeps you cool and comfortable during intense matches.',
        descriptionTh: 'เสื้อยืด performance น้ำหนักเบาพร้อมระบบจัดการความชื้นขั้นสูง เทคโนโลยีแห้งไวช่วยให้คุณเย็นสบายระหว่างแข่งขันหนักๆ',
        note: 'Athletic Fit',
        noteTh: 'ทรง Athletic',
        specs: {
            material: '100% Polyester Dry-Fit',
            fit: 'Athletic Fit',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Performance',
            parentSku: 'APR-TEE',
        },
        performanceRatings: {
            comfort: 8,
            breathability: 10,
            durability: 7,
            fit: 9,
            flexibility: 9,
        },
        sizes: [
            { size: 'XS', available: true },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: true },
            { size: '3XL', available: true },
        ],
        colors: [
            { name: 'WHITE', nameTh: 'ขาว', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800' },
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800' },
            { name: 'GREEN', nameTh: 'เขียว', hex: '#22c55e', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800' },
        ],
        relatedProducts: ['pro-hoodie', 'training-shorts'],
    },
    {
        id: 'training-shorts',
        name: 'TRAINING SHORTS',
        nameTh: 'กางเกงซ้อม',
        category: 'shorts',
        price: 890,
        badge: 'NEW',
        stockCount: 12,
        images: [
            'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800',
            'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Ultra-comfortable training shorts with elastic waistband and inner brief. Designed for unrestricted movement on the court.',
        descriptionTh: 'กางเกงซ้อมสุดสบายพร้อมเอวยืดและซับใน ออกแบบมาเพื่อการเคลื่อนไหวอย่างอิสระบนคอร์ท',
        note: 'Regular Fit',
        noteTh: 'ทรงปกติ',
        specs: {
            material: '92% Polyester, 8% Spandex',
            fit: 'Regular Fit',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Training',
            parentSku: 'APR-SHORTS',
        },
        performanceRatings: {
            comfort: 9,
            breathability: 9,
            durability: 8,
            fit: 8,
            flexibility: 10,
        },
        sizes: [
            { size: 'XS', available: false },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: true },
            { size: '3XL', available: false },
        ],
        colors: [
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800' },
            { name: 'NAVY', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800' },
        ],
        relatedProducts: ['performance-tee', 'competition-set'],
    },
    {
        id: 'competition-set',
        name: 'COMPETITION SET',
        nameTh: 'ชุดแข่งขัน',
        category: 'set',
        price: 1890,
        originalPrice: 2290,
        badge: 'BEST SELLER',
        stockCount: 25,
        images: [
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800',
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800',
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400', username: '@reachbadminton' },
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400', username: '@proplayerth' },
        ],
        description: 'Official competition set featuring jersey and shorts. Tournament-grade quality with professional design and maximum performance fabric.',
        descriptionTh: 'ชุดแข่งขันอย่างเป็นทางการประกอบด้วยเสื้อและกางเกง คุณภาพระดับทัวร์นาเมนต์พร้อมดีไซน์มืออาชีพและผ้าประสิทธิภาพสูงสุด',
        note: 'Includes Jersey + Shorts',
        noteTh: 'รวมเสื้อ + กางเกง',
        specs: {
            material: '100% Premium Polyester',
            fit: 'Competition Fit',
            care: 'Machine wash cold, hang dry',
            sport: 'Badminton',
            playerType: 'Intermediate / Advanced',
            productTier: 'Competition',
            parentSku: 'APR-COMPSET',
        },
        performanceRatings: {
            comfort: 8,
            breathability: 10,
            durability: 9,
            fit: 10,
            flexibility: 9,
        },
        sizes: [
            { size: 'XS', available: true },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: true },
            { size: '3XL', available: true },
        ],
        colors: [
            { name: 'WHITE/BLUE', nameTh: 'ขาว/น้ำเงิน', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800' },
            { name: 'BLACK/RED', nameTh: 'ดำ/แดง', hex: '#ef4444', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800' },
        ],
        relatedProducts: ['pro-hoodie', 'training-shorts'],
    },
    // Long Sleeve
    {
        id: 'long-sleeve-tee',
        name: 'LONG SLEEVE PERFORMANCE TEE',
        nameTh: 'เสื้อแขนยาว Performance',
        category: 'long-sleeve',
        price: 990,
        originalPrice: 1190,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Long sleeve performance tee with UV protection and moisture-wicking technology. Perfect for outdoor training and cool weather matches.',
        descriptionTh: 'เสื้อแขนยาว performance พร้อมกันแสง UV และเทคโนโลยีระบายเหงื่อ เหมาะสำหรับซ้อมกลางแจ้งและแข่งขันในอากาศเย็น',
        note: 'Athletic Fit',
        noteTh: 'ทรง Athletic',
        specs: {
            material: '95% Polyester, 5% Spandex',
            fit: 'Athletic Fit',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Performance',
            parentSku: 'APR-LS-TEE',
        },
        performanceRatings: {
            comfort: 8,
            breathability: 9,
            durability: 8,
            fit: 9,
            flexibility: 9,
        },
        sizes: [
            { size: 'XS', available: true },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: true },
            { size: '3XL', available: false },
        ],
        colors: [
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800' },
            { name: 'WHITE', nameTh: 'ขาว', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800' },
        ],
        relatedProducts: ['performance-tee', 'pro-hoodie'],
    },
    // Pants
    {
        id: 'training-pants',
        name: 'TRAINING PANTS',
        nameTh: 'กางเกงซ้อมขายาว',
        category: 'pants',
        price: 990,
        originalPrice: 1290,
        badge: 'SALE',
        stockCount: 8,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Lightweight training pants with tapered fit and zippered ankles. Features side pockets and elastic waistband for maximum comfort.',
        descriptionTh: 'กางเกงซ้อมขายาวน้ำหนักเบา ทรงเรียวพร้อมซิปที่ข้อเท้า มีกระเป๋าข้างและเอวยืดเพื่อความสบายสูงสุด',
        note: 'Tapered Fit',
        noteTh: 'ทรงเรียว',
        specs: {
            material: '100% Polyester',
            fit: 'Tapered Fit',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Training',
            parentSku: 'APR-PANTS',
        },
        performanceRatings: {
            comfort: 9,
            breathability: 8,
            durability: 9,
            fit: 9,
            flexibility: 8,
        },
        sizes: [
            { size: 'XS', available: false },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: true },
            { size: '3XL', available: true },
        ],
        colors: [
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800' },
            { name: 'NAVY', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800' },
        ],
        relatedProducts: ['training-shorts', 'pro-hoodie'],
    },
    // Socks
    {
        id: 'performance-socks',
        name: 'PERFORMANCE SOCKS (3 PACK)',
        nameTh: 'ถุงเท้า Performance (3 คู่)',
        category: 'socks',
        price: 390,
        badge: 'VALUE PACK',
        images: [
            'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800',
            'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'Crew-length performance socks with arch support and cushioned sole. Moisture-wicking fabric keeps feet dry during intense matches.',
        descriptionTh: 'ถุงเท้าครึ่งแข้งพร้อมซัพพอร์ตอุ้งเท้าและพื้นกันกระแทก ผ้าระบายเหงื่อช่วยให้เท้าแห้งสบายระหว่างแข่งขัน',
        note: 'Pack of 3 pairs',
        noteTh: 'แพ็ค 3 คู่',
        specs: {
            material: '70% Cotton, 25% Polyester, 5% Spandex',
            fit: 'Crew Length',
            care: 'Machine wash cold',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Performance',
            parentSku: 'APR-SOCKS',
        },
        performanceRatings: {
            comfort: 9,
            breathability: 8,
            durability: 9,
            fit: 9,
            flexibility: 10,
        },
        sizes: [
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
        ],
        colors: [
            { name: 'WHITE', nameTh: 'ขาว', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800' },
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800' },
        ],
        relatedProducts: ['training-shorts', 'performance-tee'],
    },
    // Sports Bra
    {
        id: 'high-support-sports-bra',
        name: 'HIGH SUPPORT SPORTS BRA',
        nameTh: 'สปอร์ตบรา High Support',
        category: 'underwear',
        price: 1090,
        badge: 'HIGH SUPPORT',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
        ],
        videos: [
            { url: '#', thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400', username: '@reachbadminton' },
        ],
        description: 'High support sports bra designed for intensive training and competition. Features adjustable straps, moisture-wicking fabric, and racerback design.',
        descriptionTh: 'สปอร์ตบราซัพพอร์ตสูงออกแบบมาสำหรับการฝึกซ้อมและแข่งขันหนัก มีสายปรับได้ ผ้าระบายเหงื่อ และดีไซน์ racerback',
        note: 'High Support',
        noteTh: 'ซัพพอร์ตสูง',
        specs: {
            material: '85% Nylon, 15% Spandex',
            fit: 'Compression Fit',
            care: 'Hand wash recommended',
            sport: 'Badminton',
            playerType: 'All Levels',
            productTier: 'Performance',
            parentSku: 'APR-SBRA',
        },
        performanceRatings: {
            comfort: 8,
            breathability: 9,
            durability: 8,
            fit: 10,
            flexibility: 8,
        },
        sizes: [
            { size: 'XS', available: true },
            { size: 'S', available: true },
            { size: 'M', available: true },
            { size: 'L', available: true },
            { size: 'XL', available: true },
            { size: '2XL', available: false },
            { size: '3XL', available: false },
        ],
        colors: [
            { name: 'BLACK', nameTh: 'ดำ', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
            { name: 'NAVY', nameTh: 'กรม', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
            { name: 'PINK', nameTh: 'ชมพู', hex: '#ec4899', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
        ],
        relatedProducts: ['performance-tee', 'training-shorts'],
    },
];

export function getSportswearProductById(id: string): SportswearProduct | undefined {
    return sportswearProducts.find(p => p.id === id);
}

export function getRelatedSportswearProducts(productIds: string[]): SportswearProduct[] {
    return sportswearProducts.filter(p => productIds.includes(p.id));
}

// ==================== BUNDLE PRODUCTS ====================

export interface BundleItem {
    name: string;
    nameTh: string;
    price: number;
    image: string;
    category: 'racket' | 'shoes' | 'bag' | 'apparel' | 'accessory';
}

export interface BundleProduct {
    id: string;
    name: string;
    nameTh: string;
    price: number;
    originalPrice: number;
    savingsPercent: number;
    badge?: string;
    stockCount?: number; // จำนวนสินค้าคงเหลือ
    images: string[];
    description: string;
    descriptionTh: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    items: BundleItem[];
    features: string[];
    featuresTh: string[];
}

export const bundleProducts: BundleProduct[] = [
    {
        id: 'pro-tournament',
        name: 'Pro Tournament Set',
        nameTh: 'เซ็ตโปรทัวร์นาเมนต์',
        price: 12990,
        originalPrice: 16240,
        savingsPercent: 20,
        badge: 'BEST VALUE',
        stockCount: 5,
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        ],
        description: 'The ultimate tournament-ready bundle for serious competitors. Includes our premium Pro X1 racket with advanced carbon fiber technology, professional-grade Court Pro shoes with superior cushioning, a spacious tournament bag with multiple compartments, and a complete grip set for optimal handling.',
        descriptionTh: 'เซ็ตสำหรับนักแข่งขันที่ต้องการความพร้อมสูงสุด รวมไม้แบด Pro X1 ระดับพรีเมียมพร้อมเทคโนโลยีคาร์บอนไฟเบอร์ขั้นสูง รองเท้า Court Pro ระดับมืออาชีพที่มีการรองรับแรงกระแทกเหนือชั้น กระเป๋าทัวร์นาเมนต์ที่มีช่องเก็บของหลายช่อง และชุดกริปครบเซ็ตสำหรับการจับที่ดีที่สุด',
        skillLevel: 'advanced',
        items: [
            { name: 'Pro X1 Racket', nameTh: 'ไม้แบด Pro X1', price: 4990, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'racket' },
            { name: 'Court Pro Shoes', nameTh: 'รองเท้า Court Pro', price: 4990, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', category: 'shoes' },
            { name: 'Pro Racket Bag', nameTh: 'กระเป๋าไม้แบด Pro', price: 2490, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400', category: 'bag' },
            { name: '3-pack Grip Set', nameTh: 'กริปชุด 3 ชิ้น', price: 590, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'accessory' },
        ],
        features: [
            'Premium Pro X1 racket with carbon fiber frame',
            'Court Pro shoes with Power Cushion+ technology',
            'Tournament bag with thermal protection',
            '3-pack overgrip set included',
            'Free stringing service (valued at ฿350)',
        ],
        featuresTh: [
            'ไม้แบด Pro X1 พรีเมียมพร้อมกรอบคาร์บอนไฟเบอร์',
            'รองเท้า Court Pro พร้อมเทคโนโลยี Power Cushion+',
            'กระเป๋าทัวร์นาเมนต์พร้อมระบบป้องกันความร้อน',
            'ชุดกริป 3 ชิ้นรวมอยู่ในเซ็ต',
            'บริการขึ้นเอ็นฟรี (มูลค่า ฿350)',
        ],
    },
    {
        id: 'elite-competition',
        name: 'Elite Competition Set',
        nameTh: 'เซ็ตอีลิทแข่งขัน',
        price: 18990,
        originalPrice: 23740,
        savingsPercent: 20,
        badge: 'PRO CHOICE',
        images: [
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        ],
        description: 'Professional-grade equipment bundle for elite players. Features our flagship Elite Series racket used by world-ranked players, Speed Elite shoes for lightning-fast court coverage, tournament-grade bag, and a complete accessory kit including shuttlecocks, grips, and wristbands.',
        descriptionTh: 'เซ็ตอุปกรณ์ระดับมืออาชีพสำหรับผู้เล่นระดับสูง ประกอบด้วยไม้แบด Elite Series ที่นักแข่งระดับโลกใช้ รองเท้า Speed Elite สำหรับการเคลื่อนที่รวดเร็วในคอร์ต กระเป๋าระดับทัวร์นาเมนต์ และชุดอุปกรณ์เสริมครบถ้วนรวมถึงลูกขนไก่ กริป และสายรัดข้อมือ',
        skillLevel: 'professional',
        items: [
            { name: 'Elite Series Racket', nameTh: 'ไม้แบด Elite Series', price: 6990, image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=400', category: 'racket' },
            { name: 'Speed Elite Shoes', nameTh: 'รองเท้า Speed Elite', price: 4290, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400', category: 'shoes' },
            { name: 'Tournament Bag', nameTh: 'กระเป๋าทัวร์นาเมนต์', price: 3490, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400', category: 'bag' },
            { name: 'Complete Accessory Kit', nameTh: 'ชุดอุปกรณ์เสริมครบ', price: 2990, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'accessory' },
        ],
        features: [
            'Elite Series racket with SONIC FLARE SYSTEM',
            'Speed Elite shoes with carbon fiber plate',
            'Premium tournament bag with 6-racket capacity',
            'Complete accessory kit (shuttlecocks, grips, wristbands)',
            'Free stringing with premium strings (valued at ฿650)',
            '1-year warranty on all items',
        ],
        featuresTh: [
            'ไม้แบด Elite Series พร้อมระบบ SONIC FLARE SYSTEM',
            'รองเท้า Speed Elite พร้อมแผ่นคาร์บอนไฟเบอร์',
            'กระเป๋าทัวร์นาเมนต์พรีเมียมจุ 6 ไม้',
            'ชุดอุปกรณ์เสริมครบ (ลูกขนไก่ กริป สายรัดข้อมือ)',
            'ขึ้นเอ็นฟรีด้วยเอ็นพรีเมียม (มูลค่า ฿650)',
            'รับประกัน 1 ปีสำหรับทุกรายการ',
        ],
    },
    {
        id: 'starter-bundle',
        name: 'Starter Bundle',
        nameTh: 'เซ็ตเริ่มต้น',
        price: 5990,
        originalPrice: 7490,
        savingsPercent: 20,
        badge: 'BEGINNER',
        images: [
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Perfect entry-level bundle for new badminton players. Includes a forgiving Beginner Plus racket designed for easy learning, a convenient racket bag, grip set for comfortable handling, and practice shuttlecocks to get you started on your badminton journey.',
        descriptionTh: 'เซ็ตสำหรับผู้เริ่มต้นเล่นแบดมินตัน รวมไม้แบด Beginner Plus ที่ออกแบบมาให้เรียนรู้ได้ง่าย กระเป๋าไม้แบดที่สะดวก ชุดกริปสำหรับการจับที่สบาย และลูกขนไก่สำหรับฝึกซ้อมเพื่อเริ่มต้นการเดินทางสู่โลกแบดมินตัน',
        skillLevel: 'beginner',
        items: [
            { name: 'Beginner Plus Racket', nameTh: 'ไม้แบด Beginner Plus', price: 2490, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'racket' },
            { name: 'Racket Bag', nameTh: 'กระเป๋าไม้แบด', price: 1490, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400', category: 'bag' },
            { name: '3-pack Grip Set', nameTh: 'กริปชุด 3 ชิ้น', price: 590, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'accessory' },
            { name: '6-pack Shuttlecocks', nameTh: 'ลูกแบดชุด 6 ลูก', price: 490, image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=400', category: 'accessory' },
        ],
        features: [
            'Beginner-friendly racket with larger sweet spot',
            'Lightweight single racket bag',
            '3 overgrips for comfort',
            '6 practice shuttlecocks included',
            'Free beginner tips guide',
        ],
        featuresTh: [
            'ไม้แบดสำหรับมือใหม่พร้อม sweet spot กว้าง',
            'กระเป๋าใส่ไม้เดี่ยว น้ำหนักเบา',
            'กริป 3 ชิ้นเพื่อความสบาย',
            'ลูกขนไก่ฝึกซ้อม 6 ลูก',
            'คู่มือเทคนิคสำหรับมือใหม่ฟรี',
        ],
    },
    {
        id: 'intermediate-bundle',
        name: 'Intermediate Bundle',
        nameTh: 'เซ็ตกลางเกม',
        price: 8990,
        originalPrice: 11240,
        savingsPercent: 20,
        badge: 'POPULAR',
        images: [
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        ],
        description: 'Designed for players ready to level up their game. Features the Speed X racket with balanced performance, Agility Pro shoes for improved footwork, and a durable racket bag. Perfect for club players looking to improve.',
        descriptionTh: 'ออกแบบมาสำหรับผู้เล่นที่พร้อมยกระดับเกม พร้อมไม้แบด Speed X ที่มีประสิทธิภาพสมดุล รองเท้า Agility Pro สำหรับฟุตเวิร์คที่ดีขึ้น และกระเป๋าไม้แบดที่ทนทาน เหมาะสำหรับผู้เล่นระดับสโมสรที่ต้องการพัฒนา',
        skillLevel: 'intermediate',
        items: [
            { name: 'Speed X Racket', nameTh: 'ไม้แบด Speed X', price: 5490, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400', category: 'racket' },
            { name: 'Agility Pro Shoes', nameTh: 'รองเท้า Agility Pro', price: 3990, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', category: 'shoes' },
            { name: 'Racket Bag', nameTh: 'กระเป๋าไม้แบด', price: 1490, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400', category: 'bag' },
        ],
        features: [
            'Speed X racket with medium flex shaft',
            'Agility Pro shoes with responsive cushioning',
            'Durable 3-racket capacity bag',
            'Free stringing service',
            'Complimentary 2 overgrips',
        ],
        featuresTh: [
            'ไม้แบด Speed X พร้อมก้านความยืดหยุ่นปานกลาง',
            'รองเท้า Agility Pro พร้อมการรองรับแรงกระแทกที่ตอบสนอง',
            'กระเป๋าทนทานจุ 3 ไม้',
            'บริการขึ้นเอ็นฟรี',
            'แถมกริป 2 ชิ้น',
        ],
    },
];

export function getBundleProductById(id: string): BundleProduct | undefined {
    return bundleProducts.find(p => p.id === id);
}

// ==================== SUPPLEMENT PRODUCTS ====================

export type SupplementCategory =
    | 'protein'         // โปรตีน
    | 'energy'          // เครื่องดื่มพลังงาน/เจล
    | 'vitamins'        // วิตามินและแร่ธาตุ
    | 'recovery'        // ฟื้นฟูกล้ามเนื้อ
    | 'hydration';      // เกลือแร่/อิเล็กโทรไลต์

export const supplementCategoryNames: Record<SupplementCategory, { en: string; th: string }> = {
    'protein': { en: 'Protein', th: 'โปรตีน' },
    'energy': { en: 'Energy', th: 'พลังงาน' },
    'vitamins': { en: 'Vitamins & Minerals', th: 'วิตามินและแร่ธาตุ' },
    'recovery': { en: 'Recovery', th: 'ฟื้นฟูกล้ามเนื้อ' },
    'hydration': { en: 'Hydration', th: 'เกลือแร่' },
};

export interface SupplementSpecs {
    servingSize: string;
    servingsPerContainer: number;
    flavor: string;
    form: string;           // powder, capsule, liquid, gel
    certifications: string[];
    allergens: string[];
}

export interface SupplementNutrition {
    calories?: number;
    protein?: number;
    carbs?: number;
    sugar?: number;
    sodium?: number;
    potassium?: number;
}

export interface SupplementColor {
    name: string;
    nameTh: string;
    hex: string;
    image: string;
}

export interface SupplementProduct {
    id: string;
    name: string;
    nameTh: string;
    category: SupplementCategory;
    price: number;
    originalPrice?: number;
    badge?: string;
    stockCount?: number; // จำนวนสินค้าคงเหลือ
    images: string[];
    description: string;
    descriptionTh: string;
    benefits: string[];
    benefitsTh: string[];
    specs: SupplementSpecs;
    nutrition: SupplementNutrition;
    colors: SupplementColor[];      // flavors represented as colors
    relatedProducts: string[];
}

export const supplementProducts: SupplementProduct[] = [
    {
        id: 'whey-protein-isolate',
        name: 'WHEY PROTEIN ISOLATE',
        nameTh: 'เวย์โปรตีน ไอโซเลท',
        category: 'protein',
        price: 1890,
        originalPrice: 2290,
        badge: 'BEST SELLER',
        stockCount: 25,
        images: [
            'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800',
            'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=800',
        ],
        description: 'Premium whey protein isolate with 25g protein per serving. Fast-absorbing formula perfect for post-workout recovery. Low in fat and carbs for lean muscle building.',
        descriptionTh: 'เวย์โปรตีนไอโซเลทพรีเมียม โปรตีน 25 กรัมต่อเสิร์ฟ สูตรดูดซึมเร็วเหมาะสำหรับฟื้นฟูหลังออกกำลังกาย ไขมันและคาร์บต่ำสำหรับสร้างกล้ามเนื้อ',
        benefits: [
            '25g protein per serving',
            'Fast absorption',
            'Low fat & carbs',
            'Supports muscle recovery',
            'No added sugar',
        ],
        benefitsTh: [
            'โปรตีน 25 กรัมต่อเสิร์ฟ',
            'ดูดซึมเร็ว',
            'ไขมันและคาร์บต่ำ',
            'ช่วยฟื้นฟูกล้ามเนื้อ',
            'ไม่เติมน้ำตาล',
        ],
        specs: {
            servingSize: '30g (1 scoop)',
            servingsPerContainer: 30,
            flavor: 'Chocolate',
            form: 'powder',
            certifications: ['Informed Sport', 'GMP'],
            allergens: ['Milk', 'Soy'],
        },
        nutrition: {
            calories: 120,
            protein: 25,
            carbs: 2,
            sugar: 1,
            sodium: 50,
        },
        colors: [
            { name: 'Chocolate', nameTh: 'ช็อกโกแลต', hex: '#4a3728', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800' },
            { name: 'Vanilla', nameTh: 'วานิลลา', hex: '#f3e5ab', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=800' },
            { name: 'Strawberry', nameTh: 'สตรอว์เบอร์รี่', hex: '#fc5a8d', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800' },
        ],
        relatedProducts: ['bcaa-powder', 'energy-gel-pack'],
    },
    {
        id: 'bcaa-powder',
        name: 'BCAA POWDER 2:1:1',
        nameTh: 'บีซีเอเอ พาวเดอร์ 2:1:1',
        category: 'recovery',
        price: 990,
        badge: 'NEW',
        stockCount: 12,
        images: [
            'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800',
            'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800',
        ],
        description: 'Branch Chain Amino Acids in optimal 2:1:1 ratio. Supports muscle recovery and reduces muscle soreness. Perfect during or after intense training sessions.',
        descriptionTh: 'กรดอะมิโนสายโซ่กิ่งในอัตราส่วน 2:1:1 ที่เหมาะสม ช่วยฟื้นฟูกล้ามเนื้อและลดอาการปวดเมื่อย เหมาะสำหรับดื่มระหว่างหรือหลังการซ้อมหนัก',
        benefits: [
            'Optimal 2:1:1 ratio',
            'Reduces muscle soreness',
            'Supports recovery',
            'Sugar-free formula',
            'Refreshing taste',
        ],
        benefitsTh: [
            'อัตราส่วน 2:1:1 ที่เหมาะสม',
            'ลดอาการปวดเมื่อยกล้ามเนื้อ',
            'ช่วยฟื้นฟูร่างกาย',
            'สูตรไม่มีน้ำตาล',
            'รสชาติสดชื่น',
        ],
        specs: {
            servingSize: '10g',
            servingsPerContainer: 30,
            flavor: 'Blue Raspberry',
            form: 'powder',
            certifications: ['Informed Sport'],
            allergens: [],
        },
        nutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            sugar: 0,
            sodium: 10,
        },
        colors: [
            { name: 'Blue Raspberry', nameTh: 'บลูราสเบอร์รี่', hex: '#1e90ff', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
            { name: 'Watermelon', nameTh: 'แตงโม', hex: '#ff6b6b', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
            { name: 'Lemon Lime', nameTh: 'มะนาว', hex: '#bfff00', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
        ],
        relatedProducts: ['whey-protein-isolate', 'electrolyte-powder'],
    },
    {
        id: 'energy-gel-pack',
        name: 'ENERGY GEL PACK (6 PCS)',
        nameTh: 'เจลพลังงาน แพ็ค 6 ซอง',
        category: 'energy',
        price: 390,
        stockCount: 50,
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
        ],
        description: 'Quick energy boost during intense matches. Each gel provides 25g of fast-acting carbohydrates. Easy to consume and gentle on the stomach.',
        descriptionTh: 'เติมพลังงานอย่างรวดเร็วระหว่างการแข่งขัน แต่ละซองให้คาร์โบไฮเดรตออกฤทธิ์เร็ว 25 กรัม ทานง่ายและไม่ทำให้ท้องไส้ปั่นป่วน',
        benefits: [
            '25g fast-acting carbs',
            'Quick energy boost',
            'Easy to consume',
            'Gentle on stomach',
            'Compact & portable',
        ],
        benefitsTh: [
            'คาร์บออกฤทธิ์เร็ว 25 กรัม',
            'เติมพลังงานอย่างรวดเร็ว',
            'ทานง่าย',
            'ไม่ทำให้ท้องเสีย',
            'พกพาสะดวก',
        ],
        specs: {
            servingSize: '32g (1 gel)',
            servingsPerContainer: 6,
            flavor: 'Mixed Berry',
            form: 'gel',
            certifications: ['Informed Sport'],
            allergens: [],
        },
        nutrition: {
            calories: 100,
            protein: 0,
            carbs: 25,
            sugar: 10,
            sodium: 50,
            potassium: 30,
        },
        colors: [
            { name: 'Mixed Berry', nameTh: 'มิกซ์เบอร์รี่', hex: '#8b008b', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
            { name: 'Citrus', nameTh: 'ซิตรัส', hex: '#ffa500', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
            { name: 'Cola', nameTh: 'โคล่า', hex: '#3c1414', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
        ],
        relatedProducts: ['electrolyte-powder', 'bcaa-powder'],
    },
    {
        id: 'electrolyte-powder',
        name: 'ELECTROLYTE POWDER',
        nameTh: 'ผงเกลือแร่อิเล็กโทรไลต์',
        category: 'hydration',
        price: 590,
        badge: 'ESSENTIAL',
        images: [
            'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800',
            'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800',
        ],
        description: 'Complete electrolyte formula to replace minerals lost through sweat. Essential for maintaining hydration and performance during long training sessions.',
        descriptionTh: 'สูตรอิเล็กโทรไลต์ครบถ้วนเพื่อทดแทนแร่ธาตุที่สูญเสียไปกับเหงื่อ จำเป็นสำหรับรักษาความชุ่มชื้นและประสิทธิภาพระหว่างการซ้อมยาวนาน',
        benefits: [
            'Complete electrolyte blend',
            'Maintains hydration',
            'Prevents cramping',
            'Zero calories',
            'No artificial colors',
        ],
        benefitsTh: [
            'อิเล็กโทรไลต์ครบสูตร',
            'รักษาความชุ่มชื้น',
            'ป้องกันตะคริว',
            'ไม่มีแคลอรี่',
            'ไม่มีสีสังเคราะห์',
        ],
        specs: {
            servingSize: '5g',
            servingsPerContainer: 40,
            flavor: 'Lemon',
            form: 'powder',
            certifications: ['Informed Sport', 'Vegan'],
            allergens: [],
        },
        nutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            sugar: 0,
            sodium: 500,
            potassium: 200,
        },
        colors: [
            { name: 'Lemon', nameTh: 'เลมอน', hex: '#fff44f', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800' },
            { name: 'Orange', nameTh: 'ส้ม', hex: '#ff8c00', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800' },
            { name: 'Unflavored', nameTh: 'ไม่มีรส', hex: '#f5f5f5', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=800' },
        ],
        relatedProducts: ['energy-gel-pack', 'multivitamin-athletes'],
    },
    {
        id: 'multivitamin-athletes',
        name: 'MULTIVITAMIN FOR ATHLETES',
        nameTh: 'มัลติวิตามินสำหรับนักกีฬา',
        category: 'vitamins',
        price: 790,
        stockCount: 35,
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800',
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800',
        ],
        description: 'Comprehensive multivitamin specially formulated for athletes. Contains essential vitamins and minerals to support energy, immunity, and overall performance.',
        descriptionTh: 'มัลติวิตามินครบถ้วนสูตรพิเศษสำหรับนักกีฬา ประกอบด้วยวิตามินและแร่ธาตุจำเป็นเพื่อสนับสนุนพลังงาน ภูมิคุ้มกัน และประสิทธิภาพโดยรวม',
        benefits: [
            '100% daily vitamins',
            'Supports energy levels',
            'Boosts immunity',
            'Easy to swallow',
            '60-day supply',
        ],
        benefitsTh: [
            'วิตามินครบ 100% ต่อวัน',
            'ช่วยเพิ่มพลังงาน',
            'เสริมภูมิคุ้มกัน',
            'กลืนง่าย',
            'พอใช้ 60 วัน',
        ],
        specs: {
            servingSize: '1 tablet',
            servingsPerContainer: 60,
            flavor: 'None',
            form: 'capsule',
            certifications: ['GMP', 'NSF Certified'],
            allergens: [],
        },
        nutrition: {
            calories: 0,
        },
        colors: [
            { name: 'Standard', nameTh: 'มาตรฐาน', hex: '#228b22', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' },
        ],
        relatedProducts: ['electrolyte-powder', 'whey-protein-isolate'],
    },
    {
        id: 'pre-workout-formula',
        name: 'PRE-WORKOUT FORMULA',
        nameTh: 'สูตรก่อนออกกำลังกาย',
        category: 'energy',
        price: 1290,
        badge: 'POWER BOOST',
        images: [
            'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800',
            'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800',
        ],
        description: 'Powerful pre-workout formula to maximize your training intensity. Contains caffeine, beta-alanine, and citrulline for explosive energy and enhanced focus.',
        descriptionTh: 'สูตรก่อนออกกำลังกายที่ทรงพลังเพื่อเพิ่มความเข้มข้นในการซ้อม มีคาเฟอีน เบต้า-อะลานีน และซิทรูลลีนสำหรับพลังระเบิดและสมาธิที่ดีขึ้น',
        benefits: [
            'Explosive energy',
            'Enhanced focus',
            'Increased endurance',
            'Better pump',
            'No crash formula',
        ],
        benefitsTh: [
            'พลังงานระเบิด',
            'สมาธิที่ดีขึ้น',
            'เพิ่มความอึด',
            'กล้ามเนื้อพองตัวดี',
            'ไม่มีอาการอ่อนล้าหลังหมดฤทธิ์',
        ],
        specs: {
            servingSize: '12g',
            servingsPerContainer: 30,
            flavor: 'Fruit Punch',
            form: 'powder',
            certifications: ['Informed Sport'],
            allergens: [],
        },
        nutrition: {
            calories: 10,
            protein: 0,
            carbs: 2,
            sugar: 0,
            sodium: 100,
        },
        colors: [
            { name: 'Fruit Punch', nameTh: 'ฟรุตพันช์', hex: '#ff1744', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
            { name: 'Blue Ice', nameTh: 'บลูไอซ์', hex: '#00bfff', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
            { name: 'Green Apple', nameTh: 'แอปเปิ้ลเขียว', hex: '#7cfc00', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800' },
        ],
        relatedProducts: ['bcaa-powder', 'energy-gel-pack'],
    },
];

export function getSupplementProductById(id: string): SupplementProduct | undefined {
    return supplementProducts.find(p => p.id === id);
}

export function getRelatedSupplementProducts(productIds: string[]): SupplementProduct[] {
    return supplementProducts.filter(p => productIds.includes(p.id));
}

// ========== COURT SERVICES (สนามแบดมินตัน) ==========

export type CourtServiceType = 'flooring' | 'lighting' | 'renovation' | 'consultation';

// Performance Ratings สำหรับพื้นสนาม (1-10 scale)
export interface CourtPerformanceRatings {
    shockAbsorption: number;  // รองรับแรงกระแทก (1=FIRM, 10=SOFT)
    stability: number;        // ความมั่นคง (1=FLEXIBLE, 10=STABLE)
    grip: number;             // การยึดเกาะ (1=LOW, 10=HIGH)
    breathability: number;    // การระบายอากาศ (1=LOW, 10=HIGH)
    durability: number;       // ความทนทาน (1=LIGHT, 10=HEAVY)
}

// Highlights สำหรับแสดงจุดเด่นของบริการ
export interface CourtHighlight {
    number: string;    // เช่น "01", "02"
    text: string;      // ข้อความภาษาอังกฤษ
    textTh: string;    // ข้อความภาษาไทย
}

export interface CourtService {
    id: string;
    name: string;
    nameTh: string;
    serviceType: CourtServiceType;
    images: string[];
    description: string;
    descriptionTh: string;
    features: string[];
    featuresTh: string[];
    materials?: string[];
    materialsTh?: string[];
    warranty?: string;
    warrantyTh?: string;
    contactOnly: true; // ไม่แสดงราคา ให้ติดต่อสอบถาม
    // ข้อมูลเพิ่มเติมสำหรับหน้ารายละเอียด
    performanceRatings?: CourtPerformanceRatings;
    highlights?: CourtHighlight[];
    suitableFor?: string;      // เหมาะสำหรับใคร (EN)
    suitableForTh?: string;    // เหมาะสำหรับใคร (TH)
}

export const courtServices: CourtService[] = [
    {
        id: 'pvc-flooring-standard',
        name: 'PVC Flooring - Standard',
        nameTh: 'พื้นสนาม PVC มาตรฐาน',
        serviceType: 'flooring',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'High-quality PVC flooring for badminton courts. Provides excellent grip, shock absorption, and durability. BWF approved for recreational use. Available in multiple colors.',
        descriptionTh: 'พื้นสนามแบดมินตัน PVC คุณภาพสูง ให้การยึดเกาะดีเยี่ยม ดูดซับแรงกระแทก และทนทาน ได้รับการรับรองจาก BWF สำหรับการใช้งานทั่วไป มีหลายสีให้เลือก',
        features: [
            'BWF Approved for recreational use',
            'Anti-slip surface',
            'Shock absorption technology',
            'Easy to clean and maintain',
            'UV resistant',
            '5-year warranty',
        ],
        featuresTh: [
            'ได้รับการรับรองจาก BWF สำหรับการใช้งานทั่วไป',
            'พื้นผิวกันลื่น',
            'เทคโนโลยีดูดซับแรงกระแทก',
            'ทำความสะอาดและดูแลรักษาง่าย',
            'ทนต่อรังสี UV',
            'รับประกัน 5 ปี',
        ],
        materials: ['PVC 4.5mm thickness', 'Foam backing 2mm'],
        materialsTh: ['PVC หนา 4.5 มม.', 'โฟมรองหลัง 2 มม.'],
        warranty: '5 years',
        warrantyTh: '5 ปี',
        contactOnly: true,
        performanceRatings: {
            shockAbsorption: 6,  // กลางๆ
            stability: 7,        // ค่อนข้างมั่นคง
            grip: 8,             // ยึดเกาะดี
            breathability: 5,    // ระบายอากาศปานกลาง
            durability: 7,       // ทนทานดี
        },
        highlights: [
            { number: '01', text: 'BWF Approved for excellent shock absorption', textTh: 'ได้รับการรับรอง BWF รองรับแรงกระแทกอย่างยอดเยี่ยม' },
            { number: '02', text: 'PVC surface provides excellent grip and stability', textTh: 'พื้นผิว PVC ให้การยึดเกาะและความมั่นคงดีเยี่ยม' },
            { number: '03', text: 'Suitable for recreational and club level play', textTh: 'เหมาะสำหรับผู้เล่นระดับสันทนาการและสโมสร' },
        ],
        suitableFor: 'Recreational / Club Level',
        suitableForTh: 'ระดับสันทนาการ / สโมสร',
    },
    {
        id: 'pvc-flooring-professional',
        name: 'PVC Flooring - Professional',
        nameTh: 'พื้นสนาม PVC ระดับโปร',
        serviceType: 'flooring',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Professional-grade PVC flooring certified by BWF for international tournaments. Superior shock absorption and ball response. Used in major competitions worldwide.',
        descriptionTh: 'พื้นสนาม PVC ระดับมืออาชีพ ได้รับการรับรองจาก BWF สำหรับการแข่งขันระดับนานาชาติ ดูดซับแรงกระแทกและการตอบสนองของลูกดีเยี่ยม ใช้ในการแข่งขันใหญ่ทั่วโลก',
        features: [
            'BWF Certified for international tournaments',
            'Professional anti-slip surface',
            'Advanced shock absorption',
            'Optimal ball bounce',
            'Fire resistant',
            '10-year warranty',
        ],
        featuresTh: [
            'ได้รับการรับรองจาก BWF สำหรับการแข่งขันระดับนานาชาติ',
            'พื้นผิวกันลื่นระดับมืออาชีพ',
            'ดูดซับแรงกระแทกขั้นสูง',
            'การเด้งของลูกเหมาะสม',
            'ทนไฟ',
            'รับประกัน 10 ปี',
        ],
        materials: ['PVC 7.0mm thickness', 'High-density foam 3mm', 'Fiberglass layer'],
        materialsTh: ['PVC หนา 7.0 มม.', 'โฟมความหนาแน่นสูง 3 มม.', 'ชั้นไฟเบอร์กลาส'],
        warranty: '10 years',
        warrantyTh: '10 ปี',
        contactOnly: true,
        performanceRatings: {
            shockAbsorption: 8,  // นุ่มกว่า
            stability: 9,        // มั่นคงมาก
            grip: 9,             // ยึดเกาะดีมาก
            breathability: 6,    // ระบายอากาศดีขึ้น
            durability: 9,       // ทนทานมาก
        },
        highlights: [
            { number: '01', text: 'BWF Certified for international tournament standards', textTh: 'ได้รับการรับรอง BWF มาตรฐานการแข่งขันระดับนานาชาติ' },
            { number: '02', text: 'Advanced multi-layer system for superior performance', textTh: 'ระบบหลายชั้นขั้นสูงเพื่อประสิทธิภาพที่เหนือกว่า' },
            { number: '03', text: 'Designed for professional and competitive players', textTh: 'ออกแบบสำหรับนักกีฬามืออาชีพและระดับแข่งขัน' },
        ],
        suitableFor: 'Professional / Advanced',
        suitableForTh: 'ระดับมืออาชีพ / ขั้นสูง',
    },
    {
        id: 'wood-flooring',
        name: 'Wooden Flooring System',
        nameTh: 'ระบบพื้นไม้สนาม',
        serviceType: 'flooring',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Premium wooden flooring system for indoor badminton courts. Natural feel with excellent performance characteristics. Perfect for clubs and training centers.',
        descriptionTh: 'ระบบพื้นไม้ระดับพรีเมียมสำหรับสนามแบดมินตันในร่ม สัมผัสธรรมชาติพร้อมคุณสมบัติการใช้งานที่ยอดเยี่ยม เหมาะสำหรับสโมสรและศูนย์ฝึกซ้อม',
        features: [
            'Natural wood surface',
            'Sprung floor system',
            'Excellent shock absorption',
            'Beautiful aesthetic',
            'Can be refinished multiple times',
            '15-year warranty',
        ],
        featuresTh: [
            'พื้นผิวไม้ธรรมชาติ',
            'ระบบพื้นสปริง',
            'ดูดซับแรงกระแทกดีเยี่ยม',
            'สวยงาม',
            'สามารถขัดผิวใหม่ได้หลายครั้ง',
            'รับประกัน 15 ปี',
        ],
        materials: ['Maple hardwood 22mm', 'Resilient pads', 'Plywood subfloor'],
        materialsTh: ['ไม้เมเปิ้ลแข็ง 22 มม.', 'แผ่นรองยืดหยุ่น', 'พื้นไม้อัด'],
        warranty: '15 years',
        warrantyTh: '15 ปี',
        contactOnly: true,
        performanceRatings: {
            shockAbsorption: 9,  // นุ่มมาก เพราะมีระบบสปริง
            stability: 8,        // มั่นคงดี
            grip: 7,             // ยึดเกาะดี
            breathability: 8,    // ระบายอากาศดี (ไม้ธรรมชาติ)
            durability: 8,       // ทนทานดีมาก
        },
        highlights: [
            { number: '01', text: 'Sprung floor system for superior shock absorption', textTh: 'ระบบพื้นสปริงรองรับแรงกระแทกได้ดีเยี่ยม' },
            { number: '02', text: 'Natural maple hardwood for premium aesthetics', textTh: 'ไม้เมเปิ้ลธรรมชาติสวยงามระดับพรีเมียม' },
            { number: '03', text: 'Can be refinished for long-term value', textTh: 'ขัดผิวใหม่ได้คุ้มค่าระยะยาว' },
        ],
        suitableFor: 'Club / Training Center',
        suitableForTh: 'สโมสร / ศูนย์ฝึกซ้อม',
    },
    {
        id: 'court-lighting',
        name: 'LED Court Lighting System',
        nameTh: 'ระบบไฟส่องสว่าง LED สนาม',
        serviceType: 'lighting',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Professional LED lighting system designed specifically for badminton courts. Anti-glare technology ensures optimal visibility. Energy efficient and long-lasting.',
        descriptionTh: 'ระบบไฟ LED ระดับมืออาชีพออกแบบมาเฉพาะสำหรับสนามแบดมินตัน เทคโนโลยีลดแสงสะท้อนให้มองเห็นได้อย่างเหมาะสม ประหยัดพลังงานและใช้งานได้ยาวนาน',
        features: [
            'Anti-glare design',
            '500+ lux brightness',
            'No flickering',
            '50,000 hours lifespan',
            'Energy saving 60%',
            'Instant on/off',
        ],
        featuresTh: [
            'ออกแบบลดแสงสะท้อน',
            'ความสว่าง 500+ ลักซ์',
            'ไม่กระพริบ',
            'อายุการใช้งาน 50,000 ชั่วโมง',
            'ประหยัดพลังงาน 60%',
            'เปิด/ปิดทันที',
        ],
        warranty: '5 years',
        warrantyTh: '5 ปี',
        contactOnly: true,
        highlights: [
            { number: '01', text: 'Anti-glare technology for clear shuttle visibility', textTh: 'เทคโนโลยีลดแสงสะท้อนมองเห็นลูกขนไก่ชัดเจน' },
            { number: '02', text: '500+ lux brightness meets BWF standards', textTh: 'ความสว่าง 500+ ลักซ์ ตามมาตรฐาน BWF' },
            { number: '03', text: '60% energy saving compared to traditional lighting', textTh: 'ประหยัดพลังงาน 60% เทียบกับไฟแบบเดิม' },
        ],
    },
    {
        id: 'court-renovation',
        name: 'Court Renovation Package',
        nameTh: 'แพ็คเกจปรับปรุงสนาม',
        serviceType: 'renovation',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Complete court renovation service including flooring replacement, line marking, net posts, and finishing touches. Transform your old court into a professional venue.',
        descriptionTh: 'บริการปรับปรุงสนามครบวงจร รวมถึงเปลี่ยนพื้น ตีเส้นสนาม เสาตาข่าย และงานตกแต่ง เปลี่ยนสนามเก่าของคุณให้เป็นสถานที่ระดับมืออาชีพ',
        features: [
            'Complete flooring replacement',
            'Professional line marking',
            'Net post installation',
            'Court numbering',
            'Cleaning and finishing',
            'Project management included',
        ],
        featuresTh: [
            'เปลี่ยนพื้นใหม่ทั้งหมด',
            'ตีเส้นสนามระดับมืออาชีพ',
            'ติดตั้งเสาตาข่าย',
            'เลขสนาม',
            'ทำความสะอาดและตกแต่ง',
            'รวมการบริหารโครงการ',
        ],
        contactOnly: true,
        highlights: [
            { number: '01', text: 'Complete turnkey renovation from assessment to finishing', textTh: 'ปรับปรุงครบวงจรตั้งแต่ประเมินจนถึงงานเสร็จ' },
            { number: '02', text: 'Professional line marking to BWF standards', textTh: 'ตีเส้นสนามตามมาตรฐาน BWF' },
            { number: '03', text: 'Full project management included', textTh: 'รวมการบริหารโครงการครบถ้วน' },
        ],
    },
    {
        id: 'court-consultation',
        name: 'Court Design Consultation',
        nameTh: 'ที่ปรึกษาออกแบบสนาม',
        serviceType: 'consultation',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        ],
        description: 'Expert consultation for new court construction or existing court improvement. Our team will help you design the perfect court for your needs and budget.',
        descriptionTh: 'ที่ปรึกษาผู้เชี่ยวชาญสำหรับการสร้างสนามใหม่หรือปรับปรุงสนามเดิม ทีมงานของเราจะช่วยคุณออกแบบสนามที่เหมาะสมกับความต้องการและงบประมาณ',
        features: [
            'Site survey and assessment',
            'Custom design proposal',
            '3D visualization',
            'Material recommendations',
            'Cost estimation',
            'Project timeline planning',
        ],
        featuresTh: [
            'สำรวจและประเมินพื้นที่',
            'ข้อเสนอการออกแบบเฉพาะ',
            'ภาพ 3D',
            'คำแนะนำวัสดุ',
            'ประมาณการค่าใช้จ่าย',
            'วางแผนระยะเวลาโครงการ',
        ],
        contactOnly: true,
        highlights: [
            { number: '01', text: 'Free initial site survey and assessment', textTh: 'สำรวจและประเมินพื้นที่เบื้องต้นฟรี' },
            { number: '02', text: '3D visualization to preview your court design', textTh: 'ภาพ 3D แสดงตัวอย่างการออกแบบสนาม' },
            { number: '03', text: 'Expert recommendations based on budget and needs', textTh: 'คำแนะนำจากผู้เชี่ยวชาญตามงบประมาณและความต้องการ' },
        ],
    },
];

export function getCourtServiceById(id: string): CourtService | undefined {
    return courtServices.find(s => s.id === id);
}

export function getCourtServicesByType(type: CourtServiceType): CourtService[] {
    return courtServices.filter(s => s.serviceType === type);
}
