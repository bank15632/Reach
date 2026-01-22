// Thai Address Data - Provinces, Districts, Subdistricts with Postal Codes
// This is a simplified dataset covering major areas. In production, use a complete database.

export interface Subdistrict {
    name: string;
    nameTh: string;
    postalCode: string;
}

export interface District {
    name: string;
    nameTh: string;
    subdistricts: Subdistrict[];
}

export interface Province {
    name: string;
    nameTh: string;
    districts: District[];
}

export const provinces: Province[] = [
    {
        name: "Bangkok",
        nameTh: "กรุงเทพมหานคร",
        districts: [
            {
                name: "Phra Nakhon",
                nameTh: "พระนคร",
                subdistricts: [
                    { name: "Phra Borom Maha Ratchawang", nameTh: "พระบรมมหาราชวัง", postalCode: "10200" },
                    { name: "Wang Burapha Phirom", nameTh: "วังบูรพาภิรมย์", postalCode: "10200" },
                    { name: "Wat Ratchabophit", nameTh: "วัดราชบพิธ", postalCode: "10200" },
                    { name: "Samran Rat", nameTh: "สำราญราษฎร์", postalCode: "10200" },
                    { name: "San Chaopho Suea", nameTh: "ศาลเจ้าพ่อเสือ", postalCode: "10200" },
                ]
            },
            {
                name: "Dusit",
                nameTh: "ดุสิต",
                subdistricts: [
                    { name: "Dusit", nameTh: "ดุสิต", postalCode: "10300" },
                    { name: "Wachiraphayaban", nameTh: "วชิรพยาบาล", postalCode: "10300" },
                    { name: "Suan Chitlada", nameTh: "สวนจิตรลดา", postalCode: "10300" },
                    { name: "Si Yaek Maha Nak", nameTh: "สี่แยกมหานาค", postalCode: "10300" },
                ]
            },
            {
                name: "Nong Chok",
                nameTh: "หนองจอก",
                subdistricts: [
                    { name: "Krathum Rai", nameTh: "กระทุ่มราย", postalCode: "10530" },
                    { name: "Nong Chok", nameTh: "หนองจอก", postalCode: "10530" },
                    { name: "Khlong Sip", nameTh: "คลองสิบ", postalCode: "10530" },
                    { name: "Khlong Sip Song", nameTh: "คลองสิบสอง", postalCode: "10530" },
                ]
            },
            {
                name: "Bang Rak",
                nameTh: "บางรัก",
                subdistricts: [
                    { name: "Maha Phruettharam", nameTh: "มหาพฤฒาราม", postalCode: "10500" },
                    { name: "Si Lom", nameTh: "สีลม", postalCode: "10500" },
                    { name: "Suriyawong", nameTh: "สุริยวงศ์", postalCode: "10500" },
                    { name: "Bang Rak", nameTh: "บางรัก", postalCode: "10500" },
                    { name: "Si Phraya", nameTh: "สี่พระยา", postalCode: "10500" },
                ]
            },
            {
                name: "Bang Khen",
                nameTh: "บางเขน",
                subdistricts: [
                    { name: "Anusawari", nameTh: "อนุสาวรีย์", postalCode: "10220" },
                    { name: "Tha Raeng", nameTh: "ท่าแร้ง", postalCode: "10220" },
                ]
            },
            {
                name: "Bang Kapi",
                nameTh: "บางกะปิ",
                subdistricts: [
                    { name: "Khlong Chan", nameTh: "คลองจั่น", postalCode: "10240" },
                    { name: "Hua Mak", nameTh: "หัวหมาก", postalCode: "10240" },
                ]
            },
            {
                name: "Pathum Wan",
                nameTh: "ปทุมวัน",
                subdistricts: [
                    { name: "Rong Muang", nameTh: "รองเมือง", postalCode: "10330" },
                    { name: "Wang Mai", nameTh: "วังใหม่", postalCode: "10330" },
                    { name: "Pathum Wan", nameTh: "ปทุมวัน", postalCode: "10330" },
                    { name: "Lumphini", nameTh: "ลุมพินี", postalCode: "10330" },
                ]
            },
            {
                name: "Pom Prap Sattru Phai",
                nameTh: "ป้อมปราบศัตรูพ่าย",
                subdistricts: [
                    { name: "Pom Prap", nameTh: "ป้อมปราบ", postalCode: "10100" },
                    { name: "Wat Thep Sirin", nameTh: "วัดเทพศิรินทร์", postalCode: "10100" },
                    { name: "Khlong Maha Nak", nameTh: "คลองมหานาค", postalCode: "10100" },
                    { name: "Ban Bat", nameTh: "บ้านบาตร", postalCode: "10100" },
                    { name: "Wat Sommanat", nameTh: "วัดโสมนัส", postalCode: "10100" },
                ]
            },
            {
                name: "Phra Khanong",
                nameTh: "พระโขนง",
                subdistricts: [
                    { name: "Bang Chak", nameTh: "บางจาก", postalCode: "10260" },
                    { name: "Phra Khanong Nuea", nameTh: "พระโขนงเหนือ", postalCode: "10260" },
                ]
            },
            {
                name: "Min Buri",
                nameTh: "มีนบุรี",
                subdistricts: [
                    { name: "Min Buri", nameTh: "มีนบุรี", postalCode: "10510" },
                    { name: "Saen Saep", nameTh: "แสนแสบ", postalCode: "10510" },
                ]
            },
            {
                name: "Lat Krabang",
                nameTh: "ลาดกระบัง",
                subdistricts: [
                    { name: "Lat Krabang", nameTh: "ลาดกระบัง", postalCode: "10520" },
                    { name: "Khlong Song Ton Nun", nameTh: "คลองสองต้นนุ่น", postalCode: "10520" },
                    { name: "Khlong Sam Prawet", nameTh: "คลองสามประเวศ", postalCode: "10520" },
                    { name: "Lam Pla Thio", nameTh: "ลำปลาทิว", postalCode: "10520" },
                    { name: "Thap Yao", nameTh: "ทับยาว", postalCode: "10520" },
                    { name: "Khum Thong", nameTh: "ขุมทอง", postalCode: "10520" },
                ]
            },
            {
                name: "Yan Nawa",
                nameTh: "ยานนาวา",
                subdistricts: [
                    { name: "Chong Nonsi", nameTh: "ช่องนนทรี", postalCode: "10120" },
                    { name: "Bang Phongphang", nameTh: "บางโพงพาง", postalCode: "10120" },
                ]
            },
            {
                name: "Samphanthawong",
                nameTh: "สัมพันธวงศ์",
                subdistricts: [
                    { name: "Chakkrawat", nameTh: "จักรวรรดิ", postalCode: "10100" },
                    { name: "Samphanthawong", nameTh: "สัมพันธวงศ์", postalCode: "10100" },
                    { name: "Talat Noi", nameTh: "ตลาดน้อย", postalCode: "10100" },
                ]
            },
            {
                name: "Phaya Thai",
                nameTh: "พญาไท",
                subdistricts: [
                    { name: "Sam Sen Nai", nameTh: "สามเสนใน", postalCode: "10400" },
                    { name: "Phaya Thai", nameTh: "พญาไท", postalCode: "10400" },
                ]
            },
            {
                name: "Thon Buri",
                nameTh: "ธนบุรี",
                subdistricts: [
                    { name: "Wat Kanlaya", nameTh: "วัดกัลยาณ์", postalCode: "10600" },
                    { name: "Hiran Ruchi", nameTh: "หิรัญรูจี", postalCode: "10600" },
                    { name: "Bang Yi Ruea", nameTh: "บางยี่เรือ", postalCode: "10600" },
                    { name: "Bukkhalo", nameTh: "บุคคโล", postalCode: "10600" },
                    { name: "Talat Phlu", nameTh: "ตลาดพลู", postalCode: "10600" },
                    { name: "Dao Khanong", nameTh: "ดาวคะนอง", postalCode: "10600" },
                    { name: "Samre", nameTh: "สำเหร่", postalCode: "10600" },
                ]
            },
            {
                name: "Bangkok Yai",
                nameTh: "บางกอกใหญ่",
                subdistricts: [
                    { name: "Wat Arun", nameTh: "วัดอรุณ", postalCode: "10600" },
                    { name: "Wat Tha Phra", nameTh: "วัดท่าพระ", postalCode: "10600" },
                ]
            },
            {
                name: "Huai Khwang",
                nameTh: "ห้วยขวาง",
                subdistricts: [
                    { name: "Huai Khwang", nameTh: "ห้วยขวาง", postalCode: "10310" },
                    { name: "Bang Kapi", nameTh: "บางกะปิ", postalCode: "10310" },
                    { name: "Sam Sen Nok", nameTh: "สามเสนนอก", postalCode: "10310" },
                ]
            },
            {
                name: "Khlong San",
                nameTh: "คลองสาน",
                subdistricts: [
                    { name: "Somdet Chao Phraya", nameTh: "สมเด็จเจ้าพระยา", postalCode: "10600" },
                    { name: "Khlong San", nameTh: "คลองสาน", postalCode: "10600" },
                    { name: "Bang Lamphu Lang", nameTh: "บางลำภูล่าง", postalCode: "10600" },
                    { name: "Khlong Ton Sai", nameTh: "คลองต้นไทร", postalCode: "10600" },
                ]
            },
            {
                name: "Taling Chan",
                nameTh: "ตลิ่งชัน",
                subdistricts: [
                    { name: "Khlong Chak Phra", nameTh: "คลองชักพระ", postalCode: "10170" },
                    { name: "Taling Chan", nameTh: "ตลิ่งชัน", postalCode: "10170" },
                    { name: "Chim Phli", nameTh: "ฉิมพลี", postalCode: "10170" },
                    { name: "Bang Phrom", nameTh: "บางพรม", postalCode: "10170" },
                    { name: "Bang Ramat", nameTh: "บางระมาด", postalCode: "10170" },
                    { name: "Bang Chueak Nang", nameTh: "บางเชือกหนัง", postalCode: "10170" },
                ]
            },
            {
                name: "Bangkok Noi",
                nameTh: "บางกอกน้อย",
                subdistricts: [
                    { name: "Siri Rat", nameTh: "ศิริราช", postalCode: "10700" },
                    { name: "Ban Chang Lo", nameTh: "บ้านช่างหล่อ", postalCode: "10700" },
                    { name: "Bang Khun Non", nameTh: "บางขุนนนท์", postalCode: "10700" },
                    { name: "Bang Khun Si", nameTh: "บางขุนศรี", postalCode: "10700" },
                    { name: "Arun Amarin", nameTh: "อรุณอมรินทร์", postalCode: "10700" },
                ]
            },
            {
                name: "Bang Khun Thian",
                nameTh: "บางขุนเทียน",
                subdistricts: [
                    { name: "Tha Kham", nameTh: "ท่าข้าม", postalCode: "10150" },
                    { name: "Samae Dam", nameTh: "แสมดำ", postalCode: "10150" },
                ]
            },
            {
                name: "Phasi Charoen",
                nameTh: "ภาษีเจริญ",
                subdistricts: [
                    { name: "Bang Wa", nameTh: "บางหว้า", postalCode: "10160" },
                    { name: "Bang Duan", nameTh: "บางด้วน", postalCode: "10160" },
                    { name: "Bang Chak", nameTh: "บางจาก", postalCode: "10160" },
                    { name: "Bang Waek", nameTh: "บางแวก", postalCode: "10160" },
                    { name: "Khlong Khwang", nameTh: "คลองขวาง", postalCode: "10160" },
                    { name: "Pak Khlong Phasi Charoen", nameTh: "ปากคลองภาษีเจริญ", postalCode: "10160" },
                    { name: "Khuha Sawan", nameTh: "คูหาสวรรค์", postalCode: "10160" },
                ]
            },
            {
                name: "Nong Khaem",
                nameTh: "หนองแขม",
                subdistricts: [
                    { name: "Nong Khaem", nameTh: "หนองแขม", postalCode: "10160" },
                    { name: "Nong Khang Phlu", nameTh: "หนองค้างพลู", postalCode: "10160" },
                ]
            },
            {
                name: "Rat Burana",
                nameTh: "ราษฎร์บูรณะ",
                subdistricts: [
                    { name: "Rat Burana", nameTh: "ราษฎร์บูรณะ", postalCode: "10140" },
                    { name: "Bang Pakok", nameTh: "บางปะกอก", postalCode: "10140" },
                ]
            },
            {
                name: "Bang Phlat",
                nameTh: "บางพลัด",
                subdistricts: [
                    { name: "Bang Phlat", nameTh: "บางพลัด", postalCode: "10700" },
                    { name: "Bang O", nameTh: "บางอ้อ", postalCode: "10700" },
                    { name: "Bang Bamru", nameTh: "บางบำหรุ", postalCode: "10700" },
                    { name: "Bang Yi Khan", nameTh: "บางยี่ขัน", postalCode: "10700" },
                ]
            },
            {
                name: "Din Daeng",
                nameTh: "ดินแดง",
                subdistricts: [
                    { name: "Din Daeng", nameTh: "ดินแดง", postalCode: "10400" },
                    { name: "Ratchadaphisek", nameTh: "รัชดาภิเษก", postalCode: "10400" },
                ]
            },
            {
                name: "Bueng Kum",
                nameTh: "บึงกุ่ม",
                subdistricts: [
                    { name: "Khlong Kum", nameTh: "คลองกุ่ม", postalCode: "10230" },
                    { name: "Nawamin", nameTh: "นวมินทร์", postalCode: "10230" },
                    { name: "Nuanchan", nameTh: "นวลจันทร์", postalCode: "10230" },
                ]
            },
            {
                name: "Sathon",
                nameTh: "สาทร",
                subdistricts: [
                    { name: "Thung Maha Mek", nameTh: "ทุ่งมหาเมฆ", postalCode: "10120" },
                    { name: "Yan Nawa", nameTh: "ยานนาวา", postalCode: "10120" },
                    { name: "Thung Wat Don", nameTh: "ทุ่งวัดดอน", postalCode: "10120" },
                ]
            },
            {
                name: "Bang Sue",
                nameTh: "บางซื่อ",
                subdistricts: [
                    { name: "Bang Sue", nameTh: "บางซื่อ", postalCode: "10800" },
                    { name: "Wong Sawang", nameTh: "วงศ์สว่าง", postalCode: "10800" },
                ]
            },
            {
                name: "Chatuchak",
                nameTh: "จตุจักร",
                subdistricts: [
                    { name: "Lat Yao", nameTh: "ลาดยาว", postalCode: "10900" },
                    { name: "Sena Nikhom", nameTh: "เสนานิคม", postalCode: "10900" },
                    { name: "Chan Kasem", nameTh: "จันทรเกษม", postalCode: "10900" },
                    { name: "Chomphon", nameTh: "จอมพล", postalCode: "10900" },
                    { name: "Chatuchak", nameTh: "จตุจักร", postalCode: "10900" },
                ]
            },
            {
                name: "Bang Kho Laem",
                nameTh: "บางคอแหลม",
                subdistricts: [
                    { name: "Bang Kho Laem", nameTh: "บางคอแหลม", postalCode: "10120" },
                    { name: "Wat Phraya Krai", nameTh: "วัดพระยาไกร", postalCode: "10120" },
                    { name: "Bang Khlo", nameTh: "บางโคล่", postalCode: "10120" },
                ]
            },
            {
                name: "Prawet",
                nameTh: "ประเวศ",
                subdistricts: [
                    { name: "Prawet", nameTh: "ประเวศ", postalCode: "10250" },
                    { name: "Nong Bon", nameTh: "หนองบอน", postalCode: "10250" },
                    { name: "Dok Mai", nameTh: "ดอกไม้", postalCode: "10250" },
                ]
            },
            {
                name: "Khlong Toei",
                nameTh: "คลองเตย",
                subdistricts: [
                    { name: "Khlong Toei", nameTh: "คลองเตย", postalCode: "10110" },
                    { name: "Khlong Tan", nameTh: "คลองตัน", postalCode: "10110" },
                    { name: "Phra Khanong", nameTh: "พระโขนง", postalCode: "10110" },
                ]
            },
            {
                name: "Suan Luang",
                nameTh: "สวนหลวง",
                subdistricts: [
                    { name: "Suan Luang", nameTh: "สวนหลวง", postalCode: "10250" },
                    { name: "On Nut", nameTh: "อ่อนนุช", postalCode: "10250" },
                    { name: "Phatthanakan", nameTh: "พัฒนาการ", postalCode: "10250" },
                ]
            },
            {
                name: "Chom Thong",
                nameTh: "จอมทอง",
                subdistricts: [
                    { name: "Bang Kho", nameTh: "บางค้อ", postalCode: "10150" },
                    { name: "Bang Mot", nameTh: "บางมด", postalCode: "10150" },
                    { name: "Chom Thong", nameTh: "จอมทอง", postalCode: "10150" },
                    { name: "Bang Khun Thian", nameTh: "บางขุนเทียน", postalCode: "10150" },
                ]
            },
            {
                name: "Don Mueang",
                nameTh: "ดอนเมือง",
                subdistricts: [
                    { name: "Si Kan", nameTh: "สีกัน", postalCode: "10210" },
                    { name: "Don Mueang", nameTh: "ดอนเมือง", postalCode: "10210" },
                    { name: "Sanam Bin", nameTh: "สนามบิน", postalCode: "10210" },
                ]
            },
            {
                name: "Ratchathewi",
                nameTh: "ราชเทวี",
                subdistricts: [
                    { name: "Thanon Phetchaburi", nameTh: "ถนนเพชรบุรี", postalCode: "10400" },
                    { name: "Thanon Phaya Thai", nameTh: "ถนนพญาไท", postalCode: "10400" },
                    { name: "Makkasan", nameTh: "มักกะสัน", postalCode: "10400" },
                    { name: "Ratchathewi", nameTh: "ราชเทวี", postalCode: "10400" },
                ]
            },
            {
                name: "Lat Phrao",
                nameTh: "ลาดพร้าว",
                subdistricts: [
                    { name: "Lat Phrao", nameTh: "ลาดพร้าว", postalCode: "10230" },
                    { name: "Chorakhe Bua", nameTh: "จรเข้บัว", postalCode: "10230" },
                ]
            },
            {
                name: "Watthana",
                nameTh: "วัฒนา",
                subdistricts: [
                    { name: "Khlong Toei Nuea", nameTh: "คลองเตยเหนือ", postalCode: "10110" },
                    { name: "Khlong Tan Nuea", nameTh: "คลองตันเหนือ", postalCode: "10110" },
                    { name: "Phra Khanong Nuea", nameTh: "พระโขนงเหนือ", postalCode: "10110" },
                ]
            },
            {
                name: "Bang Kae",
                nameTh: "บางแค",
                subdistricts: [
                    { name: "Bang Kae", nameTh: "บางแค", postalCode: "10160" },
                    { name: "Bang Kae Nuea", nameTh: "บางแคเหนือ", postalCode: "10160" },
                    { name: "Bang Khae Yai", nameTh: "บางไผ่", postalCode: "10160" },
                    { name: "Lak Song", nameTh: "หลักสอง", postalCode: "10160" },
                ]
            },
            {
                name: "Lak Si",
                nameTh: "หลักสี่",
                subdistricts: [
                    { name: "Thung Song Hong", nameTh: "ทุ่งสองห้อง", postalCode: "10210" },
                    { name: "Talat Bang Khen", nameTh: "ตลาดบางเขน", postalCode: "10210" },
                ]
            },
            {
                name: "Sai Mai",
                nameTh: "สายไหม",
                subdistricts: [
                    { name: "Sai Mai", nameTh: "สายไหม", postalCode: "10220" },
                    { name: "O Ngoen", nameTh: "ออเงิน", postalCode: "10220" },
                    { name: "Khlong Thanon", nameTh: "คลองถนน", postalCode: "10220" },
                ]
            },
            {
                name: "Khan Na Yao",
                nameTh: "คันนายาว",
                subdistricts: [
                    { name: "Khan Na Yao", nameTh: "คันนายาว", postalCode: "10230" },
                    { name: "Ram Inthra", nameTh: "รามอินทรา", postalCode: "10230" },
                ]
            },
            {
                name: "Saphan Sung",
                nameTh: "สะพานสูง",
                subdistricts: [
                    { name: "Saphan Sung", nameTh: "สะพานสูง", postalCode: "10240" },
                    { name: "Rat Phatthana", nameTh: "ราษฎร์พัฒนา", postalCode: "10240" },
                    { name: "Thap Chang", nameTh: "ทับช้าง", postalCode: "10250" },
                ]
            },
            {
                name: "Wang Thonglang",
                nameTh: "วังทองหลาง",
                subdistricts: [
                    { name: "Wang Thonglang", nameTh: "วังทองหลาง", postalCode: "10310" },
                    { name: "Saphan Song", nameTh: "สะพานสอง", postalCode: "10310" },
                    { name: "Khlong Chaokhun Sing", nameTh: "คลองเจ้าคุณสิงห์", postalCode: "10310" },
                    { name: "Phlab Phla", nameTh: "พลับพลา", postalCode: "10310" },
                ]
            },
            {
                name: "Khlong Sam Wa",
                nameTh: "คลองสามวา",
                subdistricts: [
                    { name: "Sam Wa Tawan Ok", nameTh: "สามวาตะวันออก", postalCode: "10510" },
                    { name: "Sam Wa Tawan Tok", nameTh: "สามวาตะวันตก", postalCode: "10510" },
                    { name: "Bang Chan", nameTh: "บางชัน", postalCode: "10510" },
                    { name: "Sai Kong Din", nameTh: "ทรายกองดิน", postalCode: "10510" },
                    { name: "Tha Raeng", nameTh: "ทรายกองดินใต้", postalCode: "10510" },
                ]
            },
            {
                name: "Bang Na",
                nameTh: "บางนา",
                subdistricts: [
                    { name: "Bang Na", nameTh: "บางนา", postalCode: "10260" },
                ]
            },
            {
                name: "Thawi Watthana",
                nameTh: "ทวีวัฒนา",
                subdistricts: [
                    { name: "Thawi Watthana", nameTh: "ทวีวัฒนา", postalCode: "10170" },
                    { name: "Sala Thammasop", nameTh: "ศาลาธรรมสพน์", postalCode: "10170" },
                ]
            },
            {
                name: "Thung Khru",
                nameTh: "ทุ่งครุ",
                subdistricts: [
                    { name: "Bang Mot", nameTh: "บางมด", postalCode: "10140" },
                    { name: "Thung Khru", nameTh: "ทุ่งครุ", postalCode: "10140" },
                ]
            },
            {
                name: "Bang Bon",
                nameTh: "บางบอน",
                subdistricts: [
                    { name: "Bang Bon", nameTh: "บางบอน", postalCode: "10150" },
                    { name: "Bang Bon Nuea", nameTh: "บางบอนเหนือ", postalCode: "10150" },
                    { name: "Bang Bon Tai", nameTh: "บางบอนใต้", postalCode: "10150" },
                    { name: "Khlong Bang Phran", nameTh: "คลองบางพราน", postalCode: "10150" },
                    { name: "Khlong Bang Bon", nameTh: "คลองบางบอน", postalCode: "10150" },
                ]
            },
        ]
    },
    {
        name: "Nonthaburi",
        nameTh: "นนทบุรี",
        districts: [
            {
                name: "Mueang Nonthaburi",
                nameTh: "เมืองนนทบุรี",
                subdistricts: [
                    { name: "Suan Yai", nameTh: "สวนใหญ่", postalCode: "11000" },
                    { name: "Talat Khwan", nameTh: "ตลาดขวัญ", postalCode: "11000" },
                    { name: "Bang Kra So", nameTh: "บางกระสอ", postalCode: "11000" },
                    { name: "Tha Sai", nameTh: "ท่าทราย", postalCode: "11000" },
                    { name: "Bang Si Mueang", nameTh: "บางศรีเมือง", postalCode: "11000" },
                    { name: "Bang Kruat", nameTh: "บางกร่าง", postalCode: "11000" },
                    { name: "Sai Ma", nameTh: "ไทรม้า", postalCode: "11000" },
                    { name: "Bang Rak Noi", nameTh: "บางรักน้อย", postalCode: "11000" },
                    { name: "Bang Rak Yai", nameTh: "บางรักใหญ่", postalCode: "11000" },
                    { name: "Bang Mae Nang", nameTh: "บางแม่นาง", postalCode: "11000" },
                ]
            },
            {
                name: "Bang Kruai",
                nameTh: "บางกรวย",
                subdistricts: [
                    { name: "Wat Chalo", nameTh: "วัดชลอ", postalCode: "11130" },
                    { name: "Bang Kruai", nameTh: "บางกรวย", postalCode: "11130" },
                    { name: "Bang Si Thong", nameTh: "บางสีทอง", postalCode: "11130" },
                    { name: "Bang Khanun", nameTh: "บางขนุน", postalCode: "11130" },
                    { name: "Bang Khun Kong", nameTh: "บางขุนกอง", postalCode: "11130" },
                    { name: "Sak Yai", nameTh: "ศาลากลาง", postalCode: "11130" },
                    { name: "Bang Khu Wiang", nameTh: "บางคูเวียง", postalCode: "11130" },
                    { name: "Maha Sawat", nameTh: "มหาสวัสดิ์", postalCode: "11130" },
                    { name: "Pla Lat", nameTh: "ปลายบาง", postalCode: "11130" },
                ]
            },
            {
                name: "Bang Yai",
                nameTh: "บางใหญ่",
                subdistricts: [
                    { name: "Bang Yai", nameTh: "บางใหญ่", postalCode: "11140" },
                    { name: "Bang Mae Nang", nameTh: "บางแม่นาง", postalCode: "11140" },
                    { name: "Bang Len", nameTh: "บางเลน", postalCode: "11140" },
                    { name: "Sao Thong Hin", nameTh: "เสาธงหิน", postalCode: "11140" },
                    { name: "Bang Rak Phatthana", nameTh: "บางรักพัฒนา", postalCode: "11140" },
                    { name: "Ao Phikun", nameTh: "อ้อมเกร็ด", postalCode: "11140" },
                ]
            },
            {
                name: "Bang Bua Thong",
                nameTh: "บางบัวทอง",
                subdistricts: [
                    { name: "Phra Udom", nameTh: "โสนลอย", postalCode: "11110" },
                    { name: "Bang Bua Thong", nameTh: "บางบัวทอง", postalCode: "11110" },
                    { name: "Bang Khu Rat", nameTh: "บางคูรัด", postalCode: "11110" },
                    { name: "Lahan", nameTh: "ละหาร", postalCode: "11110" },
                    { name: "Lam Pho", nameTh: "ลำโพ", postalCode: "11110" },
                    { name: "Phimon Rat", nameTh: "พิมลราช", postalCode: "11110" },
                    { name: "Bang Rak Noi", nameTh: "บางรักใหญ่", postalCode: "11110" },
                    { name: "Bang Phlu", nameTh: "บางพลู", postalCode: "11110" },
                ]
            },
            {
                name: "Sai Noi",
                nameTh: "ไทรน้อย",
                subdistricts: [
                    { name: "Sai Noi", nameTh: "ไทรน้อย", postalCode: "11150" },
                    { name: "Rai Noi", nameTh: "ราษฎร์นิยม", postalCode: "11150" },
                    { name: "Khlong Khwang", nameTh: "คลองขวาง", postalCode: "11150" },
                    { name: "Thawi Watthana", nameTh: "ทวีวัฒนา", postalCode: "11150" },
                    { name: "Nong Phrao", nameTh: "หนองเพรางาย", postalCode: "11150" },
                    { name: "Khun Si", nameTh: "ขุนศรี", postalCode: "11150" },
                    { name: "Sai Yai", nameTh: "ไทรใหญ่", postalCode: "11150" },
                ]
            },
            {
                name: "Pak Kret",
                nameTh: "ปากเกร็ด",
                subdistricts: [
                    { name: "Pak Kret", nameTh: "ปากเกร็ด", postalCode: "11120" },
                    { name: "Bang Phood", nameTh: "บางพูด", postalCode: "11120" },
                    { name: "Bang Talat", nameTh: "บางตลาด", postalCode: "11120" },
                    { name: "Ban Mai", nameTh: "บ้านใหม่", postalCode: "11120" },
                    { name: "Khlong Kluea", nameTh: "คลองเกลือ", postalCode: "11120" },
                    { name: "Tha It", nameTh: "ท่าอิฐ", postalCode: "11120" },
                    { name: "Ko Kret", nameTh: "เกาะเกร็ด", postalCode: "11120" },
                    { name: "Khlong Phra Udom", nameTh: "คลองพระอุดม", postalCode: "11120" },
                    { name: "Bang Tanai", nameTh: "บางตะไนย์", postalCode: "11120" },
                    { name: "Khlong Khoi", nameTh: "คลองข่อย", postalCode: "11120" },
                    { name: "Om Kret", nameTh: "อ้อมเกร็ด", postalCode: "11120" },
                    { name: "Bang Phut", nameTh: "บางพลับ", postalCode: "11120" },
                ]
            },
        ]
    },
    {
        name: "Pathum Thani",
        nameTh: "ปทุมธานี",
        districts: [
            {
                name: "Mueang Pathum Thani",
                nameTh: "เมืองปทุมธานี",
                subdistricts: [
                    { name: "Bang Kadi", nameTh: "บางขะแยง", postalCode: "12000" },
                    { name: "Bang Khu Wat", nameTh: "บางคูวัด", postalCode: "12000" },
                    { name: "Bang Luang", nameTh: "บางหลวง", postalCode: "12000" },
                    { name: "Bang Phun", nameTh: "บางพูน", postalCode: "12000" },
                    { name: "Ban Klang", nameTh: "บ้านกลาง", postalCode: "12000" },
                    { name: "Ban Chang", nameTh: "บ้านฉาง", postalCode: "12000" },
                ]
            },
            {
                name: "Khlong Luang",
                nameTh: "คลองหลวง",
                subdistricts: [
                    { name: "Khlong Nueng", nameTh: "คลองหนึ่ง", postalCode: "12120" },
                    { name: "Khlong Song", nameTh: "คลองสอง", postalCode: "12120" },
                    { name: "Khlong Sam", nameTh: "คลองสาม", postalCode: "12120" },
                    { name: "Khlong Si", nameTh: "คลองสี่", postalCode: "12120" },
                    { name: "Khlong Ha", nameTh: "คลองห้า", postalCode: "12120" },
                    { name: "Khlong Hok", nameTh: "คลองหก", postalCode: "12120" },
                    { name: "Khlong Chet", nameTh: "คลองเจ็ด", postalCode: "12120" },
                ]
            },
            {
                name: "Thanyaburi",
                nameTh: "ธัญบุรี",
                subdistricts: [
                    { name: "Prachathipat", nameTh: "ประชาธิปัตย์", postalCode: "12130" },
                    { name: "Bueng Yitho", nameTh: "บึงยี่โถ", postalCode: "12130" },
                    { name: "Rangsit", nameTh: "รังสิต", postalCode: "12110" },
                    { name: "Lam Phak Kut", nameTh: "ลำผักกูด", postalCode: "12110" },
                    { name: "Bueng Sanan", nameTh: "บึงสนั่น", postalCode: "12110" },
                    { name: "Bueng Nam Rak", nameTh: "บึงน้ำรักษ์", postalCode: "12110" },
                ]
            },
            {
                name: "Lat Lum Kaeo",
                nameTh: "ลาดหลุมแก้ว",
                subdistricts: [
                    { name: "Lat Lum Kaeo", nameTh: "ระแหง", postalCode: "12140" },
                    { name: "Khlong Phra Udom", nameTh: "คลองพระอุดม", postalCode: "12140" },
                    { name: "Bueng Kho Hai", nameTh: "บึงคอไห", postalCode: "12140" },
                    { name: "Lam Sai", nameTh: "ลำไทร", postalCode: "12140" },
                    { name: "Bueng Khang Khok", nameTh: "บึงคำพร้อย", postalCode: "12140" },
                    { name: "Na Mai", nameTh: "หน้าไม้", postalCode: "12140" },
                    { name: "Khu Khot", nameTh: "คูขวาง", postalCode: "12140" },
                ]
            },
            {
                name: "Lam Luk Ka",
                nameTh: "ลำลูกกา",
                subdistricts: [
                    { name: "Khlong Sam", nameTh: "คูคต", postalCode: "12150" },
                    { name: "Lam Luk Ka", nameTh: "ลำลูกกา", postalCode: "12150" },
                    { name: "Bueng Kham Phroi", nameTh: "บึงคำพร้อย", postalCode: "12150" },
                    { name: "Lat Sawai", nameTh: "ลาดสวาย", postalCode: "12150" },
                    { name: "Bueng Thonglang", nameTh: "บึงทองหลาง", postalCode: "12150" },
                    { name: "Lam Sai", nameTh: "ลำไทร", postalCode: "12150" },
                    { name: "Phikun Ok", nameTh: "พืชอุดม", postalCode: "12150" },
                ]
            },
            {
                name: "Sam Khok",
                nameTh: "สามโคก",
                subdistricts: [
                    { name: "Bang Toei", nameTh: "บางเตย", postalCode: "12160" },
                    { name: "Khlong Khwai", nameTh: "คลองควาย", postalCode: "12160" },
                    { name: "Sam Khok", nameTh: "สามโคก", postalCode: "12160" },
                    { name: "Chiang Rak Noi", nameTh: "เชียงรากน้อย", postalCode: "12160" },
                    { name: "Ban Pathum", nameTh: "บ้านปทุม", postalCode: "12160" },
                    { name: "Ban Ngiu", nameTh: "บ้านงิ้ว", postalCode: "12160" },
                    { name: "Chiang Rak Yai", nameTh: "เชียงรากใหญ่", postalCode: "12160" },
                    { name: "Thai Ko", nameTh: "ท้ายเกาะ", postalCode: "12160" },
                    { name: "Krachaeng", nameTh: "กระแชง", postalCode: "12160" },
                    { name: "Bang Pho Nuea", nameTh: "บางโพธิ์เหนือ", postalCode: "12160" },
                    { name: "Nong Sam Wang", nameTh: "บางกระบือ", postalCode: "12160" },
                ]
            },
            {
                name: "Nong Suea",
                nameTh: "หนองเสือ",
                subdistricts: [
                    { name: "Bueng Ba", nameTh: "บึงบา", postalCode: "12170" },
                    { name: "Bueng Bon", nameTh: "บึงบอน", postalCode: "12170" },
                    { name: "Nong Sam Wang", nameTh: "หนองสามวัง", postalCode: "12170" },
                    { name: "Sala Krup", nameTh: "ศาลาครุ", postalCode: "12170" },
                    { name: "Nong Suea", nameTh: "หนองเสือ", postalCode: "12170" },
                ]
            },
        ]
    },
    {
        name: "Samut Prakan",
        nameTh: "สมุทรปราการ",
        districts: [
            {
                name: "Mueang Samut Prakan",
                nameTh: "เมืองสมุทรปราการ",
                subdistricts: [
                    { name: "Pak Nam", nameTh: "ปากน้ำ", postalCode: "10270" },
                    { name: "Samrong Nuea", nameTh: "สำโรงเหนือ", postalCode: "10270" },
                    { name: "Bang Mueang", nameTh: "บางเมือง", postalCode: "10270" },
                    { name: "Thepharak", nameTh: "เทพารักษ์", postalCode: "10270" },
                    { name: "Bang Pu Mai", nameTh: "บางปูใหม่", postalCode: "10280" },
                    { name: "Bang Pu", nameTh: "บางปู", postalCode: "10280" },
                    { name: "Tai Ban", nameTh: "ท้ายบ้าน", postalCode: "10280" },
                    { name: "Tai Ban Mai", nameTh: "ท้ายบ้านใหม่", postalCode: "10280" },
                ]
            },
            {
                name: "Bang Bo",
                nameTh: "บางบ่อ",
                subdistricts: [
                    { name: "Bang Bo", nameTh: "บางบ่อ", postalCode: "10560" },
                    { name: "Bang Pli Noi", nameTh: "บางพลีน้อย", postalCode: "10560" },
                    { name: "Bang Phaeng", nameTh: "บางแก้ว", postalCode: "10560" },
                    { name: "Khlong Dan", nameTh: "คลองด่าน", postalCode: "10550" },
                    { name: "Khlong Suan", nameTh: "คลองสวน", postalCode: "10560" },
                    { name: "Khlong Niyom Yattra", nameTh: "เปร็ง", postalCode: "10560" },
                    { name: "Khlong Lat Bua Khao", nameTh: "คลองนิยมยาตรา", postalCode: "10560" },
                ]
            },
            {
                name: "Bang Phli",
                nameTh: "บางพลี",
                subdistricts: [
                    { name: "Bang Phli Yai", nameTh: "บางพลีใหญ่", postalCode: "10540" },
                    { name: "Bang Kaeo", nameTh: "บางแก้ว", postalCode: "10540" },
                    { name: "Bang Pla", nameTh: "บางปลา", postalCode: "10540" },
                    { name: "Bang Chalong", nameTh: "บางโฉลง", postalCode: "10540" },
                    { name: "Racha Thewa", nameTh: "ราชาเทวะ", postalCode: "10540" },
                    { name: "Nong Prue", nameTh: "หนองปรือ", postalCode: "10540" },
                ]
            },
            {
                name: "Phra Pradaeng",
                nameTh: "พระประแดง",
                subdistricts: [
                    { name: "Pak Khlong Bang Pla Kot", nameTh: "ตลาด", postalCode: "10130" },
                    { name: "Bang Phueng", nameTh: "บางพึ่ง", postalCode: "10130" },
                    { name: "Bang Ya Phraek", nameTh: "บางยอ", postalCode: "10130" },
                    { name: "Bang Chak", nameTh: "บางจาก", postalCode: "10130" },
                    { name: "Bang Khru", nameTh: "บางครุ", postalCode: "10130" },
                    { name: "Bang Krachao", nameTh: "บางกระเจ้า", postalCode: "10130" },
                    { name: "Bang Krasop", nameTh: "บางน้ำผึ้ง", postalCode: "10130" },
                    { name: "Bang Kobua", nameTh: "บางกอบัว", postalCode: "10130" },
                    { name: "Sam Kong", nameTh: "ทรงคนอง", postalCode: "10130" },
                    { name: "Song Khanong", nameTh: "สำโรง", postalCode: "10130" },
                    { name: "Song Khanong Tai", nameTh: "สำโรงใต้", postalCode: "10130" },
                ]
            },
            {
                name: "Phra Samut Chedi",
                nameTh: "พระสมุทรเจดีย์",
                subdistricts: [
                    { name: "Pak Khlong Bang Pla Kot", nameTh: "ปากคลองบางปลากด", postalCode: "10290" },
                    { name: "Na Khluea", nameTh: "นาเกลือ", postalCode: "10290" },
                    { name: "Phra Samut Chedi", nameTh: "แหลมฟ้าผ่า", postalCode: "10290" },
                    { name: "Laem Fa Pha", nameTh: "บ้านคลองสวน", postalCode: "10290" },
                    { name: "Ban Khlong Suan", nameTh: "ในคลองบางปลากด", postalCode: "10290" },
                ]
            },
            {
                name: "Bang Sao Thong",
                nameTh: "บางเสาธง",
                subdistricts: [
                    { name: "Bang Sao Thong", nameTh: "บางเสาธง", postalCode: "10570" },
                    { name: "Si Samut", nameTh: "ศีรษะจรเข้น้อย", postalCode: "10570" },
                    { name: "Si Samut Yai", nameTh: "ศีรษะจรเข้ใหญ่", postalCode: "10570" },
                ]
            },
        ]
    },
    {
        name: "Chiang Mai",
        nameTh: "เชียงใหม่",
        districts: [
            {
                name: "Mueang Chiang Mai",
                nameTh: "เมืองเชียงใหม่",
                subdistricts: [
                    { name: "Si Phum", nameTh: "ศรีภูมิ", postalCode: "50200" },
                    { name: "Phra Sing", nameTh: "พระสิงห์", postalCode: "50200" },
                    { name: "Hai Ya", nameTh: "หายยา", postalCode: "50100" },
                    { name: "Chang Moi", nameTh: "ช้างม่อย", postalCode: "50300" },
                    { name: "Chang Khlan", nameTh: "ช้างคลาน", postalCode: "50100" },
                    { name: "Wat Ket", nameTh: "วัดเกต", postalCode: "50000" },
                    { name: "Chang Phueak", nameTh: "ช้างเผือก", postalCode: "50300" },
                    { name: "Suthep", nameTh: "สุเทพ", postalCode: "50200" },
                    { name: "Mae Hia", nameTh: "แม่เหียะ", postalCode: "50100" },
                    { name: "Pa Daet", nameTh: "ป่าแดด", postalCode: "50100" },
                    { name: "Nong Pa Khrang", nameTh: "หนองป่าครั่ง", postalCode: "50000" },
                    { name: "Tha Sala", nameTh: "ท่าศาลา", postalCode: "50000" },
                    { name: "Nong Hoi", nameTh: "หนองหอย", postalCode: "50000" },
                    { name: "Pa Tan", nameTh: "ป่าตัน", postalCode: "50300" },
                    { name: "San Phi Suea", nameTh: "สันผีเสื้อ", postalCode: "50300" },
                    { name: "Fa Ham", nameTh: "ฟ้าฮ่าม", postalCode: "50000" },
                ]
            },
            {
                name: "Hang Dong",
                nameTh: "หางดง",
                subdistricts: [
                    { name: "Hang Dong", nameTh: "หางดง", postalCode: "50230" },
                    { name: "Nong Chaeng", nameTh: "หนองแก๋ว", postalCode: "50230" },
                    { name: "Han Kaeo", nameTh: "หนองตอง", postalCode: "50230" },
                    { name: "San Phak Wan", nameTh: "สันผักหวาน", postalCode: "50230" },
                    { name: "Nong Kwai", nameTh: "หนองควาย", postalCode: "50230" },
                    { name: "Ban Pong", nameTh: "บ้านปง", postalCode: "50230" },
                    { name: "Nong Tong", nameTh: "น้ำแพร่", postalCode: "50340" },
                    { name: "Sop Mae Ka", nameTh: "สบแม่ข่า", postalCode: "50230" },
                    { name: "Ban Waen", nameTh: "บ้านแหวน", postalCode: "50230" },
                ]
            },
            {
                name: "San Sai",
                nameTh: "สันทราย",
                subdistricts: [
                    { name: "San Sai Luang", nameTh: "สันทรายหลวง", postalCode: "50210" },
                    { name: "San Sai Noi", nameTh: "สันทรายน้อย", postalCode: "50210" },
                    { name: "San Phak Wan", nameTh: "สันพระเนตร", postalCode: "50210" },
                    { name: "San Na Meng", nameTh: "สันนาเม็ง", postalCode: "50210" },
                    { name: "San Phra Non", nameTh: "สันป่าเปา", postalCode: "50210" },
                    { name: "Mae Faek", nameTh: "หนองแหย่ง", postalCode: "50290" },
                    { name: "Pa Phai", nameTh: "หนองจ๊อม", postalCode: "50210" },
                    { name: "San Klang", nameTh: "หนองหาร", postalCode: "50290" },
                    { name: "Mae Faek Mai", nameTh: "แม่แฝก", postalCode: "50290" },
                    { name: "Nong Han", nameTh: "แม่แฝกใหม่", postalCode: "50290" },
                    { name: "Tha Wangtan", nameTh: "เมืองเล็น", postalCode: "50210" },
                    { name: "Nong Chom", nameTh: "ป่าไผ่", postalCode: "50210" },
                ]
            },
        ]
    },
    {
        name: "Chonburi",
        nameTh: "ชลบุรี",
        districts: [
            {
                name: "Mueang Chonburi",
                nameTh: "เมืองชลบุรี",
                subdistricts: [
                    { name: "Bang Pla Soi", nameTh: "บางปลาสร้อย", postalCode: "20000" },
                    { name: "Makham Yong", nameTh: "มะขามหย่ง", postalCode: "20000" },
                    { name: "Ban Suan", nameTh: "บ้านสวน", postalCode: "20000" },
                    { name: "Na Pa", nameTh: "หนองรี", postalCode: "20000" },
                    { name: "Khlong Tamru", nameTh: "คลองตำหรุ", postalCode: "20000" },
                    { name: "Bang Sai", nameTh: "เหมือง", postalCode: "20130" },
                    { name: "Sam Nak Thon", nameTh: "บ้านปึก", postalCode: "20130" },
                    { name: "Huai Kapi", nameTh: "ห้วยกะปิ", postalCode: "20130" },
                    { name: "Nong Mai Daeng", nameTh: "เสม็ด", postalCode: "20000" },
                    { name: "Don Hua Lo", nameTh: "อ่างศิลา", postalCode: "20000" },
                    { name: "Bang Tako", nameTh: "สำนักบก", postalCode: "20000" },
                    { name: "Khlong Khut", nameTh: "หนองข้างคอก", postalCode: "20000" },
                ]
            },
            {
                name: "Bang Lamung",
                nameTh: "บางละมุง",
                subdistricts: [
                    { name: "Bang Lamung", nameTh: "บางละมุง", postalCode: "20150" },
                    { name: "Na Kluea", nameTh: "หนองปรือ", postalCode: "20150" },
                    { name: "Nong Prue", nameTh: "หนองปลาไหล", postalCode: "20150" },
                    { name: "Huai Yai", nameTh: "โป่ง", postalCode: "20150" },
                    { name: "Pong", nameTh: "เขาไม้แก้ว", postalCode: "20150" },
                    { name: "Khao Mai Kaeo", nameTh: "ห้วยใหญ่", postalCode: "20150" },
                    { name: "Nong Pla Lai", nameTh: "ตะเคียนเตี้ย", postalCode: "20150" },
                    { name: "Takian Tia", nameTh: "นาเกลือ", postalCode: "20150" },
                ]
            },
            {
                name: "Pattaya",
                nameTh: "พัทยา",
                subdistricts: [
                    { name: "Pattaya", nameTh: "พัทยา", postalCode: "20150" },
                ]
            },
            {
                name: "Si Racha",
                nameTh: "ศรีราชา",
                subdistricts: [
                    { name: "Si Racha", nameTh: "ศรีราชา", postalCode: "20110" },
                    { name: "Surasak", nameTh: "สุรศักดิ์", postalCode: "20110" },
                    { name: "Thung Sukla", nameTh: "ทุ่งสุขลา", postalCode: "20230" },
                    { name: "Bo Win", nameTh: "บ่อวิน", postalCode: "20230" },
                    { name: "Bang Phra", nameTh: "บางพระ", postalCode: "20110" },
                    { name: "Khao Khansong", nameTh: "เขาคันทรง", postalCode: "20110" },
                    { name: "Nong Kham", nameTh: "หนองขาม", postalCode: "20230" },
                    { name: "Laem Chabang", nameTh: "เขาคันทรง", postalCode: "20230" },
                ]
            },
        ]
    },
    {
        name: "Phuket",
        nameTh: "ภูเก็ต",
        districts: [
            {
                name: "Mueang Phuket",
                nameTh: "เมืองภูเก็ต",
                subdistricts: [
                    { name: "Talat Yai", nameTh: "ตลาดใหญ่", postalCode: "83000" },
                    { name: "Talat Nuea", nameTh: "ตลาดเหนือ", postalCode: "83000" },
                    { name: "Ko Kaeo", nameTh: "เกาะแก้ว", postalCode: "83000" },
                    { name: "Ratsada", nameTh: "รัษฎา", postalCode: "83000" },
                    { name: "Wichit", nameTh: "วิชิต", postalCode: "83000" },
                    { name: "Chalong", nameTh: "ฉลอง", postalCode: "83130" },
                    { name: "Rawai", nameTh: "ราไวย์", postalCode: "83130" },
                    { name: "Karon", nameTh: "กะรน", postalCode: "83100" },
                ]
            },
            {
                name: "Kathu",
                nameTh: "กะทู้",
                subdistricts: [
                    { name: "Kathu", nameTh: "กะทู้", postalCode: "83120" },
                    { name: "Pa Tong", nameTh: "ป่าตอง", postalCode: "83150" },
                    { name: "Kamala", nameTh: "กมลา", postalCode: "83150" },
                ]
            },
            {
                name: "Thalang",
                nameTh: "ถลาง",
                subdistricts: [
                    { name: "Thep Krasatti", nameTh: "เทพกระษัตรี", postalCode: "83110" },
                    { name: "Si Sunthon", nameTh: "ศรีสุนทร", postalCode: "83110" },
                    { name: "Choeng Thale", nameTh: "เชิงทะเล", postalCode: "83110" },
                    { name: "Pa Klok", nameTh: "ป่าคลอก", postalCode: "83110" },
                    { name: "Mai Khao", nameTh: "ไม้ขาว", postalCode: "83110" },
                    { name: "Sakhu", nameTh: "สาคู", postalCode: "83110" },
                ]
            },
        ]
    },
];

// Helper function to get all provinces
export function getAllProvinces(): { name: string; nameTh: string }[] {
    return provinces.map(p => ({ name: p.name, nameTh: p.nameTh }));
}

// Helper function to get districts by province
export function getDistrictsByProvince(provinceName: string): { name: string; nameTh: string }[] {
    const province = provinces.find(p => p.name === provinceName || p.nameTh === provinceName);
    if (!province) return [];
    return province.districts.map(d => ({ name: d.name, nameTh: d.nameTh }));
}

// Helper function to get subdistricts by district
export function getSubdistrictsByDistrict(provinceName: string, districtName: string): Subdistrict[] {
    const province = provinces.find(p => p.name === provinceName || p.nameTh === provinceName);
    if (!province) return [];
    const district = province.districts.find(d => d.name === districtName || d.nameTh === districtName);
    if (!district) return [];
    return district.subdistricts;
}

// Helper function to get postal code by subdistrict
export function getPostalCode(provinceName: string, districtName: string, subdistrictName: string): string {
    const subdistricts = getSubdistrictsByDistrict(provinceName, districtName);
    const subdistrict = subdistricts.find(s => s.name === subdistrictName || s.nameTh === subdistrictName);
    return subdistrict?.postalCode || "";
}

// Countries list
export const countries = [
    { name: "Thailand", nameTh: "ประเทศไทย" },
    { name: "Singapore", nameTh: "สิงคโปร์" },
    { name: "Malaysia", nameTh: "มาเลเซีย" },
    { name: "Indonesia", nameTh: "อินโดนีเซีย" },
    { name: "Vietnam", nameTh: "เวียดนาม" },
    { name: "Philippines", nameTh: "ฟิลิปปินส์" },
    { name: "Japan", nameTh: "ญี่ปุ่น" },
    { name: "South Korea", nameTh: "เกาหลีใต้" },
    { name: "China", nameTh: "จีน" },
    { name: "Taiwan", nameTh: "ไต้หวัน" },
    { name: "Hong Kong", nameTh: "ฮ่องกง" },
    { name: "United States", nameTh: "สหรัฐอเมริกา" },
    { name: "United Kingdom", nameTh: "สหราชอาณาจักร" },
    { name: "Australia", nameTh: "ออสเตรเลีย" },
    { name: "Germany", nameTh: "เยอรมนี" },
    { name: "France", nameTh: "ฝรั่งเศส" },
];
