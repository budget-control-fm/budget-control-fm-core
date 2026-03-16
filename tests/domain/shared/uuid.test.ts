import { Uuid } from "../../../src/domain/shared/uuid.js";

// Dummy domain types for branded UUID tests
type User = { readonly _brand: "User" };
type Merchant = { readonly _brand: "Merchant" };

const VALID_UUID_V4 = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_V4_UPPERCASE = "550E8400-E29B-41D4-A716-446655440000";
const VALID_UUID_V4_WITH_SPACES = "  550e8400-e29b-41d4-a716-446655440000  ";

describe("Uuid.of()", () => {
  describe("valid inputs", () => {
    it("creates a Uuid from a valid UUIDv4 string", () => {
      const uuid = Uuid.of(VALID_UUID_V4);
      expect(uuid.value).toBe(VALID_UUID_V4);
    });

    it("accepts uppercase UUIDv4", () => {
      const uuid = Uuid.of(VALID_UUID_V4_UPPERCASE);
      expect(uuid.value).toBe(VALID_UUID_V4_UPPERCASE);
    });

    it("trims surrounding whitespace before validating", () => {
      const uuid = Uuid.of(VALID_UUID_V4_WITH_SPACES);
      expect(uuid.value).toBe(VALID_UUID_V4);
    });
  });

  describe("invalid inputs", () => {
    it("throws for an empty string", () => {
      expect(() => Uuid.of("")).toThrow("Uuid must be a valid UUIDv4");
    });

    it("throws for a plain string", () => {
      expect(() => Uuid.of("not-a-uuid")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUIDv1 (wrong version digit)", () => {
      expect(() => Uuid.of("550e8400-e29b-11d4-a716-446655440000")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUID with wrong variant bits", () => {
      // 3rd group's first nibble must be [89ab] — this uses '7'
      expect(() => Uuid.of("550e8400-e29b-41d4-7716-446655440000")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUID missing hyphens", () => {
      expect(() => Uuid.of("550e8400e29b41d4a716446655440000")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUID with too few characters", () => {
      expect(() => Uuid.of("550e8400-e29b-41d4-a716-44665544000")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUID with too many characters", () => {
      expect(() => Uuid.of("550e8400-e29b-41d4-a716-4466554400000")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a UUID with invalid hex characters", () => {
      expect(() => Uuid.of("550e8400-e29b-41d4-a716-44665544000z")).toThrow(
        "Uuid must be a valid UUIDv4",
      );
    });

    it("throws for a whitespace-only string", () => {
      expect(() => Uuid.of("   ")).toThrow("Uuid must be a valid UUIDv4");
    });
  });
});

describe("Uuid.equals()", () => {
  it("returns true for two Uuids with the same value", () => {
    const a = Uuid.of(VALID_UUID_V4);
    const b = Uuid.of(VALID_UUID_V4);
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for two Uuids with different values", () => {
    const a = Uuid.of("550e8400-e29b-41d4-a716-446655440000");
    const b = Uuid.of("661f9511-f3ac-42e5-b827-557766551111");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive — a Uuid equals itself", () => {
    const a = Uuid.of(VALID_UUID_V4);
    expect(a.equals(a)).toBe(true);
  });

  it("is symmetric — if a equals b then b equals a", () => {
    const a = Uuid.of(VALID_UUID_V4);
    const b = Uuid.of(VALID_UUID_V4);
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });
});

describe("Uuid branding", () => {
  it("branded Uuid<User> holds the correct value", () => {
    const userId = Uuid.of<User>(VALID_UUID_V4);
    expect(userId.value).toBe(VALID_UUID_V4);
  });

  it("two branded Uuid<User> with the same value are equal", () => {
    const a = Uuid.of<User>(VALID_UUID_V4);
    const b = Uuid.of<User>(VALID_UUID_V4);
    expect(a.equals(b)).toBe(true);
  });

  it("Uuid<User> and Uuid<Merchant> with same value are structurally equal at runtime", () => {
    // Branding is a compile-time constraint only — at runtime values are compared
    const userId = Uuid.of<User>(VALID_UUID_V4);
    const merchantId = Uuid.of<Merchant>(VALID_UUID_V4);
    expect(userId.value).toBe(merchantId.value);
  });
});

describe("Uuid immutability", () => {
  it("value cannot be reassigned", () => {
    const uuid = Uuid.of(VALID_UUID_V4);
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      uuid.value = "something-else";
    }).toThrow(TypeError);
  });
});
