module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/specs/auth.test.js', '<rootDir>/specs/transactions.test.js'],
  setupFiles: ['<rootDir>/specs/helpers/env.js'],
  testTimeout: 30000
};
