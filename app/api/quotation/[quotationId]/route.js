// api/quotation/[quotationId]/route.js
import { fetchQuotation } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
    try {
        const { params } = context;
        const quotationId = params.quotationId;

        // Use fetchQuotation with the extracted quotationId
        const quotation = await fetchQuotation(quotationId);

        if (!quotation) {
            return new NextResponse(JSON.stringify({ message: 'Quotation not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify(quotation), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch quotation' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
