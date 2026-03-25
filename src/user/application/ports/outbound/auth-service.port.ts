import type { User } from "../../../../user/domain/entities/user.entity.js";

export interface AuthServicePort {
  registerUser(user: User, password: string): Promise<void>;
}
