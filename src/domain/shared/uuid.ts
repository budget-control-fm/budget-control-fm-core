const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Uuid<T = unknown> {
  private constructor(
    public readonly value: string,
    private readonly _brand?: T,
  ) {
    Object.freeze(this);
  }

  static of<T = unknown>(value: string): Uuid<T> {
    const normalized = value.trim();

    if (!UUID_V4_REGEX.test(normalized)) {
      throw new Error("Uuid must be a valid UUIDv4");
    }

    return new Uuid<T>(normalized);
  }

  equals(other: Uuid<T>): boolean {
    return this.value === other.value;
  }
}
