// src/domain/shared/email.ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static of(value: string): Email {
    const normalized = value.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      throw new TypeError("Invalid email address");
    }

    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
