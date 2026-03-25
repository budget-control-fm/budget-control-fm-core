import { User } from "../../../../src/user/domain/entities/user.entity.js";
import { UserId } from "../../../../src/user/domain/value-objects/user-id.vo.js";
import { FullName } from "../../../../src/user/domain/value-objects/full-name.vo.js";
import { Email } from "../../../../src/kernel/domain/value-objects/email.vo.js";
import { IsoDate } from "../../../../src/kernel/domain/value-objects/iso-date.vo.js";

const VALID_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

const makeUser = (
  overrides?: Partial<Parameters<typeof User.create>[0]>,
): User =>
  User.create({
    id: UserId.of(VALID_USER_ID),
    fullName: FullName.of("John Doe"),
    email: Email.of("john.doe@example.com"),
    birthDate: IsoDate.of("1990-01-01"),
    createdAt: IsoDate.of("2024-01-01"),
    updatedAt: IsoDate.of("2024-01-01"),
    ...overrides,
  });

describe("User.create()", () => {
  describe("valid inputs", () => {
    it("creates a User with valid params", () => {
      const user = makeUser();
      expect(user.id.value).toBe(VALID_USER_ID);
      expect(user.fullName.value).toBe("John Doe");
      expect(user.email.value).toBe("john.doe@example.com");
      expect(user.birthDate.value).toBe("1990-01-01");
      expect(user.createdAt.value).toBe("2024-01-01");
      expect(user.updatedAt.value).toBe("2024-01-01");
    });

    it("creates two distinct User instances with the same params", () => {
      const a = makeUser();
      const b = makeUser();
      expect(a).not.toBe(b);
    });

    it("accepts a user who turns 18 exactly on the registration date", () => {
      const user = makeUser({
        birthDate: IsoDate.of("2006-01-01"),
        createdAt: IsoDate.of("2024-01-01"),
      });
      expect(user.birthDate.value).toBe("2006-01-01");
    });

    it("accepts a user who turns 18 earlier in the same year", () => {
      const user = makeUser({
        birthDate: IsoDate.of("2005-06-15"),
        createdAt: IsoDate.of("2024-01-01"),
      });
      expect(user.birthDate.value).toBe("2005-06-15");
    });
  });

  describe("age validation", () => {
    it("throws TypeError for a user under 18", () => {
      expect(() =>
        makeUser({
          birthDate: IsoDate.of("2010-01-01"),
          createdAt: IsoDate.of("2024-01-01"),
        }),
      ).toThrow(TypeError);
    });

    it("throws TypeError with correct message for a user under 18", () => {
      expect(() =>
        makeUser({
          birthDate: IsoDate.of("2010-01-01"),
          createdAt: IsoDate.of("2024-01-01"),
        }),
      ).toThrow("User must be at least 18 years old to register");
    });

    it("throws TypeError for a user who turns 18 tomorrow", () => {
      expect(() =>
        makeUser({
          birthDate: IsoDate.of("2006-01-02"),
          createdAt: IsoDate.of("2024-01-01"),
        }),
      ).toThrow(TypeError);
    });

    it("throws TypeError for a user who turns 18 later in the same year", () => {
      expect(() =>
        makeUser({
          birthDate: IsoDate.of("2006-06-15"),
          createdAt: IsoDate.of("2024-01-01"),
        }),
      ).toThrow(TypeError);
    });

    it("throws TypeError for a newborn", () => {
      expect(() =>
        makeUser({
          birthDate: IsoDate.of("2024-01-01"),
          createdAt: IsoDate.of("2024-01-01"),
        }),
      ).toThrow(TypeError);
    });
  });
});

describe("User.create() — age calculation is timezone-safe", () => {
  it("accepts a user who turns exactly 18 on a January 1st registration date (UTC boundary)", () => {
    // birthDate and createdAt on Jan 1 — local getters in UTC-N timezones
    // shift this to Dec 31 of the previous year, corrupting the age calculation.
    // This test must pass regardless of the server's TZ environment variable.
    const user = makeUser({
      birthDate: IsoDate.of("2006-01-01"),
      createdAt: IsoDate.of("2024-01-01"),
    });
    expect(user.birthDate.value).toBe("2006-01-01");
  });

  it("rejects a user who turns 18 the day after the registration date (UTC boundary)", () => {
    expect(() =>
      makeUser({
        birthDate: IsoDate.of("2006-01-02"),
        createdAt: IsoDate.of("2024-01-01"),
      }),
    ).toThrow(TypeError);
  });
});

describe("User.updateName()", () => {
  it("returns a new User with the updated name", () => {
    const user = makeUser();
    const updated = user.updateName(
      FullName.of("Jane Doe"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.fullName.value).toBe("Jane Doe");
  });

  it("preserves all other fields", () => {
    const user = makeUser();
    const updated = user.updateName(
      FullName.of("Jane Doe"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.id.value).toBe(user.id.value);
    expect(updated.email.value).toBe(user.email.value);
    expect(updated.birthDate.value).toBe(user.birthDate.value);
    expect(updated.createdAt.value).toBe(user.createdAt.value);
  });

  it("updates updatedAt", () => {
    const user = makeUser();
    const updated = user.updateName(
      FullName.of("Jane Doe"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.updatedAt.value).toBe("2024-06-01");
  });

  it("does not mutate the original User", () => {
    const user = makeUser();
    user.updateName(FullName.of("Jane Doe"), IsoDate.of("2024-06-01"));
    expect(user.fullName.value).toBe("John Doe");
    expect(user.updatedAt.value).toBe("2024-01-01");
  });

  it("returns a new User instance", () => {
    const user = makeUser();
    const updated = user.updateName(
      FullName.of("Jane Doe"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated).not.toBe(user);
  });

  it("does not re-validate age on name update", () => {
    const user = makeUser({
      birthDate: IsoDate.of("2006-01-01"),
      createdAt: IsoDate.of("2024-01-01"),
    });
    expect(() =>
      user.updateName(FullName.of("Jane Doe"), IsoDate.of("2024-06-01")),
    ).not.toThrow();
  });
});

describe("User.updateEmail()", () => {
  it("returns a new User with the updated email", () => {
    const user = makeUser();
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.email.value).toBe("jane.doe@example.com");
  });

  it("preserves all other fields", () => {
    const user = makeUser();
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.id.value).toBe(user.id.value);
    expect(updated.fullName.value).toBe(user.fullName.value);
    expect(updated.birthDate.value).toBe(user.birthDate.value);
    expect(updated.createdAt.value).toBe(user.createdAt.value);
  });

  it("updates updatedAt", () => {
    const user = makeUser();
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated.updatedAt.value).toBe("2024-06-01");
  });

  it("does not mutate the original User", () => {
    const user = makeUser();
    user.updateEmail(
      Email.of("jane.doe@example.com"),
      IsoDate.of("2024-06-01"),
    );
    expect(user.email.value).toBe("john.doe@example.com");
    expect(user.updatedAt.value).toBe("2024-01-01");
  });

  it("returns a new User instance", () => {
    const user = makeUser();
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      IsoDate.of("2024-06-01"),
    );
    expect(updated).not.toBe(user);
  });

  it("does not re-validate age on email update", () => {
    const user = makeUser({
      birthDate: IsoDate.of("2006-01-01"),
      createdAt: IsoDate.of("2024-01-01"),
    });
    expect(() =>
      user.updateEmail(
        Email.of("jane.doe@example.com"),
        IsoDate.of("2024-06-01"),
      ),
    ).not.toThrow();
  });
});

describe("User immutability", () => {
  it("id cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.id = UserId.of("661f9511-f3ac-42e5-b827-557766551111");
    }).toThrow(TypeError);
  });

  it("fullName cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.fullName = FullName.of("Jane Doe");
    }).toThrow(TypeError);
  });

  it("email cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.email = Email.of("jane.doe@example.com");
    }).toThrow(TypeError);
  });

  it("birthDate cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.birthDate = IsoDate.of("2000-01-01");
    }).toThrow(TypeError);
  });

  it("createdAt cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.createdAt = IsoDate.of("2099-01-01");
    }).toThrow(TypeError);
  });

  it("updatedAt cannot be reassigned", () => {
    const user = makeUser();
    expect(() => {
      // @ts-expect-error — testing runtime immutability
      user.updatedAt = IsoDate.of("2099-01-01");
    }).toThrow(TypeError);
  });
});
