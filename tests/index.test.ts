// tests/index.test.ts
import * as publicApi from "../src/index.js";

describe("public API", () => {
  it("exports RegisterUserUseCase", () => {
    expect(publicApi.RegisterUserUseCase).toBeDefined();
  });

  it("exports nothing unexpected", () => {
    const expectedExports = ["RegisterUserUseCase"];
    const actualExports = Object.keys(publicApi);

    expect(actualExports.toSorted((a, b) => a.localeCompare(b))).toEqual(
      expectedExports.toSorted((a, b) => a.localeCompare(b)),
    );
  });
});
