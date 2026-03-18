import { UserId } from "../value-objects/user-id.vo.js";
import { FullName } from "../value-objects/full-name.vo.js";
import { Email } from "../../shared/email.vo.js";
import { IsoDate } from "../../shared/iso-date.vo.js";

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly fullName: FullName,
    public readonly email: Email,
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
    const age = reference.getFullYear() - birth.getFullYear();
    const monthDiff = reference.getMonth() - birth.getMonth();
    const dayDiff = reference.getDate() - birth.getDate();
    return (
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
    );
  }
}
