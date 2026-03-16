import { UserId } from "../../../../src/domain/user/value-objects/user-id.js";

const VALID_UUID_V4 = "550e8400-e29b-41d4-a716-446655440000";

describe("UserId.of()", () => {
  it("creates a UserId from a valid UUIDv4", () => {
    const id = UserId.of(VALID_UUID_V4);
    expect(id.value).toBe(VALID_UUID_V4);
  });

  it("throws TypeError for an invalid UUID", () => {
    expect(() => UserId.of("not-a-uuid")).toThrow(TypeError);
  });

  it("throws TypeError with correct message", () => {
    expect(() => UserId.of("not-a-uuid")).toThrow(
      "Uuid must be a valid UUIDv4",
    );
  });
});
