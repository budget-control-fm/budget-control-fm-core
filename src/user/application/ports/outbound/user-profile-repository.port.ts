// src/application/user/ports/outbound/user-profile-repository.port.ts
import type { UserDto } from "../../../../user/application/types/register-user.types.js";

export interface UserProfileRepositoryPort {
  save(user: UserDto): Promise<void>;
}
