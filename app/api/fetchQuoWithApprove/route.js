/*import { fetchQuotationsWithApproval } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const quotationWithApproval = await fetchQuotationsWithApproval();
        return new NextResponse(JSON.stringify({ quotationWithApproval }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch quotations with approval' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}*/
