import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
