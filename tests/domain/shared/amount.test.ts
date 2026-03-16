import { Amount } from "../../../src/domain/shared/amount.js";

describe("Amount.of()", () => {
  describe("valid inputs", () => {
    it("creates an Amount from a positive integer", () => {
      const amount = Amount.of(10000, "BRL");
      expect(amount.cents).toBe(10000);
      expect(amount.currency).toBe("BRL");
    });

    it("creates an Amount from a negative integer", () => {
      const amount = Amount.of(-10000, "BRL");
      expect(amount.cents).toBe(-10000);
      expect(amount.currency).toBe("BRL");
    });

    it("creates an Amount from zero", () => {
      const amount = Amount.of(0, "BRL");
      expect(amount.cents).toBe(0);
    });

    it("accepts USD currency", () => {
      const amount = Amount.of(10000, "USD");
      expect(amount.currency).toBe("USD");
    });

    it("accepts BRL currency", () => {
      const amount = Amount.of(10000, "BRL");
      expect(amount.currency).toBe("BRL");
    });
  });

  describe("invalid inputs", () => {
    it("throws TypeError for a decimal value", () => {
      expect(() => Amount.of(99.99, "BRL")).toThrow(TypeError);
    });

    it("throws TypeError for NaN", () => {
      expect(() => Amount.of(Number.NaN, "BRL")).toThrow(TypeError);
    });

    it("throws TypeError for Infinity", () => {
      expect(() => Amount.of(Infinity, "BRL")).toThrow(TypeError);
    });

    it("throws TypeError for -Infinity", () => {
      expect(() => Amount.of(-Infinity, "BRL")).toThrow(TypeError);
    });

    it("throws TypeError with correct message for a decimal value", () => {
      expect(() => Amount.of(99.99, "BRL")).toThrow(
        "Amount must be an integer",
      );
    });
  });
});

describe("Amount.add()", () => {
  it("adds two positive amounts of the same currency", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(5000, "BRL");
    expect(a.add(b).cents).toBe(15000);
  });

  it("adds a positive and a negative amount", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(-3000, "BRL");
    expect(a.add(b).cents).toBe(7000);
  });

  it("adds two negative amounts", () => {
    const a = Amount.of(-10000, "BRL");
    const b = Amount.of(-5000, "BRL");
    expect(a.add(b).cents).toBe(-15000);
  });

  it("returns a new Amount instance", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(5000, "BRL");
    expect(a.add(b)).not.toBe(a);
  });

  it("throws TypeError when adding different currencies", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(() => a.add(b)).toThrow(TypeError);
  });

  it("throws TypeError with correct message when adding different currencies", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(() => a.add(b)).toThrow(
      "Cannot operate on different currencies (BRL vs USD)",
    );
  });
});

describe("Amount.subtract()", () => {
  it("subtracts two positive amounts of the same currency", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(3000, "BRL");
    expect(a.subtract(b).cents).toBe(7000);
  });

  it("produces a negative result when subtracting a larger amount", () => {
    const a = Amount.of(3000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.subtract(b).cents).toBe(-7000);
  });

  it("subtracts a negative amount resulting in a larger value", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(-3000, "BRL");
    expect(a.subtract(b).cents).toBe(13000);
  });

  it("returns a new Amount instance", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(3000, "BRL");
    expect(a.subtract(b)).not.toBe(a);
  });

  it("throws TypeError when subtracting different currencies", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(() => a.subtract(b)).toThrow(TypeError);
  });
});

describe("Amount.isGreaterThan()", () => {
  it("returns true when amount is greater than the other", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(5000, "BRL");
    expect(a.isGreaterThan(b)).toBe(true);
  });

  it("returns false when amount is less than the other", () => {
    const a = Amount.of(5000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.isGreaterThan(b)).toBe(false);
  });

  it("returns false when amounts are equal", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.isGreaterThan(b)).toBe(false);
  });

  it("works correctly with negative amounts", () => {
    const a = Amount.of(-3000, "BRL");
    const b = Amount.of(-10000, "BRL");
    expect(a.isGreaterThan(b)).toBe(true);
  });

  it("throws TypeError when comparing different currencies", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(() => a.isGreaterThan(b)).toThrow(TypeError);
  });
});

describe("Amount.isLessThan()", () => {
  it("returns true when amount is less than the other", () => {
    const a = Amount.of(5000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.isLessThan(b)).toBe(true);
  });

  it("returns false when amount is greater than the other", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(5000, "BRL");
    expect(a.isLessThan(b)).toBe(false);
  });

  it("returns false when amounts are equal", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.isLessThan(b)).toBe(false);
  });

  it("works correctly with negative amounts", () => {
    const a = Amount.of(-10000, "BRL");
    const b = Amount.of(-3000, "BRL");
    expect(a.isLessThan(b)).toBe(true);
  });

  it("throws TypeError when comparing different currencies", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(() => a.isLessThan(b)).toThrow(TypeError);
  });
});

describe("Amount.equals()", () => {
  it("returns true for two amounts with same cents and currency", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for same cents but different currency", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "USD");
    expect(a.equals(b)).toBe(false);
  });

  it("returns false for same currency but different cents", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(5000, "BRL");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive — an Amount equals itself", () => {
    const a = Amount.of(10000, "BRL");
    expect(a.equals(a)).toBe(true);
  });

  it("is symmetric — if a equals b then b equals a", () => {
    const a = Amount.of(10000, "BRL");
    const b = Amount.of(10000, "BRL");
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it("works correctly with negative amounts", () => {
    const a = Amount.of(-10000, "BRL");
    const b = Amount.of(-10000, "BRL");
    expect(a.equals(b)).toBe(true);
  });
});

describe("Amount.toString()", () => {
  it("returns cents and currency as a string", () => {
    const amount = Amount.of(10000, "BRL");
    expect(amount.toString()).toBe("10000 BRL");
  });

  it("works correctly in string interpolation", () => {
    const amount = Amount.of(10000, "BRL");
    expect(`Amount: ${amount}`).toBe("Amount: 10000 BRL");
  });

  it("represents negative amounts correctly", () => {
    const amount = Amount.of(-10000, "BRL");
    expect(amount.toString()).toBe("-10000 BRL");
  });
});

describe("Amount immutability", () => {
  it("cents cannot be reassigned", () => {
    const amount = Amount.of(10000, "BRL");
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      amount.cents = 99999;
    }).toThrow(TypeError);
  });

  it("currency cannot be reassigned", () => {
    const amount = Amount.of(10000, "BRL");
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      amount.currency = "USD";
    }).toThrow(TypeError);
  });
});
