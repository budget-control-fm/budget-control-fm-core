// ===== TYPES =====
export type {
  RegisterUserCommand,
  RegisterUserResult,
  RegisterAuthUserInput,
  PersistUserProfileInput,
} from "./application/types/register-user.types.js";

// ===== PORTS =====
export type { AuthServicePort } from "./application/ports/outbound/auth-service.port.js";
export type { UserProfileRepositoryPort } from "./application/ports/outbound/user-profile-repository.port.js";
export type { IdGeneratorPort } from "../kernel/application/ports/outbound/id-generator.port.js";
export type { ClockPort } from "../kernel/application/ports/outbound/clock.port.js";

// ===== APPLICATION =====
export { RegisterUserUseCase } from "./application/use-cases/register-user.use-case.js";
