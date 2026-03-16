// src/domain/shared/iso-date.ts
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class IsoDate {
  private constructor(public readonly value: string) {
    Object.freeze(this);
  }

  static of(value: string): IsoDate {
    const normalized = value.trim();

    if (!ISO_DATE_REGEX.test(normalized)) {
      throw new TypeError("IsoDate must be in YYYY-MM-DD format");
    }

    const date = new Date(`${normalized}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
      throw new TypeError(`Invalid calendar date: ${normalized}`);
    }

    // Guard against JS Date auto-correction (e.g. 2024-02-31)
    const [y, m, d] = normalized.split("-").map(Number);
    if (
      date.getUTCFullYear() !== y ||
      date.getUTCMonth() + 1 !== m ||
      date.getUTCDate() !== d
    ) {
      throw new TypeError(`Invalid calendar date: ${normalized}`);
    }

    return new IsoDate(normalized);
  }

  equals(other: IsoDate): boolean {
    return this.value === other.value;
  }

  isBefore(other: IsoDate): boolean {
    return this.value < other.value;
  }

  isAfter(other: IsoDate): boolean {
    return this.value > other.value;
  }

  toString(): string {
    return this.value;
  }
}
