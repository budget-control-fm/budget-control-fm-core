// src/domain/user/value-objects/user-id.ts
import { Uuid } from "../../../kernel/domain/value-objects/uuid.vo.js";
import type { User } from "../entities/user.entity.js";

export type UserId = Uuid<User>;
export const UserId = {
  of: (value: string): UserId => Uuid.of<User>(value),
};
