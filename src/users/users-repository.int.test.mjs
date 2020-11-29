import { environment } from '../environment.mjs'
import moment from 'moment'
import _ from 'lodash'
import { createMomentEqualityCustomizer } from '../utils/equality-customizers.mjs'
import { ErrorName } from '../error.mjs'
import { IocContainer } from '../ioc-container'

describe('UsersRepository', () => {
  let iocContainer
  beforeEach(async () => {
    iocContainer = IocContainer(environment)
    await iocContainer.getDatabaseClient().rollbackMigrations()
    await iocContainer.getDatabaseClient().migrateToLatest()
  })

  test('can get, create, update and delete a user', async () => {
    const usersRepository = iocContainer.getUsersRepository()

    const user = {
      email: 'raffaello@email.com',
      passwordHash: 'AAAA',
      createdOn: moment(),
      lastUpdatedOn: moment(),
      isActivated: false,
      activationCode: undefined,
      activationCodeExpiresOn: undefined
    }

    const createdUser = await usersRepository.createUser(user)

    user.id = createdUser.id
    expect(_.isEqualWith(createdUser, user, eqCustomizer)).toBe(true)

    expect(_.isEqualWith(
      await usersRepository.getUsers(),
      [user],
      eqCustomizer
    )).toBe(true)

    expect(_.isEqualWith(
      await usersRepository.getUserById(user.id),
      user,
      eqCustomizer
    )).toBe(true)

    expect(_.isEqualWith(
      await usersRepository.getUserByEmail(user.email),
      user,
      eqCustomizer
    )).toBe(true)

    user.passwordHash = 'BBBB'
    expect(_.isEqualWith(
      await usersRepository.updateUser({ id: user.id, passwordHash: user.passwordHash }),
      user,
      eqCustomizer
    )).toBe(true)

    expect(_.isEqualWith(
      await usersRepository.deleteUser(user.id),
      user,
      eqCustomizer
    )).toBe(true)

    expect(await usersRepository.getUsers()).toEqual([])
  })

  test('gives undefined when getting non-existent user by id', async () => {
    const usersRepository = iocContainer.getUsersRepository()

    const user = await usersRepository.getUserById(1)
    expect(user).toBeUndefined()
  })

  test(
    `throws ${ErrorName.EMAIL_ALREADY_USED} when creating user with existent email`,
    async () => {
      const usersRepository = iocContainer.getUsersRepository()

      const user = {
        email: 'raffaello@email.com',
        passwordHash: 'AAAA',
        createdOn: moment(),
        lastUpdatedOn: moment(),
        isActivated: false
      }

      await usersRepository.createUser(user)

      await expect(usersRepository.createUser(user))
        .rejects
        .toThrow(ErrorName.EMAIL_ALREADY_USED)
    }
  )

  afterEach(async () => {
    const databaseClient = iocContainer.getDatabaseClient()
    await databaseClient.rollbackMigrations()
    await databaseClient.destroy()
  })

  const eqCustomizer = createMomentEqualityCustomizer('minute')
})
