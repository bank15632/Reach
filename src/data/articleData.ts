export interface ArticleSection {
    title: string;
    titleEn: string;
    content: string;
    contentEn: string;
    image: string;
}

export interface Article {
    id: string;
    title: string;
    titleEn: string;
    excerpt: string;
    excerptEn: string;
    heroImage: string;
    image?: string;
    category: string;
    categoryTh: string;
    date: string;
    sections: ArticleSection[];
}

export const articles: Article[] = [
    {
        id: 'choose-racket',
        title: 'วิธีเลือกไม้แบดให้เหมาะกับคุณ',
        titleEn: 'How to Choose the Right Badminton Racket',
        excerpt: 'เลือกน้ำหนัก บาลานซ์ และความยืดหยุ่นให้เหมาะกับสไตล์การเล่นของคุณ',
        excerptEn: 'Match weight, balance, and flex to your personal play style.',
        heroImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        category: 'Guide',
        categoryTh: 'คู่มือ',
        date: '2024-02-01',
        sections: [
            {
                title: 'กำหนดสไตล์การเล่น',
                titleEn: 'Define Your Play Style',
                content: 'ถามตัวเองว่าคุณเป็นสายพลัง สายเร็ว หรือสายคอนโทรล เพราะสไตล์การเล่นจะบอกได้ว่าควรเลือกไม้หนักหัวหรือหัวเบา.',
                contentEn: 'Identify whether you play for power, speed, or control—this guides you toward head-heavy or head-light rackets.',
                image: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?q=80&w=800'
            },
            {
                title: 'น้ำหนักและบาลานซ์',
                titleEn: 'Weight & Balance',
                content: 'ไม้ที่หนักหัวช่วยเพิ่มพลังตบ ส่วนไม้หัวเบาให้ความคล่องตัวสูง เหมาะกับเกมรับและตีเร็ว.',
                contentEn: 'Head-heavy rackets boost smash power, while head-light ones improve speed and defense.',
                image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800'
            },
            {
                title: 'ความยืดหยุ่นของก้าน',
                titleEn: 'Shaft Flex',
                content: 'ก้านแข็งให้ความแม่นยำ เหมาะกับผู้เล่นที่มีเทคนิค ส่วนก้านอ่อนช่วยเพิ่มแรงดีดสำหรับมือใหม่.',
                contentEn: 'Stiff shafts add precision for advanced players, while flexible shafts add repulsion for beginners.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
            }
        ]
    },
    {
        id: 'choose-shoes',
        title: 'การเลือกรองเท้าแบดมินตันที่ใช่',
        titleEn: 'Choosing the Right Badminton Shoes',
        excerpt: 'โฟกัสที่การซัพพอร์ต ความกระชับ และพื้นรองเท้าเพื่อการเคลื่อนที่ที่มั่นคง',
        excerptEn: 'Focus on support, fit, and outsole grip for confident movement.',
        heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
        category: 'Guide',
        categoryTh: 'คู่มือ',
        date: '2024-01-28',
        sections: [
            {
                title: 'การรองรับแรงกระแทก',
                titleEn: 'Cushioning & Impact Support',
                content: 'เลือกพื้นรองเท้าที่ซัพพอร์ตดี ลดแรงกระแทกจากการกระโดดและหยุดกะทันหัน.',
                contentEn: 'Choose cushioning that absorbs impact from jumps and sudden stops.',
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800'
            },
            {
                title: 'ความกระชับและไซส์',
                titleEn: 'Fit & Sizing',
                content: 'รองเท้าควรกระชับพอดี ไม่หลวมเกินไป และเผื่อพื้นที่ปลายนิ้วเล็กน้อย.',
                contentEn: 'Aim for a snug fit with a little toe room—avoid loose shoes to prevent sliding.',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800'
            },
            {
                title: 'พื้นรองเท้าและการยึดเกาะ',
                titleEn: 'Outsole Grip',
                content: 'พื้นยางที่ยึดเกาะดีช่วยให้เปลี่ยนทิศทางได้เร็วโดยไม่ลื่นไถล.',
                contentEn: 'A grippy rubber outsole keeps you stable through quick direction changes.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'
            }
        ]
    },
    {
        id: 'choose-apparel',
        title: 'การเลือกชุดกีฬาให้เล่นคล่องตัว',
        titleEn: 'Choosing Apparel for Mobility',
        excerpt: 'ชุดที่ระบายอากาศดีและยืดหยุ่นจะช่วยให้เล่นได้เต็มประสิทธิภาพ',
        excerptEn: 'Breathable, flexible apparel keeps you moving at full performance.',
        heroImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800',
        category: 'Guide',
        categoryTh: 'คู่มือ',
        date: '2024-01-25',
        sections: [
            {
                title: 'ผ้าและการระบายอากาศ',
                titleEn: 'Fabric & Breathability',
                content: 'เลือกผ้าแห้งเร็วและระบายอากาศได้ดี เพื่อลดความอับชื้นระหว่างเล่น.',
                contentEn: 'Pick quick-dry, breathable fabrics to keep moisture under control.',
                image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800'
            },
            {
                title: 'ความยืดหยุ่นและทรงเสื้อ',
                titleEn: 'Stretch & Fit',
                content: 'ชุดที่ยืดหยุ่นจะช่วยให้เคลื่อนไหวคล่อง ควรเลือกทรงที่ไม่รัดแน่นเกินไป.',
                contentEn: 'Stretchy apparel supports agility—choose fits that allow a full range of motion.',
                image: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?q=80&w=800'
            },
            {
                title: 'การจัดเลเยอร์',
                titleEn: 'Layering for Courts',
                content: 'ถ้าเล่นในสนามปรับอากาศ ให้พกเสื้อคลุมบางๆ เพื่อคุมอุณหภูมิ.',
                contentEn: 'For air-conditioned courts, add a light layer to regulate body temperature.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'
            }
        ]
    },
    {
        id: 'proper-training',
        title: 'การฝึกซ้อมที่ถูกต้องสำหรับนักแบด',
        titleEn: 'Proper Training for Badminton Players',
        excerpt: 'สร้างตารางฝึกที่มีวอร์มอัพ ฝึกทักษะ และฟื้นฟูอย่างครบถ้วน',
        excerptEn: 'Build training that balances warm-up, drills, and recovery.',
        heroImage: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        category: 'Training',
        categoryTh: 'การฝึก',
        date: '2024-01-22',
        sections: [
            {
                title: 'วอร์มอัพและยืดเหยียด',
                titleEn: 'Warm-up & Mobility',
                content: 'วอร์มอัพ 10-15 นาทีด้วยการวิ่งเบาๆ และยืดเหยียดแบบไดนามิก เพื่อป้องกันการบาดเจ็บ.',
                contentEn: 'Warm up for 10–15 minutes with light cardio and dynamic stretches to prevent injury.',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800'
            },
            {
                title: 'ฝึกฟุตเวิร์คและจังหวะ',
                titleEn: 'Footwork & Timing Drills',
                content: 'ฝึกการก้าวเท้า 6 มุมและการตีตามจังหวะ เพื่อเพิ่มความเร็วและความแม่นยำ.',
                contentEn: 'Practice six-corner footwork and timing drills to improve speed and accuracy.',
                image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800'
            },
            {
                title: 'การพักฟื้นและโภชนาการ',
                titleEn: 'Recovery & Nutrition',
                content: 'พักผ่อนให้พอ ดื่มน้ำ และเติมคาร์โบไฮเดรต/โปรตีนหลังซ้อมเพื่อฟื้นตัวเร็วขึ้น.',
                contentEn: 'Prioritize sleep, hydration, and post-training carbs/protein for faster recovery.',
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800'
            }
        ]
    },
    {
        id: 'choosing-right-racket',
        title: 'วิธีเลือกไม้แบดให้เหมาะกับสไตล์การเล่น',
        titleEn: 'How to Choose the Right Racket for Your Play Style',
        excerpt: 'เรียนรู้วิธีเลือกไม้แบดที่เหมาะกับคุณ ไม่ว่าจะเป็นสายพลัง สายเร็ว หรือสายคอนโทรล',
        excerptEn: 'Learn how to choose the right racket for you, whether you prefer power, speed, or control.',
        heroImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        category: 'Tips',
        categoryTh: 'เคล็ดลับ',
        date: '2024-01-10',
        sections: [
            {
                title: 'ทำความเข้าใจสไตล์การเล่นของคุณ',
                titleEn: 'Understanding Your Play Style',
                content: 'ก่อนเลือกไม้แบด สิ่งสำคัญที่สุดคือการรู้ว่าคุณเป็นนักเล่นแบบไหน สายพลังที่ชอบตบสแมช สายเร็วที่เน้นความคล่องตัว หรือสายคอนโทรลที่ต้องการความแม่นยำ',
                contentEn: 'Before choosing a racket, the most important thing is knowing what type of player you are. Are you a power player who loves smashing, a speed player who values agility, or a control player who needs precision?',
                image: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?q=80&w=800'
            },
            {
                title: 'น้ำหนักและบาลานซ์',
                titleEn: 'Weight and Balance',
                content: 'ไม้แบดที่หนักหัว (Head Heavy) เหมาะกับสายพลัง ให้แรงตบที่มากขึ้น ส่วนไม้หนักด้าม (Head Light) เหมาะกับสายเร็วที่ต้องการความคล่องตัวในการรับลูก',
                contentEn: 'Head-heavy rackets are ideal for power players, providing more smash power. Head-light rackets suit speed players who need agility for defensive play.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
            },
            {
                title: 'ความยืดหยุ่นของก้าน',
                titleEn: 'Shaft Flexibility',
                content: 'ก้านแข็ง (Stiff) เหมาะกับผู้เล่นที่มีเทคนิคดีและต้องการความแม่นยำ ก้านอ่อน (Flexible) ช่วยเพิ่มพลังให้ผู้เล่นที่ยังไม่มีสวิงที่แรง',
                contentEn: 'Stiff shafts are for players with good technique who need precision. Flexible shafts help generate power for players who don\'t have a strong swing yet.',
                image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800'
            }
        ]
    },
    {
        id: 'string-tension-guide',
        title: 'ความตึงเอ็นแบบไหนเหมาะกับคุณ?',
        titleEn: 'What String Tension is Right for You?',
        excerpt: 'ค้นพบว่าความตึงเอ็นแบบไหนเหมาะกับระดับฝีมือและสไตล์การเล่นของคุณ',
        excerptEn: 'Discover which string tension suits your skill level and playing style.',
        heroImage: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        category: 'Guide',
        categoryTh: 'คู่มือ',
        date: '2024-01-08',
        sections: [
            {
                title: 'ความตึงเอ็นส่งผลอย่างไร',
                titleEn: 'How String Tension Affects Your Game',
                content: 'ความตึงเอ็นส่งผลโดยตรงต่อความรู้สึกในการตี ยิ่งตึงมากยิ่งควบคุมได้ดี แต่ต้องใช้แรงมากขึ้น ยิ่งหย่อนยิ่งมีพลังแต่ควบคุมยากขึ้น',
                contentEn: 'String tension directly affects your hitting feel. Higher tension means better control but requires more power. Lower tension gives more power but less control.',
                image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800'
            },
            {
                title: 'แนะนำตามระดับฝีมือ',
                titleEn: 'Recommendations by Skill Level',
                content: 'ผู้เริ่มต้น: 20-22 lbs, ระดับกลาง: 23-26 lbs, ระดับสูง: 27-30 lbs หรือมากกว่า ขึ้นอยู่กับความชอบส่วนตัว',
                contentEn: 'Beginners: 20-22 lbs, Intermediate: 23-26 lbs, Advanced: 27-30 lbs or more depending on personal preference.',
                image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800'
            }
        ]
    },
    {
        id: 'warm-up-exercises',
        title: '5 ท่าอบอุ่นร่างกายก่อนเล่นแบด',
        titleEn: '5 Warm-up Exercises Before Playing Badminton',
        excerpt: 'ท่าอบอุ่นร่างกายที่จำเป็นเพื่อป้องกันการบาดเจ็บและเพิ่มประสิทธิภาพการเล่น',
        excerptEn: 'Essential warm-up exercises to prevent injuries and improve your performance.',
        heroImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        category: 'Fitness',
        categoryTh: 'ฟิตเนส',
        date: '2024-01-05',
        sections: [
            {
                title: 'ยืดกล้ามเนื้อไหล่และแขน',
                titleEn: 'Shoulder and Arm Stretches',
                content: 'เริ่มต้นด้วยการยืดกล้ามเนื้อไหล่และแขน วนแขนเป็นวงกลมทั้งหน้าและหลัง ช่วยเตรียมความพร้อมสำหรับการตบและการรับลูก',
                contentEn: 'Start with shoulder and arm stretches. Rotate your arms in circles both forward and backward to prepare for smashing and receiving.',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800'
            },
            {
                title: 'ยืดขาและข้อเท้า',
                titleEn: 'Leg and Ankle Stretches',
                content: 'ย่อตัวและยืดเหยียดขา ให้ความสำคัญกับข้อเท้าเป็นพิเศษ เพราะแบดมินตันต้องเคลื่อนที่อย่างรวดเร็วและหยุดกะทันหัน',
                contentEn: 'Do squats and leg stretches. Pay special attention to ankles as badminton requires quick movements and sudden stops.',
                image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800'
            }
        ]
    },
    {
        id: 'doubles-strategy',
        title: 'กลยุทธ์คู่: ตำแหน่งและการสื่อสาร',
        titleEn: 'Doubles Strategy: Positioning and Communication',
        excerpt: 'เรียนรู้วิธีเล่นคู่ที่มีประสิทธิภาพ ตั้งแต่ตำแหน่ง การสื่อสาร และกลยุทธ์โจมตี',
        excerptEn: 'Learn effective doubles play from positioning, communication, to attack strategies.',
        heroImage: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be6?q=80&w=800',
        category: 'Strategy',
        categoryTh: 'กลยุทธ์',
        date: '2024-01-03',
        sections: [
            {
                title: 'ฟอร์เมชันโจมตีและป้องกัน',
                titleEn: 'Attack and Defense Formations',
                content: 'เมื่อโจมตี ยืนหน้า-หลัง เมื่อป้องกัน ยืนข้าง-ข้าง การเปลี่ยนฟอร์เมชันอย่างรวดเร็วคือกุญแจสู่ชัยชนะ',
                contentEn: 'When attacking, use front-back formation. When defending, use side-by-side. Quick formation changes are key to winning.',
                image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800'
            },
            {
                title: 'การสื่อสารกับคู่',
                titleEn: 'Communication with Your Partner',
                content: 'ใช้สัญญาณมือหรือคำสั้นๆ เช่น "ไป" "ของฉัน" "สลับ" การสื่อสารที่ดีช่วยลดความผิดพลาดและเพิ่มความมั่นใจ',
                contentEn: 'Use hand signals or short words like "go," "mine," "switch." Good communication reduces errors and builds confidence.',
                image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800'
            }
        ]
    },
    {
        id: 'grip-types',
        title: 'ประเภทการจับด้าม: Forehand vs Backhand',
        titleEn: 'Grip Types: Forehand vs Backhand',
        excerpt: 'ทำความเข้าใจการจับด้ามแบบต่างๆ และเมื่อไหร่ควรใช้แบบไหน',
        excerptEn: 'Understand different grip types and when to use each one.',
        heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
        category: 'Technique',
        categoryTh: 'เทคนิค',
        date: '2024-01-01',
        sections: [
            {
                title: 'การจับแบบ Forehand',
                titleEn: 'Forehand Grip',
                content: 'จับเหมือนจับมือทักทาย นิ้วชี้และนิ้วหัวแม่มืออยู่คนละฝั่งของด้าม เหมาะสำหรับตีลูกด้านหน้าและสแมช',
                contentEn: 'Hold like shaking hands. Index finger and thumb on opposite sides of the handle. Ideal for forehand shots and smashes.',
                image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800'
            },
            {
                title: 'การจับแบบ Backhand',
                titleEn: 'Backhand Grip',
                content: 'หมุนด้ามเล็กน้อยให้นิ้วหัวแม่มืออยู่ด้านแบนของด้าม ใช้สำหรับตีลูกด้านหลังและลูกที่มาทางตรงข้าม',
                contentEn: 'Rotate the handle slightly so thumb is on the flat side. Used for backhand shots and balls coming to the opposite side.',
                image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800'
            }
        ]
    },
    {
        id: 'footwork-basics',
        title: 'Footwork พื้นฐานที่ต้องฝึก',
        titleEn: 'Essential Footwork Basics',
        excerpt: 'ฟุตเวิร์คพื้นฐานที่ผู้เล่นทุกระดับควรฝึกเพื่อเพิ่มความเร็วและความคล่องตัว',
        excerptEn: 'Basic footwork every player should practice to improve speed and agility.',
        heroImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        category: 'Training',
        categoryTh: 'การฝึก',
        date: '2023-12-28',
        sections: [
            {
                title: 'ท่ายืนพื้นฐาน',
                titleEn: 'Basic Stance',
                content: 'ยืนแยกขากว้างประมาณไหล่ น้ำหนักอยู่บนปลายเท้า เข่าย่อเล็กน้อย พร้อมเคลื่อนที่ทุกทิศทาง',
                contentEn: 'Stand with feet shoulder-width apart, weight on the balls of your feet, knees slightly bent, ready to move in any direction.',
                image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800'
            },
            {
                title: 'การก้าวเท้า 6 มุม',
                titleEn: 'Six-Corner Footwork',
                content: 'ฝึกก้าวไป 6 มุมของสนาม: หน้าซ้าย หน้ากลาง หน้าขวา หลังซ้าย หลังกลาง หลังขวา แล้วกลับมาตรงกลาง',
                contentEn: 'Practice stepping to 6 corners of the court: front left, front center, front right, back left, back center, back right, then return to center.',
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800'
            }
        ]
    },
    {
        id: 'nutrition-tips',
        title: 'โภชนาการสำหรับนักแบดมินตัน',
        titleEn: 'Nutrition Tips for Badminton Players',
        excerpt: 'อาหารและเครื่องดื่มที่เหมาะสมก่อน ระหว่าง และหลังการเล่นแบดมินตัน',
        excerptEn: 'Proper food and drinks before, during, and after playing badminton.',
        heroImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800',
        category: 'Health',
        categoryTh: 'สุขภาพ',
        date: '2023-12-25',
        sections: [
            {
                title: 'อาหารก่อนเล่น',
                titleEn: 'Pre-Game Nutrition',
                content: 'กินคาร์โบไฮเดรตเชิงซ้อน 2-3 ชั่วโมงก่อนเล่น เช่น ข้าว พาสต้า ขนมปังโฮลเกรน หลีกเลี่ยงอาหารมันและหนัก',
                contentEn: 'Eat complex carbohydrates 2-3 hours before playing, such as rice, pasta, whole grain bread. Avoid fatty and heavy foods.',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800'
            },
            {
                title: 'การดื่มน้ำ',
                titleEn: 'Hydration',
                content: 'ดื่มน้ำ 500ml 2 ชั่วโมงก่อนเล่น และจิบน้ำทุก 15-20 นาทีระหว่างเล่น เครื่องดื่มเกลือแร่ช่วยทดแทนเกลือที่สูญเสียไป',
                contentEn: 'Drink 500ml water 2 hours before playing and sip water every 15-20 minutes during play. Sports drinks help replace lost electrolytes.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800'
            }
        ]
    },
    {
        id: 'smash-technique',
        title: 'เทคนิคตบสแมชให้แรงและแม่น',
        titleEn: 'Smash Technique for Power and Accuracy',
        excerpt: 'วิธีตบสแมชให้ได้พลังสูงสุดพร้อมความแม่นยำ รวมถึงข้อผิดพลาดที่ควรหลีกเลี่ยง',
        excerptEn: 'How to smash with maximum power and accuracy, including common mistakes to avoid.',
        heroImage: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1600',
        image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800',
        category: 'Technique',
        categoryTh: 'เทคนิค',
        date: '2023-12-20',
        sections: [
            {
                title: 'ท่าเตรียมตัว',
                titleEn: 'Preparation Stance',
                content: 'หันข้างให้เน็ต ยกไม้ขึ้นสูงหลังศีรษะ ตามองลูก น้ำหนักอยู่บนขาหลัง พร้อมถ่ายน้ำหนักไปข้างหน้าเมื่อตี',
                contentEn: 'Turn sideways to the net, raise racket high behind your head, eyes on the shuttle, weight on back foot, ready to transfer forward when hitting.',
                image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800'
            },
            {
                title: 'จังหวะการตี',
                titleEn: 'Hitting Timing',
                content: 'ตีลูกที่จุดสูงสุด ใช้การหมุนเอวและไหล่เพื่อเพิ่มพลัง สแนปข้อมือในจังหวะสุดท้ายเพื่อเพิ่มความเร็ว',
                contentEn: 'Hit at the highest point. Use hip and shoulder rotation to add power. Snap wrist at the last moment for extra speed.',
                image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=800'
            }
        ]
    }
];

export function getArticleById(id: string): Article | undefined {
    return articles.find(article => article.id === id);
}

export function getArticlesExcluding(id: string): Article[] {
    return articles.filter(article => article.id !== id);
}
