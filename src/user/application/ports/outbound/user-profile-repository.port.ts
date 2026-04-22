import type { PersistUserProfileInput } from "../../types/register-user.types.js";

/**
 * Outbound port for user profile persistence.
 *
 * Implementations MUST be idempotent: calling save with the same
 * PersistUserProfileInput more than once must produce the same persisted state.
 * Upsert semantics are required — do not insert-only.
 */
export interface UserProfileRepositoryPort {
  save(input: PersistUserProfileInput): Promise<void>;
}
