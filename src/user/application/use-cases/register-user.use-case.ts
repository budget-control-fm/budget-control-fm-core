import type { AuthServicePort } from "../ports/outbound/auth-service.port.js";
import type { UserProfileRepositoryPort } from "../ports/outbound/user-profile-repository.port.js";
import type {
  RegisterUserCommand,
  RegisterUserResult,
} from "../types/register-user.types.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { UserId } from "../../domain/value-objects/user-id.vo.js";
import { FullName } from "../../domain/value-objects/full-name.vo.js";
import { Email } from "../../../kernel/domain/value-objects/email.vo.js";
import { IsoDate } from "../../../kernel/domain/value-objects/iso-date.vo.js";
import { User } from "../../../user/domain/entities/user.entity.js";
import type { IdGeneratorPort } from "../../../kernel/application/ports/outbound/id-generator.port.js";
import type { ClockPort } from "../../../kernel/application/ports/outbound/clock.port.js";

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

    const dto = UserMapper.toDto(
      User.create({
        id,
        fullName,
        email,
        birthDate,
        createdAt: now,
        updatedAt: now,
      }),
    );

    await this.authService.registerUser(dto, command.password);
    await this.userProfileRepository.save(dto);

    return { userId: dto.id };
  }
}
