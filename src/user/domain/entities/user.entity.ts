import { UserId, FullName, Password } from "../value-objects/index.js";
import { Email, IsoDate } from "../../../kernel/domain/value-objects/index.js";

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly fullName: FullName,
    public readonly email: Email,
    public readonly password: Password,
    public readonly birthDate: IsoDate,
    public readonly createdAt: IsoDate,
    public readonly updatedAt: IsoDate,
  ) {
    Object.freeze(this);
  }

  static create(params: {
    id: UserId;
    fullName: FullName;
    email: Email;
    password: Password;
    birthDate: IsoDate;
    createdAt: IsoDate;
    updatedAt: IsoDate;
  }): User {
    if (!User.isAbove18(params.birthDate, params.createdAt)) {
      throw new TypeError("User must be at least 18 years old to register");
    }

    return new User(
      params.id,
      params.fullName,
      params.email,
      params.password,
      params.birthDate,
      params.createdAt,
      params.updatedAt,
    );
  }

  updateName(newName: FullName, updatedAt: IsoDate): User {
    return new User(
      this.id,
      newName,
      this.email,
      this.password,
      this.birthDate,
      this.createdAt,
      updatedAt,
    );
  }

  updateEmail(newEmail: Email, updatedAt: IsoDate): User {
    return new User(
      this.id,
      this.fullName,
      newEmail,
      this.password,
      this.birthDate,
      this.createdAt,
      updatedAt,
    );
  }

  private static isAbove18(
    birthDate: IsoDate,
    referenceDate: IsoDate,
  ): boolean {
    const birth = new Date(birthDate.value);
    const reference = new Date(referenceDate.value);
    const age = reference.getUTCFullYear() - birth.getUTCFullYear();
    const monthDiff = reference.getUTCMonth() - birth.getUTCMonth();
    const dayDiff = reference.getUTCDate() - birth.getUTCDate();
    return (
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
    );
  }
}
