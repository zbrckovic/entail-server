import { environment } from '../../environment.mjs'
import { IocContainer } from '../../ioc-container.mjs'
import { ErrorName } from '../../global/error.mjs'
import moment from 'moment'

describe('AuthenticationService', () => {
  let iocContainer
  beforeEach(async () => {
    iocContainer = IocContainer({ environment, emailService: EmailServiceMock() })
    const databaseClient = iocContainer.getDatabaseClient()
    await databaseClient.rollbackMigrations()
    await databaseClient.migrateToLatest()
    await iocContainer.getDataInitializer().init()
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
      const authenticationService = iocContainer.getAuthenticationService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const registeredUser = await authenticationService.register(({ email, password }))

      expect(registeredUser).toBeDefined()
    })

    test(`throws ${ErrorName.EMAIL_ALREADY_USED} for used email`, async () => {
      const authenticationService = iocContainer.getAuthenticationService()

      const email = 'donatello@email.com'
      const password = 'AAAA'

      await expect(authenticationService.register(({ email, password })))
        .rejects
        .toThrow(ErrorName.EMAIL_ALREADY_USED)
    })

    test('produces inactive user with prepared activation code', async () => {
      const authenticationService = iocContainer.getAuthenticationService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const {
        isActivated,
        activationCode,
        activationCodeExpiresOn
      } = await authenticationService.register(({ email, password }))

      expect(isActivated).toBe(false)
      expect(activationCode).toBeDefined()
      expect(activationCodeExpiresOn).toBeDefined()
    })
  })

  describe('login', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'

    beforeEach(async () => {
      await iocContainer.getAuthenticationService().register(({ email, password }))
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong email`, async () => {
      const authenticationService = iocContainer.getAuthenticationService()

      await expect(authenticationService.login({ email: 'donatello', password }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong password`, async () => {
      const authenticationService = iocContainer.getAuthenticationService()

      await expect(authenticationService.login({ email, password: 'BBBB' }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test('passes for correct credentials.', async () => {
      const authenticationService = iocContainer.getAuthenticationService()

      const user = await authenticationService.login({ email, password })

      expect(user).toBeDefined()
    })
  })

  describe('activate', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'
    let activationCode

    beforeEach(async () => {
      await iocContainer.getAuthenticationService().register(({ email, password }))
      activationCode = iocContainer.getEmailService().getLastSentActivationCode()
    })

    test('passes for correct activation code', () => {
      return expect(iocContainer.getAuthenticationService().activate(({ email, activationCode })))
        .resolves
        .toBeUndefined()
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid email`, async () => {
      const invalidEmail = 'donatello@email.com'
      await expect(
        iocContainer.getAuthenticationService().activate(({ email: invalidEmail, activationCode }))
      )
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid activation code`, async () => {
      await expect(iocContainer.getAuthenticationService().activate(({
        email,
        activationCode: 'ABCD'
      })))
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

const EmailServiceMock = () => {
  let lastSentActivationCode

  const sendActivationCode = async activationCode => {
    lastSentActivationCode = activationCode
  }

  const getLastSentActivationCode = () => lastSentActivationCode

  return { sendActivationCode, getLastSentActivationCode }
}
