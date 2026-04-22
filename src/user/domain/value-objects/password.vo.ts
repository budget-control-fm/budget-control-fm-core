const MIN_LENGTH = 5;
const MAX_LENGTH = 16;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export class Password {
  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static of(value: string): Password {
    if (typeof value !== "string" || value.length === 0) {
      throw new TypeError("Password must be a non-empty string");
    }

    if (value.length < MIN_LENGTH || value.length > MAX_LENGTH) {
      throw new TypeError(
        `Password must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
      );
    }

    if (!HAS_NUMBER.test(value)) {
      throw new TypeError("Password must contain at least one number");
    }

    if (!HAS_SPECIAL.test(value)) {
      throw new TypeError(
        "Password must contain at least one special character",
      );
    }

    return new Password(value);
  }

  equals(other: Password): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return "********";
  }
}
