import { FullName } from "../../../../src/domain/user/value-objects/full-name.vo.js";

describe("FullName.of()", () => {
  describe("valid inputs", () => {
    it("creates a FullName from a valid full name", () => {
      const fullName = FullName.of("John Doe");
      expect(fullName.value).toBe("John Doe");
    });

    it("trims surrounding whitespace", () => {
      const fullName = FullName.of("  John Doe  ");
      expect(fullName.value).toBe("John Doe");
    });

    it("collapses internal whitespace", () => {
      const fullName = FullName.of("John  Doe");
      expect(fullName.value).toBe("John Doe");
    });

    it("trims and collapses internal whitespace together", () => {
      const fullName = FullName.of("  John   Doe  ");
      expect(fullName.value).toBe("John Doe");
    });

    it("accepts names with more than two parts", () => {
      const fullName = FullName.of("John Michael Doe");
      expect(fullName.value).toBe("John Michael Doe");
    });

    it("accepts names with exactly 3 characters", () => {
      const fullName = FullName.of("A B");
      expect(fullName.value).toBe("A B");
    });
  });

  describe("invalid inputs", () => {
    it("throws TypeError for an empty string", () => {
      expect(() => FullName.of("")).toThrow(TypeError);
    });

    it("throws TypeError for a whitespace-only string", () => {
      expect(() => FullName.of("   ")).toThrow(TypeError);
    });

    it("throws TypeError for a name shorter than 3 characters", () => {
      expect(() => FullName.of("AB")).toThrow(TypeError);
    });

    it("throws TypeError with correct message for short name", () => {
      expect(() => FullName.of("AB")).toThrow(
        "Full name must have at least 3 characters",
      );
    });

    it("throws TypeError for a single name with no space", () => {
      expect(() => FullName.of("John")).toThrow(TypeError);
    });

    it("throws TypeError with correct message for missing last name", () => {
      expect(() => FullName.of("John")).toThrow(
        "Full name must include at least first and last name",
      );
    });

    it("throws TypeError for a name that is only spaces after trimming", () => {
      expect(() => FullName.of("     ")).toThrow(TypeError);
    });
  });
});

describe("FullName.equals()", () => {
  it("returns true for two FullNames with the same value", () => {
    const a = FullName.of("John Doe");
    const b = FullName.of("John Doe");
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for two FullNames with different values", () => {
    const a = FullName.of("John Doe");
    const b = FullName.of("Jane Doe");
    expect(a.equals(b)).toBe(false);
  });

  it("returns false for same names with different casing", () => {
    const a = FullName.of("John Doe");
    const b = FullName.of("john doe");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive — a FullName equals itself", () => {
    const a = FullName.of("John Doe");
    expect(a.equals(a)).toBe(true);
  });

  it("is symmetric — if a equals b then b equals a", () => {
    const a = FullName.of("John Doe");
    const b = FullName.of("John Doe");
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });

  it("returns true for names that differ only in internal whitespace", () => {
    const a = FullName.of("John  Doe");
    const b = FullName.of("John Doe");
    expect(a.equals(b)).toBe(true);
  });
});

describe("FullName.toString()", () => {
  it("returns the full name string value", () => {
    const fullName = FullName.of("John Doe");
    expect(fullName.toString()).toBe("John Doe");
  });

  it("works correctly in string interpolation", () => {
    const fullName = FullName.of("John Doe");
    expect(`Name: ${fullName}`).toBe("Name: John Doe");
  });
});

describe("FullName immutability", () => {
  it("value cannot be reassigned", () => {
    const fullName = FullName.of("John Doe");
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      fullName.value = "Jane Doe";
    }).toThrow(TypeError);
  });
});
