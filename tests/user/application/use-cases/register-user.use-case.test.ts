import { jest } from "@jest/globals";
import type { User } from "../../../../src/user/domain/entities/user.entity.js";
import { RegisterUserUseCase } from "../../../../src/user/application/use-cases/register-user.use-case.js";
import type { AuthServicePort } from "../../../../src/user/application/ports/outbound/auth-service.port.js";
import type { UserProfileRepositoryPort } from "../../../../src/user/application/ports/outbound/user-profile-repository.port.js";
import type { IdGeneratorPort } from "../../../../src/kernel/application/ports/outbound/id-generator.port.js";
import type { ClockPort } from "../../../../src/kernel/application/ports/outbound/clock.port.js";
import type { RegisterUserCommand } from "../../../../src/user/application/types/register-user.types.js";

const VALID_USER_ID = "550e8400-e29b-41d4-a716-446655440000";
const FIXED_DATE = "2024-01-15";
const STUB_CREDENTIALS = "stub-value-for-testing";

const makeCommand = (
  overrides?: Partial<RegisterUserCommand>,
): RegisterUserCommand => ({
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: STUB_CREDENTIALS,
  birthDate: "1990-01-01",
  ...overrides,
});

const makeIdGenerator = (): IdGeneratorPort => ({
  generate: jest.fn<() => string>().mockReturnValue(VALID_USER_ID),
});

const makeClock = (): ClockPort => ({
  today: jest.fn<() => string>().mockReturnValue(FIXED_DATE),
});

const makeAuthService = (): AuthServicePort => ({
  registerUser: jest
    .fn<(user: User, password: string) => Promise<void>>()
    .mockResolvedValue(undefined),
});

const makeUserProfileRepository = (): UserProfileRepositoryPort => ({
  save: jest.fn<(user: User) => Promise<void>>().mockResolvedValue(undefined),
});

const makeUseCase = () =>
  new RegisterUserUseCase(
    makeIdGenerator(),
    makeClock(),
    makeAuthService(),
    makeUserProfileRepository(),
  );

describe("RegisterUserUseCase.execute()", () => {
  describe("successful registration", () => {
    it("returns the generated userId", async () => {
      const useCase = makeUseCase();
      const result = await useCase.execute(makeCommand());
      expect(result.userId).toBe(VALID_USER_ID);
    });

    it("calls idGenerator.generate once", async () => {
      const idGenerator = makeIdGenerator();
      const useCase = new RegisterUserUseCase(
        idGenerator,
        makeClock(),
        makeAuthService(),
        makeUserProfileRepository(),
      );

      await useCase.execute(makeCommand());

      expect(idGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it("calls clock.today once", async () => {
      const clock = makeClock();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        clock,
        makeAuthService(),
        makeUserProfileRepository(),
      );

      await useCase.execute(makeCommand());

      expect(clock.today).toHaveBeenCalledTimes(1);
    });

    it("calls authService.registerUser with the constructed User and password", async () => {
      const authService = makeAuthService();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        makeUserProfileRepository(),
      );

      await useCase.execute(makeCommand());

      expect(authService.registerUser).toHaveBeenCalledTimes(1);
      expect(authService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.objectContaining({ value: VALID_USER_ID }),
          fullName: expect.objectContaining({ value: "John Doe" }),
          email: expect.objectContaining({ value: "john.doe@example.com" }),
          birthDate: expect.objectContaining({ value: "1990-01-01" }),
        }),
        STUB_CREDENTIALS,
      );
    });

    it("calls userProfileRepository.save with the constructed User", async () => {
      const userProfileRepository = makeUserProfileRepository();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        makeAuthService(),
        userProfileRepository,
      );

      await useCase.execute(makeCommand());

      expect(userProfileRepository.save).toHaveBeenCalledTimes(1);
      expect(userProfileRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.objectContaining({ value: VALID_USER_ID }),
          fullName: expect.objectContaining({ value: "John Doe" }),
          email: expect.objectContaining({ value: "john.doe@example.com" }),
          birthDate: expect.objectContaining({ value: "1990-01-01" }),
        }),
      );
    });

    it("calls authService before userProfileRepository", async () => {
      const callOrder: string[] = [];

      const authService: AuthServicePort = {
        registerUser: jest
          .fn<(user: User, password: string) => Promise<void>>()
          .mockImplementation(async () => {
            callOrder.push("authService");
          }),
      };

      const userProfileRepository: UserProfileRepositoryPort = {
        save: jest
          .fn<(user: User) => Promise<void>>()
          .mockImplementation(async () => {
            callOrder.push("userProfileRepository");
          }),
      };

      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        userProfileRepository,
      );

      await useCase.execute(makeCommand());

      expect(callOrder).toEqual(["authService", "userProfileRepository"]);
    });

    it("normalizes email to lowercase", async () => {
      const authService = makeAuthService();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        makeUserProfileRepository(),
      );

      await useCase.execute(makeCommand({ email: "John.Doe@Example.COM" }));

      expect(authService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.objectContaining({ value: "john.doe@example.com" }),
        }),
        STUB_CREDENTIALS,
      );
    });
  });

  describe("domain validation", () => {
    it("throws TypeError for an invalid email", async () => {
      const useCase = makeUseCase();
      await expect(
        useCase.execute(makeCommand({ email: "not-an-email" })),
      ).rejects.toThrow(TypeError);
    });

    it("throws TypeError for a missing last name", async () => {
      const useCase = makeUseCase();
      await expect(
        useCase.execute(makeCommand({ fullName: "John" })),
      ).rejects.toThrow(TypeError);
    });

    it("throws TypeError for a full name shorter than 3 characters", async () => {
      const useCase = makeUseCase();
      await expect(
        useCase.execute(makeCommand({ fullName: "AB" })),
      ).rejects.toThrow(TypeError);
    });

    it("throws TypeError for a user under 18", async () => {
      const useCase = makeUseCase();
      await expect(
        useCase.execute(makeCommand({ birthDate: "2010-01-01" })),
      ).rejects.toThrow(TypeError);
    });

    it("throws TypeError with correct message for a user under 18", async () => {
      const useCase = makeUseCase();
      await expect(
        useCase.execute(makeCommand({ birthDate: "2010-01-01" })),
      ).rejects.toThrow("User must be at least 18 years old to register");
    });

    it("does not call authService when domain validation fails", async () => {
      const authService = makeAuthService();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        makeUserProfileRepository(),
      );

      await expect(
        useCase.execute(makeCommand({ email: "not-an-email" })),
      ).rejects.toThrow();

      expect(authService.registerUser).not.toHaveBeenCalled();
    });

    it("does not call userProfileRepository when domain validation fails", async () => {
      const userProfileRepository = makeUserProfileRepository();
      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        makeAuthService(),
        userProfileRepository,
      );

      await expect(
        useCase.execute(makeCommand({ email: "not-an-email" })),
      ).rejects.toThrow();

      expect(userProfileRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("infrastructure failures", () => {
    it("propagates errors thrown by authService", async () => {
      const authService: AuthServicePort = {
        registerUser: jest
          .fn<(user: User, password: string) => Promise<void>>()
          .mockRejectedValue(new Error("Auth service unavailable")),
      };

      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        makeUserProfileRepository(),
      );

      await expect(useCase.execute(makeCommand())).rejects.toThrow(
        "Auth service unavailable",
      );
    });

    it("does not call userProfileRepository when authService fails", async () => {
      const userProfileRepository = makeUserProfileRepository();
      const authService: AuthServicePort = {
        registerUser: jest
          .fn<(user: User, password: string) => Promise<void>>()
          .mockRejectedValue(new Error("Auth service unavailable")),
      };

      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        authService,
        userProfileRepository,
      );

      await expect(useCase.execute(makeCommand())).rejects.toThrow();

      expect(userProfileRepository.save).not.toHaveBeenCalled();
    });

    it("propagates errors thrown by userProfileRepository", async () => {
      const userProfileRepository: UserProfileRepositoryPort = {
        save: jest
          .fn<(user: User) => Promise<void>>()
          .mockRejectedValue(new Error("Database unavailable")),
      };

      const useCase = new RegisterUserUseCase(
        makeIdGenerator(),
        makeClock(),
        makeAuthService(),
        userProfileRepository,
      );

      await expect(useCase.execute(makeCommand())).rejects.toThrow(
        "Database unavailable",
      );
    });
  });
});
