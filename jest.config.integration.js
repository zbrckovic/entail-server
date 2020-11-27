module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  transform: { '^.+\\.m?js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'mjs'],
  setupFiles: ['dotenv/config'],
  testMatch: ['<rootDir>/integration/**/*.test.(m)?js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/e2e/'
  ]
}
