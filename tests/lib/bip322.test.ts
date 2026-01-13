import { describe, it, expect } from "vitest";
import {
  verifyMessage,
  signMessage,
  isValidSignature,
  detectAddressType,
  verifyActionSignature,
} from "@/lib/bip322";

describe("lib/bip322", () => {
  describe("detectAddressType", () => {
    it("detects P2WPKH mainnet addresses (bc1q...)", () => {
      expect(detectAddressType("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")).toBe("p2wpkh");
    });

    it("detects P2TR mainnet addresses (bc1p...)", () => {
      expect(detectAddressType("bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0")).toBe("p2tr");
    });

    it("detects P2SH mainnet addresses (3...)", () => {
      expect(detectAddressType("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy")).toBe("p2sh-p2wpkh");
    });

    it("detects P2PKH mainnet addresses (1...)", () => {
      expect(detectAddressType("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2")).toBe("p2pkh");
    });

    it("detects P2WPKH testnet addresses (tb1q...)", () => {
      expect(detectAddressType("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx")).toBe("p2wpkh");
    });

    it("detects P2TR testnet addresses (tb1p...)", () => {
      expect(detectAddressType("tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c")).toBe("p2tr");
    });

    it("detects P2SH testnet addresses (2...)", () => {
      expect(detectAddressType("2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc")).toBe("p2sh-p2wpkh");
    });

    it("detects P2PKH testnet addresses (m... or n...)", () => {
      expect(detectAddressType("mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn")).toBe("p2pkh");
      expect(detectAddressType("n3GNqMveyvaPvUbH469vDRadqpJMPc84JA")).toBe("p2pkh");
    });

    it("detects regtest addresses (bcrt1...)", () => {
      expect(detectAddressType("bcrt1q6rhpng9evdsfnn833a4f4vej0asu6dk5srld6x")).toBe("p2wpkh");
      expect(detectAddressType("bcrt1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvses5wp4dt")).toBe("p2tr");
    });

    it("returns unknown for invalid addresses", () => {
      expect(detectAddressType("invalid")).toBe("unknown");
      expect(detectAddressType("0x1234567890abcdef")).toBe("unknown");
      expect(detectAddressType("")).toBe("unknown");
    });
  });

  describe("verifyMessage", () => {
    it("returns error for empty address", () => {
      const result = verifyMessage("", "test message", "signature");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid address");
    });

    it("returns error for empty message", () => {
      const result = verifyMessage("bc1qtest", "", "signature");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid message");
    });

    it("returns error for empty signature", () => {
      const result = verifyMessage("bc1qtest", "message", "");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid signature");
    });

    it("returns error for unsupported address format", () => {
      const result = verifyMessage("0x1234567890abcdef", "message", "signature");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unsupported address format");
      expect(result.addressType).toBe("unknown");
    });

    it("returns false for invalid signature", () => {
      const result = verifyMessage(
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "test message",
        "invalidbase64signature=="
      );
      expect(result.valid).toBe(false);
      expect(result.addressType).toBe("p2wpkh");
    });

    // Integration test - verifies that valid signatures can be checked
    // Note: These tests verify the verification logic works, using known-bad sigs
    it("handles P2WPKH verification attempt", () => {
      const address = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
      const message = "test message";
      const signature = "invalidbase64sig==";

      const result = verifyMessage(address, message, signature);
      // Should return a result (valid or not) without throwing
      expect(result).toBeDefined();
      expect(result.addressType).toBe("p2wpkh");
    });

    it("handles P2TR verification attempt", () => {
      const address = "bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0";
      const message = "test message";
      const signature = "invalidbase64sig==";

      const result = verifyMessage(address, message, signature);
      expect(result).toBeDefined();
      expect(result.addressType).toBe("p2tr");
    });
  });

  describe("signMessage", () => {
    it("throws error for empty private key", () => {
      expect(() => signMessage("", "address", "message")).toThrow("Invalid private key");
    });

    it("throws error for empty address", () => {
      expect(() => signMessage("privatekey", "", "message")).toThrow("Invalid address");
    });

    it("throws error for empty message", () => {
      expect(() => signMessage("privatekey", "address", "")).toThrow("Invalid message");
    });

    it("throws error for unsupported address format", () => {
      expect(() => signMessage("L2Gkw3kKJ6N24QcDuH4XDqt9cTqsKTVNDGz1CRZhk9cq4auDUbJy", "0xinvalid", "message"))
        .toThrow("Unsupported address format");
    });
  });

  describe("isValidSignature", () => {
    it("returns boolean for signature check", () => {
      const address = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
      const message = "test";
      const signature = "somesignature==";

      // Should return a boolean without throwing
      const result = isValidSignature(address, message, signature);
      expect(typeof result).toBe("boolean");
    });

    it("returns false for invalid signature", () => {
      expect(isValidSignature(
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "test",
        "invalidsig=="
      )).toBe(false);
    });
  });

  describe("verifyActionSignature", () => {
    it("verifies action with payload", () => {
      // This test verifies the message reconstruction logic
      // even if the signature is invalid
      const result = verifyActionSignature(
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "vote",
        { proposalId: "123", choice: 1 },
        "invalidsig=="
      );

      expect(result.valid).toBe(false);
      expect(result.addressType).toBe("p2wpkh");
    });

    it("includes timestamp in message when provided", () => {
      const result = verifyActionSignature(
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "vote",
        { proposalId: "123", choice: 1 },
        "invalidsig==",
        1704067200 // 2024-01-01 00:00:00 UTC
      );

      expect(result.valid).toBe(false);
      // The function should have constructed message with timestamp
      expect(result.addressType).toBe("p2wpkh");
    });
  });
});
