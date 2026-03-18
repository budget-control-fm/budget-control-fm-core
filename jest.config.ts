import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  passWithNoTests: false,
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.types.ts",
    "!src/**/*.port.ts",
    "!src/**/*.index.ts",
  ],
  coverageReporters: ["text", "lcov"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
