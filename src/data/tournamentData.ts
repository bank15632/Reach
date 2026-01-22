// Tournament data types and data

export type TournamentStatus = 'registration_open' | 'registration_closed' | 'coming_soon' | 'in_progress' | 'completed';

export interface TournamentLocation {
    country: string;
    countryTh: string;
    city: string;
    cityTh: string;
    venue: string;
    venueTh: string;
    address?: string;
    addressTh?: string;
    mapUrl?: string;
}

export interface TournamentMatch {
    id: string;
    round: string;
    roundTh: string;
    category: string;
    categoryTh: string;
    player1: string;
    player1Nickname?: string;
    player1Photo?: string;
    player1Flag?: string;
    player1Seed?: number;
    player1Birthdate?: string;
    player1Gender?: 'male' | 'female';
    player2: string;
    player2Nickname?: string;
    player2Photo?: string;
    player2Flag?: string;
    player2Seed?: number;
    player2Birthdate?: string;
    player2Gender?: 'male' | 'female';
    // For doubles - second player
    player1Partner?: string;
    player1PartnerNickname?: string;
    player1PartnerPhoto?: string;
    player1PartnerGender?: 'male' | 'female';
    player1PartnerBirthdate?: string;
    player2Partner?: string;
    player2PartnerNickname?: string;
    player2PartnerPhoto?: string;
    player2PartnerGender?: 'male' | 'female';
    player2PartnerBirthdate?: string;
    score?: string;
    scores?: { player1: number; player2: number }[];
    winner?: 1 | 2;
    time: string;
    court: string;
    status: 'scheduled' | 'live' | 'completed';
    liveStreamUrl?: string;
    bracketPosition?: number;
}

export interface TournamentSchedule {
    date: string;
    events: Array<{
        time: string;
        event: string;
        eventTh: string;
    }>;
}

export interface Tournament {
    id: string;
    name: string;
    nameTh: string;
    dateStart: string;
    dateEnd: string;
    timeStart: string;
    timeEnd: string;
    location: TournamentLocation;
    prize: string;
    participants: number;
    registeredCount: number;
    status: TournamentStatus;
    image: string;
    images?: string[];
    categories: string[];
    categoriesTh: string[];
    description?: string;
    descriptionTh?: string;
    rules?: string[];
    rulesTh?: string[];
    entryFee?: string;
    schedule?: TournamentSchedule[];
    matches?: TournamentMatch[];
    sponsors?: string[];
    contactEmail?: string;
    contactPhone?: string;
}

// Status configuration with colors and labels
export const statusConfig: Record<TournamentStatus, {
    label: string;
    labelTh: string;
    bgColor: string;
    textColor: string;
}> = {
    registration_open: {
        label: 'Registration Open',
        labelTh: 'เปิดรับสมัคร',
        bgColor: 'bg-green-500',
        textColor: 'text-white'
    },
    registration_closed: {
        label: 'Registration Closed',
        labelTh: 'ปิดรับสมัคร',
        bgColor: 'bg-red-500',
        textColor: 'text-white'
    },
    coming_soon: {
        label: 'Coming Soon',
        labelTh: 'เร็วๆ นี้',
        bgColor: 'bg-blue-500',
        textColor: 'text-white'
    },
    in_progress: {
        label: 'In Progress',
        labelTh: 'กำลังแข่งขัน',
        bgColor: 'bg-yellow-500',
        textColor: 'text-black'
    },
    completed: {
        label: 'Completed',
        labelTh: 'การแข่งขันจบแล้ว',
        bgColor: 'bg-gray-500',
        textColor: 'text-white'
    }
};

export const tournaments: Tournament[] = [
    {
        id: 'reach-open-2026',
        name: 'REACH Open Championship 2026',
        nameTh: 'REACH Open Championship 2026',
        dateStart: '2026-02-15',
        dateEnd: '2026-02-17',
        timeStart: '09:00',
        timeEnd: '20:00',
        location: {
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            city: 'Nonthaburi',
            cityTh: 'นนทบุรี',
            venue: 'IMPACT Arena',
            venueTh: 'อิมแพ็ค อารีน่า เมืองทองธานี',
            address: '99 Popular Rd, Ban Mai, Pak Kret District, Nonthaburi 11120',
            addressTh: '99 ถนนยอดนิยม ตำบลบ้านใหม่ อำเภอปากเกร็ด นนทบุรี 11120',
            mapUrl: 'https://maps.google.com/?q=IMPACT+Arena+Muang+Thong+Thani'
        },
        prize: '฿500,000',
        participants: 256,
        registeredCount: 180,
        status: 'registration_open',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
            'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        ],
        categories: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"],
        categoriesTh: ['ชายเดี่ยว', 'หญิงเดี่ยว', 'ชายคู่', 'หญิงคู่', 'คู่ผสม'],
        description: 'The REACH Open Championship is the premier badminton tournament in Thailand, featuring top players from across the nation competing for glory and substantial prize money.',
        descriptionTh: 'REACH Open Championship เป็นการแข่งขันแบดมินตันชั้นนำของประเทศไทย รวมนักกีฬาระดับแนวหน้าจากทั่วประเทศมาแข่งขันชิงเงินรางวัล',
        rules: [
            'All participants must be at least 16 years old',
            'BWF approved equipment only',
            'Standard BWF rules apply',
            'Players must arrive 30 minutes before their match'
        ],
        rulesTh: [
            'ผู้เข้าร่วมต้องมีอายุอย่างน้อย 16 ปี',
            'ใช้อุปกรณ์ที่ได้รับการรับรองจาก BWF เท่านั้น',
            'ใช้กติกามาตรฐาน BWF',
            'ผู้เล่นต้องมาถึงก่อนเวลาแข่งขัน 30 นาที'
        ],
        entryFee: '฿500',
        schedule: [
            {
                date: '2026-02-15',
                events: [
                    { time: '09:00', event: 'Registration & Check-in', eventTh: 'ลงทะเบียนและเช็คอิน' },
                    { time: '10:00', event: 'Opening Ceremony', eventTh: 'พิธีเปิด' },
                    { time: '11:00', event: 'Round 1 - All Categories', eventTh: 'รอบที่ 1 - ทุกประเภท' },
                    { time: '18:00', event: 'Day 1 Ends', eventTh: 'สิ้นสุดวันที่ 1' }
                ]
            },
            {
                date: '2026-02-16',
                events: [
                    { time: '09:00', event: 'Round 2 & Quarterfinals', eventTh: 'รอบ 2 และรอบก่อนรองชนะเลิศ' },
                    { time: '14:00', event: 'Semifinals', eventTh: 'รอบรองชนะเลิศ' },
                    { time: '18:00', event: 'Day 2 Ends', eventTh: 'สิ้นสุดวันที่ 2' }
                ]
            },
            {
                date: '2026-02-17',
                events: [
                    { time: '14:00', event: 'Finals - All Categories', eventTh: 'รอบชิงชนะเลิศ - ทุกประเภท' },
                    { time: '18:00', event: 'Award Ceremony', eventTh: 'พิธีมอบรางวัล' },
                    { time: '19:00', event: 'Closing', eventTh: 'พิธีปิด' }
                ]
            }
        ],
        contactEmail: 'tournament@reachbadminton.com',
        contactPhone: '+66 2 123 4567'
    },
    {
        id: 'junior-elite-2026',
        name: 'Junior Elite Cup 2026',
        nameTh: 'จูเนียร์ อีลิท คัพ 2026',
        dateStart: '2026-03-01',
        dateEnd: '2026-03-03',
        timeStart: '08:00',
        timeEnd: '18:00',
        location: {
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            city: 'Bangkok',
            cityTh: 'กรุงเทพมหานคร',
            venue: 'Nimibutr Stadium',
            venueTh: 'สนามนิมิบุตร',
            address: 'National Stadium, Pathum Wan, Bangkok 10330',
            addressTh: 'สนามกีฬาแห่งชาติ ปทุมวัน กรุงเทพฯ 10330'
        },
        prize: '฿100,000',
        participants: 128,
        registeredCount: 128,
        status: 'registration_closed',
        image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        categories: ["U15 Boys Singles", "U15 Girls Singles", "U18 Boys Singles", "U18 Girls Singles"],
        categoriesTh: ['ชายเดี่ยว U15', 'หญิงเดี่ยว U15', 'ชายเดี่ยว U18', 'หญิงเดี่ยว U18'],
        description: 'The Junior Elite Cup brings together the brightest young badminton talents in Thailand to compete in age-appropriate categories.',
        descriptionTh: 'Junior Elite Cup รวบรวมนักแบดมินตันเยาวชนที่มีความสามารถที่สุดในประเทศไทยมาแข่งขันในประเภทอายุต่างๆ',
        entryFee: '฿300',
        contactEmail: 'junior@reachbadminton.com',
        contactPhone: '+66 2 123 4568'
    },
    {
        id: 'corporate-league-2026',
        name: 'Corporate League 2026',
        nameTh: 'คอร์ปอเรท ลีก 2026',
        dateStart: '2026-03-22',
        dateEnd: '2026-03-24',
        timeStart: '10:00',
        timeEnd: '21:00',
        location: {
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            city: 'Bangkok',
            cityTh: 'กรุงเทพมหานคร',
            venue: 'Rajamangala National Stadium',
            venueTh: 'สนามราชมังคลากีฬาสถาน',
            address: 'Ramkhamhaeng Rd, Hua Mak, Bang Kapi, Bangkok 10240',
            addressTh: 'ถนนรามคำแหง หัวหมาก บางกะปิ กรุงเทพฯ 10240'
        },
        prize: '฿250,000',
        participants: 64,
        registeredCount: 0,
        status: 'coming_soon',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        categories: ["Team Event"],
        categoriesTh: ['ประเภททีม'],
        description: 'A unique tournament for corporate teams to compete and build camaraderie through the sport of badminton.',
        descriptionTh: 'การแข่งขันพิเศษสำหรับทีมองค์กรเพื่อแข่งขันและสร้างความสามัคคีผ่านกีฬาแบดมินตัน',
        entryFee: '฿5,000 per team',
        contactEmail: 'corporate@reachbadminton.com'
    },
    {
        id: 'bwf-thailand-masters-2026',
        name: 'BWF Thailand Masters 2026',
        nameTh: 'BWF ไทยแลนด์ มาสเตอร์ 2026',
        dateStart: '2026-01-14',
        dateEnd: '2026-01-19',
        timeStart: '09:00',
        timeEnd: '22:00',
        location: {
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            city: 'Bangkok',
            cityTh: 'กรุงเทพมหานคร',
            venue: 'Indoor Stadium Huamark',
            venueTh: 'อินดอร์ สเตเดียม หัวหมาก',
            address: 'Ramkhamhaeng Rd, Hua Mak, Bang Kapi, Bangkok 10240',
            addressTh: 'ถนนรามคำแหง หัวหมาก บางกะปิ กรุงเทพฯ 10240'
        },
        prize: '฿12,000,000',
        participants: 320,
        registeredCount: 320,
        status: 'in_progress',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        categories: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"],
        categoriesTh: ['ชายเดี่ยว', 'หญิงเดี่ยว', 'ชายคู่', 'หญิงคู่', 'คู่ผสม'],
        description: 'A BWF World Tour Super 300 event featuring the world\'s top players competing for ranking points and prize money.',
        descriptionTh: 'การแข่งขัน BWF World Tour Super 300 ที่รวบรวมนักกีฬาระดับโลกมาแข่งขันเพื่อคะแนนสะสมและเงินรางวัล',
        matches: [
            // Quarterfinals (4 matches) - Left Column
            {
                id: 'qf1',
                round: 'Quarterfinal',
                roundTh: 'รอบก่อนรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Kunlavut V.',
                player1Nickname: 'View',
                player1Photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                player1Seed: 3,
                player1Gender: 'male',
                player1Birthdate: '2001-05-11',
                player2: 'Viktor A.',
                player2Nickname: 'Viktor',
                player2Photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                player2Seed: 1,
                player2Gender: 'male',
                player2Birthdate: '1994-01-04',
                time: '14:00',
                court: 'Court 1',
                status: 'completed',
                winner: 1,
                scores: [
                    { player1: 21, player2: 15 },
                    { player1: 21, player2: 12 }
                ]
            },
            {
                id: 'qf2',
                round: 'Quarterfinal',
                roundTh: 'รอบก่อนรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Li Shi Feng',
                player1Nickname: 'Li',
                player1Gender: 'male',
                player1Birthdate: '2000-01-09',
                player2: 'Kento Momota',
                player2Nickname: 'Kento',
                player2Gender: 'male',
                player2Birthdate: '1994-09-01',
                time: '14:00',
                court: 'Court 2',
                status: 'live',
                liveStreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                scores: [
                    { player1: 15, player2: 12 }
                ]
            },
            {
                id: 'qf3',
                round: 'Quarterfinal',
                roundTh: 'รอบก่อนรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Kodai Naraoka',
                player1Nickname: 'Kodai',
                player1Gender: 'male',
                player1Birthdate: '2001-06-30',
                player2: 'Anthony Ginting',
                player2Nickname: 'Ginting',
                player2Gender: 'male',
                player2Birthdate: '1996-10-20',
                time: '15:00',
                court: 'Court 1',
                status: 'scheduled'
            },
            {
                id: 'qf4',
                round: 'Quarterfinal',
                roundTh: 'รอบก่อนรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Loh Kean Yew',
                player1Nickname: 'LKY',
                player1Gender: 'male',
                player1Birthdate: '1997-06-26',
                player2: 'Chou Tien Chen',
                player2Nickname: 'Chou',
                player2Gender: 'male',
                player2Birthdate: '1990-01-08',
                time: '15:00',
                court: 'Court 2',
                status: 'scheduled'
            },
            // Semifinals (2 matches) - Middle Column
            {
                id: 'sf1',
                round: 'Semifinal',
                roundTh: 'รอบรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'W. Quarterfinal 1',
                player2: 'W. Quarterfinal 2',
                time: 'TBD',
                court: 'TBD',
                status: 'scheduled'
            },
            {
                id: 'sf2',
                round: 'Semifinal',
                roundTh: 'รอบรองชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'W. Quarterfinal 3',
                player2: 'W. Quarterfinal 4',
                time: 'TBD',
                court: 'TBD',
                status: 'scheduled'
            },
            // Final (1 match) - Right Column
            {
                id: 'f1',
                round: 'Final',
                roundTh: 'รอบชิงชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Kunlavut V.',
                player1Nickname: 'View',
                player1Photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                player1Seed: 3,
                player1Gender: 'male',
                player1Birthdate: '2001-05-11',
                player2: 'Viktor A.',
                player2Nickname: 'Viktor',
                player2Photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                player2Seed: 1,
                player2Gender: 'male',
                player2Birthdate: '1994-01-04',
                time: '18:00',
                court: 'TV Court',
                status: 'completed',
                winner: 1,
                scores: [
                    { player1: 21, player2: 18 },
                    { player1: 18, player2: 21 },
                    { player1: 21, player2: 19 }
                ]
            },
            // Men's Doubles Example
            {
                id: 'md1',
                round: 'Semifinal',
                roundTh: 'รอบรองชนะเลิศ',
                category: "Men's Doubles",
                categoryTh: 'ชายคู่',
                player1: 'Rankireddy S.',
                player1Nickname: 'Satwik',
                player1Gender: 'male',
                player1Birthdate: '2000-08-13',
                player1Partner: 'Shetty C.',
                player1PartnerNickname: 'Chirag',
                player1PartnerGender: 'male',
                player1PartnerBirthdate: '1997-07-04',
                player1PartnerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
                player2: 'Chia A.',
                player2Nickname: 'Aaron',
                player2Gender: 'male',
                player2Birthdate: '1997-02-24',
                player2Partner: 'Soh W. Y.',
                player2PartnerNickname: 'Wooi Yik',
                player2PartnerGender: 'male',
                player2PartnerBirthdate: '1998-02-17',
                player2PartnerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                time: '16:00',
                court: 'Court 1',
                status: 'scheduled'
            },
            // Women's Doubles Example
            {
                id: 'wd1',
                round: 'Final',
                roundTh: 'รอบชิงชนะเลิศ',
                category: "Women's Doubles",
                categoryTh: 'หญิงคู่',
                player1: 'Kititharakul J.',
                player1Nickname: 'Gift',
                player1Gender: 'female',
                player1Birthdate: '1992-12-07',
                player1Partner: 'Prajongjai R.',
                player1PartnerNickname: 'View',
                player1PartnerGender: 'female',
                player1PartnerBirthdate: '1993-09-22',
                player1PartnerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                player2: 'Lambert M.',
                player2Nickname: 'Margot',
                player2Gender: 'female',
                player2Birthdate: '1999-03-15',
                player2Partner: 'Tran A.',
                player2PartnerNickname: 'Anne',
                player2PartnerGender: 'female',
                player2PartnerBirthdate: '1996-04-27',
                player2PartnerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
                time: '13:00',
                court: 'TV Court',
                status: 'completed',
                winner: 1,
                scores: [
                    { player1: 21, player2: 19 },
                    { player1: 21, player2: 19 }
                ]
            }
        ],
        contactEmail: 'bwf@reachbadminton.com'
    },
    {
        id: 'reach-christmas-2025',
        name: 'REACH Christmas Championship 2025',
        nameTh: 'REACH คริสต์มาส แชมป์เปี้ยนชิพ 2025',
        dateStart: '2025-12-20',
        dateEnd: '2025-12-22',
        timeStart: '08:00',
        timeEnd: '19:00',
        location: {
            country: 'Thailand',
            countryTh: 'ประเทศไทย',
            city: 'Chiang Mai',
            cityTh: 'เชียงใหม่',
            venue: 'Chiang Mai International Convention Centre',
            venueTh: 'ศูนย์ประชุมและแสดงสินค้านานาชาติเชียงใหม่',
            address: '456 Charoen Prathet Rd, T. Chang Klan, Muang, Chiang Mai 50100',
            addressTh: '456 ถนนเจริญประเทศ ตำบลช้างคลาน อำเภอเมือง เชียงใหม่ 50100'
        },
        prize: '฿150,000',
        participants: 200,
        registeredCount: 200,
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        categories: ["Men's Singles", "Women's Singles", "Mixed Doubles"],
        categoriesTh: ['ชายเดี่ยว', 'หญิงเดี่ยว', 'คู่ผสม'],
        description: 'A festive tournament celebrating the holiday season with exciting badminton action.',
        descriptionTh: 'การแข่งขันฉลองเทศกาลปีใหม่ด้วยความตื่นเต้นของกีฬาแบดมินตัน',
        matches: [
            {
                id: 'f1',
                round: 'Final',
                roundTh: 'รอบชิงชนะเลิศ',
                category: "Men's Singles",
                categoryTh: 'ชายเดี่ยว',
                player1: 'Sitthikom Thammasin',
                player2: 'Kantaphon Wangcharoen',
                score: '21-15, 21-18',
                winner: 1,
                time: '16:00',
                court: 'Court 1',
                status: 'completed'
            },
            {
                id: 'f2',
                round: 'Final',
                roundTh: 'รอบชิงชนะเลิศ',
                category: "Women's Singles",
                categoryTh: 'หญิงเดี่ยว',
                player1: 'Busanan Ongbamrungphan',
                player2: 'Pornpawee Chochuwong',
                score: '21-19, 19-21, 21-17',
                winner: 2,
                time: '17:30',
                court: 'Court 1',
                status: 'completed'
            }
        ],
        contactEmail: 'events@reachbadminton.com'
    }
];

export function getTournamentById(id: string): Tournament | undefined {
    return tournaments.find(t => t.id === id);
}

export function getTournamentsByStatus(status: TournamentStatus): Tournament[] {
    return tournaments.filter(t => t.status === status);
}
