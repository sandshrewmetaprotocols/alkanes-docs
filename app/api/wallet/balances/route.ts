import { NextRequest, NextResponse } from "next/server";
import { alkanesClient, KNOWN_TOKENS } from "@/lib/alkanes-client";

/**
 * GET /api/wallet/balances?address=<bitcoin_address>
 *
 * Fetches wallet balances including:
 * - BTC balance (from esplora UTXOs via alkanes-web-sys)
 * - Alkane token balances (from protorunesbyaddress via alkanes-web-sys)
 *
 * This endpoint uses the shared alkanes-client which wraps @alkanes/ts-sdk
 * for all blockchain interactions.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Use the alkanes client to fetch all wallet balances
    // This internally uses:
    // - esplora_address::utxo for BTC balance
    // - protorunesbyaddress via metashrew_view for token balances
    console.log('[wallet/balances] Fetching balances for address:', address);
    const walletBalances = await alkanesClient.getWalletBalances(address);
    console.log('[wallet/balances] Raw result:', JSON.stringify({
      btcBalance: walletBalances.btcBalance,
      tokensCount: walletBalances.tokens.length,
      tokens: walletBalances.tokens.map(t => ({ runeId: t.runeId, balance: t.balance.toString() })),
    }, null, 2));

    // Transform to API response format
    const response = {
      btcBalance: walletBalances.btcBalance,
      btcBalanceFormatted: walletBalances.btcBalanceFormatted,
      tokens: walletBalances.tokens.map(token => ({
        runeId: token.runeId,
        symbol: token.symbol,
        name: token.name,
        balance: token.balance.toString(),
        balanceFormatted: token.balanceFormatted,
        decimals: token.decimals,
      })),
      address: walletBalances.address,
      timestamp: walletBalances.timestamp,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching wallet balances:', error);

    // Extract error details for debugging
    let errorMessage = 'Unknown error';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      };
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
      errorDetails = error as Record<string, unknown>;
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallet balances',
        details: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
