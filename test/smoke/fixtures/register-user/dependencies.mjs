// test/smoke/fixtures/register-user/dependencies.mjs
import { randomUUID } from "node:crypto";

export const idGenerator = {
  generate: () => randomUUID(),
};

export const clock = {
  today: () => "2026-01-01",
};

export const authService = {
  async registerUser() {},
};

export const userProfileRepository = {
  async save() {},
};
