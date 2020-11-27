// Configuration for e2e tests
module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  transform: { '^.+\\.m?js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'mjs'],
  setupFiles: ['dotenv/config'],
  testMatch: ['<rootDir>/e2e/**/*.test.(m)?js']
}
