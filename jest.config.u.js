// Configuration for unit tests
module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  transform: {
    '^.+\\.m?js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs'],
  testRegex: '^.+\\.utest\\.m?js$'
}
