import { RegisterUserUseCase } from "budget-control-fm-core/user";
import type {
  RegisterUserCommand,
  RegisterUserResult,
  RegisterAuthUserInput,
  PersistUserProfileInput,
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

// ✅ typed against RegisterAuthUserInput — tsc fails here if port leaks User entity
const authService: AuthServicePort = {
  async registerUser(input: RegisterAuthUserInput): Promise<void> {},
};

// ✅ typed against PersistUserProfileInput — tsc fails here if port leaks User entity
const userProfileRepository: UserProfileRepositoryPort = {
  async save(input: PersistUserProfileInput): Promise<void> {},
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
  password: "Secret1!",
  birthDate: "1990-06-15",
};

const result: RegisterUserResult = await useCase.execute(command);
console.log(result.userId);
