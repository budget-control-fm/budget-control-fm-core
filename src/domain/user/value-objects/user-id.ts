// src/domain/user/value-objects/user-id.ts
import { Uuid } from "../../shared/uuid.js";
import type { User } from "../entities/user.js";

export type UserId = Uuid<User>;
export const UserId = {
  of: (value: string): UserId => Uuid.of<User>(value),
};
