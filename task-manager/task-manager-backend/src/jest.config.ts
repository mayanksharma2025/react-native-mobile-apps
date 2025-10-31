import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};

export default config;
