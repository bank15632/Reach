import { NextRequest, NextResponse } from 'next/server';
import { convertFromTHB, getSupportedCurrencies, detectUserCurrency } from '@/lib/currency';

// GET /api/currency/convert?amount=1000&to=USD
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const amount = parseFloat(searchParams.get('amount') || '0');
        const toCurrency = searchParams.get('to');

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Valid amount is required' },
                { status: 400 }
            );
        }

        // If no target currency, try to detect from Accept-Language
        let currency = toCurrency;
        if (!currency) {
            const acceptLanguage = request.headers.get('accept-language') || '';
            currency = detectUserCurrency(acceptLanguage);
        }

        const result = convertFromTHB(amount, currency);

        return NextResponse.json({
            ...result,
            supportedCurrencies: getSupportedCurrencies()
        });
    } catch (error) {
        console.error('Error converting currency:', error);
        return NextResponse.json(
            { error: 'Failed to convert currency' },
            { status: 500 }
        );
    }
}

// POST /api/currency/convert - Convert multiple amounts
export async function POST(request: NextRequest) {
    try {
        const { amounts, to } = await request.json();

        if (!amounts || !Array.isArray(amounts)) {
            return NextResponse.json(
                { error: 'amounts array is required' },
                { status: 400 }
            );
        }

        // If no target currency, try to detect from Accept-Language
        let currency = to;
        if (!currency) {
            const acceptLanguage = request.headers.get('accept-language') || '';
            currency = detectUserCurrency(acceptLanguage);
        }

        const results = amounts.map(amount => convertFromTHB(amount, currency));

        return NextResponse.json({
            currency,
            conversions: results
        });
    } catch (error) {
        console.error('Error converting currencies:', error);
        return NextResponse.json(
            { error: 'Failed to convert currencies' },
            { status: 500 }
        );
    }
}
