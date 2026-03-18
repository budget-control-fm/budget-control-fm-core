// src/domain/user/value-objects/full-name.ts
export class FullName {
  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static of(value: string): FullName {
    const normalized = value.trim().replaceAll(/\s+/g, " ");

    if (normalized.length < 3) {
      throw new TypeError("Full name must have at least 3 characters");
    }

    if (!normalized.includes(" ")) {
      throw new TypeError(
        "Full name must include at least first and last name",
      );
    }

    return new FullName(normalized);
  }

  equals(other: FullName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
