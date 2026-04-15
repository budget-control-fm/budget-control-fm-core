import type { UserDto } from "../types/register-user.types.js";
import type { User } from "../../domain/entities/user.entity.js";

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      fullName: user.fullName.value,
      email: user.email.value,
      birthDate: user.birthDate.value,
      createdAt: user.createdAt.value,
      updatedAt: user.updatedAt.value,
    };
  }
}
