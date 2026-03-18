import type { User } from "../../../../domain/user/entities/user.entity.js";

export interface AuthServicePort {
  registerUser(user: User, password: string): Promise<void>;
}
