export default {
    testTimeout: 120000, // all tests can run up to 2 minutes
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts", "<rootDir>/tests/setupTestDB.ts"],
};
