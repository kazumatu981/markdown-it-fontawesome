/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: __dirname,
    collectCoverage: true,
    collectCoverageFrom: ['lib/**/*.ts', '!lib/**/obs/**/*.ts'],
};
