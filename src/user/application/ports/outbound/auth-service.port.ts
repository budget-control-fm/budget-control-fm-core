import type { RegisterAuthUserInput } from "../../types/register-user.types.js";

/**
 * Outbound port for user credential registration.
 *
 * Implementations MUST be idempotent: calling registerUser with the same
 * RegisterAuthUserInput more than once must not create duplicate credentials.
 * If credentials for the given id already exist, the implementation must
 * resolve successfully.
 */
export interface AuthServicePort {
  registerUser(user: RegisterAuthUserInput): Promise<void>;
}
