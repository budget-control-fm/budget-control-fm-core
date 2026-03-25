// src/application/user/ports/outbound/user-profile-repository.port.ts
import type { User } from "../../../../user/domain/entities/user.entity.js";

export interface UserProfileRepositoryPort {
  save(user: User): Promise<void>;
}
