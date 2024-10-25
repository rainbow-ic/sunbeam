import type { Config } from "jest";

const config: Config = {
    watch: false,
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    testTimeout: 30_000,
    testMatch: ["**/*.test.ts?(x)"],
    transform: {
        "^.+\\.[tj]s$": "ts-jest",
    },
};

export default config;
