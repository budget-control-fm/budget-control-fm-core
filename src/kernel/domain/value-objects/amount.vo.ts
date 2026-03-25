// src/domain/shared/amount.ts
export type Currency = "BRL" | "USD";

export class Amount {
  private constructor(
    public readonly cents: number,
    public readonly currency: Currency,
  ) {
    Object.freeze(this);
  }

  static of(cents: number, currency: Currency): Amount {
    if (!Number.isInteger(cents)) {
      throw new TypeError("Amount must be an integer");
    }

    if (!Number.isSafeInteger(cents)) {
      throw new TypeError("Amount exceeds safe integer range");
    }

    return new Amount(cents, currency);
  }

  add(other: Amount): Amount {
    this.assertSameCurrency(other);
    return Amount.of(this.cents + other.cents, this.currency);
  }

  subtract(other: Amount): Amount {
    this.assertSameCurrency(other);
    return Amount.of(this.cents - other.cents, this.currency);
  }

  isGreaterThan(other: Amount): boolean {
    this.assertSameCurrency(other);
    return this.cents > other.cents;
  }

  isLessThan(other: Amount): boolean {
    this.assertSameCurrency(other);
    return this.cents < other.cents;
  }

  equals(other: Amount): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  toString(): string {
    return `${this.cents} ${this.currency}`;
  }

  private assertSameCurrency(other: Amount): void {
    if (this.currency !== other.currency) {
      throw new TypeError(
        `Cannot operate on different currencies (${this.currency} vs ${other.currency})`,
      );
    }
  }
}
