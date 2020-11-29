import { environment } from '../environment.mjs'
import { IocContainer } from '../ioc-container'
import { ErrorName } from '../error'

let iocContainer
beforeEach(async () => {
  iocContainer = IocContainer(environment)
  await iocContainer.getDatabaseClient().migrateToLatest()
})

test('Register passes for unused email.', async () => {
  const usersService = iocContainer.getUsersService()

  const email = 'raffaello@email.com'
  const password = 'tmnt'

  const registeredUser = await usersService.register(({ email, password }))

  expect(registeredUser).toBeDefined()
})

describe('Login', () => {
  const email = 'raffaello@email.com'
  const password = 'tmnt'
  let usersService

  beforeEach(async () => {
    usersService = iocContainer.getUsersService()
    await usersService.register(({ email, password }))
  })

  test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong email.`, async () => {
    return expect(async () => {
      await usersService.login({ email: 'donatello', password })
    }).rejects.toThrow(ErrorName.INVALID_CREDENTIALS)
  })

  test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong password.`, async () => {
    return expect(async () => {
      await usersService.login({ email, password: 'tmnt2' })
    }).rejects.toThrow(ErrorName.INVALID_CREDENTIALS)
  })

  test('passes for correct credentials.', async () => {
    const user = await usersService.login({ email, password })

    expect(user).toBeDefined()
  })
})

afterEach(async () => {
  const databaseClient = iocContainer.getDatabaseClient()
  await databaseClient.rollbackMigrations()
  await databaseClient.destroy()
})
