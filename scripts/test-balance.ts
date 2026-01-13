/**
 * Quick test script to debug DIESEL token balance fetching
 * Run with: npx tsx scripts/test-balance.ts <address>
 */

import { AlkanesProvider } from '@alkanes/ts-sdk';

async function testBalance(address: string) {
  console.log('Testing balance fetch for address:', address);
  console.log('---');

  const provider = new AlkanesProvider({
    network: 'mainnet',
    rpcUrl: process.env.ALKANES_RPC_URL || 'https://mainnet.subfrost.io/v4/buildalkanes',
  });

  console.log('Initializing provider...');
  await provider.initialize();
  console.log('Provider initialized.');
  console.log('---');

  // Fetch UTXOs
  console.log('Fetching UTXOs...');
  try {
    const utxos = await provider.esplora.getAddressUtxos(address);
    console.log('UTXOs count:', Array.isArray(utxos) ? utxos.length : 0);
    if (Array.isArray(utxos) && utxos.length > 0) {
      console.log('First UTXO:', JSON.stringify(utxos[0], null, 2));
    }
  } catch (e) {
    console.error('Error fetching UTXOs:', e);
  }
  console.log('---');

  // Fetch alkane balances
  console.log('Fetching Alkane balances...');
  try {
    const alkaneBalances = await provider.getAlkaneBalance(address);
    console.log('Alkane balances type:', typeof alkaneBalances);
    console.log('Alkane balances isArray:', Array.isArray(alkaneBalances));
    console.log('Alkane balances length:', alkaneBalances?.length ?? 'undefined');
    console.log('Alkane balances raw:', JSON.stringify(alkaneBalances, null, 2));

    if (Array.isArray(alkaneBalances) && alkaneBalances.length > 0) {
      console.log('---');
      console.log('First balance entry fields:');
      const first = alkaneBalances[0];
      console.log('  id:', first.id);
      console.log('  alkane_id:', (first as any).alkane_id);
      console.log('  balance:', first.balance);
      console.log('  amount:', (first as any).amount);
      console.log('  symbol:', first.symbol);
      console.log('  name:', first.name);
    }
  } catch (e) {
    console.error('Error fetching Alkane balances:', e);
  }
}

const address = process.argv[2];
if (!address) {
  console.log('Usage: npx tsx scripts/test-balance.ts <bitcoin_address>');
  console.log('Example: npx tsx scripts/test-balance.ts bc1p...');
  process.exit(1);
}

testBalance(address).catch(console.error);
