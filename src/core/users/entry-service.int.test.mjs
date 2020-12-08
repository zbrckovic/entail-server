import { environment } from '../../environment.mjs'
import { IocContainer } from '../../ioc-container.mjs'
import { ErrorName } from '../../global/error.mjs'
import moment from 'moment'

describe('EntryService', () => {
  let iocContainer
  beforeEach(async () => {
    iocContainer = IocContainer({ emailService: EmailServiceMock(), environment })
    const databaseManager = iocContainer.getDatabaseManager()
    await databaseManager.rollbackMigrations()
    await databaseManager.migrateToLatest()
    await iocContainer.getDataInitializer().initializeData()
  })

  describe('register', () => {
    beforeEach(async () => {
      await iocContainer
        .getRepository()
        .createUser({
          email: 'donatello@email.com',
          passwordHash: 'AAAA',
          createdOn: moment(),
          lastUpdatedOn: moment()
        })
    })

    test('passes for unused email', async () => {
      const entryService = iocContainer.getEntryService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const registeredUser = await entryService.register(({ email, password }))

      expect(registeredUser).toBeDefined()
    })

    test(`throws ${ErrorName.EMAIL_ALREADY_USED} for used email`, async () => {
      const entryService = iocContainer.getEntryService()

      const email = 'donatello@email.com'
      const password = 'AAAA'

      await expect(entryService.register(({ email, password })))
        .rejects
        .toThrow(ErrorName.EMAIL_ALREADY_USED)
    })

    test('produces inactive user with prepared activation code', async () => {
      const entryService = iocContainer.getEntryService()

      const email = 'raffaello@email.com'
      const password = 'AAAA'

      const {
        isActivated,
        activationCode,
        activationCodeExpiresOn
      } = await entryService.register(({ email, password }))

      expect(isActivated).toBe(false)
      expect(activationCode).toBeDefined()
      expect(activationCodeExpiresOn).toBeDefined()
    })
  })

  describe('login', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'

    beforeEach(async () => {
      await iocContainer.getEntryService().register(({ email, password }))
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong email`, async () => {
      const entryService = iocContainer.getEntryService()

      await expect(entryService.login({ email: 'donatello', password }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for wrong password`, async () => {
      const entryService = iocContainer.getEntryService()

      await expect(entryService.login({ email, password: 'BBBB' }))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test('passes for correct credentials.', async () => {
      const entryService = iocContainer.getEntryService()

      const user = await entryService.login({ email, password })

      expect(user).toBeDefined()
    })
  })

  describe('activate', () => {
    const email = 'raffaello@email.com'
    const password = 'AAAA'
    let activationCode

    beforeEach(async () => {
      await iocContainer.getEntryService().register(({ email, password }))
      activationCode = iocContainer.getEmailService().getLastSentActivationCode()
    })

    test('passes for correct activation code', () => {
      return expect(iocContainer.getEntryService().activate(({ email, activationCode })))
        .resolves
        .toBeUndefined()
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid email`, async () => {
      const invalidEmail = 'donatello@email.com'
      await expect(
        iocContainer.getEntryService().activate(({ email: invalidEmail, activationCode }))
      )
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })

    test(`throws ${ErrorName.INVALID_CREDENTIALS} for invalid activation code`, async () => {
      await expect(iocContainer.getEntryService().activate(({
        email,
        activationCode: 'ABCD'
      })))
        .rejects
        .toThrow(ErrorName.INVALID_CREDENTIALS)
    })
  })

  afterEach(async () => {
    const databaseManager = iocContainer.getDatabaseManager()
    await databaseManager.rollbackMigrations()
    await databaseManager.destroy()
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
