import { RegisterUserUseCase } from "budget-control-fm-core/user";

const value: unknown = RegisterUserUseCase;

if (!value) {
  throw new Error("TypeScript smoke test failed");
}
