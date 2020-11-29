import { environment } from '../environment.mjs'
import { IocContainer } from '../ioc-container'
import { createError, ErrorName } from '../error'
import moment from 'moment'

describe('UsersService', () => {
  let iocContainer
  beforeEach(async () => {
    iocContainer = IocContainer(environment)
    await iocContainer.getDatabaseClient().rollbackMigrations()
    await iocContainer.getDatabaseClient().migrateToLatest()
  })

  describe('register', () => {
    beforeEach(async () => {
      await iocContainer
        .getUsersRepository()
        .createUser({
          email: 'donatello@email.com',
          passwordHash: 'AAAA',
          createdOn: moment(),
          lastUpdatedOn: moment()
        })
    })

    test('passes for unused email', async () => {
      const usersService = iocContainer.getUsersService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const registeredUser = await usersService.register(({ email, password }))

      expect(registeredUser).toBeDefined()
    })

    test(`throws ${ErrorName.EMAIL_ALREADY_USED} for used email`, async () => {
      const usersService = iocContainer.getUsersService()

      const email = 'donatello@email.com'
      const password = 'AAAA'

      await expect(usersService.register(({ email, password })))
        .rejects
        .toThrow(createError(ErrorName.EMAIL_ALREADY_USED))
    })

    test('produces inactive user with prepared activation code', async () => {
      const usersService = iocContainer.getUsersService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const {
        isActivated,
        activationCode,
        activationCodeExpiresOn
      } = await usersService.register(({ email, password }))

      expect(isActivated).toBe(false)
      expect(activationCode).toBeDefined()
      expect(activationCodeExpiresOn).toBeDefined()
    })
  })

  describe('login', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'

    beforeEach(async () => { await iocContainer.getUsersService().register(({ email, password })) })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong email`, async () => {
      const usersService = iocContainer.getUsersService()

      await expect(usersService.login({ email: 'donatello', password }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong password`, async () => {
      const usersService = iocContainer.getUsersService()

      await expect(usersService.login({ email, password: 'BBBB' }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test('passes for correct credentials.', async () => {
      const usersService = iocContainer.getUsersService()

      const user = await usersService.login({ email, password })

      expect(user).toBeDefined()
    })
  })

  describe('activate', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'
    let activationCode

    beforeEach(async () => {
      const raffaello = await iocContainer.getUsersService().register(({ email, password }))
      activationCode = raffaello.activationCode
    })

    test('passes for correct activation code', () => {
      return expect(iocContainer.getUsersService().activate(({ email, activationCode })))
        .resolves
        .toBeUndefined()
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid email`, async () => {
      const invalidEmail = 'donatello@email.com'
      await expect(
        iocContainer.getUsersService().activate(({ email: invalidEmail, activationCode }))
      )
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid activation code`, async () => {
      await expect(iocContainer.getUsersService().activate(({ email, activationCode: 'ABCD' })))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })
  })

  afterEach(async () => {
    const databaseClient = iocContainer.getDatabaseClient()
    await databaseClient.rollbackMigrations()
    await databaseClient.destroy()
  })
})
