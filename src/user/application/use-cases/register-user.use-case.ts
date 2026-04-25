import type { AuthServicePort } from "../ports/outbound/auth-service.port.js";
import type { UserProfileRepositoryPort } from "../ports/outbound/user-profile-repository.port.js";
import type {
  RegisterUserCommand,
  RegisterUserResult,
} from "../types/register-user.types.js";
import type { IdGeneratorPort } from "../../../kernel/application/ports/outbound/id-generator.port.js";
import type { ClockPort } from "../../../kernel/application/ports/outbound/clock.port.js";
import {
  UserId,
  FullName,
  Password,
} from "../../domain/value-objects/index.js";
import { Email, IsoDate } from "../../../kernel/domain/value-objects/index.js";
import { User } from "../../domain/entities/user.entity.js";

export class RegisterUserUseCase {
  constructor(
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
    private readonly authService: AuthServicePort,
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const fullName = FullName.of(command.fullName);
    const email = Email.of(command.email);
    const password = Password.of(command.password);
    const birthDate = IsoDate.of(command.birthDate);
    const now = IsoDate.of(this.clock.today());
    const id = UserId.of(this.idGenerator.generate(email.value));

    const user = User.create({
      id,
      fullName,
      email,
      birthDate,
      createdAt: now,
      updatedAt: now,
    });

    await this.authService.registerUser({
      id: user.id.value,
      email: user.email.value,
      password: password.value,
    });

    await this.userProfileRepository.save({
      id: user.id.value,
      fullName: user.fullName.value,
      email: user.email.value,
      birthDate: user.birthDate.value,
      createdAt: now.value,
      updatedAt: now.value,
    });

    return { userId: user.id.value };
  }
}
