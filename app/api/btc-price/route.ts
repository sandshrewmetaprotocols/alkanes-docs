import { NextResponse } from 'next/server';
import { getBitcoinPrice } from '@/lib/pools/pool-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/btc-price
 * Returns current BTC price in USD
 */
export async function GET() {
  try {
    const price = await getBitcoinPrice();

    return NextResponse.json({
      success: true,
      data: price,
    });
  } catch (error) {
    console.error('BTC price API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
