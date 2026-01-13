import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatAddress,
  satsToBtc,
  formatNumber,
  formatDiesel,
  parseDiesel,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatTimeRemaining,
  sleep,
  generateId,
  isValidBitcoinAddress,
} from "@/lib/utils";

describe("lib/utils", () => {
  describe("cn (className merge)", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("handles arrays", () => {
      expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("handles objects", () => {
      expect(cn({ foo: true, bar: false })).toBe("foo");
    });

    it("merges tailwind classes correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("handles undefined and null", () => {
      expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("handles empty inputs", () => {
      expect(cn()).toBe("");
    });
  });

  describe("formatAddress", () => {
    it("truncates long addresses", () => {
      expect(formatAddress("bc1qxyztest1234567890abcdefgh", 6)).toBe(
        "bc1qxy...cdefgh"
      );
    });

    it("returns full address if shorter than chars * 2", () => {
      expect(formatAddress("short", 6)).toBe("short");
    });

    it("returns empty string for empty input", () => {
      expect(formatAddress("")).toBe("");
    });

    it("handles custom char count", () => {
      expect(formatAddress("bc1qxyztest1234567890abcdefgh", 4)).toBe(
        "bc1q...efgh"
      );
    });

    it("handles address exactly at threshold", () => {
      expect(formatAddress("123456789012", 6)).toBe("123456789012");
    });
  });

  describe("satsToBtc", () => {
    it("converts satoshis to BTC", () => {
      expect(satsToBtc(100000000)).toBe("1");
    });

    it("handles fractional BTC", () => {
      expect(satsToBtc(50000000)).toBe("0.5");
    });

    it("handles small amounts", () => {
      expect(satsToBtc(1)).toBe("0.00000001");
    });

    it("handles zero", () => {
      expect(satsToBtc(0)).toBe("0");
    });

    it("handles bigint", () => {
      expect(satsToBtc(BigInt(100000000))).toBe("1");
    });

    it("removes trailing zeros", () => {
      expect(satsToBtc(10000000)).toBe("0.1");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      const result = formatNumber(1000000);
      expect(result).toMatch(/1.*000.*000/);
    });

    it("handles small numbers", () => {
      expect(formatNumber(42)).toBe("42");
    });

    it("handles bigint", () => {
      const result = formatNumber(BigInt(1000000));
      expect(result).toMatch(/1.*000.*000/);
    });

    it("handles zero", () => {
      expect(formatNumber(0)).toBe("0");
    });
  });

  describe("formatDiesel", () => {
    it("formats DIESEL with 6 decimals", () => {
      const result = formatDiesel(BigInt(1000000));
      expect(result).toBe("1");
    });

    it("handles fractional DIESEL", () => {
      const result = formatDiesel(BigInt(500000));
      expect(result).toBe("0.5");
    });

    it("handles large amounts", () => {
      const result = formatDiesel(BigInt(1000000000000));
      expect(result).toMatch(/1.*000.*000/);
    });

    it("handles zero", () => {
      expect(formatDiesel(BigInt(0))).toBe("0");
    });
  });

  describe("parseDiesel", () => {
    it("parses DIESEL string to bigint", () => {
      expect(parseDiesel("1")).toBe(BigInt(1000000));
    });

    it("handles decimal input", () => {
      expect(parseDiesel("1.5")).toBe(BigInt(1500000));
    });

    it("handles invalid input", () => {
      expect(parseDiesel("invalid")).toBe(BigInt(0));
    });

    it("handles empty string", () => {
      expect(parseDiesel("")).toBe(BigInt(0));
    });

    it("handles zero", () => {
      expect(parseDiesel("0")).toBe(BigInt(0));
    });
  });

  describe("formatDate", () => {
    it("formats Date object", () => {
      const date = new Date("2024-06-15T12:00:00Z");
      const result = formatDate(date);
      expect(result).toMatch(/Jun.*15.*2024/);
    });

    it("formats date string", () => {
      const result = formatDate("2024-06-15T12:00:00Z");
      expect(result).toMatch(/Jun.*15.*2024/);
    });
  });

  describe("formatDateTime", () => {
    it("formats Date with time", () => {
      const date = new Date("2024-06-15T14:30:00Z");
      const result = formatDateTime(date);
      expect(result).toContain("Jun");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("formats date string with time", () => {
      const result = formatDateTime("2024-06-15T14:30:00Z");
      expect(result).toContain("Jun");
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns 'just now' for recent times", () => {
      const date = new Date("2024-06-15T11:59:50Z");
      expect(formatRelativeTime(date)).toBe("just now");
    });

    it("returns minutes ago", () => {
      const date = new Date("2024-06-15T11:55:00Z");
      expect(formatRelativeTime(date)).toBe("5 minutes ago");
    });

    it("returns singular minute", () => {
      const date = new Date("2024-06-15T11:59:00Z");
      expect(formatRelativeTime(date)).toBe("1 minute ago");
    });

    it("returns hours ago", () => {
      const date = new Date("2024-06-15T10:00:00Z");
      expect(formatRelativeTime(date)).toBe("2 hours ago");
    });

    it("returns singular hour", () => {
      const date = new Date("2024-06-15T11:00:00Z");
      expect(formatRelativeTime(date)).toBe("1 hour ago");
    });

    it("returns days ago", () => {
      const date = new Date("2024-06-13T12:00:00Z");
      expect(formatRelativeTime(date)).toBe("2 days ago");
    });

    it("returns singular day", () => {
      const date = new Date("2024-06-14T12:00:00Z");
      expect(formatRelativeTime(date)).toBe("1 day ago");
    });

    it("handles string input", () => {
      expect(formatRelativeTime("2024-06-15T11:55:00Z")).toBe("5 minutes ago");
    });
  });

  describe("formatTimeRemaining", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns 'Ended' for past dates", () => {
      const date = new Date("2024-06-14T12:00:00Z");
      expect(formatTimeRemaining(date)).toBe("Ended");
    });

    it("returns days left", () => {
      const date = new Date("2024-06-17T12:00:00Z");
      expect(formatTimeRemaining(date)).toBe("2 days left");
    });

    it("returns singular day", () => {
      const date = new Date("2024-06-16T12:00:00Z");
      expect(formatTimeRemaining(date)).toBe("1 day left");
    });

    it("returns hours left", () => {
      const date = new Date("2024-06-15T14:00:00Z");
      expect(formatTimeRemaining(date)).toBe("2 hours left");
    });

    it("returns singular hour", () => {
      const date = new Date("2024-06-15T13:00:00Z");
      expect(formatTimeRemaining(date)).toBe("1 hour left");
    });

    it("returns minutes left", () => {
      const date = new Date("2024-06-15T12:30:00Z");
      expect(formatTimeRemaining(date)).toBe("30 minutes left");
    });

    it("returns singular minute", () => {
      const date = new Date("2024-06-15T12:01:00Z");
      expect(formatTimeRemaining(date)).toBe("1 minute left");
    });

    it("returns 'Less than a minute'", () => {
      const date = new Date("2024-06-15T12:00:30Z");
      expect(formatTimeRemaining(date)).toBe("Less than a minute");
    });

    it("handles string input", () => {
      expect(formatTimeRemaining("2024-06-17T12:00:00Z")).toBe("2 days left");
    });
  });

  describe("sleep", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("resolves after specified time", async () => {
      const promise = sleep(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("generates non-empty string", () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
    });
  });

  describe("isValidBitcoinAddress", () => {
    it("validates mainnet P2PKH (1...)", () => {
      expect(isValidBitcoinAddress("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2")).toBe(
        true
      );
    });

    it("validates mainnet P2SH (3...)", () => {
      expect(isValidBitcoinAddress("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy")).toBe(
        true
      );
    });

    it("validates mainnet bech32 (bc1...)", () => {
      expect(
        isValidBitcoinAddress("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")
      ).toBe(true);
    });

    it("validates testnet P2PKH (m... or n...)", () => {
      expect(isValidBitcoinAddress("mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn")).toBe(
        true
      );
      expect(isValidBitcoinAddress("n3GNqMveyvaPvUbH469vDRadqpJMPc84JA")).toBe(
        true
      );
    });

    it("validates testnet P2SH (2...)", () => {
      expect(isValidBitcoinAddress("2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc")).toBe(
        true
      );
    });

    it("validates testnet bech32 (tb1...)", () => {
      expect(
        isValidBitcoinAddress("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx")
      ).toBe(true);
    });

    it("validates regtest bech32 (bcrt1...)", () => {
      expect(
        isValidBitcoinAddress("bcrt1q6rhpng9evdsfnn833a4f4vej0asu6dk5srld6x")
      ).toBe(true);
    });

    it("rejects invalid addresses", () => {
      expect(isValidBitcoinAddress("invalid")).toBe(false);
      expect(isValidBitcoinAddress("0x1234567890abcdef")).toBe(false);
      expect(isValidBitcoinAddress("xyz123")).toBe(false);
    });
  });
});
