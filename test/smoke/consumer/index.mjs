import { RegisterUserUseCase } from "budget-control-fm-core/user";

const idGenerator = {
  generate: () => "123e4567-e89b-42d3-a456-426614174000",
};

const clock = {
  today: () => "2026-01-01",
};

const authService = {
  registerUser: async () => {},
};

const userProfileRepository = {
  save: async () => {},
};

/** @type {import("budget-control-fm-core/user").RegisterUserUseCase} */
const useCase = new RegisterUserUseCase(
  idGenerator,
  clock,
  authService,
  userProfileRepository,
);

/** @type {import("budget-control-fm-core/user").RegisterUserCommand} */
await useCase.execute({
  fullName: "Fabio Moggi",
  email: "fabio@example.com",
  birthDate: "1990-01-01",
  password: "strong-password",
});

console.log(" *** ESM smoke test passed ***");
