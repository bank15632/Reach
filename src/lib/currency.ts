// Currency Conversion Utilities
// Note: Since we're using Stripe to handle currency, this is mainly for display purposes

import { getCountryByCode } from '@/data/countryData';

// Base currency for all prices in the database
export const BASE_CURRENCY = 'THB';

// Static exchange rates (updated periodically)
// In production, these would be fetched from an API or Stripe
// These rates are: 1 THB = X foreign currency
const exchangeRates: Record<string, number> = {
    THB: 1,
    USD: 0.029,    // 1 THB ≈ 0.029 USD (1 USD ≈ 34.5 THB)
    EUR: 0.027,    // 1 THB ≈ 0.027 EUR (1 EUR ≈ 37 THB)
    GBP: 0.023,    // 1 THB ≈ 0.023 GBP (1 GBP ≈ 43.5 THB)
    JPY: 4.35,     // 1 THB ≈ 4.35 JPY (1 JPY ≈ 0.23 THB)
    AUD: 0.044,    // 1 THB ≈ 0.044 AUD
    CAD: 0.039,    // 1 THB ≈ 0.039 CAD
    SGD: 0.039,    // 1 THB ≈ 0.039 SGD
    MYR: 0.13,     // 1 THB ≈ 0.13 MYR
    CNY: 0.21,     // 1 THB ≈ 0.21 CNY
    KRW: 38.5,     // 1 THB ≈ 38.5 KRW
    INR: 2.42,     // 1 THB ≈ 2.42 INR
    HKD: 0.23,     // 1 THB ≈ 0.23 HKD
    TWD: 0.92,     // 1 THB ≈ 0.92 TWD
    PHP: 1.64,     // 1 THB ≈ 1.64 PHP
    IDR: 460,      // 1 THB ≈ 460 IDR
    VND: 725,      // 1 THB ≈ 725 VND
    CHF: 0.026,    // 1 THB ≈ 0.026 CHF
    SEK: 0.31,     // 1 THB ≈ 0.31 SEK
    NOK: 0.31,     // 1 THB ≈ 0.31 NOK
    DKK: 0.20,     // 1 THB ≈ 0.20 DKK
    NZD: 0.048,    // 1 THB ≈ 0.048 NZD
    AED: 0.11,     // 1 THB ≈ 0.11 AED
    SAR: 0.11,     // 1 THB ≈ 0.11 SAR
};

export interface ConvertedPrice {
    original: number;
    originalCurrency: string;
    converted: number;
    currency: string;
    symbol: string;
    formatted: string;
    rate: number;
}

// Convert THB to target currency
export function convertFromTHB(amountTHB: number, targetCurrency: string): ConvertedPrice {
    const currency = targetCurrency.toUpperCase();
    const rate = exchangeRates[currency] || exchangeRates.USD;
    const converted = amountTHB * rate;
    
    // Get currency symbol
    const symbols: Record<string, string> = {
        THB: '฿', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$',
        CAD: 'C$', SGD: 'S$', MYR: 'RM', CNY: '¥', KRW: '₩', INR: '₹',
        HKD: 'HK$', TWD: 'NT$', PHP: '₱', IDR: 'Rp', VND: '₫',
        CHF: 'CHF', SEK: 'kr', NOK: 'kr', DKK: 'kr', NZD: 'NZ$',
        AED: 'د.إ', SAR: '﷼'
    };
    
    const symbol = symbols[currency] || currency;
    
    // Format based on currency
    let formatted: string;
    if (['JPY', 'KRW', 'VND', 'IDR'].includes(currency)) {
        // No decimal places for these currencies
        formatted = `${symbol}${Math.round(converted).toLocaleString()}`;
    } else {
        formatted = `${symbol}${converted.toFixed(2)}`;
    }
    
    return {
        original: amountTHB,
        originalCurrency: 'THB',
        converted,
        currency,
        symbol,
        formatted,
        rate
    };
}

// Get currency from country code
export function getCurrencyForCountry(countryCode: string): string {
    const country = getCountryByCode(countryCode);
    return country?.currencyCode || 'USD';
}

// Format price for display based on country
export function formatPriceForCountry(amountTHB: number, countryCode: string): string {
    const currency = getCurrencyForCountry(countryCode);
    
    // If Thailand, show THB directly
    if (countryCode.toUpperCase() === 'TH') {
        return `฿${amountTHB.toLocaleString()}`;
    }
    
    const converted = convertFromTHB(amountTHB, currency);
    return converted.formatted;
}

// Get supported currencies list
export function getSupportedCurrencies(): string[] {
    return Object.keys(exchangeRates);
}

// Detect user's likely currency from browser/locale
export function detectUserCurrency(acceptLanguage?: string): string {
    if (!acceptLanguage) return 'USD';
    
    // Map common locales to currencies
    const localeCurrencyMap: Record<string, string> = {
        'en-US': 'USD', 'en-GB': 'GBP', 'en-AU': 'AUD', 'en-CA': 'CAD',
        'en-SG': 'SGD', 'en-NZ': 'NZD', 'en-HK': 'HKD',
        'th': 'THB', 'th-TH': 'THB',
        'ja': 'JPY', 'ja-JP': 'JPY',
        'ko': 'KRW', 'ko-KR': 'KRW',
        'zh-CN': 'CNY', 'zh-TW': 'TWD', 'zh-HK': 'HKD',
        'de': 'EUR', 'fr': 'EUR', 'it': 'EUR', 'es': 'EUR', 'nl': 'EUR',
        'sv': 'SEK', 'no': 'NOK', 'da': 'DKK',
        'ms': 'MYR', 'id': 'IDR', 'vi': 'VND', 'fil': 'PHP',
        'hi': 'INR', 'ar': 'AED'
    };
    
    // Parse Accept-Language header
    const locales = acceptLanguage.split(',').map(l => l.split(';')[0].trim());
    
    for (const locale of locales) {
        if (localeCurrencyMap[locale]) {
            return localeCurrencyMap[locale];
        }
        // Try just the language part
        const lang = locale.split('-')[0];
        if (localeCurrencyMap[lang]) {
            return localeCurrencyMap[lang];
        }
    }
    
    return 'USD';
}
