module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  coverageDirectory: '../docs/coverage',
  transform: {
    '^.+\\.m?js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs'],
  testRegex: '^.+\\.test\\.m?js$',
  setupFiles: ['dotenv/config']
}
