import { environment } from './environment.mjs'

describe('environment', () => {
  it('loaded all important environment variables', () => {
    Object.values(environment).forEach(key => {
      expect(key).toBeDefined()
    })
  })
})
