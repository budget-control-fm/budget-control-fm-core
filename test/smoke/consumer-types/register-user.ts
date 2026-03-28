// test/smoke/consumer-types/register-user.ts
import { RegisterUserUseCase } from "budget-control-fm-core/user";
import type {
  RegisterUserCommand,
  AuthServicePort,
  UserProfileRepositoryPort,
  IdGeneratorPort,
  ClockPort,
} from "budget-control-fm-core/user";

const idGenerator: IdGeneratorPort = {
  generate: () => "123e4567-e89b-42d3-a456-426614174000",
};

const clock: ClockPort = {
  today: () => "2026-01-01",
};

const authService: AuthServicePort = {
  registerUser: async () => {},
};

const userProfileRepository: UserProfileRepositoryPort = {
  save: async () => {},
};

const useCase = new RegisterUserUseCase(
  idGenerator,
  clock,
  authService,
  userProfileRepository,
);

const command: RegisterUserCommand = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  password: "secret",
  birthDate: "1990-06-15",
};

await useCase.execute(command);
