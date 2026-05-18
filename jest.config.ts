import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@angular/core$": "<rootDir>/src/__mocks__/@angular/core.ts",
    "^@angular/common$": "<rootDir>/src/__mocks__/@angular/common.ts",
    "^flowchart-sequence-designer$": "<rootDir>/src/__mocks__/fsd.ts",
    "^flowchart-sequence-designer/ui$": "<rootDir>/src/__mocks__/fsd-ui.ts",
  },
};

export default config;
