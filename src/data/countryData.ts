// Country data for shipping and address forms

export interface Country {
    code: string;
    name: string;
    nameTh: string;
    currencyCode: string;
    currencySymbol: string;
    phoneCode: string;
}

export const countries: Country[] = [
    // ASEAN
    { code: 'TH', name: 'Thailand', nameTh: 'ประเทศไทย', currencyCode: 'THB', currencySymbol: '฿', phoneCode: '+66' },
    { code: 'SG', name: 'Singapore', nameTh: 'สิงคโปร์', currencyCode: 'SGD', currencySymbol: 'S$', phoneCode: '+65' },
    { code: 'MY', name: 'Malaysia', nameTh: 'มาเลเซีย', currencyCode: 'MYR', currencySymbol: 'RM', phoneCode: '+60' },
    { code: 'ID', name: 'Indonesia', nameTh: 'อินโดนีเซีย', currencyCode: 'IDR', currencySymbol: 'Rp', phoneCode: '+62' },
    { code: 'PH', name: 'Philippines', nameTh: 'ฟิลิปปินส์', currencyCode: 'PHP', currencySymbol: '₱', phoneCode: '+63' },
    { code: 'VN', name: 'Vietnam', nameTh: 'เวียดนาม', currencyCode: 'VND', currencySymbol: '₫', phoneCode: '+84' },
    { code: 'MM', name: 'Myanmar', nameTh: 'เมียนมาร์', currencyCode: 'MMK', currencySymbol: 'K', phoneCode: '+95' },
    { code: 'KH', name: 'Cambodia', nameTh: 'กัมพูชา', currencyCode: 'KHR', currencySymbol: '៛', phoneCode: '+855' },
    { code: 'LA', name: 'Laos', nameTh: 'ลาว', currencyCode: 'LAK', currencySymbol: '₭', phoneCode: '+856' },
    { code: 'BN', name: 'Brunei', nameTh: 'บรูไน', currencyCode: 'BND', currencySymbol: 'B$', phoneCode: '+673' },
    
    // Asia Pacific
    { code: 'JP', name: 'Japan', nameTh: 'ญี่ปุ่น', currencyCode: 'JPY', currencySymbol: '¥', phoneCode: '+81' },
    { code: 'KR', name: 'South Korea', nameTh: 'เกาหลีใต้', currencyCode: 'KRW', currencySymbol: '₩', phoneCode: '+82' },
    { code: 'CN', name: 'China', nameTh: 'จีน', currencyCode: 'CNY', currencySymbol: '¥', phoneCode: '+86' },
    { code: 'HK', name: 'Hong Kong', nameTh: 'ฮ่องกง', currencyCode: 'HKD', currencySymbol: 'HK$', phoneCode: '+852' },
    { code: 'TW', name: 'Taiwan', nameTh: 'ไต้หวัน', currencyCode: 'TWD', currencySymbol: 'NT$', phoneCode: '+886' },
    { code: 'AU', name: 'Australia', nameTh: 'ออสเตรเลีย', currencyCode: 'AUD', currencySymbol: 'A$', phoneCode: '+61' },
    { code: 'NZ', name: 'New Zealand', nameTh: 'นิวซีแลนด์', currencyCode: 'NZD', currencySymbol: 'NZ$', phoneCode: '+64' },
    { code: 'IN', name: 'India', nameTh: 'อินเดีย', currencyCode: 'INR', currencySymbol: '₹', phoneCode: '+91' },
    
    // Europe
    { code: 'GB', name: 'United Kingdom', nameTh: 'สหราชอาณาจักร', currencyCode: 'GBP', currencySymbol: '£', phoneCode: '+44' },
    { code: 'DE', name: 'Germany', nameTh: 'เยอรมนี', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+49' },
    { code: 'FR', name: 'France', nameTh: 'ฝรั่งเศส', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+33' },
    { code: 'IT', name: 'Italy', nameTh: 'อิตาลี', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+39' },
    { code: 'ES', name: 'Spain', nameTh: 'สเปน', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+34' },
    { code: 'NL', name: 'Netherlands', nameTh: 'เนเธอร์แลนด์', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+31' },
    { code: 'BE', name: 'Belgium', nameTh: 'เบลเยียม', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+32' },
    { code: 'SE', name: 'Sweden', nameTh: 'สวีเดน', currencyCode: 'SEK', currencySymbol: 'kr', phoneCode: '+46' },
    { code: 'NO', name: 'Norway', nameTh: 'นอร์เวย์', currencyCode: 'NOK', currencySymbol: 'kr', phoneCode: '+47' },
    { code: 'DK', name: 'Denmark', nameTh: 'เดนมาร์ก', currencyCode: 'DKK', currencySymbol: 'kr', phoneCode: '+45' },
    { code: 'FI', name: 'Finland', nameTh: 'ฟินแลนด์', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+358' },
    { code: 'AT', name: 'Austria', nameTh: 'ออสเตรีย', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+43' },
    { code: 'CH', name: 'Switzerland', nameTh: 'สวิตเซอร์แลนด์', currencyCode: 'CHF', currencySymbol: 'CHF', phoneCode: '+41' },
    { code: 'PL', name: 'Poland', nameTh: 'โปแลนด์', currencyCode: 'PLN', currencySymbol: 'zł', phoneCode: '+48' },
    { code: 'CZ', name: 'Czech Republic', nameTh: 'สาธารณรัฐเช็ก', currencyCode: 'CZK', currencySymbol: 'Kč', phoneCode: '+420' },
    { code: 'PT', name: 'Portugal', nameTh: 'โปรตุเกส', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+351' },
    { code: 'IE', name: 'Ireland', nameTh: 'ไอร์แลนด์', currencyCode: 'EUR', currencySymbol: '€', phoneCode: '+353' },
    
    // Americas
    { code: 'US', name: 'United States', nameTh: 'สหรัฐอเมริกา', currencyCode: 'USD', currencySymbol: '$', phoneCode: '+1' },
    { code: 'CA', name: 'Canada', nameTh: 'แคนาดา', currencyCode: 'CAD', currencySymbol: 'C$', phoneCode: '+1' },
    { code: 'MX', name: 'Mexico', nameTh: 'เม็กซิโก', currencyCode: 'MXN', currencySymbol: 'MX$', phoneCode: '+52' },
    { code: 'BR', name: 'Brazil', nameTh: 'บราซิล', currencyCode: 'BRL', currencySymbol: 'R$', phoneCode: '+55' },
    { code: 'AR', name: 'Argentina', nameTh: 'อาร์เจนตินา', currencyCode: 'ARS', currencySymbol: 'AR$', phoneCode: '+54' },
    { code: 'CL', name: 'Chile', nameTh: 'ชิลี', currencyCode: 'CLP', currencySymbol: 'CL$', phoneCode: '+56' },
    { code: 'CO', name: 'Colombia', nameTh: 'โคลอมเบีย', currencyCode: 'COP', currencySymbol: 'CO$', phoneCode: '+57' },
    { code: 'PE', name: 'Peru', nameTh: 'เปรู', currencyCode: 'PEN', currencySymbol: 'S/', phoneCode: '+51' },
    
    // Middle East
    { code: 'AE', name: 'United Arab Emirates', nameTh: 'สหรัฐอาหรับเอมิเรตส์', currencyCode: 'AED', currencySymbol: 'د.إ', phoneCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', nameTh: 'ซาอุดีอาระเบีย', currencyCode: 'SAR', currencySymbol: '﷼', phoneCode: '+966' },
    { code: 'QA', name: 'Qatar', nameTh: 'กาตาร์', currencyCode: 'QAR', currencySymbol: '﷼', phoneCode: '+974' },
    { code: 'KW', name: 'Kuwait', nameTh: 'คูเวต', currencyCode: 'KWD', currencySymbol: 'د.ك', phoneCode: '+965' },
    { code: 'BH', name: 'Bahrain', nameTh: 'บาห์เรน', currencyCode: 'BHD', currencySymbol: '.د.ب', phoneCode: '+973' },
    { code: 'OM', name: 'Oman', nameTh: 'โอมาน', currencyCode: 'OMR', currencySymbol: '﷼', phoneCode: '+968' },
    { code: 'IL', name: 'Israel', nameTh: 'อิสราเอล', currencyCode: 'ILS', currencySymbol: '₪', phoneCode: '+972' },
    { code: 'TR', name: 'Turkey', nameTh: 'ตุรกี', currencyCode: 'TRY', currencySymbol: '₺', phoneCode: '+90' },
];

export const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(c => c.code === code.toUpperCase());
};

export const getCountriesByRegion = (region: 'asean' | 'asia' | 'europe' | 'americas' | 'middle_east'): Country[] => {
    const regionCodes: Record<string, string[]> = {
        asean: ['TH', 'SG', 'MY', 'ID', 'PH', 'VN', 'MM', 'KH', 'LA', 'BN'],
        asia: ['JP', 'KR', 'CN', 'HK', 'TW', 'AU', 'NZ', 'IN'],
        europe: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'AT', 'CH', 'PL', 'CZ', 'PT', 'IE'],
        americas: ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE'],
        middle_east: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IL', 'TR']
    };
    
    return countries.filter(c => regionCodes[region]?.includes(c.code));
};
