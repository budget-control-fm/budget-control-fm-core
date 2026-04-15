import type { UserDto } from "../../../../user/application/types/register-user.types.js";

export interface AuthServicePort {
  registerUser(user: UserDto, password: string): Promise<void>;
}
