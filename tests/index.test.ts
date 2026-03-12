import { hello } from "../src/index.js";

describe("index", () => {
  it("should return greeting message", () => {
    expect(hello()).toBe("Hi budget-control-fm-core");
  });
});
