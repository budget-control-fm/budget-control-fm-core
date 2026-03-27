import { RegisterUserUseCase } from "budget-control-fm-core/user";

const useCase = new RegisterUserUseCase({
  authService: {
    hashPassword: async () => "hashed-password",
  },
  userProfileRepository: {
    existsByEmail: async () => false,
    save: async () => {},
  },
  idGenerator: {
    generate: () => "123e4567-e89b-12d3-a456-426614174000",
  },
  clock: {
    now: () => new Date("2026-01-01T00:00:00.000Z"),
  },
});

await useCase.execute({
  fullName: "Fabio Moggi",
  email: "fabio@example.com",
  password: "strong-password",
});
