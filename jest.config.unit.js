module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  transform: { '^.+\\.m?js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['<rootDir>/**/*.test.(m)?js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/test/e2e/',
    '<rootDir>/test/integration/'
  ]
}
