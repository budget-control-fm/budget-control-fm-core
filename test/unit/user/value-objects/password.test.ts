import { Password } from "../../../../src/user/domain/value-objects/password.vo.js";

describe("Password.of()", () => {
  describe("valid inputs", () => {
    it("creates a Password from a valid value", () => {
      const password = Password.of("abc1!");
      expect(password.value).toBe("abc1!");
    });

    it("accepts a password with exactly 5 characters", () => {
      const password = Password.of("ab1!c");
      expect(password.value).toBe("ab1!c");
    });

    it("accepts a password with exactly 16 characters", () => {
      const password = Password.of("Abcd1234!Efghijk");
      expect(password.value).toBe("Abcd1234!Efghijk");
    });
  });

  describe("invalid inputs", () => {
    it("throws TypeError for an empty string", () => {
      expect(() => Password.of("")).toThrow(TypeError);
    });

    it("throws TypeError with correct message for an empty string", () => {
      expect(() => Password.of("")).toThrow(
        "Password must be a non-empty string",
      );
    });

    it("throws TypeError for a password shorter than 5 characters", () => {
      expect(() => Password.of("a1!b")).toThrow(TypeError);
    });

    it("throws TypeError with correct message for a short password", () => {
      expect(() => Password.of("a1!b")).toThrow(
        "Password must be between 5 and 16 characters",
      );
    });

    it("throws TypeError for a password longer than 16 characters", () => {
      expect(() => Password.of("Abcd1234!Efghijkl")).toThrow(TypeError);
    });

    it("throws TypeError when the password does not contain a number", () => {
      expect(() => Password.of("abcde!")).toThrow(TypeError);
    });

    it("throws TypeError with correct message when number is missing", () => {
      expect(() => Password.of("abcde!")).toThrow(
        "Password must contain at least one number",
      );
    });

    it("throws TypeError when the password does not contain a special character", () => {
      expect(() => Password.of("abcde1")).toThrow(TypeError);
    });

    it("throws TypeError with correct message when special character is missing", () => {
      expect(() => Password.of("abcde1")).toThrow(
        "Password must contain at least one special character",
      );
    });
  });
});

describe("Password.equals()", () => {
  it("returns true for two Passwords with the same value", () => {
    const a = Password.of("abc1!");
    const b = Password.of("abc1!");
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for two Passwords with different values", () => {
    const a = Password.of("abc1!");
    const b = Password.of("xyz1!");
    expect(a.equals(b)).toBe(false);
  });

  it("is reflexive", () => {
    const password = Password.of("abc1!");
    expect(password.equals(password)).toBe(true);
  });
});

describe("Password.toString()", () => {
  it("returns a masked string", () => {
    const password = Password.of("abc1!");
    expect(password.toString()).toBe("********");
  });

  it("works correctly in string interpolation", () => {
    const password = Password.of("abc1!");
    expect(`Password: ${password}`).toBe("Password: ********");
  });
});

describe("Password immutability", () => {
  it("value cannot be reassigned", () => {
    const password = Password.of("abc1!");
    expect(() => {
      // @ts-expect-error - testing runtime immutability
      password.value = "xyz1!";
    }).toThrow(TypeError);
  });
});
