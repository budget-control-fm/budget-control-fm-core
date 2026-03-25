import { Email } from "../../../../src/kernel/domain/value-objects/email.vo.js";

describe("Email.of()", () => {
  describe("valid inputs", () => {
    it("creates an Email from a valid email address", () => {
      const email = Email.of("john.doe@example.com");
      expect(email.value).toBe("john.doe@example.com");
    });

    it("normalizes to lowercase", () => {
      const email = Email.of("John.Doe@Example.COM");
      expect(email.value).toBe("john.doe@example.com");
    });

    it("trims surrounding whitespace before validating", () => {
      const email = Email.of("  john.doe@example.com  ");
      expect(email.value).toBe("john.doe@example.com");
    });

    it("trims and normalizes to lowercase together", () => {
      const email = Email.of("  John.Doe@Example.COM  ");
      expect(email.value).toBe("john.doe@example.com");
    });

    it("accepts email with subdomains", () => {
      const email = Email.of("john.doe@mail.example.com");
      expect(email.value).toBe("john.doe@mail.example.com");
    });

    it("accepts email with plus sign", () => {
      const email = Email.of("john+filter@example.com");
      expect(email.value).toBe("john+filter@example.com");
    });

    it("accepts email with numbers", () => {
      const email = Email.of("john123@example456.com");
      expect(email.value).toBe("john123@example456.com");
    });
  });

  describe("invalid inputs", () => {
    it("throws TypeError for an empty string", () => {
      expect(() => Email.of("")).toThrow(TypeError);
    });

    it("throws TypeError for a whitespace-only string", () => {
      expect(() => Email.of("   ")).toThrow(TypeError);
    });

    it("throws TypeError for a plain string with no @", () => {
      expect(() => Email.of("notanemail")).toThrow(TypeError);
    });

    it("throws TypeError for missing domain", () => {
      expect(() => Email.of("john@")).toThrow(TypeError);
    });

    it("throws TypeError for missing local part", () => {
      expect(() => Email.of("@example.com")).toThrow(TypeError);
    });

    it("throws TypeError for missing TLD", () => {
      expect(() => Email.of("john@example")).toThrow(TypeError);
    });

    it("throws TypeError for email with spaces", () => {
      expect(() => Email.of("john doe@example.com")).toThrow(TypeError);
    });

    it("throws TypeError for multiple @ signs", () => {
      expect(() => Email.of("john@@example.com")).toThrow(TypeError);
    });

    it("throws TypeError with correct message", () => {
      expect(() => Email.of("notanemail")).toThrow("Invalid email address");
    });
  });
});

describe("Email.equals()", () => {
  it("returns true for two Emails with the same value", () => {
    const a = Email.of("john.doe@example.com");
    const b = Email.of("john.doe@example.com");
    expect(a.equals(b)).toBe(true);
  });

  it("returns true for emails that differ only in casing", () => {
    const a = Email.of("john.doe@example.com");
    const b = Email.of("JOHN.DOE@EXAMPLE.COM");
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for two Emails with different values", () => {
    const a = Email.of("john.doe@example.com");
    const b = Email.of("jane.doe@example.com");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive — an Email equals itself", () => {
    const a = Email.of("john.doe@example.com");
    expect(a.equals(a)).toBe(true);
  });

  it("is symmetric — if a equals b then b equals a", () => {
    const a = Email.of("john.doe@example.com");
    const b = Email.of("john.doe@example.com");
    expect(a.equals(b)).toBe(true);
    expect(b.equals(a)).toBe(true);
  });
});

describe("Email.toString()", () => {
  it("returns the email string value", () => {
    const email = Email.of("john.doe@example.com");
    expect(email.toString()).toBe("john.doe@example.com");
  });

  it("works correctly in string interpolation", () => {
    const email = Email.of("john.doe@example.com");
    expect(`Email: ${email}`).toBe("Email: john.doe@example.com");
  });
});

describe("Email immutability", () => {
  it("value cannot be reassigned", () => {
    const email = Email.of("john.doe@example.com");
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      email.value = "hacker@evil.com";
    }).toThrow(TypeError);
  });
});
