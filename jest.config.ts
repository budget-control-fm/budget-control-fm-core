import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // preset: "ts-jest",
  // testEnvironment: "node",
  // extensionsToTreatAsEsm: [".ts"],
  // transform: {
  //   "^.+\\.ts$": [
  //     "ts-jest",
  //     {
  //       useESM: true,
  //       tsconfig: "tsconfig.json",
  //     },
  //   ],
  // },
  // testMatch: ["<rootDir>/tests/**/*.test.ts"],
  // roots: ["<rootDir>/tests"],
  // moduleFileExtensions: ["ts", "js"],
  // clearMocks: true,
};

export default config;
