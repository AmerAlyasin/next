import { fetchAllSales } from '@/app/lib/data'; 
import { NextResponse } from 'next/server';

export async function GET(req, res) {
    try {
        const sales = await fetchAllSales(); // Example function call
        console.log(sales)
       return NextResponse.json(sales);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch sales' });
    }
}
