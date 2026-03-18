import { IsoDate } from "../../../src/domain/shared/iso-date.vo.js";

describe("IsoDate.of()", () => {
  describe("valid inputs", () => {
    it("creates an IsoDate from a valid date string", () => {
      const date = IsoDate.of("2024-01-15");
      expect(date.value).toBe("2024-01-15");
    });

    it("trims surrounding whitespace before validating", () => {
      const date = IsoDate.of("  2024-01-15  ");
      expect(date.value).toBe("2024-01-15");
    });

    it("accepts leap year date Feb 29 on a leap year", () => {
      const date = IsoDate.of("2024-02-29");
      expect(date.value).toBe("2024-02-29");
    });

    it("accepts the first day of the year", () => {
      const date = IsoDate.of("2024-01-01");
      expect(date.value).toBe("2024-01-01");
    });

    it("accepts the last day of the year", () => {
      const date = IsoDate.of("2024-12-31");
      expect(date.value).toBe("2024-12-31");
    });
  });

  describe("invalid format", () => {
    it("throws TypeError for an empty string", () => {
      expect(() => IsoDate.of("")).toThrow(TypeError);
    });

    it("throws TypeError for a whitespace-only string", () => {
      expect(() => IsoDate.of("   ")).toThrow(TypeError);
    });

    it("throws TypeError for a plain string", () => {
      expect(() => IsoDate.of("not-a-date")).toThrow(TypeError);
    });

    it("throws TypeError for DD-MM-YYYY format", () => {
      expect(() => IsoDate.of("15-01-2024")).toThrow(TypeError);
    });

    it("throws TypeError for MM/DD/YYYY format", () => {
      expect(() => IsoDate.of("01/15/2024")).toThrow(TypeError);
    });

    it("throws TypeError for a datetime string", () => {
      expect(() => IsoDate.of("2024-01-15T00:00:00Z")).toThrow(TypeError);
    });

    it("throws TypeError for a date with missing leading zeros", () => {
      expect(() => IsoDate.of("2024-1-5")).toThrow(TypeError);
    });

    it("throws TypeError message indicating YYYY-MM-DD format", () => {
      expect(() => IsoDate.of("not-a-date")).toThrow(
        "IsoDate must be in YYYY-MM-DD format",
      );
    });
  });

  describe("invalid calendar dates", () => {
    it("throws TypeError for Feb 29 on a non-leap year", () => {
      expect(() => IsoDate.of("2023-02-29")).toThrow(TypeError);
    });

    it("throws TypeError for Feb 30", () => {
      expect(() => IsoDate.of("2024-02-30")).toThrow(TypeError);
    });

    it("throws TypeError for Feb 31", () => {
      expect(() => IsoDate.of("2024-02-31")).toThrow(TypeError);
    });

    it("throws TypeError for April 31", () => {
      expect(() => IsoDate.of("2024-04-31")).toThrow(TypeError);
    });

    it("throws TypeError for month 00", () => {
      expect(() => IsoDate.of("2024-00-01")).toThrow(TypeError);
    });

    it("throws TypeError for month 13", () => {
      expect(() => IsoDate.of("2024-13-01")).toThrow(TypeError);
    });

    it("throws TypeError for day 00", () => {
      expect(() => IsoDate.of("2024-01-00")).toThrow(TypeError);
    });

    it("throws TypeError for day 32", () => {
      expect(() => IsoDate.of("2024-01-32")).toThrow(TypeError);
    });
  });
});

describe("IsoDate.equals()", () => {
  it("returns true for two IsoDate with the same value", () => {
    const a = IsoDate.of("2024-01-15");
    const b = IsoDate.of("2024-01-15");
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for two IsoDate with different values", () => {
    const a = IsoDate.of("2024-01-15");
    const b = IsoDate.of("2024-01-16");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive — an IsoDate equals itself", () => {
    const a = IsoDate.of("2024-01-15");
    expect(a.equals(a)).toBe(true);
  });

  it("is symmetric — if a equals b then b equals a", () => {
    const a = IsoDate.of("2024-01-15");
    const b = IsoDate.of("2024-01-15");
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });
});

describe("IsoDate.isBefore()", () => {
  it("returns true when date is before the other", () => {
    const a = IsoDate.of("2024-01-01");
    const b = IsoDate.of("2024-01-02");
    expect(a.isBefore(b)).toBe(true);
  });

  it("returns false when date is after the other", () => {
    const a = IsoDate.of("2024-01-02");
    const b = IsoDate.of("2024-01-01");
    expect(a.isBefore(b)).toBe(false);
  });

  it("returns false when dates are equal", () => {
    const a = IsoDate.of("2024-01-01");
    const b = IsoDate.of("2024-01-01");
    expect(a.isBefore(b)).toBe(false);
  });

  it("works across different months", () => {
    const a = IsoDate.of("2024-01-31");
    const b = IsoDate.of("2024-02-01");
    expect(a.isBefore(b)).toBe(true);
  });

  it("works across different years", () => {
    const a = IsoDate.of("2023-12-31");
    const b = IsoDate.of("2024-01-01");
    expect(a.isBefore(b)).toBe(true);
  });
});

describe("IsoDate.isAfter()", () => {
  it("returns true when date is after the other", () => {
    const a = IsoDate.of("2024-01-02");
    const b = IsoDate.of("2024-01-01");
    expect(a.isAfter(b)).toBe(true);
  });

  it("returns false when date is before the other", () => {
    const a = IsoDate.of("2024-01-01");
    const b = IsoDate.of("2024-01-02");
    expect(a.isAfter(b)).toBe(false);
  });

  it("returns false when dates are equal", () => {
    const a = IsoDate.of("2024-01-01");
    const b = IsoDate.of("2024-01-01");
    expect(a.isAfter(b)).toBe(false);
  });

  it("works across different months", () => {
    const a = IsoDate.of("2024-02-01");
    const b = IsoDate.of("2024-01-31");
    expect(a.isAfter(b)).toBe(true);
  });

  it("works across different years", () => {
    const a = IsoDate.of("2024-01-01");
    const b = IsoDate.of("2023-12-31");
    expect(a.isAfter(b)).toBe(true);
  });
});

describe("IsoDate.toString()", () => {
  it("returns the date string value", () => {
    const date = IsoDate.of("2024-01-15");
    expect(date.toString()).toBe("2024-01-15");
  });

  it("works correctly in string interpolation", () => {
    const date = IsoDate.of("2024-01-15");
    expect(`Date: ${date}`).toBe("Date: 2024-01-15");
  });
});

describe("IsoDate immutability", () => {
  it("value cannot be reassigned", () => {
    const date = IsoDate.of("2024-01-15");
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      date.value = "2099-01-01";
    }).toThrow(TypeError);
  });
});
