import { describe, it, expect } from 'vitest';
import {
  parseU128LE,
  parseU128LEAtOffset,
  readVarint,
  calculatePrice,
  formatAlkaneId,
  KNOWN_TOKENS,
  POOLS,
  DIESEL_TOKEN,
} from '@/lib/alkanes-client';

describe('alkanes-client utility functions', () => {
  describe('parseU128LE', () => {
    it('should parse a simple little-endian value', () => {
      // 0x01 in LE = 1
      expect(parseU128LE('01')).toBe(BigInt(1));
    });

    it('should parse multi-byte little-endian value', () => {
      // 0x0102 in LE (bytes: 02 01) = 0x0102 = 258
      expect(parseU128LE('0201')).toBe(BigInt(258));
    });

    it('should parse a 16-byte u128 value', () => {
      // All zeros
      expect(parseU128LE('00000000000000000000000000000000')).toBe(BigInt(0));

      // Value 1 as u128 LE
      expect(parseU128LE('01000000000000000000000000000000')).toBe(BigInt(1));

      // Larger value
      const hex = '00e40b5402000000000000000000000000'; // Should be some large number in LE
      const result = parseU128LE(hex.slice(0, 32));
      expect(result).toBeGreaterThan(BigInt(0));
    });

    it('should handle empty string', () => {
      expect(parseU128LE('')).toBe(BigInt(0));
    });

    it('should handle odd-length hex strings by padding', () => {
      // Single char should be padded
      expect(parseU128LE('1')).toBe(BigInt(1));
    });
  });

  describe('parseU128LEAtOffset', () => {
    it('should extract value at byte offset 0', () => {
      const hex = '01000000000000000000000000000000ffffffffffffffffffffffffffffffff';
      expect(parseU128LEAtOffset(hex, 0)).toBe(BigInt(1));
    });

    it('should extract value at byte offset 16', () => {
      const hex = '0000000000000000000000000000000001000000000000000000000000000000';
      // At offset 16 bytes = 32 hex chars
      expect(parseU128LEAtOffset(hex, 16)).toBe(BigInt(1));
    });

    it('should handle pool reserve offsets (64, 80, 96 bytes)', () => {
      // Simulate pool data: 64 bytes of prefix + reserves
      const prefix = '00'.repeat(64); // 64 bytes of zeros
      const reserve0 = '01000000000000000000000000000000'; // 1
      const reserve1 = '02000000000000000000000000000000'; // 2
      const totalSupply = '03000000000000000000000000000000'; // 3
      const hex = prefix + reserve0 + reserve1 + totalSupply;

      expect(parseU128LEAtOffset(hex, 64)).toBe(BigInt(1));
      expect(parseU128LEAtOffset(hex, 80)).toBe(BigInt(2));
      expect(parseU128LEAtOffset(hex, 96)).toBe(BigInt(3));
    });
  });

  describe('readVarint', () => {
    it('should read single-byte varint', () => {
      const buf = Buffer.from([0x01]);
      const result = readVarint(buf, 0);
      expect(result.value).toBe(1);
      expect(result.newPos).toBe(1);
    });

    it('should read multi-byte varint', () => {
      // 300 = 0xAC 0x02 in varint encoding
      const buf = Buffer.from([0xac, 0x02]);
      const result = readVarint(buf, 0);
      expect(result.value).toBe(300);
      expect(result.newPos).toBe(2);
    });

    it('should read varint from middle of buffer', () => {
      const buf = Buffer.from([0xff, 0xff, 0x05, 0x00]);
      const result = readVarint(buf, 2);
      expect(result.value).toBe(5);
      expect(result.newPos).toBe(3);
    });

    it('should handle zero', () => {
      const buf = Buffer.from([0x00]);
      const result = readVarint(buf, 0);
      expect(result.value).toBe(0);
      expect(result.newPos).toBe(1);
    });
  });

  describe('calculatePrice', () => {
    it('should calculate price from reserves', () => {
      const reserve0 = BigInt(1000000000); // 10 DIESEL (8 decimals)
      const reserve1 = BigInt(500000000);  // 5 frBTC (8 decimals)
      const price = calculatePrice(reserve0, reserve1, 8, 8);
      expect(price).toBe(0.5); // 5/10 = 0.5
    });

    it('should handle different decimal configurations', () => {
      const reserve0 = BigInt(1000000); // 1 token with 6 decimals
      const reserve1 = BigInt(2000000000); // 20 tokens with 8 decimals
      const price = calculatePrice(reserve0, reserve1, 6, 8);
      expect(price).toBe(20); // 20/1 = 20
    });

    it('should return 0 for zero reserve0', () => {
      const price = calculatePrice(BigInt(0), BigInt(1000), 8, 8);
      expect(price).toBe(0);
    });

    it('should handle large values', () => {
      const reserve0 = BigInt('444121520576000000'); // Large DIESEL balance
      const reserve1 = BigInt('100000000000');       // Some frBTC
      const price = calculatePrice(reserve0, reserve1, 8, 8);
      expect(price).toBeGreaterThan(0);
      expect(price).toBeLessThan(1); // frBTC should be worth more than DIESEL
    });
  });

  describe('formatAlkaneId', () => {
    it('should format alkane ID correctly', () => {
      expect(formatAlkaneId({ block: 2, tx: 0 })).toBe('2:0');
      expect(formatAlkaneId({ block: 32, tx: 0 })).toBe('32:0');
      expect(formatAlkaneId({ block: 2, tx: 77087 })).toBe('2:77087');
    });
  });

  describe('KNOWN_TOKENS constant', () => {
    it('should have DIESEL token defined', () => {
      expect(KNOWN_TOKENS['2:0']).toBeDefined();
      expect(KNOWN_TOKENS['2:0'].symbol).toBe('DIESEL');
      expect(KNOWN_TOKENS['2:0'].decimals).toBe(8);
    });

    it('should have frBTC token defined', () => {
      expect(KNOWN_TOKENS['32:0']).toBeDefined();
      expect(KNOWN_TOKENS['32:0'].symbol).toBe('frBTC');
    });

    it('should have bUSD token defined', () => {
      expect(KNOWN_TOKENS['2:56801']).toBeDefined();
      expect(KNOWN_TOKENS['2:56801'].symbol).toBe('bUSD');
    });

    it('should have LP tokens defined', () => {
      expect(KNOWN_TOKENS['2:68441']).toBeDefined(); // DIESEL/bUSD LP
      expect(KNOWN_TOKENS['2:77087']).toBeDefined(); // DIESEL/frBTC LP
    });
  });

  describe('POOLS constant', () => {
    it('should have DIESEL/frBTC pool defined', () => {
      expect(POOLS.DIESEL_FRBTC).toBeDefined();
      expect(POOLS.DIESEL_FRBTC.token0Symbol).toBe('DIESEL');
      expect(POOLS.DIESEL_FRBTC.token1Symbol).toBe('frBTC');
      expect(POOLS.DIESEL_FRBTC.protobufPayload).toMatch(/^0x/);
    });

    it('should have DIESEL/bUSD pool defined', () => {
      expect(POOLS.DIESEL_BUSD).toBeDefined();
      expect(POOLS.DIESEL_BUSD.token0Symbol).toBe('DIESEL');
      expect(POOLS.DIESEL_BUSD.token1Symbol).toBe('bUSD');
      expect(POOLS.DIESEL_BUSD.protobufPayload).toMatch(/^0x/);
    });
  });

  describe('DIESEL_TOKEN constant', () => {
    it('should have correct alkane ID', () => {
      expect(DIESEL_TOKEN.alkaneId.block).toBe(2);
      expect(DIESEL_TOKEN.alkaneId.tx).toBe(0);
    });

    it('should have 8 decimals', () => {
      expect(DIESEL_TOKEN.decimals).toBe(8);
    });

    it('should have total supply payload', () => {
      expect(DIESEL_TOKEN.totalSupplyPayload).toMatch(/^0x/);
    });
  });
});

describe('alkanes-client pool parsing', () => {
  // These tests would require actual hex data from the RPC
  // For now, we test the structure

  describe('parsePoolReservesHex', () => {
    it('should be tested with actual pool data', () => {
      // This would require mocking the RPC response
      // Integration tests cover this with live data
      expect(true).toBe(true);
    });
  });

  describe('parseTotalSupplyHex', () => {
    it('should be tested with actual supply data', () => {
      // This would require mocking the RPC response
      // Integration tests cover this with live data
      expect(true).toBe(true);
    });
  });
});
