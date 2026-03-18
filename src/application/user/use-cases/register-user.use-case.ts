export type {
  RegisterUserCommand,
  RegisterUserResult,
} from "../types/register-user.types.js";

import type { AuthServicePort } from "../ports/outbound/auth-service.port.js";
import type { UserProfileRepositoryPort } from "../ports/outbound/user-profile-repository.port.js";
import type {
  RegisterUserCommand,
  RegisterUserResult,
} from "../types/register-user.types.js";
import { UserId } from "../../../domain/user/value-objects/user-id.vo.js";
import { FullName } from "../../../domain/user/value-objects/full-name.vo.js";
import { Email } from "../../../domain/shared/email.vo.js";
import { IsoDate } from "../../../domain/shared/iso-date.vo.js";
import { User } from "../../../domain/user/entities/user.entity.js";
import type { IdGeneratorPort } from "../../shared/ports/outbound/id-generator.port.js";
import type { ClockPort } from "../../shared/ports/outbound/clock.port.js";

export class RegisterUserUseCase {
  constructor(
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
    private readonly authService: AuthServicePort,
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const id = UserId.of(this.idGenerator.generate());
    const fullName = FullName.of(command.fullName);
    const email = Email.of(command.email);
    const birthDate = IsoDate.of(command.birthDate);
    const now = IsoDate.of(this.clock.today());

    const user = User.create({
      id,
      fullName,
      email,
      birthDate,
      createdAt: now,
      updatedAt: now,
    });

    await this.authService.registerUser(user, command.password);
    await this.userProfileRepository.save(user);

    return { userId: user.id.value };
  }
}
