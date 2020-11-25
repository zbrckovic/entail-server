// Configuration for integration tests
module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  transform: { '^.+\\.m?js$': 'babel-jest' },
  moduleFileExtensions: ['js', 'mjs'],
  testRegex: '\\.itest\\.m?js$',
  setupFiles: ['dotenv/config']
}
