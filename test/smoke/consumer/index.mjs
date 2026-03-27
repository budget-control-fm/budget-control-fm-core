import { RegisterUserUseCase } from "budget-control-fm-core/user";

if (!RegisterUserUseCase) {
  throw new Error("Failed to import RegisterUserUseCase from ESM consumer");
}

console.log("ESM smoke test passed");
