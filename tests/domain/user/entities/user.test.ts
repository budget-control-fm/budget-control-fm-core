import { User } from "../../../../src/domain/user/entities/user.js";
import { UserId } from "../../../../src/domain/user/value-objects/user-id.js";
import { FullName } from "../../../../src/domain/user/value-objects/full-name.js";
import { Email } from "../../../../src/domain/shared/email.js";
import { IsoDate } from "../../../../src/domain/shared/iso-date.js";

// Test fixtures
const makeUser = (
  overrides?: Partial<Parameters<typeof User.create>[0]>,
): User =>
  User.create({
    id: UserId.of("550e8400-e29b-41d4-a716-446655440000"),
    fullName: FullName.of("John Doe"),
    email: Email.of("john.doe@example.com"),
    createdAt: IsoDate.of("2024-01-01"),
    updatedAt: IsoDate.of("2024-01-01"),
    ...overrides,
  });

describe("User.create()", () => {
  it("creates a User with valid params", () => {
    const user = makeUser();
    expect(user.id.value).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(user.fullName.value).toBe("John Doe");
    expect(user.email.value).toBe("john.doe@example.com");
    expect(user.createdAt.value).toBe("2024-01-01");
    expect(user.updatedAt.value).toBe("2024-01-01");
  });

  it("creates two distinct User instances with the same params", () => {
    const a = makeUser();
    const b = makeUser();
    expect(a).not.toBe(b);
  });
});

describe("User.updateName()", () => {
  it("returns a new User with the updated name", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateName(FullName.of("Jane Doe"), updatedAt);
    expect(updated.fullName.value).toBe("Jane Doe");
  });

  it("preserves all other fields", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateName(FullName.of("Jane Doe"), updatedAt);
    expect(updated.id.value).toBe(user.id.value);
    expect(updated.email.value).toBe(user.email.value);
    expect(updated.createdAt.value).toBe(user.createdAt.value);
  });

  it("updates updatedAt", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateName(FullName.of("Jane Doe"), updatedAt);
    expect(updated.updatedAt.value).toBe("2024-06-01");
  });

  it("does not mutate the original User", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    user.updateName(FullName.of("Jane Doe"), updatedAt);
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
});

describe("User.updateEmail()", () => {
  it("returns a new User with the updated email", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      updatedAt,
    );
    expect(updated.email.value).toBe("jane.doe@example.com");
  });

  it("preserves all other fields", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      updatedAt,
    );
    expect(updated.id.value).toBe(user.id.value);
    expect(updated.fullName.value).toBe(user.fullName.value);
    expect(updated.createdAt.value).toBe(user.createdAt.value);
  });

  it("updates updatedAt", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    const updated = user.updateEmail(
      Email.of("jane.doe@example.com"),
      updatedAt,
    );
    expect(updated.updatedAt.value).toBe("2024-06-01");
  });

  it("does not mutate the original User", () => {
    const user = makeUser();
    const updatedAt = IsoDate.of("2024-06-01");
    user.updateEmail(Email.of("jane.doe@example.com"), updatedAt);
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
