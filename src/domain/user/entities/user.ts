// src/domain/user/entities/user.ts
import { UserId } from "../value-objects/user-id.js";
import { FullName } from "../value-objects/full-name.js";
import { Email } from "../../shared/email.js";
import { IsoDate } from "../../shared/iso-date.js";

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly fullName: FullName,
    public readonly email: Email,
    public readonly createdAt: IsoDate,
    public readonly updatedAt: IsoDate,
  ) {
    Object.freeze(this);
  }

  static create(params: {
    id: UserId;
    fullName: FullName;
    email: Email;
    createdAt: IsoDate;
    updatedAt: IsoDate;
  }): User {
    return new User(
      params.id,
      params.fullName,
      params.email,
      params.createdAt,
      params.updatedAt,
    );
  }

  updateName(newName: FullName, updatedAt: IsoDate): User {
    return new User(this.id, newName, this.email, this.createdAt, updatedAt);
  }

  updateEmail(newEmail: Email, updatedAt: IsoDate): User {
    return new User(
      this.id,
      this.fullName,
      newEmail,
      this.createdAt,
      updatedAt,
    );
  }
}
