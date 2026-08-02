/* global module, require, __dirname */

const fs = require('node:fs');
const path = require('node:path');

const hasCriteriaTests = fs.existsSync(path.join(__dirname, 'criteria-tests'));

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: hasCriteriaTests ? ['<rootDir>/src', '<rootDir>/criteria-tests'] : ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/server.ts', '!src/app.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    verbose: true,
    testTimeout: 10000,
    setupFilesAfterEnv: hasCriteriaTests ? ['<rootDir>/criteria-tests/setup.ts'] : [],
};
