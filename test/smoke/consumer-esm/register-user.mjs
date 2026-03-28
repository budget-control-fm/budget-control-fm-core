// test/smoke/consumer-esm/register-user.mjs
import { RegisterUserUseCase } from "budget-control-fm-core/user";
import {
  idGenerator,
  clock,
  authService,
  userProfileRepository,
} from "./fixtures/register-user/dependencies.mjs";
import { registerUserCommand } from "./fixtures/register-user/command.mjs";

/** @type {import("budget-control-fm-core/user").RegisterUserUseCase} */
const useCase = new RegisterUserUseCase(
  idGenerator,
  clock,
  authService,
  userProfileRepository,
);

const result = await useCase.execute(registerUserCommand);

if (!result?.userId) {
  throw new Error("RegisterUserUseCase smoke test failed: missing userId");
}

console.log("register-user ESM smoke test passed");
